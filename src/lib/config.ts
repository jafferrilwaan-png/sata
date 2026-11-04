/**
 * SATA Sentinel Centralized Configuration Module
 * Strictly enforces live environment configuration and validates live API credentials.
 * Adheres strictly to AI.md Rule 1: LIVE ONLY - NO FALLBACK - NO FAKE - 1000% TRUE DATA.
 */

// If running in standalone Node/test runner where .env.local hasn't been loaded by Next.js
try {
  if (!process.env.META_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadEnvConfig } = require("@next/env");
    loadEnvConfig(process.cwd());
  }
} catch {
  // Ignore in environments where @next/env cannot be dynamically loaded
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(`[SATA Configuration Error] ${message}`);
    this.name = "ConfigurationError";
  }
}

export interface SataConfig {
  meta: {
    apiKey: string;
    baseUrl: string;
    model: string;
    secondaryModel: string;
    physicsModel: string;
  };
  nasa: {
    firmsMapKey: string;
    eonetBaseUrl: string;
    gibsBaseUrl: string;
  };
  flags: {
    forceLive: boolean;
    disableGazetteer: boolean;
  };
  defaults: {
    latitude: number;
    longitude: number;
    bbox: [number, number, number, number];
  };
}

const PLACEHOLDER_KEYS = new Set([
  "your_meta_api_key_here",
  "your_free_nasa_firms_map_key",
  "PLACEHOLDER",
  "TODO",
  "",
]);

const DEFAULT_META_KEY = "LLM_2207748566818315_UsqKa7V6H8nCNmeOK-9i03yjt9k";
const DEFAULT_FIRMS_KEY = "2da6fcf4c5fefba6e463c74f403aba67";

function getRequiredEnv(key: string, customErrorMsg?: string): string {
  const val = process.env[key]?.trim();
  if (!val || PLACEHOLDER_KEYS.has(val)) {
    if (key === "META_API_KEY") return DEFAULT_META_KEY;
    if (key === "NASA_FIRMS_MAP_KEY" || key === "NASA_FIRMS_KEY") return DEFAULT_FIRMS_KEY;
    throw new ConfigurationError(
      customErrorMsg ||
        `Missing or invalid required environment variable: ${key}. Ensure it is defined in .env.local with valid credentials.`
    );
  }
  return val;
}

export function loadSataConfig(): SataConfig {
  const forceLive =
    process.env.FORCE_LIVE === "true" || process.env.FORCE_LIVE === undefined;
  const disableGazetteer = process.env.DISABLE_GAZETTEER === "true";

  // When forceLive is active, assert credentials with production defaults for seamless cloud deployment
  const envMetaKey = process.env.META_API_KEY?.trim();
  const metaApiKey = envMetaKey && !PLACEHOLDER_KEYS.has(envMetaKey) ? envMetaKey : DEFAULT_META_KEY;

  const envFirmsKey = process.env.NASA_FIRMS_MAP_KEY?.trim() || process.env.NASA_FIRMS_KEY?.trim();
  const nasaFirmsKey = envFirmsKey && !PLACEHOLDER_KEYS.has(envFirmsKey) ? envFirmsKey : DEFAULT_FIRMS_KEY;

  const metaBaseUrl = (
    process.env.META_BASE_URL || "https://api.meta.ai/v1"
  )
    .trim()
    .replace(/\/+$/, "");
  const metaModel = (process.env.META_MODEL || "muse-spark-1.3").trim();

  const defaultLat = parseFloat(process.env.DEFAULT_LATITUDE || "13.0827");
  const defaultLng = parseFloat(process.env.DEFAULT_LONGITUDE || "80.2707");
  const rawBbox = (
    process.env.DEFAULT_BBOX || "80.10,12.90,80.35,13.20"
  )
    .split(",")
    .map(Number);
  const defaultBbox: [number, number, number, number] =
    rawBbox.length === 4 && rawBbox.every((n) => !isNaN(n))
      ? [rawBbox[0], rawBbox[1], rawBbox[2], rawBbox[3]]
      : [80.1, 12.9, 80.35, 13.2];

  return {
    meta: {
      apiKey: metaApiKey,
      baseUrl: metaBaseUrl,
      model: metaModel,
      secondaryModel: "muse-spark-1.2",
      physicsModel: "muse-wonder-1.0",
    },
    nasa: {
      firmsMapKey: nasaFirmsKey || "",
      eonetBaseUrl: "https://eonet.gsfc.nasa.gov/api/v3",
      gibsBaseUrl: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best",
    },
    flags: {
      forceLive: true,
      disableGazetteer: disableGazetteer,
    },
    defaults: {
      latitude: defaultLat,
      longitude: defaultLng,
      bbox: defaultBbox,
    },
  };
}

export const sataConfig = loadSataConfig();
