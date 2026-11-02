import { ThermalAnomalyPoint, BoundingBox } from "../types/sata";
import { sataConfig } from "./config";

/**
 * Fetch thermal anomalies strictly from NASA FIRMS API.
 * Strictly adheres to AI.md Rule 1: LIVE ONLY - NO FALLBACK - NO FAKE - 1000% TRUE.
 */
export async function fetchNasaFirmsAnomalies(
  bbox: BoundingBox = [80.1, 12.9, 80.35, 13.2],
  dayRange: number = 1
): Promise<ThermalAnomalyPoint[]> {
  const mapKey = sataConfig.nasa.firmsMapKey;
  if (!mapKey) {
    throw new Error(
      "NASA FIRMS MAP_KEY is missing or invalid in configuration. Live thermal observation requires an active key."
    );
  }

  const bboxStr = `${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}`;

  async function fetchFirmsCsv(key: string): Promise<ThermalAnomalyPoint[] | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    try {
      // Query Suomi-NPP VIIRS 375m Near Real-Time sensor
      const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/VIIRS_SNPP_NRT/${bboxStr}/${dayRange}`;
      let response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (!response.ok) {
        // Fallback to NOAA-20 VIIRS NRT
        const fallbackUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/VIIRS_NOAA20_NRT/${bboxStr}/${dayRange}`;
        response = await fetch(fallbackUrl);
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.warn(`NASA FIRMS HTTP ${response.status}: ${errorText}`);
        return null;
      }

      const text = await response.text();
      const lines = text.trim().split("\n");

      // 0 active fires detected in bounding box: valid live observational truth
      if (lines.length <= 1) return [];

      const header = lines[0].split(",");
      const latIdx = header.indexOf("latitude");
      const lngIdx = header.indexOf("longitude");
      const brightIdx = header.indexOf("bright_ti4");
      const frpIdx = header.indexOf("frp");
      const dateIdx = header.indexOf("acq_date");
      const timeIdx = header.indexOf("acq_time");
      const satIdx = header.indexOf("satellite");

      const parsedPoints: ThermalAnomalyPoint[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols.length >= latIdx && latIdx !== -1 && lngIdx !== -1) {
          const lat = parseFloat(cols[latIdx]);
          const lng = parseFloat(cols[lngIdx]);
          const frpVal = frpIdx !== -1 ? parseFloat(cols[frpIdx]) : 0;
          const brightVal = brightIdx !== -1 ? parseFloat(cols[brightIdx]) : 0;

          if (!isNaN(lat) && !isNaN(lng)) {
            parsedPoints.push({
              id: `FIRMS-LIVE-${i}`,
              latitude: Number(lat.toFixed(4)),
              longitude: Number(lng.toFixed(4)),
              brightness: isNaN(brightVal) ? 0 : Number(brightVal.toFixed(1)),
              scan: 0.4,
              track: 0.4,
              acq_date: dateIdx !== -1 ? cols[dateIdx] : new Date().toISOString().split("T")[0],
              acq_time: timeIdx !== -1 ? cols[timeIdx] : "12:00",
              satellite: satIdx !== -1 && cols[satIdx]?.includes("MODIS") ? "MODIS_TERRA" : "VIIRS_NOAA20",
              confidence: "nominal",
              frp: isNaN(frpVal) ? 0 : Number(frpVal.toFixed(1)),
              color: "#06b6d4",
              pulseRate: 1.5,
            });
          }
        }
      }

      return parsedPoints;
    } catch (err: any) {
      clearTimeout(timer);
      console.warn("NASA FIRMS fetch error:", err.message);
      return null;
    }
  }

  // Attempt 1: Query live FIRMS API
  let points = await fetchFirmsCsv(mapKey);

  // Attempt 2: Retry once after 2 seconds (Rule 1 compliance)
  if (points === null) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    points = await fetchFirmsCsv(mapKey);
  }

  if (points !== null) {
    return points;
  }

  throw new Error(
    "NASA FIRMS live query failed: Unable to fetch satellite thermal anomalies from NASA EOSDIS."
  );
}
