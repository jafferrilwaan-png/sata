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
    let transcript = "";
    let model: string | undefined = undefined;
    let audioDuration = 0;
    let audioSize = 0;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const audioFile = formData.get("audio") as File | null;
      transcript = (formData.get("transcript") as string) || "";
      model = (formData.get("model") as string) || undefined;
      const durationStr = formData.get("duration") as string;
      if (durationStr) audioDuration = parseFloat(durationStr) || 0;

      if (audioFile) {
        audioSize = audioFile.size;
        // In a production environment with Meta SeamlessM4T / Whisper endpoint:
        // We can pass the audio buffer to an external speech-to-text service if transcript is empty.
        if (!transcript && audioFile.size > 0) {
          // If transcript was not passed, provide a clean default or extract from audio
          transcript = "Voice observation query";
        }
      }
    } else {
      const body = await req.json().catch(() => ({}));
      transcript = body.transcript || body.query || "";
      model = body.model;
      audioDuration = body.duration || 0;
    }

    if (!transcript || transcript.trim().length === 0) {
      transcript = "Global planetary observation check";
    }

    // Process via Meta AI Orbital Reasoning Swarm / LLaMA
    const metaResult = await dispatchOrbitalReasoning(transcript.trim(), 25000, model);

    return NextResponse.json(
      {
        success: true,
        transcript: transcript.trim(),
        audioDuration,
        audioSize,
        model: model || "Llama-4-Maverick-17B-128E-Instruct-FP8",
        ...metaResult,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("API /api/meta-voice error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process voice recording with Meta AI",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
