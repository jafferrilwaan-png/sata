import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { NextRequest } from "next/server";

// Load environment config
loadEnvConfig(process.cwd());

import { sataConfig, loadSataConfig, ConfigurationError } from "../lib/config";
import { executeLlama4GeospatialReasoning } from "../lib/meta-llama";
import { dispatchOrbitalReasoning } from "../services/metaLlamaService";
import { fetchNasaFirmsAnomalies } from "../lib/nasa-firms";
import { POST as queryPostHandler } from "../app/api/query/route";
import { GET as firmsGetHandler } from "../app/api/firms/route";

const ORIGINAL_META_KEY = sataConfig.meta.apiKey;
const ORIGINAL_FIRMS_KEY = sataConfig.nasa.firmsMapKey;

test.afterEach(() => {
  sataConfig.meta.apiKey = ORIGINAL_META_KEY;
  sataConfig.nasa.firmsMapKey = ORIGINAL_FIRMS_KEY;
});

test("Adversarial 1: executeLlama4GeospatialReasoning with invalid Meta API key throws error and does NOT return Chennai coordinates", async () => {
  sataConfig.meta.apiKey = "LLM_INVALID_KEY_EXPLICIT_TEST_REJECTION";

  let caughtError: Error | null = null;
  let returnedResult: any = null;

  try {
    returnedResult = await executeLlama4GeospatialReasoning("Analyze wildfires near Chennai, Tamil Nadu");
  } catch (err: any) {
    caughtError = err;
  }

  // Verify that an error was thrown
  assert.ok(caughtError !== null, "executeLlama4GeospatialReasoning must throw an error when API key is invalid");
  assert.ok(
    caughtError.message.includes("Meta AI live reasoning failed"),
    `Error message must indicate Meta AI live reasoning failure, got: "${caughtError.message}"`
  );

  // Verify no fallback result was returned
  assert.equal(returnedResult, null, "No result must be returned on API key failure");
});

test("Adversarial 2: dispatchOrbitalReasoning with invalid Meta API key yields error payload and does NOT return Chennai coordinates", async () => {
  sataConfig.meta.apiKey = "LLM_INVALID_KEY_EXPLICIT_TEST_REJECTION";

  const result = await dispatchOrbitalReasoning("Show wildfires and active heat spots near Chennai last 72 hours", 5000);

  // Verify error state
  assert.equal(result.source, "meta-live-error", "Source must explicitly indicate 'meta-live-error'");
  assert.ok(result.error, "Result must contain explicit error field");
  assert.ok(
    result.error.includes("Meta AI reasoning pipeline failed"),
    `Error field must describe failure, got: "${result.error}"`
  );

  // Verify that fake Chennai coordinates { lat: 13.0827, lon: 80.2707 } were NOT returned
  assert.notEqual(result.lat, 13.0827, "Must NOT return fake Chennai latitude 13.0827");
  assert.notEqual(result.lon, 80.2707, "Must NOT return fake Chennai longitude 80.2707");
  assert.equal(result.lat, 0, "Failed lock must return coordinate 0");
  assert.equal(result.lon, 0, "Failed lock must return coordinate 0");

  // Verify that active heat spots are NOT fabricated (previously defaulted to 84 or 72)
  assert.equal(result.activeHeatSpots, 0, "activeHeatSpots must be 0 on failure, not synthetic count");
});

test("Adversarial 3: POST /api/query route handler with invalid Meta API key returns HTTP 500 with meta-live-error and NO fake coordinates", async () => {
  sataConfig.meta.apiKey = "LLM_INVALID_KEY_EXPLICIT_TEST_REJECTION";

  const req = new NextRequest("http://localhost:3005/api/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "Wildfires near Chennai" }),
  });

  const response = await queryPostHandler(req);
  assert.equal(response.status, 500, "API must return HTTP 500 on Meta AI live reasoning failure");

  const json = await response.json();
  assert.equal(json.success, false, "Response success flag must be false");
  assert.equal(json.source, "meta-live-error", "Response source must be 'meta-live-error'");
  assert.ok(json.error, "Response must include error message");
  assert.equal(json.reasoning, undefined, "Response must NOT return reasoning object with fake coordinates");
  assert.equal(json.points, undefined, "Response must NOT return points array");
});

