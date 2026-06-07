const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_API_URL = "https://api.replicate.com/v1";

const IDM_VTON_VERSION = "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";

function getHeaders() {
  return {
    Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function checkModelStatus() {
  console.log("=== Checking model: cuuupid/idm-vton ===");
  
  try {
    const response = await fetch(`${REPLICATE_API_URL}/models/cuuupid/idm-vton`, {
      headers: getHeaders(),
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function checkVersion() {
  console.log("\n=== Checking version ===");
  
  try {
    const response = await fetch(`${REPLICATE_API_URL}/models/cuuupid/idm-vton/versions/${IDM_VTON_VERSION}`, {
      headers: getHeaders(),
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function listModelVersions() {
  console.log("\n=== Listing model versions ===");
  
  try {
    const response = await fetch(`${REPLICATE_API_URL}/models/cuuupid/idm-vton/versions`, {
      headers: getHeaders(),
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Versions:", JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function searchVtonModels() {
  console.log("\n=== Searching for VTON models ===");
  
  const queries = ["virtual try-on", "vton", "idm-vton", "catvton", "ootdiffusion", "garment", "clothes"];
  
  for (const q of queries) {
    console.log(`\n--- Query: ${q} ---`);
    try {
      const response = await fetch(`${REPLICATE_API_URL}/models?query=${encodeURIComponent(q)}`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        console.log(`Found ${data.results.length} models:`);
        data.results.forEach((m) => {
          console.log(`  - ${m.owner}/${m.name}: ${(m.description || '').slice(0, 100) || '...'}`);
        });
      } else {
        console.log("No models found");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }
}

async function getCurrentPredictions() {
  console.log("\n=== Getting recent predictions ===");
  
  try {
    const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
      headers: getHeaders(),
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Predictions:", JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function main() {
  console.log("========================================");
  console.log("Replicate API Test");
  console.log("========================================");
  
  await checkModelStatus();
  await checkVersion();
  await listModelVersions();
  await searchVtonModels();
  await getCurrentPredictions();
  
  console.log("\n========================================");
  console.log("Done");
  console.log("========================================");
}

main();
