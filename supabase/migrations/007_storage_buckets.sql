-- Criar buckets de storage se não existirem
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('pieces', 'pieces', true),
  ('base-photos', 'base-photos', true),
  ('results', 'results', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Política de acesso público para leitura dos buckets
DROP POLICY IF EXISTS "Public Access - pieces" ON storage.objects;
CREATE POLICY "Public Access - pieces"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pieces');

DROP POLICY IF EXISTS "Authenticated Upload - pieces" ON storage.objects;
CREATE POLICY "Authenticated Upload - pieces"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'pieces');

DROP POLICY IF EXISTS "Users Delete Own - pieces" ON storage.objects;
CREATE POLICY "Users Delete Own - pieces"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'pieces' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Base photos
DROP POLICY IF EXISTS "Public Access - base-photos" ON storage.objects;
CREATE POLICY "Public Access - base-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'base-photos');

DROP POLICY IF EXISTS "Authenticated Upload - base-photos" ON storage.objects;
CREATE POLICY "Authenticated Upload - base-photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'base-photos');

DROP POLICY IF EXISTS "Users Delete Own - base-photos" ON storage.objects;
CREATE POLICY "Users Delete Own - base-photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'base-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Results
DROP POLICY IF EXISTS "Public Access - results" ON storage.objects;
CREATE POLICY "Public Access - results"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'results');

DROP POLICY IF EXISTS "Authenticated Upload - results" ON storage.objects;
CREATE POLICY "Authenticated Upload - results"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'results');

DROP POLICY IF EXISTS "Users Delete Own - results" ON storage.objects;
CREATE POLICY "Users Delete Own - results"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'results' AND (storage.foldername(name))[1] = auth.uid()::text);
