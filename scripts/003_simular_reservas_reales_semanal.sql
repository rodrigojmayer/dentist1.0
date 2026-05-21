CREATE OR REPLACE FUNCTION simular_reservas_reales_semanal()
RETURNS void AS $$
DECLARE
    -- MODIFICADO: Ahora la fecha de inicio es HOY mismo
    fecha_inicio DATE := CURRENT_DATE; 
    fecha_turno_date DATE;
    fecha_turno_text TEXT; -- Formato texto para la columna 'date'
    hora_turno TEXT;       -- Formato texto para la columna 'time'
    
    -- Array con tus 7 odontólogas reales
    profesionales_list TEXT[][] := ARRAY[
        ['ana-marquez', 'Od. Ana Marquez'],
        ['mailen-luque', 'Od. Mailen Luque'],
        ['erica-fani', 'Od. Erica Fani'],
        ['carla-perez', 'Od. Carla Perez'],
        ['julieta-azcua', 'Od. Julieta Azcua'],
        ['maria-diaz', 'Od. Maria Diaz'],
        ['natalia-ojeda', 'Od. Natalia Ojeda']
    ];
    
    -- Grilla horaria cada 30 min (09:00 a 17:30) EXCLUYENDO las 12:00 y 12:30
    horas_list TEXT[] := ARRAY[
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
        '13:00', '13:30', '14:00', '14:45', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];
    
    -- --- COMPONENTES PARA GENERAR PACIENTES ALEATORIOS DINÁMICOS ---
    nombres_base TEXT[] := ARRAY['Juan', 'María', 'Lucas', 'Ana', 'Diego', 'Laura', 'Sofía', 'Facundo', 'Carlos', 'Marta', 'Andrés', 'Elena', 'Nicolás', 'Clara', 'Santiago', 'Agustina', 'Mateo', 'Florencia', 'Camila', 'Bruno', 'Valentina', 'Joaquín', 'Martina', 'Gonzalo', 'Paula', 'Leandro', 'Rocío', 'Matías', 'Lucía', 'Damián', 'Milagros', 'Franco'];
    apellidos_base TEXT[] := ARRAY['Pérez', 'Rodríguez', 'Gómez', 'Martínez', 'Fernández', 'Díaz', 'Benítez', 'López', 'Sosa', 'Carrizo', 'Flores', 'Romero', 'Segovia', 'Giménez', 'Ruiz', 'Silva', 'Peralta', 'Juárez', 'Acosta', 'Pereyra', 'Medina', 'Aguirre', 'Castro', 'Franco', 'Alarcón', 'Vargas', 'Herrera', 'Cáceres', 'Villalba', 'Olivera', 'Ibáñez', 'Moyano'];
    dominios_base TEXT[] := ARRAY['mail.com', 'gmail.com', 'outlook.com', 'hotmail.com'];
    caracteristicas_base TEXT[] := ARRAY['341', '3476'];
    
    -- Variables para construir al paciente en cada iteración
    v_nombre TEXT;
    v_apellido TEXT;
    v_paciente_nombre TEXT;
    v_paciente_email TEXT;
    v_paciente_telefono TEXT;
    
    -- Identificador único para el mail 
    v_seed INT := FLOOR(RANDOM() * 100000);
    
    i INT;
    turnos_creados INT; 
    random_hora_idx INT;
    random_dia_offset INT;
    existe_turno BOOLEAN;
    es_fin_de_semana BOOLEAN;
BEGIN
    -- Asegurar que la extensión unaccent esté activa por si hay acentos
    EXECUTE 'CREATE EXTENSION IF NOT EXISTS unaccent';

    -- Recorremos cada una de las 7 odontólogas
    FOR i IN 1..ARRAY_UPPER(profesionales_list, 1) LOOP
        
        turnos_creados := 0;
        
        -- El bucle garantiza exactamente 5 turnos por profesional
        WHILE turnos_creados < 15 LOOP
            
            -- Calcular el día al azar sumando de 0 a 29 días a la fecha de HOY
            random_dia_offset := FLOOR(RANDOM() * 30); 
            fecha_turno_date := fecha_inicio + random_dia_offset;
            
            -- Verificar que no sea Sábado (6) ni Domingo (0)
            SELECT (EXTRACT(DOW FROM fecha_turno_date) IN (0, 6)) INTO es_fin_de_semana;
            
            -- Si NO es fin de semana, continuamos
            IF NOT es_fin_de_semana THEN
                
                fecha_turno_text := to_char(fecha_turno_date, 'YYYY-MM-DD');
                
                -- Elegir hora del array de textos
                random_hora_idx := FLOOR(RANDOM() * ARRAY_LENGTH(horas_list, 1)) + 1;
                hora_turno := horas_list[random_hora_idx];
                
                -- Verificar existencia de cita previa
                SELECT EXISTS (
                    SELECT 1 FROM appointments 
                    WHERE professional_id = profesionales_list[i][1] 
                      AND date = fecha_turno_text
                      AND time = hora_turno
                      AND status NOT IN ('cancelled', 'deleted')
                ) INTO existe_turno;
                
                -- Si está libre, armamos al paciente aleatorio dinámico y lo insertamos
                IF NOT existe_turno THEN
                    v_seed := v_seed + 1;

                    -- Seleccionar piezas al azar
                    v_nombre := nombres_base[FLOOR(RANDOM() * ARRAY_LENGTH(nombres_base, 1)) + 1];
                    v_apellido := apellidos_base[FLOOR(RANDOM() * ARRAY_LENGTH(apellidos_base, 1)) + 1];
                    
                    -- Construir datos estructurados
                    v_paciente_nombre := v_nombre || ' ' || v_apellido;
                    v_paciente_email := lower(unaccent(v_nombre)) || '.' || lower(unaccent(v_apellido)) || v_seed || '@' || dominios_base[FLOOR(RANDOM() * ARRAY_LENGTH(dominios_base, 1)) + 1];
                    v_paciente_telefono := caracteristicas_base[FLOOR(RANDOM() * ARRAY_LENGTH(caracteristicas_base, 1)) + 1] || 
                                           FLOOR(RANDOM() * (6999999 - 2000000 + 1) + 2000000)::TEXT;

                    INSERT INTO appointments (
                        patient_name, patient_email, patient_phone,
                        location_id, location_name, 
                        professional_id, professional_name, 
                        service, date, time, status, notes
                    )
                    VALUES (
                        v_paciente_nombre,
                        v_paciente_email,
                        v_paciente_telefono,
                        'san-lorenzo', 'San Lorenzo',
                        profesionales_list[i][1], profesionales_list[i][2],
                        'Odontología General', 
                        fecha_turno_text,
                        hora_turno, 
                        'confirmed', 
                        'Bloqueo preventivo automático'
                    );
                    
                    -- Contabilizar el turno creado exitosamente
                    turnos_creados := turnos_creados + 1;
                END IF;
                
            END IF; 

        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;