import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    service: "SATA Sentinel Backend API",
    status: "ONLINE",
    version: "2.0.0",
    hackathon: "Meta Global AI Developer Hackathon 2026",
    track: "Indie Developer / Student Track",
    architecture: "Strict Backend & Autonomous Geospatial Reasoning API (Zero UI)",
    operational_mode: "LIVE ONLY - NO FALLBACK - 1000% TRUE DATA",
    models: {
      primary_reasoner: "Meta Model API (muse-spark-1.3)",
      backup_live_model: "muse-spark-1.2",
    },
    satellite_sources: [
      "NASA FIRMS (VIIRS NOAA-20 & MODIS Terra NRT)",
      "NASA EONET v3 (Live Global Hazards)",
      "NASA GIBS (Black Marble Night Lights & Cryosphere)",
      "ISRO Cartosat-3 TLE Tracking (Live SGP4)",
      "ISRO INSAT-3DR Geostationary Sounder (Live SGP4)",
      "ISRO Oceansat-3 & RISAT-2B (Live SGP4)",
    ],
    endpoints: {
      llama_reason: "/api/llama-reason",
      reason: "/api/reason",
      query: "/api/query",
      firms: "/api/firms",
      telemetry: "/api/telemetry",
      orbits: "/api/orbits",
      incidents: "/api/incidents",
      gibs: "/api/gibs",
    },
  });
}
