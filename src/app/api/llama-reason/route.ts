import { NextRequest, NextResponse } from "next/server";
import { dispatchOrbitalReasoning } from "@/services/metaLlamaService";

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
    const query =
      body.query ||
      body.q ||
      "Show wildfires and active heat spots near Chennai last 72 hours";

    const model = body.model || body.selectedMetaModel || undefined;
    const result = await dispatchOrbitalReasoning(query, 25000, model);

    return NextResponse.json(
      {
        success: true,
        query,
        ...result,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("API /api/llama-reason POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process orbital dispatch query",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query =
    searchParams.get("query") ||
    searchParams.get("q") ||
    "Show wildfires and active heat spots near Chennai last 72 hours";

  const result = await dispatchOrbitalReasoning(query);

  return NextResponse.json(
    {
      success: true,
      query,
      ...result,
    },
    { headers: CORS_HEADERS }
  );
}
