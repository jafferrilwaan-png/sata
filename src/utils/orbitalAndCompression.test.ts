import test from "node:test";
import assert from "node:assert/strict";
import {
  encodeGeohash,
  geohashToH3Index,
  compressTelemetryPoints,
  formatLlamaSpatialPrompt,
} from "../lib/geospatial-compressor";
import { propagateTleKeplerian, SATELLITE_CATALOG } from "../lib/isro-orbit-engine";
import { ThermalAnomalyPoint } from "../types/sata";

test("Orbital Propagator: Cartosat-3 TLE propagates real Sun-synchronous altitude and velocity", () => {
  const cartosat = SATELLITE_CATALOG.find((s) => s.catalogNumber === 44804);
  assert.ok(cartosat, "Cartosat-3 must exist in catalog");

  const { inclinationDeg, altitudeKm, velocityKms } = propagateTleKeplerian(cartosat.defaultTle[1]);

  assert.ok(Math.abs(inclinationDeg - 97.4) < 1.0, `Inclination must be ~97.4°, got ${inclinationDeg}`);
  assert.ok(altitudeKm > 490 && altitudeKm < 520, `Altitude must be ~505 km, got ${altitudeKm}`);
  assert.ok(velocityKms > 7.5 && velocityKms < 7.7, `Velocity must be ~7.6 km/s, got ${velocityKms}`);
});

test("Orbital Propagator: INSAT-3DR TLE propagates geostationary orbit altitude and inclination", () => {
  const insat = SATELLITE_CATALOG.find((s) => s.catalogNumber === 41752);
  assert.ok(insat, "INSAT-3DR must exist in catalog");

  const { inclinationDeg, altitudeKm } = propagateTleKeplerian(insat.defaultTle[1]);

  assert.ok(inclinationDeg < 1.0, `Geostationary inclination near 0°, got ${inclinationDeg}`);
  assert.ok(altitudeKm > 35000, `Geostationary altitude must be ~35,786 km, got ${altitudeKm}`);
});

test("Spatial Compression: Geohash accurately encodes Chennai coordinates", () => {
  const gh = encodeGeohash(13.0827, 80.2707, 6);
  assert.equal(typeof gh, "string");
  assert.equal(gh.length, 6);

  const h3Index = geohashToH3Index(gh, 7);
  assert.ok(h3Index.startsWith("87"), "H3 resolution 7 must start with 87");
});

test("Spatial Compression: Compresses 100+ raw points into <80 tokens micro-digest", () => {
  const syntheticPoints: ThermalAnomalyPoint[] = [];
  for (let i = 0; i < 120; i++) {
    syntheticPoints.push({
      id: `TEST-PT-${i}`,
      latitude: 13.08 + (i % 10) * 0.01,
      longitude: 80.27 + (i % 10) * 0.01,
      brightness: 320 + (i % 30),
      scan: 0.4,
      track: 0.4,
      acq_date: "2026-10-30",
      acq_time: "14:20",
      satellite: i % 2 === 0 ? "VIIRS_NOAA20" : "MODIS_TERRA",
      confidence: "nominal",
      frp: 15.0 + (i % 25),
      color: "#06b6d4",
      pulseRate: 1.5,
    });
  }

  const result = compressTelemetryPoints(syntheticPoints);
  assert.ok(result.clusterCount > 0, "Must produce spatial clusters");
  assert.equal(result.totalPoints, 120);

  const prompt = formatLlamaSpatialPrompt("Chennai, Tamil Nadu", result, "STABLE");

  // Verify token ceiling (<80 tokens)
  assert.ok(
    result.tokenCountEstimate < 80,
    `Token estimate must be < 80 tokens, got ${result.tokenCountEstimate}`
  );
  assert.ok(prompt.includes("DIGEST:"), "Prompt must include digested spatial context");
  assert.ok(prompt.includes("H3:"), "Digest must contain H3 index representation");
});
