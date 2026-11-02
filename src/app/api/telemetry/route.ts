import { NextResponse } from "next/server";
import { fetchNasaFirmsAnomalies } from "@/lib/nasa-firms";
import { computeSensorTelemetry } from "@/lib/telemetry";

export const dynamic = "force-dynamic";

export async function GET() {
  const points = await fetchNasaFirmsAnomalies();
  const telemetry = computeSensorTelemetry(points);

  return NextResponse.json({
    success: true,
    telemetry,
  });
}
