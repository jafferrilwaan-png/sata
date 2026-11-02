/**
 * Earth Physics & Atmospheric Chemistry Engine for SATA Sentinel
 * Milestone 2: Feature F4 (AOD), Feature F5 (Thermal/FRE), Feature F6 (Plume Dispersion)
 * Strictly conforms to Contract 2 in PROJECT.md.
 */

import {
  AodCalculationResult,
  AodClassification,
  FireRadiativeResult,
  PasquillStabilityClass,
  PlumeDispersionResult,
} from "../types/physics";

// --- PHYSICAL CONSTANTS ---
export const STANDARD_SEA_LEVEL_PRESSURE_HPA = 1013.25;
export const DEFAULT_PBL_SCALE_HEIGHT_KM = 1.5;
export const DEFAULT_ANGSTROM_ALPHA = 1.30;
export const PM25_AOD_CONVERSION_FACTOR = 65.0;

export const WOOSTER_BIOMASS_COEFFICIENT_KG_PER_MJ = 0.368;
export const DEFAULT_PM25_EMISSION_FACTOR_G_PER_KG = 12.5;
export const SAVANNA_PM25_EMISSION_FACTOR_G_PER_KG = 9.0;
export const STEFAN_BOLTZMANN_CONSTANT = 5.670374419e-8;
export const VIIRS_375M_PIXEL_AREA_M2 = 1.40625e5;

// ============================================================================
// 1. FEATURE F4: ATMOSPHERIC OPTICAL DEPTH (AOD) & RADIATIVE TRANSFER
// ============================================================================

/**
 * Calculates optical air mass using the Kasten and Young (1989) empirical formulation.
 * Valid across all zenith angles, avoiding plane-parallel singularities near the horizon.
 *
 * @param solarZenithAngleDeg Solar zenith angle in degrees (0 = zenith, 90 = horizon)
 * @returns Dimensionless optical air mass factor m
 */
export function computeKastenYoungAirMass(solarZenithAngleDeg: number): number {
  const theta = Math.min(89.0, Math.max(0.0, Math.abs(solarZenithAngleDeg)));
  const thetaRad = (theta * Math.PI) / 180.0;
  const cosZenith = Math.cos(thetaRad);
  const horizonAngleDiff = 96.07995 - theta;
  const airMass = 1.0 / (cosZenith + 0.50572 * Math.pow(horizonAngleDiff, -1.6364));
  return airMass;
}

/**
 * Computes Rayleigh scattering optical depth using the Bodhaine et al. (1999) parameterization,
 * scaled by local atmospheric pressure.
 *
 * @param wavelengthUm Observation wavelength in micrometers (e.g. 0.47 for blue, 0.55 for green)
 * @param pressureHpa Local surface atmospheric pressure in hPa (default: 1013.25 hPa)
 * @returns Rayleigh optical depth tau_Rayleigh
 */
export function computeBodhaineRayleighOpticalDepth(
  wavelengthUm: number,
  pressureHpa: number = STANDARD_SEA_LEVEL_PRESSURE_HPA
): number {
  const pRatio = pressureHpa / STANDARD_SEA_LEVEL_PRESSURE_HPA;
  const l2Inv = Math.pow(wavelengthUm, -2);
  const l4Inv = Math.pow(wavelengthUm, -4);
  const dispersionFactor = 1.0 + 0.0113 * l2Inv + 0.00013 * l4Inv;
  return 0.008569 * l4Inv * dispersionFactor * pRatio;
}

/**
 * Estimates trace gas optical depth (dominated by Ozone Chappuis band) across visible bands.
 * Centered at 0.60 um with standard atmospheric column density (300 DU).
 *
 * @param wavelengthUm Observation wavelength in micrometers
 * @returns Trace gas absorption optical depth tau_gas
 */
