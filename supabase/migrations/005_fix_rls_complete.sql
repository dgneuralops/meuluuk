-- CORREÇÃO DEFINITIVA RLS
-- Executar no SQL Editor do Supabase

-- 1. Desabilitar RLS temporariamente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE pieces DISABLE ROW LEVEL SECURITY;
ALTER TABLE base_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE looks DISABLE ROW LEVEL SECURITY;
ALTER TABLE look_pieces DISABLE ROW LEVEL SECURITY;
ALTER TABLE generations DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
ALTER TABLE saved_looks DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits DISABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage DISABLE ROW LEVEL SECURITY;

-- 2. Adicionar coluna slot_key se não existir
ALTER TABLE pieces ADD COLUMN IF NOT EXISTS slot_key TEXT NOT NULL DEFAULT 'default';

-- 3. Reabilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE base_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE look_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas simples e permissivas
-- Profiles
CREATE POLICY "profiles_all" ON profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Pieces
CREATE POLICY "pieces_all" ON pieces FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Base photos
CREATE POLICY "base_photos_all" ON base_photos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Looks
CREATE POLICY "looks_all" ON looks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Look pieces
CREATE POLICY "look_pieces_all" ON look_pieces FOR ALL USING (
  EXISTS (SELECT 1 FROM looks WHERE looks.id = look_pieces.look_id AND looks.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM looks WHERE looks.id = look_pieces.look_id AND looks.user_id = auth.uid())
);

-- Generations
CREATE POLICY "generations_all" ON generations FOR ALL USING (
  EXISTS (SELECT 1 FROM looks WHERE looks.id = generations.look_id AND looks.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM looks WHERE looks.id = generations.look_id AND looks.user_id = auth.uid())
);

-- Results
CREATE POLICY "results_all" ON results FOR ALL USING (
  EXISTS (SELECT 1 FROM generations g JOIN looks l ON l.id = g.look_id WHERE g.id = results.generation_id AND l.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM generations g JOIN looks l ON l.id = g.look_id WHERE g.id = results.generation_id AND l.user_id = auth.uid())
);

-- Saved looks
CREATE POLICY "saved_looks_all" ON saved_looks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User credits
CREATE POLICY "user_credits_all" ON user_credits FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Credit usage
CREATE POLICY "credit_usage_all" ON credit_usage FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
