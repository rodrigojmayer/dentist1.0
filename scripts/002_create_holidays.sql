CREATE TABLE IF NOT EXISTS holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_holidays_date
ON holidays(date);

-- RLS
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "Allow public read access holidays"
ON holidays
FOR SELECT
USING (true);

-- Inserción pública
CREATE POLICY "Allow public insert access holidays"
ON holidays
FOR INSERT
WITH CHECK (true);

-- Update público
CREATE POLICY "Allow public update access holidays"
ON holidays
FOR UPDATE
USING (true);

-- Delete público
CREATE POLICY "Allow public delete access holidays"
ON holidays
FOR DELETE
USING (true);