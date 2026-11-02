/**
 * Earth Physics & Chemistry Type Contracts for SATA Sentinel
 * Milestone 2: Feature F4 (AOD), Feature F5 (Thermal/FRE), Feature F6 (Plume Dispersion)
 * Strictly conforms to Contract 1 in PROJECT.md.
 */

export type AodClassification = "CLEAR" | "STABLE" | "ELEVATED" | "CRITICAL";

export interface AodCalculationResult {
  /** Dimensionless optical air mass factor (Kasten-Young 1989 formulation) */
  opticalAirMass: number;
  /** Total atmospheric optical depth derived from Beer-Lambert attenuation */
  totalOpticalDepth: number;
  /** Rayleigh molecular scattering optical depth (Bodhaine 1999 formula) */
  rayleighOpticalDepth: number;
  /** Trace gas absorption optical depth (Ozone Chappuis band) */
  traceGasOpticalDepth: number;
  /** Net Aerosol Optical Depth at primary sensor wavelength (tau_aerosol) */
  aerosolOpticalDepth: number;
  /** Ångström exponent alpha for aerosol spectral extinction scaling */
  angstromAlpha: number;
  /** Extrapolated Aerosol Optical Depth at standard 550nm green reference channel */
  scaledAod550nm: number;
  /** Aerosol extinction coefficient sigma_ext = AOD(0.55) / H_PBL (km^-1) */
  aerosolExtinctionKmInv: number;
  /** Estimated ground-level particulate matter concentration (ug/m^3) */
  estimatedPm25UgM3: number;
  /** Qualitative atmospheric clarity classification */
  classification: AodClassification;
}

export interface FireRadiativeResult {
  /** Aggregated Fire Radiative Power across all active cluster hotspots in Megawatts (MW) */
  totalFrpMw: number;
  /** Maximum FRP observed in a single pixel hotspot within the cluster in Megawatts (MW) */
  peakFrpMw: number;
  /** Time-integrated Fire Radiative Energy in Joules (J) */
  fireRadiativeEnergyJoules: number;
  /** Time-integrated Fire Radiative Energy in Megajoules (MJ) */
  fireRadiativeEnergyMj: number;
  /** Estimated dry vegetative biomass combusted in kilograms (kg) based on Wooster et al. (0.368 kg/MJ) */
  dryBiomassConsumedKg: number;
  /** Estimated dry vegetative biomass combusted in metric tons (t = kg / 1000) */
  dryBiomassConsumedTons: number;
  /** Total particulate matter (PM2.5) mass emitted in grams (g) */
  totalPm25EmittedGrams: number;
  /** Continuous particulate emission rate Q in grams per second (g/s) for dispersion modeling */
  continuousEmissionRateGs: number;
}

export type PasquillStabilityClass = "A" | "B" | "C" | "D" | "E" | "F";

export interface PlumeDispersionResult {
  /** Thermal buoyancy flux Fb in m^4/s^3 */
  buoyancyFluxM4S3: number;
  /** Unconstrained Briggs buoyant plume rise deltaH in meters (m) */
  plumeRiseM: number;
  /** Effective release height H in meters (m), capped by atmospheric inversion lid if present */
  effectivePlumeHeightM: number;
  /** Crosswind Gaussian dispersion coefficient sigma_y in meters (m) */
  sigmaYM: number;
  /** Vertical Gaussian dispersion coefficient sigma_z in meters (m) */
  sigmaZM: number;
  /** Ground-level particulate concentration C(x, y, 0) in ug/m^3 */
  groundConcentrationUgM3: number;
  /** Peak ground-level particulate concentration C_max along the plume centerline in ug/m^3 */
  peakGroundConcentrationUgM3: number;
  /** Downwind distance x_max to peak concentration in kilometers (km) */
  peakDistanceKm: number;
  /** Pasquill-Gifford atmospheric stability classification */
  stabilityClass: PasquillStabilityClass;
}

export interface ComprehensivePhysicsMetrics {
  /** Atmospheric optical depth and spectral aerosol metrics */
  aod: AodCalculationResult;
  /** Fire radiative power, energy integral, biomass consumption, and smoke emission rates */
  thermal: FireRadiativeResult;
  /** Gaussian plume atmospheric dispersion and downwind ground concentrations */
  dispersion: PlumeDispersionResult;
}

/**
 * Satellite hotspot observation input parameter schema
 */
export interface HotspotObservation {
  /** Fire Radiative Power in Megawatts (MW) */
  frpMw: number;
  /** VIIRS 375m Band I4 brightness temperature (Kelvin), optional */
  brightnessTi4K?: number;
  /** VIIRS 375m Band I5 thermal IR brightness temperature (Kelvin), optional */
  brightnessTi5K?: number;
}
