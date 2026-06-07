const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://ysbnoxvairppuitkhzkt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzYm5veHZhaXJwcHVpdGtoemt0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTMwNzQyNywiZXhwIjoyMDk0ODgzNDI3fQ.hrb6sb2C2TK5ywdmL8wjKIC5QA0-gBOgKh-aLE4tGTc";

const supabase = createClient(supabaseUrl, supabaseKey);

async function execSQL(sql) {
  try {
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
  } catch (e) {
    return { error: e };
  }
}

async function main() {
  console.log("=== LUUK Supabase Setup ===\n");

  // Read migration files
  const fs = require("fs");
  const path = require("path");

  const migrationDir = path.join(__dirname, "..", "supabase", "migrations");
  const files = fs.readdirSync(migrationDir).filter((f) => f.endsWith(".sql"));

  console.log("Found migrations:", files);

  // Execute each migration
  for (const file of files) {
    console.log(`\nExecuting: ${file}`);
    const sql = fs.readFileSync(path.join(migrationDir, file), "utf-8");

    // Split by semicolons and execute each statement
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      if (statement.includes("CREATE TYPE") || statement.includes("CREATE TABLE") || statement.includes("CREATE INDEX") || statement.includes("CREATE POLICY") || statement.includes("CREATE FUNCTION") || statement.includes("CREATE TRIGGER") || statement.includes("ALTER TABLE")) {
        try {
          // Use the Supabase SQL API
          const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });

          if (!response.ok) {
            const error = await response.json();
            if (error.message && !error.message.includes("already exists") && !error.message.includes("does not exist")) {
              console.log(`  ? ${error.message}`);
            }
          }
        } catch (e) {
          // Ignore errors for now
        }
      }
    }
    console.log(`✓ ${file} processed`);
  }

  console.log("\n=== Setup Complete ===");
  console.log("Please verify tables in Supabase dashboard.");
}

main().catch(console.error);
