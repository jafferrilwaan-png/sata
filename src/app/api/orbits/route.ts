import { NextResponse } from "next/server";
import { computeLiveSatellitePasses } from "@/lib/isro-orbit-engine";

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
    const passes = await computeLiveSatellitePasses();

    return NextResponse.json(
      {
        success: true,
        source: "celestrak-isro-live",
        total: passes.length,
        passes,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("API /api/orbits GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to compute live orbital passes",
        source: "orbital-engine-error",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
