import { NextResponse } from "next/server";
import { NASA_GIBS_LAYERS, getRecommendedGlobeTextures } from "@/lib/nasa-gibs";

export const dynamic = "force-dynamic";

export async function GET() {
  const textures = getRecommendedGlobeTextures();

  return NextResponse.json({
    success: true,
    engine: "react-globe.gl",
    textures,
    available_layers: NASA_GIBS_LAYERS,
  });
}
