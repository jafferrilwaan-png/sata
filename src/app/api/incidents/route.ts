import { NextResponse } from "next/server";
import { fetchLiveNasaEonetIncidents } from "@/lib/nasa-eonet";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  try {
    const incidents = await fetchLiveNasaEonetIncidents();

    return NextResponse.json(
      {
        success: true,
        source: "nasa-eonet-live",
        total: incidents.length,
        incidents,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("API /api/incidents GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch live NASA EONET incidents",
        source: "nasa-eonet-error",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
