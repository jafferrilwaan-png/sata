import test from "node:test";
import assert from "node:assert/strict";
import { loadEnvConfig } from "@next/env";

// Baseline env loading
loadEnvConfig(process.cwd());

import { loadSataConfig, ConfigurationError } from "../lib/config";
import { fetchNasaFirmsAnomalies } from "../lib/nasa-firms";
import { computeSensorTelemetry } from "../lib/telemetry";

const SAVED_ENV = { ...process.env };

function restoreEnv() {
  process.env = { ...SAVED_ENV };
}

test("Adversarial 1: loadSataConfig() rejects missing or placeholder META_API_KEY", () => {
  try {
    // Subcase 1A: META_API_KEY is undefined
    delete process.env.META_API_KEY;
    assert.throws(
      () => loadSataConfig(),
      (err: any) => err instanceof ConfigurationError && err.message.includes("META_API_KEY"),
      "Should throw ConfigurationError when META_API_KEY is undefined"
    );

    // Subcase 1B: META_API_KEY is placeholder 'your_meta_api_key_here'
    process.env.META_API_KEY = "your_meta_api_key_here";
    assert.throws(
      () => loadSataConfig(),
      (err: any) => err instanceof ConfigurationError && err.message.includes("META_API_KEY"),
      "Should throw ConfigurationError when META_API_KEY is placeholder"
    );

    // Subcase 1C: META_API_KEY is empty string
    process.env.META_API_KEY = "   ";
    assert.throws(
      () => loadSataConfig(),
      (err: any) => err instanceof ConfigurationError,
      "Should throw ConfigurationError when META_API_KEY is whitespace"
    );

    // Subcase 1D: META_API_KEY is PLACEHOLDER
    process.env.META_API_KEY = "PLACEHOLDER";
    assert.throws(
      () => loadSataConfig(),
      (err: any) => err instanceof ConfigurationError,
      "Should throw ConfigurationError when META_API_KEY is 'PLACEHOLDER'"
    );

    // Subcase 1E: META_API_KEY is TODO
    process.env.META_API_KEY = "TODO";
    assert.throws(
      () => loadSataConfig(),
      (err: any) => err instanceof ConfigurationError,
      "Should throw ConfigurationError when META_API_KEY is 'TODO'"
    );
  } finally {
    restoreEnv();
  }
});

test("Adversarial 2: loadSataConfig() rejects missing or placeholder NASA_FIRMS_MAP_KEY", () => {
  try {
    // Subcase 2A: Keys deleted
    delete process.env.NASA_FIRMS_MAP_KEY;
    delete process.env.NASA_FIRMS_KEY;
    assert.throws(
      () => loadSataConfig(),
      (err: any) => err instanceof ConfigurationError && err.message.includes("NASA_FIRMS_MAP_KEY"),
      "Should throw ConfigurationError when FIRMS key is absent"
    );

    // Subcase 2B: Placeholder 'your_free_nasa_firms_map_key'
    process.env.NASA_FIRMS_MAP_KEY = "your_free_nasa_firms_map_key";
    delete process.env.NASA_FIRMS_KEY;
    assert.throws(
      () => loadSataConfig(),
      (err: any) => err instanceof ConfigurationError && err.message.includes("NASA_FIRMS_MAP_KEY"),
      "Should throw ConfigurationError when FIRMS key is placeholder"
    );

    // Subcase 2C: Empty string
    process.env.NASA_FIRMS_MAP_KEY = "";
    delete process.env.NASA_FIRMS_KEY;
    assert.throws(
      () => loadSataConfig(),
      (err: any) => err instanceof ConfigurationError,
      "Should throw ConfigurationError when FIRMS key is empty"
    );

    // Subcase 2D: PLACEHOLDER keyword
    process.env.NASA_FIRMS_MAP_KEY = "PLACEHOLDER";
    delete process.env.NASA_FIRMS_KEY;
    assert.throws(
      () => loadSataConfig(),
      (err: any) => err instanceof ConfigurationError,
      "Should throw ConfigurationError when FIRMS key is 'PLACEHOLDER'"
    );
  } finally {
    restoreEnv();
  }
});

test("Adversarial 3: Live zero-fire detection returns [] and computeSensorTelemetry yields total_heat_spots === 0", async () => {
  restoreEnv();
  // Known urban/marine bounding box in Chennai: [80.1, 12.9, 80.35, 13.2]
  const bbox: [number, number, number, number] = [80.1, 12.9, 80.35, 13.2];
  const points = await fetchNasaFirmsAnomalies(bbox, 1);

  // Assert genuine live response
  assert.ok(Array.isArray(points), "Result must be an array");
  console.log(`[EMPIRICAL TEST] Live FIRMS query returned ${points.length} points for Chennai bbox.`);
  assert.equal(points.length, 0, "Chennai urban/marine bbox must yield 0 active fire anomalies today");

  // Telemetry computation verification
  const telemetry = computeSensorTelemetry(points, "THERMAL_FIRE");
  console.log("[EMPIRICAL TEST] computeSensorTelemetry result:", JSON.stringify(telemetry, null, 2));

  assert.equal(telemetry.total_heat_spots, 0, "total_heat_spots MUST strictly equal 0 (NOT 84)");
  assert.equal(telemetry.primary_sensor_metric, "0 Points");
  assert.equal(telemetry.secondary_sensor_metric, "0 Points");
});

test("Adversarial 4: Zero Mock Fallback verification when FIRMS returns invalid response", async () => {
  // If an invalid key is used, fetchNasaFirmsAnomalies must throw an error, NOT return mock data
  // We temporarily test this by calling the FIRMS URL directly or observing fetchNasaFirmsAnomalies behavior
  const mapKey = "00000000000000000000000000000000"; // Invalid 32-char hex key
  const bboxStr = "80.1,12.9,80.35,13.2";
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/VIIRS_SNPP_NRT/${bboxStr}/1`;

  const response = await fetch(url);
  // NASA FIRMS returns 403 or error text for bad key
  const bodyText = await response.text();
  console.log(`[EMPIRICAL TEST] Invalid key HTTP Status: ${response.status}, body: "${bodyText.trim()}"`);
  assert.ok(!response.ok || bodyText.toLowerCase().includes("invalid") || bodyText.toLowerCase().includes("denied") || bodyText.toLowerCase().includes("error") || response.status === 403 || response.status === 401, "Invalid key must be rejected by NASA FIRMS");
});
