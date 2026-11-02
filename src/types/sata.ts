export type BoundingBox = [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]

export type QueryIntent = "THERMAL_FIRE" | "CRYO_ANOMALY" | "CYCLONE_STORM" | "ATMOSPHERIC_OBS";

export interface ThermalAnomalyPoint {
  id: string;
  latitude: number;
  longitude: number;
  brightness: number;
  scan: number;
  track: number;
  acq_date: string;
  acq_time: string;
  satellite: "VIIRS_NOAA20" | "MODIS_TERRA";
  confidence: string | number;
  frp: number; // Fire Radiative Power (MW)
  color: string; // Strictly electric cyan (#06b6d4) or sky blue (#38bdf8)
  pulseRate: number;
}

export interface MetricCardHighlight {
  primary_metric: string; // e.g. "84 ACTIVE HEAT SPOTS" or "02 ACTIVE ICE RIFTS"
  trend: "RISING" | "STABLE" | "DECLINING";
  status_badge: string;
}

import { ComprehensivePhysicsMetrics } from "./physics";

export interface SensorTelemetry {
  primary_sensor_name: string;
  primary_sensor_metric: string;
  primary_sensor_status: "ACTIVE" | "CALIBRATING";
  secondary_sensor_name: string;
  secondary_sensor_metric: string;
  secondary_sensor_status: "ACTIVE" | "STABLE";
  aod_atmospheric: "STABLE" | "CLEAR" | "ELEVATED" | "CRITICAL";
  aod_index_val: number;
  cloud_cover_pct: number;
  total_heat_spots?: number;
  last_satellite_sync: string;
  physics?: ComprehensivePhysicsMetrics;
}

export interface SatelliteOrbitPass {
  id: string;
  satellite_name: string;
  mission: string;
  agency: "ISRO" | "NASA" | "SpaceX" | "CNSA";
  pass_time: string;
  altitude_km: number;
  velocity_kms: number;
  inclination_deg: number;
  status: "TRACKING" | "SCHEDULED" | "ORBITING";
}

export interface IncidentRecord {
  id: string;
  code: string;
  category:
    | "Fire"
    | "Explosion"
    | "Industrial Thermal"
    | "Thermal Plume"
    | "Iceberg Calving"
    | "Cyclonic Storm"
    | "Flood Inundation"
    | "Volcano Eruption"
    | string;
  title: string;
  coordinates: [number, number]; // [lat, lng]
  thumbnail_url: string;
  date_detected: string;
  intensity_mw?: number;
}

export interface Llama4GeospatialReasoning {
  target_location: string;
  coordinates: {
    lat: number;
    lng: number;
    altitude: number;
  };
  bounding_box: BoundingBox;
  query_intent: QueryIntent;
  nasa_endpoint: string; // e.g. "FIRMS_VIIRS_NOAA20" | "GIBS_MODIS_SEA_ICE" | "GIBS_CLOUD_TOP_PRESSURE"
  briefing_summary: string;
  active_layers: Array<"FIRMS_THERMAL" | "GIBS_NIGHT_LIGHTS" | "GIBS_SEA_ICE" | "GIBS_CYCLONE_WEATHER">;
  metric_card: MetricCardHighlight;
  model_used: string;
  latency_ms: number;
}

export interface UnifiedQueryResponse {
  success: boolean;
  query: string;
  reasoning: Llama4GeospatialReasoning;
  telemetry: SensorTelemetry;
  points: ThermalAnomalyPoint[];
  incident_highlight: IncidentRecord;
  active_satellite: SatelliteOrbitPass;
  timestamp: string;
}
