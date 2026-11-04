export type LayerType = "THERMAL" | "CRYO" | "STORM" | "ORBITAL" | "TRUE_COLOR" | "TERRAIN" | "DAY_NIGHT_TERMINATOR";

export type EventPhenomenon =
  | "CYCLONE_RAIN"
  | "TSUNAMI"
  | "FLOOD_STORM"
  | "WILDFIRE"
  | "DEFORESTATION"
  | "CRYO_MELT"
  | "THERMAL"
  | "DAY_NIGHT_TERMINATOR";

export interface EnvironmentalPhysics {
  phenomenon: EventPhenomenon;
  precipitationMm: number;
  waveSurgeM: number;
  windSpeedKmh: number;
  cloudCoverPct: number;
  cloudVorticity: number;
  thermalRadiativeMw: number;
  severity: "CRITICAL" | "HIGH" | "MODERATE" | "STABLE";
  tacticalProtocol: string;
  satelliteVisionUrl?: string;
  targetLat?: number;
  targetLon?: number;
}

export interface TelemetryMetrics {
  viirsPoints: number;
  modisPoints: number;
  aodStatus: "STABLE" | "CLEAR" | "ELEVATED";
  cloudCoverPct: number;
  precipitationMm?: number;
  waveSurgeM?: number;
  windSpeedKmh?: number;
}

export interface AiRecommendation {
  category: string;
  action: string;
}

export interface SataOrbitalDispatchResult {
  targetName: string;
  lat: number;
  lon: number;
  zoomAltitude: number;
  activeHeatSpots: number;
  layerType: LayerType;
  briefingSummary: string;
  briefingLead?: string;
  thinkingSteps?: string[];
  recommendations?: AiRecommendation[];
  telemetry: TelemetryMetrics;
  environmentalPhysics?: EnvironmentalPhysics;
  source?: "meta-live" | "meta-live-error";
  latencyMs?: number;
  error?: string;
}
