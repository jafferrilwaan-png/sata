import test from "node:test";
import assert from "node:assert/strict";
import {
  computeLayerType,
  validateDispatchResult,
  normalizeQuery,
} from "./telemetryLogic";

test("Test 1: normalizeQuery trims whitespace and downcases text", () => {
  assert.equal(normalizeQuery("  Wildfires Around Chennai  "), "wildfires around chennai");
  assert.equal(normalizeQuery(""), "");
});

test("Test 2: computeLayerType classifies CRYO keywords correctly", () => {
  assert.equal(computeLayerType("Antarctic Ocean iceberg calving"), "CRYO");
  assert.equal(computeLayerType("Ronne ice shelf fracture"), "CRYO");
  assert.equal(computeLayerType("glacier cryo anomaly"), "CRYO");
});

test("Test 3: computeLayerType classifies STORM keywords correctly", () => {
  assert.equal(computeLayerType("Cyclone over Bay of Bengal"), "STORM");
  assert.equal(computeLayerType("Severe hurricane alert"), "STORM");
  assert.equal(computeLayerType("Typhoon tracking coordinates"), "STORM");
});

test("Test 4: computeLayerType classifies ORBITAL keywords correctly", () => {
  assert.equal(computeLayerType("ISRO Cartosat-3 satellite pass"), "ORBITAL");
  assert.equal(computeLayerType("Orbit trajectory pass time"), "ORBITAL");
  assert.equal(computeLayerType("Starlink TLE ephemeris"), "ORBITAL");
});

test("Test 5: computeLayerType defaults to THERMAL for wildfire and fire queries", () => {
  assert.equal(computeLayerType("Wildfire near Chennai"), "THERMAL");
  assert.equal(computeLayerType("Industrial thermal heat plume"), "THERMAL");
  assert.equal(computeLayerType("Active heat anomalies"), "THERMAL");
});

test("Test 6: validateDispatchResult accepts valid live dispatch schema", () => {
  const valid = {
    targetName: "Chennai, Tamil Nadu",
    lat: 13.0827,
    lon: 80.2707,
    zoomAltitude: 1.6,
    activeHeatSpots: 84,
    layerType: "THERMAL",
    briefingSummary: "Llama 4: Active thermal anomalies detected. Aerosol dispersion remains nominal.",
    telemetry: {
      viirsPoints: 56,
      modisPoints: 28,
      aodStatus: "STABLE",
      cloudCoverPct: 14,
    },
  };
  assert.equal(validateDispatchResult(valid), true);
});

test("Test 7: validateDispatchResult rejects missing targetName", () => {
  assert.equal(
    validateDispatchResult({
      targetName: "",
      lat: 13.0827,
      lon: 80.2707,
      zoomAltitude: 1.6,
      activeHeatSpots: 84,
      layerType: "THERMAL",
      briefingSummary: "Llama 4: Test.",
      telemetry: { viirsPoints: 1, modisPoints: 1, aodStatus: "STABLE", cloudCoverPct: 10 },
    }),
    false
  );
});

test("Test 8: validateDispatchResult rejects out-of-bounds latitude", () => {
  assert.equal(
    validateDispatchResult({
      targetName: "Invalid Lat",
      lat: 135.0,
      lon: 80.2707,
      zoomAltitude: 1.6,
      activeHeatSpots: 84,
      layerType: "THERMAL",
      briefingSummary: "Llama 4: Test.",
      telemetry: { viirsPoints: 1, modisPoints: 1, aodStatus: "STABLE", cloudCoverPct: 10 },
    }),
    false
  );
});

test("Test 9: validateDispatchResult rejects out-of-bounds longitude", () => {
  assert.equal(
    validateDispatchResult({
      targetName: "Invalid Lon",
      lat: 13.0,
      lon: -195.0,
      zoomAltitude: 1.6,
      activeHeatSpots: 84,
      layerType: "THERMAL",
      briefingSummary: "Llama 4: Test.",
      telemetry: { viirsPoints: 1, modisPoints: 1, aodStatus: "STABLE", cloudCoverPct: 10 },
    }),
    false
  );
});

test("Test 10: validateDispatchResult rejects invalid layerType", () => {
  assert.equal(
    validateDispatchResult({
      targetName: "Test",
      lat: 13.0,
      lon: 80.0,
      zoomAltitude: 1.6,
      activeHeatSpots: 84,
      layerType: "INVALID_LAYER",
      briefingSummary: "Llama 4: Test.",
      telemetry: { viirsPoints: 1, modisPoints: 1, aodStatus: "STABLE", cloudCoverPct: 10 },
    }),
    false
  );
});

test("Test 11: validateDispatchResult rejects briefing without 'Llama 4:' prefix", () => {
  assert.equal(
    validateDispatchResult({
      targetName: "Test",
      lat: 13.0,
      lon: 80.0,
      zoomAltitude: 1.6,
      activeHeatSpots: 84,
      layerType: "THERMAL",
      briefingSummary: "Missing prefix.",
      telemetry: { viirsPoints: 1, modisPoints: 1, aodStatus: "STABLE", cloudCoverPct: 10 },
    }),
    false
  );
});

test("Test 12: validateDispatchResult rejects invalid AOD status", () => {
  assert.equal(
    validateDispatchResult({
      targetName: "Test",
      lat: 13.0,
      lon: 80.0,
      zoomAltitude: 1.6,
      activeHeatSpots: 84,
      layerType: "THERMAL",
      briefingSummary: "Llama 4: Test.",
      telemetry: { viirsPoints: 1, modisPoints: 1, aodStatus: "UNKNOWN_STATUS", cloudCoverPct: 10 },
    }),
    false
  );
});

test("Test 13: validateDispatchResult rejects out-of-bounds cloud cover percentage", () => {
  assert.equal(
    validateDispatchResult({
      targetName: "Test",
      lat: 13.0,
      lon: 80.0,
      zoomAltitude: 1.6,
      activeHeatSpots: 84,
      layerType: "THERMAL",
      briefingSummary: "Llama 4: Test.",
      telemetry: { viirsPoints: 1, modisPoints: 1, aodStatus: "STABLE", cloudCoverPct: 150 },
    }),
    false
  );
});

test("Test 14: validateDispatchResult rejects negative heat spots", () => {
  assert.equal(
    validateDispatchResult({
      targetName: "Test",
      lat: 13.0,
      lon: 80.0,
      zoomAltitude: 1.6,
      activeHeatSpots: -5,
      layerType: "THERMAL",
      briefingSummary: "Llama 4: Test.",
      telemetry: { viirsPoints: 1, modisPoints: 1, aodStatus: "STABLE", cloudCoverPct: 10 },
    }),
    false
  );
});

test("Test 15: validateDispatchResult rejects null or missing telemetry object", () => {
  assert.equal(
    validateDispatchResult({
      targetName: "Test",
      lat: 13.0,
      lon: 80.0,
      zoomAltitude: 1.6,
      activeHeatSpots: 10,
      layerType: "THERMAL",
      briefingSummary: "Llama 4: Test.",
      telemetry: null,
    }),
    false
  );
});

test("Test 16: validateDispatchResult rejects null/undefined inputs cleanly without throwing", () => {
  assert.equal(validateDispatchResult(null), false);
  assert.equal(validateDispatchResult(undefined), false);
  assert.equal(validateDispatchResult("string instead of object"), false);
});
