const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_API_URL = "https://api.replicate.com/v1";

function getHeaders() {
  return {
    Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function searchModels(query) {
  console.log(`\n=== Searching for: "${query}" ===`);
  
  try {
    const response = await fetch(
      `${REPLICATE_API_URL}/models?query=${encodeURIComponent(query)}`,
      { headers: getHeaders() }
    );
    
    const data = await response.json();
    console.log(`Found ${data.results?.length || 0} models`);
    
    if (data.results && data.results.length > 0) {
      data.results.slice(0, 10).forEach((m, i) => {
        console.log(`\n${i + 1}. ${m.owner}/${m.name}`);
        console.log(`   Description: ${m.description?.slice(0, 100) || 'N/A'}...`);
        console.log(`   Run count: ${m.run_count || 'N/A'}`);
        console.log(`   URL: https://replicate.com/${m.owner}/${m.name}`);
      });
    }
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function checkAccount() {
  console.log("\n=== Checking account ===");
  
  try {
    const response = await fetch(`${REPLICATE_API_URL}/account`, {
      headers: getHeaders(),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("Account:", data.username || data.name || 'Found');
      console.log("Type:", data.type || 'N/A');
    } else {
      console.log("Cannot get account (might not have permission)");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

async function main() {
  console.log("========================================");
  console.log("Replicate Model Search");
  console.log("========================================");
  
  await checkAccount();
  
  // Search for VTON-related models
  await searchModels("try-on");
  await searchModels("virtual try");
  await searchModels("garment");
  await searchModels("clothing");
  await searchModels("fashion");
  
  console.log("\n========================================");
  console.log("Done");
  console.log("========================================");
}

main();
