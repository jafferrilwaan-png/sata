import test from "node:test";
import assert from "node:assert/strict";
import {
  computeAtmosphericOpticalDepth,
  computeKastenYoungAirMass,
  computeBodhaineRayleighOpticalDepth,
  computeTraceGasAbsorption,
  computeFireRadiativeMetrics,
  computeGaussianPlumeDispersion,
  WOOSTER_BIOMASS_COEFFICIENT_KG_PER_MJ,
  DEFAULT_PM25_EMISSION_FACTOR_G_PER_KG,
  SAVANNA_PM25_EMISSION_FACTOR_G_PER_KG,
} from "../lib/earth-physics";
import { PasquillStabilityClass } from "../types/physics";

/**
 * Asserts that a numerical value is within a percentage tolerance of the expected value.
 * Default tolerance is 0.1% (+/- 0.001 relative error).
 */
function assertClose(
  actual: number,
  expected: number,
  tolerancePct: number = 0.1,
  fieldName: string = "Value"
): void {
  const delta = Math.abs(actual - expected);
  const maxDelta = Math.abs(expected) * (tolerancePct / 100.0);
  assert.ok(
    delta <= maxDelta,
    `${fieldName} outside +/- ${tolerancePct}% tolerance! Actual: ${actual}, Expected: ${expected}, Delta: ${delta}, Allowed Delta: ${maxDelta}`
  );
}

// ============================================================================
// 1. FEATURE F4: ATMOSPHERIC OPTICAL DEPTH (AOD) BENCHMARKS
// ============================================================================

test("M2 Feature F4: Case A Atmospheric Optical Depth & Angstrom Exponent Benchmark", () => {
  const result = computeAtmosphericOpticalDepth(
    600.0, // directSolarIrradianceWPerM2
    1000.0, // toaSolarIrradianceWPerM2
    30.0, // solarZenithAngleDeg
    0.47, // wavelengthUm (primary blue channel)
    0.66, // secondaryWavelengthUm (red channel)
    0.145, // secondaryAod
    1013.25 // pressureHpa
  );

  // 1. Optical Air Mass (Kasten-Young: 1.153992 +/- 0.1%)
  assertClose(result.opticalAirMass, 1.153992, 0.1, "opticalAirMass");

  // 2. Total Optical Depth (0.442659 +/- 0.1%)
  assertClose(result.totalOpticalDepth, 0.442659, 0.1, "totalOpticalDepth");

  // 3. Rayleigh Optical Depth (Bodhaine exact at 0.47um: 0.185057 +/- 0.1%)
  assertClose(result.rayleighOpticalDepth, 0.185057, 0.1, "rayleighOpticalDepth");

  // 4. Trace Gas Absorption (Chappuis band at 0.47um: 0.008000 +/- 0.1%)
  assertClose(result.traceGasOpticalDepth, 0.008, 0.1, "traceGasOpticalDepth");

  // 5. Aerosol Optical Depth (0.249605 +/- 0.1%)
  assertClose(result.aerosolOpticalDepth, 0.249605, 0.1, "aerosolOpticalDepth");

  // 6. Angstrom Exponent Alpha (1.599802 +/- 0.1%)
  assertClose(result.angstromAlpha, 1.599802, 0.1, "angstromAlpha");

  // 7. Scaled AOD at 550nm green channel (0.194108 +/- 0.1%)
  assertClose(result.scaledAod550nm, 0.194108, 0.1, "scaledAod550nm");

  // 8. Aerosol Extinction Coefficient (0.129405 km^-1 +/- 0.1%)
  assertClose(result.aerosolExtinctionKmInv, 0.129405, 0.1, "aerosolExtinctionKmInv");

  // 9. Ground PM2.5 (12.616988 ug/m^3 +/- 0.1%)
  assertClose(result.estimatedPm25UgM3, 12.616988, 0.1, "estimatedPm25UgM3");

  // 10. Qualitative Classification
  assert.equal(result.classification, "STABLE");
});