export function computeTraceGasAbsorption(wavelengthUm: number): number {
  const peakAbsorption = 0.030;
  const centerWavelengthUm = 0.60;
  const bandSigma = 0.07995;
  return (
    peakAbsorption *
    Math.exp(
      -Math.pow(wavelengthUm - centerWavelengthUm, 2) / (2.0 * Math.pow(bandSigma, 2))
    )
  );
}

/**
 * Computes Atmospheric Optical Depth (AOD) and aerosol characteristics from solar irradiance measurements
 * and satellite spectral band observations using the Beer-Lambert law, Bodhaine Rayleigh scattering,
 * and Ångström spectral scaling.
 *
 * Conforms strictly to Contract 2 in PROJECT.md.
 */
export function computeAtmosphericOpticalDepth(
  directSolarIrradianceWPerM2: number,
  toaSolarIrradianceWPerM2: number,
  solarZenithAngleDeg: number,
  wavelengthUm: number,
  secondaryWavelengthUm?: number,
  secondaryAod?: number,
  pressureHpa: number = STANDARD_SEA_LEVEL_PRESSURE_HPA
): AodCalculationResult {
  // 1. Optical Air Mass (Kasten-Young 1989)
  const opticalAirMass = computeKastenYoungAirMass(solarZenithAngleDeg);

  // 2. Beer-Lambert Total Optical Depth
  const safeDirect = Math.max(1e-9, directSolarIrradianceWPerM2);
  const safeToa = Math.max(safeDirect, toaSolarIrradianceWPerM2);
  const totalOpticalDepth = -(1.0 / opticalAirMass) * Math.log(safeDirect / safeToa);

  // 3. Rayleigh Scattering Optical Depth (Bodhaine 1999)
  const rayleighOpticalDepth = computeBodhaineRayleighOpticalDepth(
    wavelengthUm,
    pressureHpa
  );

  // 4. Trace Gas Absorption (Ozone Chappuis band)
  const traceGasOpticalDepth = computeTraceGasAbsorption(wavelengthUm);

  // 5. Net Aerosol Optical Depth (non-negative)
  const aerosolOpticalDepth = Math.max(
    0.0,
    totalOpticalDepth - rayleighOpticalDepth - traceGasOpticalDepth
  );

  // 6. Ångström Exponent Spectral Scaling
  let angstromAlpha = DEFAULT_ANGSTROM_ALPHA;
  if (
    secondaryWavelengthUm !== undefined &&
    secondaryAod !== undefined &&
    secondaryAod > 0 &&
    aerosolOpticalDepth > 0 &&
    secondaryWavelengthUm !== wavelengthUm
  ) {
    angstromAlpha =
      Math.log(aerosolOpticalDepth / secondaryAod) /
      Math.log(secondaryWavelengthUm / wavelengthUm);
  }

  // 7. Scaled AOD at 550nm green reference channel
  const scaledAod550nm =
    aerosolOpticalDepth * Math.pow(0.55 / wavelengthUm, -angstromAlpha);

  // 8. Aerosol Extinction Coefficient (H_PBL = 1.5 km)
  const aerosolExtinctionKmInv = scaledAod550nm / DEFAULT_PBL_SCALE_HEIGHT_KM;

  // 9. Ground-Level PM2.5 Correlation (ug/m^3)
  const estimatedPm25UgM3 = PM25_AOD_CONVERSION_FACTOR * scaledAod550nm;

  // 10. AOD Qualitative Classification
  let classification: AodClassification;
  if (scaledAod550nm < 0.10) {
    classification = "CLEAR";
  } else if (scaledAod550nm <= 0.35) {
    classification = "STABLE";
  } else if (scaledAod550nm <= 0.70) {
    classification = "ELEVATED";
  } else {
    classification = "CRITICAL";
  }

  return {
    opticalAirMass,
    totalOpticalDepth,
    rayleighOpticalDepth,
    traceGasOpticalDepth,
    aerosolOpticalDepth,
    angstromAlpha,
    scaledAod550nm,
    aerosolExtinctionKmInv,
    estimatedPm25UgM3,
    classification,
  };
}

