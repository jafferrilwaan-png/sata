import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";

// Load environment variables from Next.js project root (.env.local)
loadEnvConfig(process.cwd());

test("Test 1: Verifies .env.local exists and contains required live environment keys", () => {
  const envPath = path.resolve(process.cwd(), ".env.local");
  assert.ok(fs.existsSync(envPath), ".env.local file must exist in project root");

  const envContent = fs.readFileSync(envPath, "utf8");
  const requiredKeys = [
    "META_API_KEY",
    "META_BASE_URL",
    "META_MODEL",
    "NASA_FIRMS_MAP_KEY",
    "FORCE_LIVE",
  ];

  for (const key of requiredKeys) {
    assert.ok(
      envContent.includes(key),
      `.env.local file must declare ${key}`
    );
  }

  // Verify process.env values loaded and are valid credentials (not placeholders)
  assert.ok(process.env.META_API_KEY, "process.env.META_API_KEY must be defined");
  assert.notEqual(
    process.env.META_API_KEY,
    "your_meta_api_key_here",
    "META_API_KEY must not be the example placeholder"
  );
  assert.ok(
    process.env.META_API_KEY.startsWith("LLM_") || process.env.META_API_KEY.length > 20,
    "META_API_KEY must be a valid bearer token format"
  );

  assert.ok(process.env.META_BASE_URL, "process.env.META_BASE_URL must be defined");
  assert.ok(
    process.env.META_BASE_URL.startsWith("http"),
    "META_BASE_URL must be a valid HTTP/HTTPS URL"
  );

  assert.ok(process.env.META_MODEL, "process.env.META_MODEL must be defined");

  assert.ok(process.env.NASA_FIRMS_MAP_KEY, "process.env.NASA_FIRMS_MAP_KEY must be defined");
  assert.notEqual(
    process.env.NASA_FIRMS_MAP_KEY,
    "your_free_nasa_firms_map_key",
    "NASA_FIRMS_MAP_KEY must not be the example placeholder"
  );
  assert.equal(
    process.env.NASA_FIRMS_MAP_KEY.length,
    32,
    "NASA_FIRMS_MAP_KEY must be a 32-character hex key"
  );

  assert.equal(
    process.env.FORCE_LIVE,
    "true",
    "FORCE_LIVE must be explicitly set to 'true'"
  );
});

test("Test 2: Validates live Meta API endpoint with authenticated network call", async () => {
  const apiKey = process.env.META_API_KEY;
  const baseUrl = process.env.META_BASE_URL;
  const model = process.env.META_MODEL || "muse-spark-1.3";

  assert.ok(apiKey, "META_API_KEY required for live test");
  assert.ok(baseUrl, "META_BASE_URL required for live test");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "Ping" }],
        max_tokens: 10,
        temperature: 0.1,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    assert.equal(
      response.status,
      200,
      `Meta API chat completions responded with HTTP ${response.status}`
    );

    const json = await response.json();
    assert.ok(json.choices && Array.isArray(json.choices), "Response must have choices array");
    assert.ok(json.choices.length > 0, "Response choices array must not be empty");
    assert.equal(
      json.model,
      model,
      `Returned model ${json.model} must match requested model ${model}`
    );
    assert.ok(json.id, "Response must include completion ID");
  } catch (err: any) {
    clearTimeout(timer);
    assert.fail(`Live Meta API endpoint validation failed: ${err.message}`);
  }
});

test("Test 3: Validates live NASA FIRMS endpoint with authenticated network call", async () => {
  const mapKey = process.env.NASA_FIRMS_MAP_KEY;
  assert.ok(mapKey, "NASA_FIRMS_MAP_KEY required for live FIRMS test");

  const url = `https://firms.modaps.eosdis.nasa.gov/api/data_availability/csv/${mapKey}/VIIRS_SNPP_NRT`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    assert.equal(
      response.status,
      200,
      `NASA FIRMS data availability responded with HTTP ${response.status}`
    );

    const csvText = await response.text();
    assert.ok(
      csvText.includes("data_id,min_date,max_date"),
      "Response must contain valid FIRMS CSV header"
    );
    assert.ok(
      csvText.includes("VIIRS_SNPP_NRT"),
      "Response must verify VIIRS_SNPP_NRT near real-time data availability"
    );
  } catch (err: any) {
    clearTimeout(timer);
    assert.fail(`Live NASA FIRMS endpoint validation failed: ${err.message}`);
  }
});

test("Test 4: Verifies that mock flags are not enabled and mock indicators are absent", async () => {
  assert.equal(process.env.FORCE_LIVE, "true", "FORCE_LIVE must be explicitly 'true'");
  assert.equal(process.env.DISABLE_GAZETTEER, "true", "DISABLE_GAZETTEER must be 'true'");
  assert.notEqual(process.env.USE_MOCK, "true", "USE_MOCK must NOT be true");
  assert.notEqual(process.env.MOCK_DATA, "true", "MOCK_DATA must NOT be true");
  assert.notEqual(process.env.ENABLE_FALLBACK, "true", "ENABLE_FALLBACK must NOT be true");

  // Verify that live NASA FIRMS query does not produce mock records
  const { fetchNasaFirmsAnomalies } = await import("../lib/nasa-firms");
  const points = await fetchNasaFirmsAnomalies([80.1, 12.9, 80.35, 13.2], 1);

  assert.ok(Array.isArray(points), "Thermal anomaly results must be an array");
  for (const pt of points) {
    assert.ok(!pt.id.includes("MOCK"), `Point ${pt.id} must not be flagged MOCK`);
    assert.ok(!pt.id.includes("DUMMY"), `Point ${pt.id} must not be flagged DUMMY`);
    assert.ok(!pt.id.includes("SYNTHETIC"), `Point ${pt.id} must not be flagged SYNTHETIC`);
  }
});
