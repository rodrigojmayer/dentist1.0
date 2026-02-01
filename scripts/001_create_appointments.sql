-- Crear tabla de turnos/citas
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  location_id TEXT NOT NULL,
  location_name TEXT NOT NULL,
  professional_id TEXT NOT NULL,
  professional_name TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear indice para busquedas por fecha
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);

-- Crear indice para busquedas por estado
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Crear indice para busquedas por profesional
CREATE INDEX IF NOT EXISTS idx_appointments_professional ON appointments(professional_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Politica para permitir lectura publica (para que el admin pueda ver todos los turnos)
CREATE POLICY "Allow public read access" ON appointments
  FOR SELECT
  USING (true);

-- Politica para permitir insercion publica (para que los pacientes puedan reservar)
CREATE POLICY "Allow public insert access" ON appointments
  FOR INSERT
  WITH CHECK (true);

-- Politica para permitir actualizacion publica (para cambiar estado)
CREATE POLICY "Allow public update access" ON appointments
  FOR UPDATE
  USING (true);

-- Politica para permitir eliminacion publica
CREATE POLICY "Allow public delete access" ON appointments
  FOR DELETE
  USING (true);

-- Funcion para actualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