test("M2 Feature F4: AOD Classification Threshold Boundaries", () => {
  // CLEAR: AOD < 0.10
  const clearResult = computeAtmosphericOpticalDepth(950, 1000, 0, 0.55);
  assert.ok(clearResult.scaledAod550nm < 0.1);
  assert.equal(clearResult.classification, "CLEAR");

  // STABLE: 0.10 <= AOD <= 0.35
  const stableResult = computeAtmosphericOpticalDepth(750, 1000, 0, 0.55);
  assert.ok(stableResult.scaledAod550nm >= 0.1 && stableResult.scaledAod550nm <= 0.35);
  assert.equal(stableResult.classification, "STABLE");

  // ELEVATED: 0.35 < AOD <= 0.70
  const elevatedResult = computeAtmosphericOpticalDepth(550, 1000, 0, 0.55);
  assert.ok(elevatedResult.scaledAod550nm > 0.35 && elevatedResult.scaledAod550nm <= 0.7);
  assert.equal(elevatedResult.classification, "ELEVATED");

  // CRITICAL: AOD > 0.70
  const criticalResult = computeAtmosphericOpticalDepth(200, 1000, 0, 0.55);
  assert.ok(criticalResult.scaledAod550nm > 0.7);
  assert.equal(criticalResult.classification, "CRITICAL");
});

test("M2 Feature F4: Bodhaine Pressure Scaling and Zenith Clamping", () => {
  // Atmospheric pressure scaling at high altitude (e.g. 850 hPa)
  const seaLevelRayleigh = computeBodhaineRayleighOpticalDepth(0.47, 1013.25);
  const mountainRayleigh = computeBodhaineRayleighOpticalDepth(0.47, 850.0);
  assertClose(mountainRayleigh, seaLevelRayleigh * (850.0 / 1013.25), 0.01, "mountainRayleigh");

  // Zenith angle near horizon clamped to 89 deg
  const m89 = computeKastenYoungAirMass(89.0);
  const m95 = computeKastenYoungAirMass(95.0);
  assert.equal(m89, m95, "Zenith angles above 89 degrees should clamp safely");
});

// ============================================================================
// 2. FEATURE F5: THERMAL RADIANCE & FRE BENCHMARKS
// ============================================================================

test("M2 Feature F5: Case B Fire Radiative Power, Energy, Biomass & Smoke Emissions Benchmark", () => {
  const points = [
    { frpMw: 45.0, brightnessTi4K: 367.4, brightnessTi5K: 298.2 },
    { frpMw: 30.0, brightnessTi4K: 350.1, brightnessTi5K: 295.0 },
    { frpMw: 25.0, brightnessTi4K: 342.8, brightnessTi5K: 294.5 },
  ];
  const durationHours = 2.0;

  const result = computeFireRadiativeMetrics(points, durationHours);

  // 1. Total FRP (MW) = 45 + 30 + 25 = 100 MW
  assertClose(result.totalFrpMw, 100.0, 0.1, "totalFrpMw");

  // 2. Peak FRP (MW) = max(45, 30, 25) = 45 MW
  assertClose(result.peakFrpMw, 45.0, 0.1, "peakFrpMw");

  // 3. Fire Radiative Energy (Joules) = 100 * 1e6 * (2 * 3600) = 7.20e11 J
  assertClose(result.fireRadiativeEnergyJoules, 7.2e11, 0.1, "fireRadiativeEnergyJoules");

  // 4. Fire Radiative Energy (MJ) = 720000.0 MJ
  assertClose(result.fireRadiativeEnergyMj, 720000.0, 0.1, "fireRadiativeEnergyMj");

  // 5. Combusted Dry Biomass (kg) = 0.368 * 720000 = 264960.0 kg
  assertClose(result.dryBiomassConsumedKg, 264960.0, 0.1, "dryBiomassConsumedKg");

  // 6. Combusted Dry Biomass (metric tons) = 264.96 tons
  assertClose(result.dryBiomassConsumedTons, 264.96, 0.1, "dryBiomassConsumedTons");

  // 7. Total PM2.5 Emitted (grams) = 264960 * 12.5 = 3312000.0 g
  assertClose(result.totalPm25EmittedGrams, 3312000.0, 0.1, "totalPm25EmittedGrams (12.5 g/kg)");

  // 8. Continuous Smoke Emission Rate Q (g/s) = 4.60 * 100 = 460.0 g/s
  assertClose(result.continuousEmissionRateGs, 460.0, 0.1, "continuousEmissionRateGs (12.5 g/kg)");
});

