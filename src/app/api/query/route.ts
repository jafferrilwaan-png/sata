import { NextRequest, NextResponse } from "next/server";
import { executeLlama4GeospatialReasoning } from "@/lib/meta-llama";
import { fetchNasaFirmsAnomalies } from "@/lib/nasa-firms";
import { computeSensorTelemetry } from "@/lib/telemetry";
import { computeLiveSatellitePasses } from "@/lib/isro-orbit-engine";
import { fetchLiveNasaEonetIncidents } from "@/lib/nasa-eonet";
import { UnifiedQueryResponse, IncidentRecord } from "@/types/sata";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = (body.query || body.q || "").trim();
    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter is required",
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 1. Run Meta AI Reasoning
    const reasoning = await executeLlama4GeospatialReasoning(query);

    // 2. Fetch NASA data according to query intent
    const thermalPoints =
      reasoning.query_intent === "CRYO_ANOMALY"
        ? []
        : await fetchNasaFirmsAnomalies(reasoning.bounding_box, 1);

    // 3. Compute telemetry tailored to intent
    const telemetry = computeSensorTelemetry(thermalPoints, reasoning.query_intent);

    // 4. Retrieve live satellite passes and live incidents
    const orbitPasses = await computeLiveSatellitePasses();
    const liveIncidents = await fetchLiveNasaEonetIncidents();

    const incidentHighlight: IncidentRecord | null =
      liveIncidents.length > 0 ? liveIncidents[0] : null;

    const response: UnifiedQueryResponse = {
      success: true,
      query,
      reasoning,
      telemetry,
      points: thermalPoints,
      incident_highlight: incidentHighlight as any,
      active_satellite: orbitPasses[0],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { headers: CORS_HEADERS });
  } catch (error: any) {
    console.error("API /api/query error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process geospatial query",
        source: "meta-live-error",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || searchParams.get("query") || "").trim();
  if (!q) {
    return NextResponse.json(
      {
        success: false,
        error: "Query parameter is required",
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const reasoning = await executeLlama4GeospatialReasoning(q);
    const thermalPoints =
      reasoning.query_intent === "CRYO_ANOMALY"
        ? []
        : await fetchNasaFirmsAnomalies(reasoning.bounding_box, 1);
    const telemetry = computeSensorTelemetry(thermalPoints, reasoning.query_intent);
    const orbitPasses = await computeLiveSatellitePasses();
    const liveIncidents = await fetchLiveNasaEonetIncidents();

    const incidentHighlight: IncidentRecord | null =
      liveIncidents.length > 0 ? liveIncidents[0] : null;

    return NextResponse.json(
      {
        success: true,
        query: q,
        reasoning,
        telemetry,
        points: thermalPoints,
        incident_highlight: incidentHighlight as any,
        active_satellite: orbitPasses[0],
        timestamp: new Date().toISOString(),
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process geospatial query",
        source: "meta-live-error",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
