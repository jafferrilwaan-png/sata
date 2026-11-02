import { SensorTelemetry, ThermalAnomalyPoint, QueryIntent } from "../types/sata";
import { ComprehensivePhysicsMetrics } from "../types/physics";
import {
  computeFireRadiativeMetrics,
  computeGaussianPlumeDispersion,
  computeAtmosphericOpticalDepth,
} from "./earth-physics";

export interface TelemetryComputeOptions {
  windSpeedMs?: number;
  durationHours?: number;
  downwindDistKm?: number;
  crosswindDistM?: number;
  stabilityClass?: "A" | "B" | "C" | "D" | "E" | "F";
  inversionCapM?: number;
}

/**
 * Aggregates sensor telemetry metrics dynamically tailored to query intent,
 * integrating advanced Earth physics and chemistry computation.
 */
export function computeSensorTelemetry(
  points: ThermalAnomalyPoint[],
  intent: QueryIntent = "THERMAL_FIRE",
  options?: TelemetryComputeOptions
): SensorTelemetry {
  const now = new Date().toISOString();

  if (intent === "CRYO_ANOMALY") {
    const cryoPhysics: ComprehensivePhysicsMetrics = {
      aod: computeAtmosphericOpticalDepth(950, 1000, 30.0, 0.55),
      thermal: computeFireRadiativeMetrics([], 0),
      dispersion: computeGaussianPlumeDispersion(0, 0, 8.0, 2.5, 0.0, "D", 15.0),
    };

    return {
      primary_sensor_name: "MODIS Terra Cryo",
      primary_sensor_metric: "98.2% Coverage",
      primary_sensor_status: "ACTIVE",
      secondary_sensor_name: "VIIRS Polar Drift",
      secondary_sensor_metric: "1.4 km/day",
      secondary_sensor_status: "STABLE",
      aod_atmospheric: "CLEAR",
      aod_index_val: 0.02,
      cloud_cover_pct: 8.1,
      total_heat_spots: 0,
      last_satellite_sync: now,
      physics: cryoPhysics,
    };
  }

  if (intent === "CYCLONE_STORM") {
    const cyclonePhysics: ComprehensivePhysicsMetrics = {
      aod: computeAtmosphericOpticalDepth(500, 1000, 30.0, 0.47, 0.66, 0.45),
      thermal: computeFireRadiativeMetrics([], 0),
      dispersion: computeGaussianPlumeDispersion(0, 0, 25.0, 2.5, 0.0, "C", 15.0),
    };

    return {
      primary_sensor_name: "INSAT-3DR Rapid Scan",
      primary_sensor_metric: "16 kts / 985 hPa",
      primary_sensor_status: "ACTIVE",
      secondary_sensor_name: "MODIS Cloud Top IR",
      secondary_sensor_metric: "-78°C Core Temp",
      secondary_sensor_status: "ACTIVE",
      aod_atmospheric: "ELEVATED",
      aod_index_val: 0.44,
      cloud_cover_pct: 92.4,
      total_heat_spots: 3,
      last_satellite_sync: now,
      physics: cyclonePhysics,
    };
  }

  // Default: Thermal / Fire Telemetry
  const viirsPoints = points.filter((p) => p.satellite === "VIIRS_NOAA20");
  const modisPoints = points.filter((p) => p.satellite === "MODIS_TERRA");

  // Planetary physics & chemistry calculations
  const hotspotPoints = points.map((p) => ({
    frpMw: p.frp || 0,
    brightnessTi4K: p.brightness,
  }));
  const thermal = computeFireRadiativeMetrics(
    hotspotPoints,
    options?.durationHours ?? 2.0
  );

  const dispersion = computeGaussianPlumeDispersion(
    thermal.continuousEmissionRateGs,
    thermal.totalFrpMw,
    options?.windSpeedMs ?? 4.0,
    options?.downwindDistKm ?? 2.5,
    options?.crosswindDistM ?? 0.0,
    options?.stabilityClass ?? "D",
    15.0,
    options?.inversionCapM ?? 150.0
  );

  // Dynamic AOD computation based on fire smoke loading
  const aod =
    points.length === 0
      ? computeAtmosphericOpticalDepth(600.0, 1000.0, 30.0, 0.47, 0.66, 0.145, 1013.25)
      : computeAtmosphericOpticalDepth(
          thermal.totalFrpMw > 150
            ? 350.0
            : thermal.totalFrpMw > 50
            ? 500.0
            : 600.0,
          1000.0,
          30.0,
          0.47,
          0.66,
          thermal.totalFrpMw > 150
            ? 0.55
            : thermal.totalFrpMw > 50
            ? 0.3
            : 0.145,
          1013.25
        );

  const physics: ComprehensivePhysicsMetrics = {
    aod,
    thermal,
    dispersion,
  };

  const aodAtmospheric =
    points.length === 0 ? "STABLE" : aod.classification;
  const aodIndexVal =
    points.length === 0 ? 0.18 : Number(aod.scaledAod550nm.toFixed(2));

  return {
    primary_sensor_name: "VIIRS NOAA-20 NRT",
    primary_sensor_metric: `${viirsPoints.length} Points`,
    primary_sensor_status: "ACTIVE",
    secondary_sensor_name: "MODIS Terra NRT",
    secondary_sensor_metric: `${modisPoints.length} Points`,
    secondary_sensor_status: "ACTIVE",
    aod_atmospheric: aodAtmospheric,
    aod_index_val: aodIndexVal,
    cloud_cover_pct: 14.2,
    total_heat_spots: points.length,
    last_satellite_sync: now,
    physics,
  };
}