test("M2 Feature F5: Case B Savanna Emission Factor (9.0 g/kg)", () => {
  const points = [{ frpMw: 45.0 }, { frpMw: 30.0 }, { frpMw: 25.0 }];
  const durationHours = 2.0;

  const result = computeFireRadiativeMetrics(
    points,
    durationHours,
    SAVANNA_PM25_EMISSION_FACTOR_G_PER_KG
  );

  // Combusted biomass remains unchanged
  assertClose(result.dryBiomassConsumedKg, 264960.0, 0.1, "dryBiomassConsumedKg");

  // Total PM2.5 = 264960 * 9.0 = 2384640.0 g
  assertClose(result.totalPm25EmittedGrams, 2384640.0, 0.1, "totalPm25EmittedGrams (9.0 g/kg)");

  // Continuous emission rate Q = 2384640 / 7200 = 331.2 g/s
  assertClose(result.continuousEmissionRateGs, 331.2, 0.1, "continuousEmissionRateGs (9.0 g/kg)");
});

test("M2 Feature F5: Edge Cases - Empty Array and Zero Duration", () => {
  // Empty array returns strict zeroes
  const emptyResult = computeFireRadiativeMetrics([], 2.0);
  assert.equal(emptyResult.totalFrpMw, 0);
  assert.equal(emptyResult.peakFrpMw, 0);
  assert.equal(emptyResult.fireRadiativeEnergyJoules, 0);
  assert.equal(emptyResult.fireRadiativeEnergyMj, 0);
  assert.equal(emptyResult.dryBiomassConsumedKg, 0);
  assert.equal(emptyResult.dryBiomassConsumedTons, 0);
  assert.equal(emptyResult.totalPm25EmittedGrams, 0);
  assert.equal(emptyResult.continuousEmissionRateGs, 0);

  // Zero duration returns instantaneous Q = 4.60 * totalFrpMw
  const zeroDurResult = computeFireRadiativeMetrics([{ frpMw: 100.0 }], 0);
  assert.equal(zeroDurResult.totalFrpMw, 100.0);
  assert.equal(zeroDurResult.fireRadiativeEnergyJoules, 0);
  assert.equal(zeroDurResult.fireRadiativeEnergyMj, 0);
  assert.equal(zeroDurResult.dryBiomassConsumedKg, 0);
  assertClose(zeroDurResult.continuousEmissionRateGs, 460.0, 0.1, "instantaneous Q");
});

test("M2 Feature F5: Brightness Temperature Fallback When frpMw is Zero", () => {
  const points = [{ frpMw: 0, brightnessTi4K: 367.4, brightnessTi5K: 298.2 }];
  const result = computeFireRadiativeMetrics(points, 1.0);

  assert.ok(result.totalFrpMw > 100.0, `Expected estimated FRP > 100 MW, got ${result.totalFrpMw}`);
  assert.ok(result.fireRadiativeEnergyJoules > 0, "FRE Joules must be positive");
});

// ============================================================================
// 3. FEATURE F6: GAUSSIAN PLUME DISPERSION BENCHMARKS
// ============================================================================

