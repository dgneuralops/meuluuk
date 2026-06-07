-- Adicionar coluna slot_key na tabela pieces
ALTER TABLE pieces ADD COLUMN IF NOT EXISTS slot_key TEXT NOT NULL DEFAULT 'default';

-- Adicionar índice para slot_key
CREATE INDEX IF NOT EXISTS idx_pieces_user_slot ON pieces(user_id, slot_key);
