-- RESET COMPLETO RLS
-- Copie e cole no SQL Editor do Supabase

-- 1. Desabilitar RLS em TODAS as tabelas
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

-- 4. Criar UMA política por tabela (FOR ALL = SELECT + INSERT + UPDATE + DELETE)
CREATE POLICY "enable_all_for_users_profiles" ON profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "enable_all_for_users_pieces" ON pieces FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enable_all_for_users_base_photos" ON base_photos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enable_all_for_users_looks" ON looks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enable_all_for_users_look_pieces" ON look_pieces FOR ALL USING (EXISTS (SELECT 1 FROM looks WHERE looks.id = look_pieces.look_id AND looks.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM looks WHERE looks.id = look_pieces.look_id AND looks.user_id = auth.uid()));
CREATE POLICY "enable_all_for_users_generations" ON generations FOR ALL USING (EXISTS (SELECT 1 FROM looks WHERE looks.id = generations.look_id AND looks.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM looks WHERE looks.id = generations.look_id AND looks.user_id = auth.uid()));
CREATE POLICY "enable_all_for_users_results" ON results FOR ALL USING (EXISTS (SELECT 1 FROM generations g JOIN looks l ON l.id = g.look_id WHERE g.id = results.generation_id AND l.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM generations g JOIN looks l ON l.id = g.look_id WHERE g.id = results.generation_id AND l.user_id = auth.uid()));
CREATE POLICY "enable_all_for_users_saved_looks" ON saved_looks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enable_all_for_users_user_credits" ON user_credits FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enable_all_for_users_credit_usage" ON credit_usage FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
