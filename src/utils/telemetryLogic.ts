/**
 * SATA Pure Validation & Geospatial Sanitization Logic
 * Strictly adheres to AI.md Rule 1: LIVE ONLY - NO FALLBACK - NO FAKE - 1000% TRUE
 * Zero mock data, zero fake gazetteer.
 */

import { LayerType } from "../types/telemetry";

/**
 * Normalizes query string for reliable processing
 */
export function normalizeQuery(q: string): string {
  return (q || "").trim().toLowerCase();
}

/**
 * Classifies layer type based on query semantics
 */
export function computeLayerType(query: string): LayerType {
  const q = normalizeQuery(query);
  if (
    q.includes("ice") ||
    q.includes("calving") ||
    q.includes("iceberg") ||
    q.includes("antarctic") ||
    q.includes("glacier") ||
    q.includes("cryo")
  ) {
    return "CRYO";
  }
  if (
    q.includes("cyclone") ||
    q.includes("storm") ||
    q.includes("hurricane") ||
    q.includes("typhoon") ||
    q.includes("bay of bengal")
  ) {
    return "STORM";
  }
  if (
    q.includes("orbit") ||
    q.includes("satellite") ||
    q.includes("pass") ||
    q.includes("tle") ||
    q.includes("starlink") ||
    q.includes("cartosat")
  ) {
    return "ORBITAL";
  }
  return "THERMAL";
}

const VALID_LAYER_TYPES = new Set(["THERMAL", "CRYO", "STORM", "ORBITAL"]);
const VALID_AOD_STATUSES = new Set(["CLEAR", "STABLE", "ELEVATED", "CRITICAL"]);

/**
 * Validates whether an object strictly conforms to the SataOrbitalDispatchResult schema
 * Ensures live model output has valid coordinates, layer types, and telemetry metrics.
 */
export function validateDispatchResult(result: any): boolean {
  if (!result || typeof result !== "object") return false;
  if (typeof result.targetName !== "string" || result.targetName.trim().length === 0) return false;
  if (typeof result.lat !== "number" || isNaN(result.lat) || result.lat < -90 || result.lat > 90) return false;
  if (typeof result.lon !== "number" || isNaN(result.lon) || result.lon < -180 || result.lon > 180) return false;
  if (typeof result.layerType !== "string" || !VALID_LAYER_TYPES.has(result.layerType)) return false;
  if (typeof result.activeHeatSpots !== "number" || isNaN(result.activeHeatSpots) || result.activeHeatSpots < 0) return false;
  if (typeof result.briefingSummary !== "string" || !result.briefingSummary.startsWith("Llama 4:")) return false;
  if (!result.telemetry || typeof result.telemetry !== "object") return false;
  if (typeof result.telemetry.aodStatus !== "string" || !VALID_AOD_STATUSES.has(result.telemetry.aodStatus)) return false;
  if (
    typeof result.telemetry.cloudCoverPct !== "number" ||
    isNaN(result.telemetry.cloudCoverPct) ||
    result.telemetry.cloudCoverPct < 0 ||
    result.telemetry.cloudCoverPct > 100
  ) {
    return false;
  }
  return true;
}
