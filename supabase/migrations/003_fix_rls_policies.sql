-- Correção das políticas RLS para permitir INSERT
-- Executar no SQL Editor do Supabase

-- Pieces
DROP POLICY IF EXISTS "Users see own pieces" ON pieces;
CREATE POLICY "Users can view own pieces" ON pieces
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pieces" ON pieces
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pieces" ON pieces
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pieces" ON pieces
  FOR DELETE USING (auth.uid() = user_id);

-- Base photos
DROP POLICY IF EXISTS "Users see own base_photos" ON base_photos;
CREATE POLICY "Users can view own base_photos" ON base_photos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own base_photos" ON base_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own base_photos" ON base_photos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own base_photos" ON base_photos
  FOR DELETE USING (auth.uid() = user_id);

-- Looks
DROP POLICY IF EXISTS "Users see own looks" ON looks;
CREATE POLICY "Users can view own looks" ON looks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own looks" ON looks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own looks" ON looks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own looks" ON looks
  FOR DELETE USING (auth.uid() = user_id);

-- Look pieces
DROP POLICY IF EXISTS "Users see own look_pieces" ON look_pieces;
CREATE POLICY "Users can view own look_pieces" ON look_pieces
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM looks WHERE looks.id = look_pieces.look_id AND looks.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own look_pieces" ON look_pieces
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM looks WHERE looks.id = look_pieces.look_id AND looks.user_id = auth.uid())
  );

CREATE POLICY "Users can delete own look_pieces" ON look_pieces
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM looks WHERE looks.id = look_pieces.look_id AND looks.user_id = auth.uid())
  );

-- Generations
DROP POLICY IF EXISTS "Users see own generations" ON generations;
CREATE POLICY "Users can view own generations" ON generations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM looks WHERE looks.id = generations.look_id AND looks.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own generations" ON generations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM looks WHERE looks.id = generations.look_id AND looks.user_id = auth.uid())
  );

CREATE POLICY "Users can update own generations" ON generations
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM looks WHERE looks.id = generations.look_id AND looks.user_id = auth.uid())
  );

-- Results
DROP POLICY IF EXISTS "Users see own results" ON results;
CREATE POLICY "Users can view own results" ON results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM generations g
      JOIN looks l ON l.id = g.look_id
      WHERE g.id = results.generation_id AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own results" ON results
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM generations g
      JOIN looks l ON l.id = g.look_id
      WHERE g.id = results.generation_id AND l.user_id = auth.uid()
    )
  );

-- Saved looks
DROP POLICY IF EXISTS "Users see own saved_looks" ON saved_looks;
CREATE POLICY "Users can view own saved_looks" ON saved_looks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved_looks" ON saved_looks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved_looks" ON saved_looks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved_looks" ON saved_looks
  FOR DELETE USING (auth.uid() = user_id);

-- User credits
DROP POLICY IF EXISTS "Users see own credits" ON user_credits;
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits" ON user_credits
  FOR UPDATE USING (auth.uid() = user_id);

-- Credit usage
DROP POLICY IF EXISTS "Users see own credit_usage" ON credit_usage;
CREATE POLICY "Users can view own credit_usage" ON credit_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit_usage" ON credit_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);
