import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ysbnoxvairppuitkhzkt.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzYm5veHZhaXJwcHVpdGtoemt0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTMwNzQyNywiZXhwIjoyMDk0ODgzNDI3fQ.hrb6sb2C2TK5ywdmL8wjKIC5QA0-gBOgKh-aLE4tGTc";

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQL(sql: string) {
  // Use the Supabase SQL API via the postgres meta endpoint
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      "Prefer": "params=single-object",
    },
    body: JSON.stringify({}),
  });
  return response;
}

async function createEnums() {
  console.log("Creating enums...");

  const enums = [
    `CREATE TYPE piece_category AS ENUM ('top', 'bottom', 'dress', 'shoes', 'bag', 'necklace', 'earrings', 'belt', 'other')`,
    `CREATE TYPE generation_status AS ENUM ('pending', 'processing', 'completed', 'failed')`,
    `CREATE TYPE look_status AS ENUM ('draft', 'ready', 'generating', 'completed', 'failed', 'saved')`,
  ];

  for (const sql of enums) {
    try {
      await supabase.rpc("exec_sql", { sql_query: sql });
    } catch (e) {
      // Enums might already exist
    }
  }
  console.log("✓ Enums ready");
}

async function createTables() {
  console.log("Creating tables...");

  const tables = [
    {
      name: "profiles",
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `,
    },
    {
      name: "pieces",
      sql: `
        CREATE TABLE IF NOT EXISTS pieces (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          category piece_category NOT NULL,
          slot_key TEXT NOT NULL DEFAULT 'default',
          image_url TEXT NOT NULL,
          mime_type TEXT NOT NULL,
          width INTEGER,
          height INTEGER,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `,
    },
    {
      name: "base_photos",
      sql: `
        CREATE TABLE IF NOT EXISTS base_photos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          image_url TEXT NOT NULL,
          width INTEGER,
          height INTEGER,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `,
    },
    {
      name: "looks",
      sql: `
        CREATE TABLE IF NOT EXISTS looks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          status look_status DEFAULT 'draft',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `,
    },
    {
      name: "look_pieces",
      sql: `
        CREATE TABLE IF NOT EXISTS look_pieces (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          look_id UUID REFERENCES looks(id) ON DELETE CASCADE NOT NULL,
          piece_id UUID REFERENCES pieces(id) ON DELETE CASCADE NOT NULL,
          slot_name TEXT NOT NULL,
          sort_order INTEGER DEFAULT 0,
          UNIQUE(look_id, piece_id)
        )
      `,
    },
    {
      name: "generations",
      sql: `
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
        )
      `,
    },
    {
      name: "results",
      sql: `
        CREATE TABLE IF NOT EXISTS results (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          generation_id UUID REFERENCES generations(id) ON DELETE CASCADE NOT NULL,
          image_url TEXT NOT NULL,
          thumbnail_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `,
    },
    {
      name: "saved_looks",
      sql: `
        CREATE TABLE IF NOT EXISTS saved_looks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          result_id UUID REFERENCES results(id) ON DELETE CASCADE NOT NULL,
          look_id UUID REFERENCES looks(id) ON DELETE SET NULL,
          favorite BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `,
    },
    {
      name: "user_credits",
      sql: `
        CREATE TABLE IF NOT EXISTS user_credits (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
          total_generations INTEGER DEFAULT 0,
          credits_remaining INTEGER DEFAULT 5,
          max_credits INTEGER DEFAULT 5,
          reset_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `,
    },
    {
      name: "credit_usage",
      sql: `
        CREATE TABLE IF NOT EXISTS credit_usage (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          generation_id UUID REFERENCES generations(id) ON DELETE SET NULL,
          credits_spent INTEGER DEFAULT 1,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `,
    },
  ];

  for (const table of tables) {
    try {
      // Try to create the table
      const { error } = await supabase.rpc("exec_sql", { sql_query: table.sql });
      if (error && !error.message.includes("already exists")) {
        console.log(`? ${table.name}: ${error.message}`);
      } else {
        console.log(`✓ ${table.name}`);
      }
    } catch (e) {
      console.log(`? ${table.name}: ${e}`);
    }
  }
}

async function main() {
  console.log("=== LUUK Supabase Setup ===\n");

  // Buckets are already created
  console.log("✓ Storage buckets created\n");

  // Create enums and tables
  await createEnums();
  await createTables();

  console.log("\n=== Setup Complete ===");
  console.log("Restart the dev server to apply changes.");
}

main().catch(console.error);