// ============================================================================
// 2. FEATURE F5: THERMAL RADIANCE, FRP, FRE & BIOMASS CONSUMPTION
// ============================================================================

/**
 * Computes Fire Radiative Power (FRP), Fire Radiative Energy (FRE),
 * combusted dry biomass, total particulate smoke emissions (PM2.5),
 * and continuous smoke emission rate Q.
 *
 * Conforms strictly to Contract 2 in PROJECT.md.
 *
 * @param hotspotPoints Array of hotspot observations with frpMw and optional brightness temperatures
 * @param durationHours Burning duration in hours (e.g. 2.0)
 * @param pm25EmissionFactorGPerKg Emission factor in g/kg (defaults to 12.5 g/kg per survey spec)
 * @returns FireRadiativeResult conforming strictly to Contract 1
 */
export function computeFireRadiativeMetrics(
  hotspotPoints: Array<{
    frpMw: number;
    brightnessTi4K?: number;
    brightnessTi5K?: number;
  }>,
  durationHours: number,
  pm25EmissionFactorGPerKg: number = DEFAULT_PM25_EMISSION_FACTOR_G_PER_KG
): FireRadiativeResult {
  const validDurationHours = Math.max(0, durationHours || 0);
  const durationSeconds = validDurationHours * 3600;

  // Defensive check: Handle empty or null hotspot array
  if (!hotspotPoints || hotspotPoints.length === 0) {
    return {
      totalFrpMw: 0,
      peakFrpMw: 0,
      fireRadiativeEnergyJoules: 0,
      fireRadiativeEnergyMj: 0,
      dryBiomassConsumedKg: 0,
      dryBiomassConsumedTons: 0,
      totalPm25EmittedGrams: 0,
      continuousEmissionRateGs: 0,
    };
  }

  let totalFrp = 0;
  let peakFrp = 0;

  for (const point of hotspotPoints) {
    let frp = point.frpMw;

    // Fallback: If frpMw is missing/invalid but brightness temperatures are present
    if (
      (frp === undefined || frp === null || isNaN(frp) || frp <= 0) &&
      point.brightnessTi4K &&
      point.brightnessTi5K &&
      point.brightnessTi4K > point.brightnessTi5K
    ) {
      // Stefan-Boltzmann 4th power brightness proxy:
      // k_MIR * (T_i4^4 - T_i5^4), where empirical factor ~1.385e-8 MW/K^4 for VIIRS 375m
      const deltaT4 =
        Math.pow(point.brightnessTi4K, 4) - Math.pow(point.brightnessTi5K, 4);
      frp = Math.max(0, 1.385e-8 * deltaT4);
    }

    const validFrp = Math.max(0, frp || 0);
    totalFrp += validFrp;
    if (validFrp > peakFrp) {
      peakFrp = validFrp;
    }
  }

  // FRE in Joules: Total FRP (W) * time (s) = Total FRP (MW) * 1e6 * durationSeconds
  const fireRadiativeEnergyJoules = totalFrp * 1e6 * durationSeconds;

  // FRE in Megajoules: FRE (Joules) * 1e-6 = Total FRP (MW) * durationSeconds
  const fireRadiativeEnergyMj = fireRadiativeEnergyJoules * 1e-6;

  // Dry Biomass combusted (Wooster et al. 2005): 0.368 kg/MJ
  const dryBiomassConsumedKg =
    WOOSTER_BIOMASS_COEFFICIENT_KG_PER_MJ * fireRadiativeEnergyMj;
  const dryBiomassConsumedTons = dryBiomassConsumedKg / 1000;

  // Total PM2.5 Emitted (grams) = biomass (kg) * EF (g/kg)
  const totalPm25EmittedGrams = dryBiomassConsumedKg * pm25EmissionFactorGPerKg;

  // Continuous particulate emission rate Q (g/s):
  // In steady-state: Q = 0.368 * EF * totalFrp (independent of duration)
  const continuousEmissionRateGs =
    durationSeconds > 0
      ? totalPm25EmittedGrams / durationSeconds
      : WOOSTER_BIOMASS_COEFFICIENT_KG_PER_MJ * pm25EmissionFactorGPerKg * totalFrp;

  return {
    totalFrpMw: totalFrp,
    peakFrpMw: peakFrp,
    fireRadiativeEnergyJoules,
    fireRadiativeEnergyMj,
    dryBiomassConsumedKg,
    dryBiomassConsumedTons,
    totalPm25EmittedGrams,
    continuousEmissionRateGs,
  };
}

