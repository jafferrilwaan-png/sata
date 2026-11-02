import fs from "node:fs";
import path from "node:path";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf8");
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx > 0) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

async function testMetaAI() {
  const env = loadEnv();
  const apiKey = env.META_API_KEY;
  const baseUrl = env.META_BASE_URL || "https://api.meta.ai/v1";
  const model = env.META_MODEL || "muse-spark-1.3";

  console.log(`Connecting to live Meta AI (${model}) at ${baseUrl}...`);

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "You are the SATA Sentinel Earth Observation Assistant powered by Meta AI. Provide a concise, helpful summary of atmospheric weather and satellite observations.",
        },
        {
          role: "user",
          content: "Summarize satellite weather observations for Cape Canaveral, Florida (28.57° N, 80.65° W). Focus on cloud cover and ocean temperatures.",
        },
      ],
      max_tokens: 1200,
      temperature: 0.2,
    }),
  });

  console.log(`HTTP Status: ${response.status} ${response.statusText}`);
  const data: any = await response.json();
  console.log("\n--- META AI LIVE RESPONSE ---");
  console.log(data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2));
  console.log("-----------------------------\n");
}

testMetaAI().catch((err) => {
  console.error("Test Error:", err);
});
