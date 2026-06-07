-- LUUK Provador Virtual - Schema Inicial
-- Executar no SQL Editor do Supabase

-- Enums
DO $$ BEGIN
  CREATE TYPE piece_category AS ENUM (
    'top', 'bottom', 'dress', 'shoes',
    'bag', 'necklace', 'earrings', 'belt', 'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE generation_status AS ENUM (
    'pending', 'processing', 'completed', 'failed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE look_status AS ENUM (
    'draft', 'ready', 'generating', 'completed', 'failed', 'saved'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles (estende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pieces
CREATE TABLE IF NOT EXISTS pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category piece_category NOT NULL,
  image_url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Base photos
CREATE TABLE IF NOT EXISTS base_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Looks
CREATE TABLE IF NOT EXISTS looks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status look_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Look-Pieces junction
CREATE TABLE IF NOT EXISTS look_pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  look_id UUID REFERENCES looks(id) ON DELETE CASCADE NOT NULL,
  piece_id UUID REFERENCES pieces(id) ON DELETE CASCADE NOT NULL,
  slot_name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(look_id, piece_id)
);

-- Generations (job queue)
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  look_id UUID REFERENCES looks(id) ON DELETE CASCADE NOT NULL,
  base_photo_id UUID REFERENCES base_photos(id) ON DELETE CASCADE NOT NULL,
  status generation_status DEFAULT 'pending',
  provider TEXT NOT NULL DEFAULT 'mock',
  prompt_used TEXT,
  payload JSONB,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Results
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID REFERENCES generations(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved looks
CREATE TABLE IF NOT EXISTS saved_looks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  result_id UUID REFERENCES results(id) ON DELETE CASCADE NOT NULL,
  look_id UUID REFERENCES looks(id) ON DELETE SET NULL,
  favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pieces_user ON pieces(user_id);
CREATE INDEX IF NOT EXISTS idx_pieces_user_category ON pieces(user_id, category);
CREATE INDEX IF NOT EXISTS idx_base_photos_user ON base_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_looks_user ON looks(user_id);
CREATE INDEX IF NOT EXISTS idx_looks_user_status ON looks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_look_pieces_look ON look_pieces(look_id);
CREATE INDEX IF NOT EXISTS idx_generations_look ON generations(look_id);
CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
CREATE INDEX IF NOT EXISTS idx_results_generation ON results(generation_id);
CREATE INDEX IF NOT EXISTS idx_saved_looks_user ON saved_looks(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_looks_user_fav ON saved_looks(user_id, favorite);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE base_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE look_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_looks ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users see own profile" ON profiles;
CREATE POLICY "Users see own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users see own pieces" ON pieces;
CREATE POLICY "Users see own pieces" ON pieces
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users see own base_photos" ON base_photos;
CREATE POLICY "Users see own base_photos" ON base_photos
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users see own looks" ON looks;
CREATE POLICY "Users see own looks" ON looks
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users see own look_pieces" ON look_pieces;
CREATE POLICY "Users see own look_pieces" ON look_pieces
  FOR ALL USING (
    EXISTS (SELECT 1 FROM looks WHERE looks.id = look_pieces.look_id AND looks.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users see own generations" ON generations;
CREATE POLICY "Users see own generations" ON generations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM looks WHERE looks.id = generations.look_id AND looks.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users see own results" ON results;
CREATE POLICY "Users see own results" ON results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM generations g
      JOIN looks l ON l.id = g.look_id
      WHERE g.id = results.generation_id AND l.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users see own saved_looks" ON saved_looks;
CREATE POLICY "Users see own saved_looks" ON saved_looks
  FOR ALL USING (auth.uid() = user_id);

-- Função para criar profile automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
