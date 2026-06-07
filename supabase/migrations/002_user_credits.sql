-- Adicionar sistema de créditos ao schema existente
-- Executar no SQL Editor do Supabase

-- Tabela de créditos do usuário
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_generations INTEGER DEFAULT 0,
  credits_remaining INTEGER DEFAULT 5,
  max_credits INTEGER DEFAULT 5,
  reset_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de histórico de uso de créditos
CREATE TABLE IF NOT EXISTS credit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  generation_id UUID REFERENCES generations(id) ON DELETE SET NULL,
  credits_spent INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_credit_usage_user ON credit_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_created ON credit_usage(created_at);

-- RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users see own credits" ON user_credits;
CREATE POLICY "Users see own credits" ON user_credits
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users see own credit_usage" ON credit_usage;
CREATE POLICY "Users see own credit_usage" ON credit_usage
  FOR ALL USING (auth.uid() = user_id);

-- Função para criar créditos automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits_remaining, max_credits)
  VALUES (NEW.id, 5, 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();

-- Função para consumir crédito
CREATE OR REPLACE FUNCTION public.consume_credit(p_user_id UUID, p_generation_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_credits INTEGER;
BEGIN
  SELECT credits_remaining INTO v_credits
  FROM public.user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_credits <= 0 THEN
    RETURN FALSE;
  END IF;

  UPDATE public.user_credits
  SET credits_remaining = credits_remaining - 1,
      total_generations = total_generations + 1,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO public.credit_usage (user_id, generation_id, credits_spent)
  VALUES (p_user_id, p_generation_id, 1);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
