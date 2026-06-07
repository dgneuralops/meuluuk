const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://ysbnoxvairppuitkhzkt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzYm5veHZhaXJwcHVpdGtoemt0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTMwNzQyNywiZXhwIjoyMDk0ODgzNDI3fQ.hrb6sb2C2TK5ywdmL8wjKIC5QA0-gBOgKh-aLE4tGTc";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableExists(tableName) {
  const { error } = await supabase.from(tableName).select("count").limit(1);
  return !error || !error.message.includes("does not exist");
}

async function createEnum(name, values) {
  console.log(`Creating enum: ${name}`);
  const sql = `CREATE TYPE ${name} AS ENUM (${values.map((v) => `'${v}'`).join(", ")})`;
  try {
    await supabase.rpc("exec_sql", { sql_query: sql });
    console.log(`✓ ${name}`);
  } catch (e) {
    console.log(`? ${name}: ${e.message || "already exists"}`);
  }
}

async function createTable(name, columns, options = {}) {
  console.log(`Creating table: ${name}`);

  // Build CREATE TABLE SQL
  const colDefs = columns.map((col) => {
    let def = `${col.name} ${col.type}`;
    if (col.primaryKey) def += " PRIMARY KEY";
    if (col.default) def += ` DEFAULT ${col.default}`;
    if (col.notNull) def += " NOT NULL";
    if (col.references) def += ` REFERENCES ${col.references}`;
    if (col.unique) def += " UNIQUE";
    return def;
  });

  const sql = `CREATE TABLE IF NOT EXISTS ${name} (${colDefs.join(", ")})`;

  try {
    // Try to execute via RPC
    await supabase.rpc("exec_sql", { sql_query: sql });
    console.log(`✓ ${name}`);
  } catch (e) {
    console.log(`? ${name}: ${e.message || "error"}`);
  }
}

async function main() {
  console.log("=== LUUK Supabase Setup ===\n");

  // Check if tables exist
  const tables = ["profiles", "pieces", "base_photos", "looks", "look_pieces", "generations", "results", "saved_looks", "user_credits", "credit_usage"];

  for (const table of tables) {
    const exists = await checkTableExists(table);
    console.log(`${exists ? "✓" : "✗"} ${table}`);
  }

  console.log("\n=== Instructions ===");
  console.log("1. Go to: https://supabase.com/dashboard/project/ysbnoxvairppuitkhzkt/sql");
  console.log("2. Copy and paste the SQL from: supabase/migrations/001_initial_schema.sql");
  console.log("3. Run it, then copy and paste: supabase/migrations/002_user_credits.sql");
  console.log("4. Restart the dev server");
}

main().catch(console.error);
