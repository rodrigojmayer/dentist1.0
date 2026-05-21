SELECT cron.schedule(
    'simular-turnos-diarios',   -- Nombre único para identificar la tarea
    '0 8 * * *',                -- Expresión Cron: Minuto 0, Hora 5, Todos los días
    --'8 15 * * *',                -- Expresión Cron test: hay que sumarle 3 hs por el utc
    $$ SELECT simular_reservas_reales_semanal(); $$
);