const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_API_URL = "https://api.replicate.com/v1";

const IDM_VTON_VERSION = "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";

function getHeaders() {
  return {
    Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function checkPrediction(predictionId) {
  console.log(`\n=== Checking prediction: ${predictionId} ===`);
  
  try {
    const response = await fetch(`${REPLICATE_API_URL}/predictions/${predictionId}`, {
      headers: getHeaders(),
    });
    
    const data = await response.json();
    console.log("Status:", data.status);
    console.log("Started at:", data.started_at);
    console.log("Completed at:", data.completed_at);
    console.log("Error:", data.error);
    console.log("Output:", data.output);
    console.log("Metrics:", JSON.stringify(data.metrics, null, 2));
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function checkHardwareAndStatus() {
  console.log("\n=== Checking model cuuupid/idm-vton details ===");
  
  try {
    const response = await fetch(`${REPLICATE_API_URL}/models/cuuupid/idm-vton`, {
      headers: getHeaders(),
    });
    
    const data = await response.json();
    console.log("Model data keys:", Object.keys(data));
    console.log("Name:", data.name);
    console.log("Owner:", data.owner);
    console.log("Description:", data.description?.slice(0, 200));
    console.log("Run URL:", data.urls?.run);
    console.log("Is public?", data.public);
    console.log("Latest version created at:", data.latest_version?.created_at);
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function listModelVersionsDetailed() {
  console.log("\n=== Listing model versions for cuuupid/idm-vton ===");
  
  try {
    const response = await fetch(`${REPLICATE_API_URL}/models/cuuupid/idm-vton/versions`, {
      headers: getHeaders(),
    });
    
    const data = await response.json();
    console.log("Versions found:", data.results?.length || 0);
    
    if (data.results && data.results.length > 0) {
      data.results.forEach((v, i) => {
        console.log(`\n--- Version ${i + 1} ---`);
        console.log("ID:", v.id?.slice(0, 30) + "...");
        console.log("Created at:", v.created_at);
      });
    }
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function main() {
  console.log("========================================");
  console.log("Replicate Deep Diagnostic");
  console.log("========================================");
  
  await checkPrediction("k5m9c3chqdrnc0cy9mv9y61x50");
  await checkPrediction("3362thkq69rne0cy9ma9jjq4gc");
  await checkHardwareAndStatus();
  await listModelVersionsDetailed();
  
  console.log("\n========================================");
  console.log("Done");
  console.log("========================================");
}

main();
