import { NextRequest, NextResponse } from "next/server";
import { fetchNasaFirmsAnomalies } from "@/lib/nasa-firms";
import { BoundingBox } from "@/types/sata";

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bboxParam = searchParams.get("bbox");
    const daysParam = parseInt(searchParams.get("days") || "1", 10);

    let bbox: BoundingBox = [80.1, 12.9, 80.35, 13.2]; // Default Chennai corridor

    if (bboxParam) {
      const parts = bboxParam.split(",").map(Number);
      if (parts.length === 4 && parts.every((n) => !isNaN(n))) {
        bbox = [parts[0], parts[1], parts[2], parts[3]];
      }
    }

    const points = await fetchNasaFirmsAnomalies(bbox, daysParam);

    return NextResponse.json(
      {
        success: true,
        source: "nasa-live",
        count: points.length,
        bbox,
        sensor_network: ["VIIRS_NOAA20", "MODIS_TERRA"],
        points,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("API /api/firms GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch live NASA thermal telemetry",
        source: "nasa-firms-error",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
