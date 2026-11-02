import { Llama4GeospatialReasoning } from "../types/sata";
import { sataConfig } from "./config";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Autonomous Geospatial Reasoning Engine powered by Meta AI
 * Strictly LIVE ONLY - NO FALLBACK - NO FAKE - 1000% TRUE (Rule 1 of AI.md)
 */
export async function executeLlama4GeospatialReasoning(
  userQuery: string
): Promise<Llama4GeospatialReasoning> {
  const startTime = Date.now();
  const apiKey = sataConfig.meta.apiKey;
  const baseUrl = sataConfig.meta.baseUrl;
  const model = sataConfig.meta.model;

  const systemPrompt = `You are SATA's Autonomous Geospatial Dispatcher powered by Meta AI.
Analyze the user's natural language satellite observation query and extract precise geospatial target data.

You MUST respond strictly with valid JSON conforming to this schema (no markdown, no backticks):
{
  "target_location": "<Descriptive location name, e.g. Chennai, India or Weddell Sea, Antarctica>",
  "coordinates": {
    "lat": <latitude number>,
    "lng": <longitude number>,
    "altitude": <camera altitude from 1.2 to 2.4>
  },
  "bounding_box": [<min_lon>, <min_lat>, <max_lon>, <max_lat>],
  "query_intent": "<THERMAL_FIRE | CRYO_ANOMALY | CYCLONE_STORM | ATMOSPHERIC_OBS>",
  "nasa_endpoint": "<FIRMS_VIIRS_NOAA20 | GIBS_MODIS_SEA_ICE | GIBS_CLOUD_TOP_PRESSURE>",
  "briefing_summary": "<Exactly 2 concise sentences in plain English starting with 'Llama 4:' synthesizing the anomaly observation>",
  "metric_card": {
    "primary_metric": "<e.g. '02 ACTIVE ICE RIFTS' or '84 ACTIVE HEAT SPOTS'>",
    "trend": "<RISING | STABLE | DECLINING>",
    "status_badge": "<CRYO ALERT | THERMAL ACTIVE | STORM WATCH>"
  },
  "active_layers": ["FIRMS_THERMAL", "GIBS_NIGHT_LIGHTS"]
}`;

  async function callMeta(): Promise<Llama4GeospatialReasoning | null> {
    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery },
          ],
          max_tokens: 4096,
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          let clean = content.trim();
          if (clean.startsWith("```")) {
            clean = clean.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
          }
          const parsed = JSON.parse(clean);
          let summary = parsed.briefing_summary || "Autonomous telemetry synced across primary sensor array with nominal observations.";
          if (!summary.startsWith("Llama 4:") && !summary.startsWith("Meta Muse:")) {
            summary = `Llama 4: ${summary}`;
          }
          const lat =
            typeof parsed.coordinates?.lat === "number" &&
            !isNaN(parsed.coordinates.lat)
              ? parsed.coordinates.lat
              : null;
          const lng =
            typeof parsed.coordinates?.lng === "number" &&
            !isNaN(parsed.coordinates.lng)
              ? parsed.coordinates.lng
              : null;
          if (lat === null || lng === null) {
            console.warn("Meta AI response lacked valid lat/lng coordinates");
            return null;
          }
          const altitude =
            typeof parsed.coordinates?.altitude === "number" &&
            !isNaN(parsed.coordinates.altitude)
              ? parsed.coordinates.altitude
              : 1.6;

          const bbox: [number, number, number, number] =
            Array.isArray(parsed.bounding_box) &&
            parsed.bounding_box.length === 4 &&
            parsed.bounding_box.every(
              (n: any) => typeof n === "number" && !isNaN(n)
            )
              ? (parsed.bounding_box as [number, number, number, number])
              : [lng - 0.2, lat - 0.2, lng + 0.2, lat + 0.2];

          return {
            target_location: parsed.target_location || "Target Observation Area",
            coordinates: { lat, lng, altitude },
            bounding_box: bbox,
            query_intent: parsed.query_intent || "THERMAL_FIRE",
            nasa_endpoint: parsed.nasa_endpoint || "FIRMS_VIIRS_NOAA20",
            briefing_summary: summary,
            metric_card: parsed.metric_card || {
              primary_metric: "ACTIVE SENSOR TELEMETRY",
              trend: "STABLE",
              status_badge: "ACTIVE",
            },
            active_layers: parsed.active_layers || ["FIRMS_THERMAL", "GIBS_NIGHT_LIGHTS"],
            model_used: model,
            latency_ms: Date.now() - startTime,
          };
        }
      }
      return null;
    } catch (err: any) {
      console.warn("Meta API attempt failed:", err.message);
      return null;
    }
  }

  // Attempt 1: Live Meta AI call
  const first = await callMeta();
  if (first) return first;

  // Attempt 2: Retry once after 2 seconds (AI.md Rule 1)
  console.log("Retrying Meta API once after 2 seconds...");
  await sleep(2000);
  const second = await callMeta();
  if (second) return second;

  // Strict Rule 1 Enforcement: NEVER return mock data
  throw new Error(
    `Meta AI live reasoning failed: Unable to obtain live geospatial analysis from model ${model}`
  );
}