// ============================================================================
// 3. FEATURE F6: ENVIRONMENTAL PLUME DISPERSION & GAUSSIAN MODELING
// ============================================================================

/**
 * Computes 3D Gaussian plume dispersion, Briggs thermal buoyancy plume rise,
 * Pasquill-Gifford dispersion coefficients, and ground-level concentrations.
 *
 * Conforms strictly to Contract 2 in PROJECT.md.
 *
 * @param emissionRateGs Source particulate emission rate Q in g/s (defaults to 4.60 * totalFrpMw if <= 0)
 * @param totalFrpMw Fire Radiative Power in MW for buoyancy flux calculation
 * @param windSpeedMs Ambient wind speed in m/s (clamped to >= 0.5 m/s)
 * @param downwindDistKm Downwind distance x from source in kilometers (km)
 * @param crosswindDistM Crosswind distance y from plume centerline in meters (m, default: 0)
 * @param stabilityClass Pasquill-Gifford stability class ("A" through "F", default: "D")
 * @param releaseHeightM Physical vegetation canopy release height hs in meters (default: 15.0 m)
 * @param inversionCapM Atmospheric inversion lid height in meters (optional)
 * @returns PlumeDispersionResult conforming strictly to Contract 1
 */
export function computeGaussianPlumeDispersion(
  emissionRateGs: number,
  totalFrpMw: number,
  windSpeedMs: number,
  downwindDistKm: number,
  crosswindDistM: number = 0,
  stabilityClass: PasquillStabilityClass = "D",
  releaseHeightM: number = 15.0,
  inversionCapM?: number
): PlumeDispersionResult {
  const u_eff = Math.max(windSpeedMs, 0.5);
  const validTotalFrp = Math.max(totalFrpMw, 0);
  const q_eff = emissionRateGs > 0 ? emissionRateGs : 4.60 * validTotalFrp;
  const Fb = 29.0 * validTotalFrp;

  // 1. Briggs Plume Rise (deltaH)
  let deltaH = 0;
  if (Fb > 0) {
    if (["A", "B", "C", "D"].includes(stabilityClass)) {
      if (Fb < 55) {
        deltaH = (21.425 * Math.pow(Fb, 0.75)) / u_eff;
      } else {
        deltaH = (38.71 * Math.pow(Fb, 0.6)) / u_eff;
      }
    } else {
      const s = stabilityClass === "E" ? 0.0004 : 0.0008;
      deltaH = 2.6 * Math.pow(Fb / (u_eff * s), 1.0 / 3.0);
    }
  }

  // 2. Effective Release Height H (with optional inversion cap)
  const H_uncapped = releaseHeightM + deltaH;
  const H =
    inversionCapM !== undefined ? Math.min(H_uncapped, inversionCapM) : H_uncapped;

  // 3. Pasquill-Gifford Dispersion Coefficients
  const cyMap: Record<PasquillStabilityClass, number> = {
    A: 213,
    B: 156,
    C: 104,
    D: 68,
    E: 50.5,
    F: 34,
  };
  const dy = 0.894;
  const cy = cyMap[stabilityClass] ?? 68;

  const czLe1: Record<PasquillStabilityClass, number> = {
    A: 440.8,
    B: 106.6,
    C: 61.0,
    D: 33.2,
    E: 22.8,
    F: 14.35,
  };
  const dzLe1: Record<PasquillStabilityClass, number> = {
    A: 1.941,
    B: 1.149,
    C: 0.911,
    D: 0.725,
    E: 0.678,
    F: 0.740,
  };
  const czGt1: Record<PasquillStabilityClass, number> = {
    A: 459.7,
    B: 108.2,
    C: 61.0,
    D: 44.5,
    E: 28.5,
    F: 17.5,
  };
  const dzGt1: Record<PasquillStabilityClass, number> = {
    A: 2.094,
    B: 1.098,
    C: 0.911,
    D: 0.516,
    E: 0.540,
    F: 0.505,
  };

  const x = Math.max(downwindDistKm, 0.01);
  const sigmaY = cy * Math.pow(x, dy);
  const cz = x <= 1.0 ? czLe1[stabilityClass] : czGt1[stabilityClass];
  const dz = x <= 1.0 ? dzLe1[stabilityClass] : dzGt1[stabilityClass];
  const sigmaZ = cz * Math.pow(x, dz);

  // 4. Ground-Level Concentration C(x, y, 0)
  let groundConcentrationUgM3 = 0;
  if (q_eff > 0) {
    const denom = Math.PI * u_eff * sigmaY * sigmaZ;
    const expY = Math.exp(
      -(crosswindDistM * crosswindDistM) / (2.0 * sigmaY * sigmaY)
    );
    const expH = Math.exp(-(H * H) / (2.0 * sigmaZ * sigmaZ));
    groundConcentrationUgM3 = (q_eff / denom) * expY * expH * 1e6;
  }

  // 5. Peak Downwind Distance x_max and Maximum Concentration C_max
  let x_max = 0.01;
  let sigmaZ_max = 0;
  let sigmaY_max = 0;
  if (H > 0) {
    const targetSigmaZ = H / Math.SQRT2;
    const sigmaZAt1 = czLe1[stabilityClass];
    if (targetSigmaZ <= sigmaZAt1) {
      x_max = Math.pow(targetSigmaZ / czLe1[stabilityClass], 1.0 / dzLe1[stabilityClass]);
    } else {
      x_max = Math.pow(targetSigmaZ / czGt1[stabilityClass], 1.0 / dzGt1[stabilityClass]);
    }
    x_max = Math.max(0.01, x_max);
    const cz_peak = x_max <= 1.0 ? czLe1[stabilityClass] : czGt1[stabilityClass];
    const dz_peak = x_max <= 1.0 ? dzLe1[stabilityClass] : dzGt1[stabilityClass];
    sigmaZ_max = cz_peak * Math.pow(x_max, dz_peak);
    sigmaY_max = cy * Math.pow(x_max, dy);
  } else {
    sigmaZ_max = czLe1[stabilityClass] * Math.pow(0.01, dzLe1[stabilityClass]);
    sigmaY_max = cy * Math.pow(0.01, dy);
  }

  let peakGroundConcentrationUgM3 = 0;
  if (q_eff > 0) {
    const denom_max = Math.PI * u_eff * sigmaY_max * sigmaZ_max;
    const expH_max = H > 0 ? Math.exp(-(H * H) / (2.0 * sigmaZ_max * sigmaZ_max)) : 1.0;
    peakGroundConcentrationUgM3 = (q_eff / denom_max) * expH_max * 1e6;
  }

  return {
    buoyancyFluxM4S3: Fb,
    plumeRiseM: deltaH,
    effectivePlumeHeightM: H,
    sigmaYM: sigmaY,
    sigmaZM: sigmaZ,
    groundConcentrationUgM3,
    peakGroundConcentrationUgM3,
    peakDistanceKm: x_max,
    stabilityClass,
  };
}