test("M2 Feature F6: Case C Gaussian Plume Dispersion Benchmark", () => {
  const result = computeGaussianPlumeDispersion(
    460.0, // emissionRateGs
    100.0, // totalFrpMw
    4.0, // windSpeedMs
    2.5, // downwindDistKm
    0.0, // crosswindDistM
    "D", // stabilityClass
    15.0, // releaseHeightM
    150.0 // inversionCapM
  );

  // 1. Buoyancy Flux Fb = 29.0 * 100 = 2900.0 m^4/s^3
  assertClose(result.buoyancyFluxM4S3, 2900.0, 0.1, "buoyancyFluxM4S3");

  // 2. Unconstrained Plume Rise = 1156.65 m
  assertClose(result.plumeRiseM, 1156.65, 0.1, "plumeRiseM");

  // 3. Effective Plume Height H = capped at 150.0 m
  assertClose(result.effectivePlumeHeightM, 150.0, 0.1, "effectivePlumeHeightM");

  // 4. Sigma Y at 2.5 km (Class D: 68 * 2.5^0.894 = 154.265 m)
  assertClose(result.sigmaYM, 154.265, 0.1, "sigmaYM");

  // 5. Sigma Z at 2.5 km (Class D: 44.5 * 2.5^0.516 = 71.400 m)
  assertClose(result.sigmaZM, 71.4, 0.1, "sigmaZM");

  // 6. Ground-Level Concentration at 2.5 km (365.757 ug/m^3)
  assertClose(result.groundConcentrationUgM3, 365.757, 0.1, "groundConcentrationUgM3");

  // 7. Peak Downwind Distance x_max (5.383 km)
  assertClose(result.peakDistanceKm, 5.383, 0.1, "peakDistanceKm");

  // 8. Peak Ground Concentration C_max (414.590 ug/m^3)
  assertClose(result.peakGroundConcentrationUgM3, 414.59, 0.1, "peakGroundConcentrationUgM3");

  // 9. Stability Class
  assert.equal(result.stabilityClass, "D");
});

test("M2 Feature F6: Stability Classes A-F Monotonic Dispersion Characteristics", () => {
  const classes: PasquillStabilityClass[] = ["A", "B", "C", "D", "E", "F"];
  const results = classes.map((c) =>
    computeGaussianPlumeDispersion(460.0, 100.0, 4.0, 2.5, 0.0, c, 15.0, 150.0)
  );

  // 1. Crosswind dispersion sigma_y strictly decreases from A to F
  for (let i = 0; i < results.length - 1; i++) {
    assert.ok(
      results[i].sigmaYM > results[i + 1].sigmaYM,
      `sigmaYM for ${classes[i]} (${results[i].sigmaYM}) must exceed ${classes[i + 1]} (${results[i + 1].sigmaYM})`
    );
  }

  // 2. Vertical dispersion sigma_z at 2.5 km strictly decreases from A to F
  for (let i = 0; i < results.length - 1; i++) {
    assert.ok(
      results[i].sigmaZM > results[i + 1].sigmaZM,
      `sigmaZM for ${classes[i]} (${results[i].sigmaZM}) must exceed ${classes[i + 1]} (${results[i + 1].sigmaZM})`
    );
  }

  // 3. Peak downwind distance x_max increases monotonically as atmosphere becomes more stable
  for (let i = 0; i < results.length - 1; i++) {
    assert.ok(
      results[i].peakDistanceKm <= results[i + 1].peakDistanceKm,
      `peakDistanceKm for ${classes[i]} (${results[i].peakDistanceKm}) must be <= ${classes[i + 1]} (${results[i + 1].peakDistanceKm})`
    );
  }
});

test("M2 Feature F6: Crosswind Attenuation and Zero Emission Edge Cases", () => {
  // Centerline vs crosswind (y = 200 m)
  const centerline = computeGaussianPlumeDispersion(460.0, 100.0, 4.0, 2.5, 0.0, "D", 15.0, 150.0);
  const crosswind = computeGaussianPlumeDispersion(460.0, 100.0, 4.0, 2.5, 200.0, "D", 15.0, 150.0);

  assert.ok(
    crosswind.groundConcentrationUgM3 < centerline.groundConcentrationUgM3,
    "Crosswind concentration must be strictly less than centerline"
  );

  // Zero emission rate and zero FRP
  const zeroResult = computeGaussianPlumeDispersion(0, 0, 4.0, 2.5, 0.0, "D", 15.0);
  assert.equal(zeroResult.buoyancyFluxM4S3, 0);
  assert.equal(zeroResult.plumeRiseM, 0);
  assert.equal(zeroResult.groundConcentrationUgM3, 0);
  assert.equal(zeroResult.peakGroundConcentrationUgM3, 0);
});