test("Adversarial 4: fetchNasaFirmsAnomalies with invalid FIRMS key throws error and does NOT fabricate anomaly points from EONET", async () => {
  sataConfig.nasa.firmsMapKey = "INVALID_FIRMS_KEY_9999999999999999";

  let caughtError: Error | null = null;
  let returnedPoints: any = null;

  try {
    returnedPoints = await fetchNasaFirmsAnomalies([80.1, 12.9, 80.35, 13.2], 1);
  } catch (err: any) {
    caughtError = err;
  }

  // Verify that an error was thrown
  assert.ok(caughtError !== null, "fetchNasaFirmsAnomalies must throw an error when NASA FIRMS key is invalid");
  assert.ok(
    caughtError.message.includes("NASA FIRMS live query failed"),
    `Error message must indicate NASA FIRMS live query failure, got: "${caughtError.message}"`
  );

  // Verify NO synthetic points were fabricated out of EONET
  assert.equal(returnedPoints, null, "Must NOT return synthetic anomaly points on NASA FIRMS failure");
});

test("Adversarial 5: GET /api/firms route handler with invalid FIRMS key returns HTTP 500 with nasa-firms-error and NO fake points", async () => {
  sataConfig.nasa.firmsMapKey = "INVALID_FIRMS_KEY_9999999999999999";

  const req = new NextRequest("http://localhost:3005/api/firms?bbox=80.1,12.9,80.35,13.2&days=1");
  const response = await firmsGetHandler(req);

  assert.equal(response.status, 500, "API must return HTTP 500 on NASA FIRMS query failure");

  const json = await response.json();
  assert.equal(json.success, false, "Response success must be false");
  assert.equal(json.source, "nasa-firms-error", "Response source must be 'nasa-firms-error'");
  assert.ok(json.error, "Response must include error description");
  assert.equal(json.points, undefined, "Response must NOT contain points array");
});

test("Adversarial 6: FORCE_LIVE=true enforcement across environment, config, and operational paths", () => {
  // 1. Verify FORCE_LIVE in process.env
  assert.equal(process.env.FORCE_LIVE, "true", "process.env.FORCE_LIVE must be explicitly 'true'");

  // 2. Verify sataConfig enforcement
  const config = loadSataConfig();
  assert.equal(config.flags.forceLive, true, "config.flags.forceLive must be true");

  // 3. Verify placeholder rejection when FORCE_LIVE is active
  const savedMetaKey = process.env.META_API_KEY;
  try {
    process.env.META_API_KEY = "your_meta_api_key_here";
    assert.throws(
      () => loadSataConfig(),
      (err: any) => err instanceof ConfigurationError,
      "loadSataConfig must throw ConfigurationError on placeholder META_API_KEY"
    );
  } finally {
    process.env.META_API_KEY = savedMetaKey;
  }

  const savedFirmsKey = process.env.NASA_FIRMS_MAP_KEY;
  try {
    process.env.NASA_FIRMS_MAP_KEY = "your_free_nasa_firms_map_key";
    delete process.env.NASA_FIRMS_KEY;
    assert.throws(
      () => loadSataConfig(),
      (err: any) => err instanceof ConfigurationError,
      "loadSataConfig must throw ConfigurationError on placeholder NASA_FIRMS_MAP_KEY"
    );
  } finally {
    process.env.NASA_FIRMS_MAP_KEY = savedFirmsKey;
  }

  // 4. Verify no mock flags exist in process.env
  assert.notEqual(process.env.USE_MOCK, "true", "USE_MOCK must not be true");
  assert.notEqual(process.env.MOCK_DATA, "true", "MOCK_DATA must not be true");
  assert.notEqual(process.env.ENABLE_FALLBACK, "true", "ENABLE_FALLBACK must not be true");
  assert.notEqual(process.env.MOCK, "true", "MOCK must not be true");

  // 5. Verify no mock flags in .env.local
  const envPath = path.resolve(process.cwd(), ".env.local");
  const envContent = fs.readFileSync(envPath, "utf8");
  assert.ok(!envContent.includes("USE_MOCK=true"), ".env.local must not contain USE_MOCK=true");
  assert.ok(!envContent.includes("MOCK_DATA=true"), ".env.local must not contain MOCK_DATA=true");
  assert.ok(!envContent.includes("ENABLE_FALLBACK=true"), ".env.local must not contain ENABLE_FALLBACK=true");
});
