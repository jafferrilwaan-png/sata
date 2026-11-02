# ==============================================================================
# META GLOBAL AI DEVELOPER HACKATHON 2026 — SATA MASTER STRATEGY & ALIGNMENT
# Co-Hosted by: Meta Platforms, Inc. & Cerebral Valley
# Submission Deadline: November 4, 2026 at 9:00 PM ET (Nov 5, 2026 at 6:30 AM IST)
# Tracks: Indie Developer / Student Track
# Prize Pool: $1,000,000 USD Total ($250,000 Grand Prize)
# ==============================================================================

## 1. OFFICIAL JUDGING RUBRIC (100% TOTAL) & SATA SCORING BLUEPRINT

### A. Impact (30% — Highest Weighted Rubric Pillar)
- **Judges Look For:** Real-world utility, who benefits, and how much it matters for disaster and environmental monitoring.
- **SATA Positioning:** "Autonomous Geospatial Emergency Response Console"
- **The Problem Solved:** Traditional satellite portals (NASA Worldview, FIRMS, Copernicus) are fragmented, complex, and slow. Ground responders and emergency dispatchers waste 10–20 minutes filtering raster layers.
- **SATA Innovation:** Ground operators type plain English ("Show wildfires near Chennai last 72 hours" or "Recent incidents in Antarctic Ocean: iceberg calving"), and SATA autonomously flies the 3D Earth, isolates anomalies, plots cyan radar markers, and delivers a 2-sentence actionable briefing in under 2 seconds.

### B. Use of Meta AI Tooling (25% — Compulsory Meta Model Integration)
- **Judges Look For:** Deep, authentic integration of Meta's AI ecosystem beyond a generic chat window.
- **SATA Implementation:** 
  - Meta Model API integration with live authenticated credentials.
  - Acts as an **Orbital Intelligence Dispatcher** performing autonomous tool-calling:
    1. Ingests natural language query from the Omnibar.
    2. Extracts structured JSON parameters (`lat`, `lon`, `zoomAltitude`, `activeHeatSpots`, `layerType`, `telemetry`).
    3. Triggers NASA FIRMS / GIBS satellite data pipelines.
    4. Synthesizes sensor telemetry into a crisp 2-sentence executive briefing.
  - Zero out-of-pocket cost: Utilizes Meta's $150 developer credits with a strict $1 safety cap.

### C. Working Demo & Video (25% — Live Stability & Presentation)
- **Judges Look For:** Zero crashes under live testing, high polish, and a clean demo video.
- **SATA Architecture Guarantees:**
  - **Zero-Crash Resilience:** Every Meta API call is wrapped in a 6-second timeout with an automatic fallback to our deterministic gazetteer resolver (`telemetryLogic.ts`), ensuring the demo NEVER crashes or errors out even if Wi-Fi drops.
  - **Fluid 60 FPS 3D Earth:** Camera fly-to animations with glowing cyan radar rings over active regions.
  - **90-Second Demo Video Script:**
    - `00:00 - 00:15`: Problem (Satellite data is slow and manual for disaster response).
    - `00:15 - 00:60`: Live Demo (Typing query in Omnibar -> Meta AI extracts target -> 3D globe flies to Chennai/Antarctica -> Live telemetry cards populate).
    - `00:60 - 00:90`: Architecture Slide (Next.js + Meta Model API + NASA FIRMS/GIBS).

### D. Technical Depth & Execution (20% — Engineering Refinement)
- **Obsidian & Electric Cyan Theme:** Strictly `#030712` dark background, translucent slate glass cards (`bg-slate-900/60 backdrop-blur-md`), and glowing cyan `#06b6d4` & blue `#38bdf8` accents.
- **Zero Red Rule:** Never use red for alerts or charts—use cyan/sky blue/white only.
- **Strict Backend Separation:** Clean TypeScript contracts, serverless API routes with CORS support, and complete isolation from the frontend (which is designed in AI Studio / Antigravity Argon).

---

## 2. STRICT BACKEND DATA CONTRACT FOR AI STUDIO FRONTEND
Every API endpoint and service function conforms to this exact JSON schema:

```json
{
  "targetName": "Chennai, Tamil Nadu",
  "lat": 13.0827,
  "lon": 80.2707,
  "zoomAltitude": 1.6,
  "activeHeatSpots": 84,
  "layerType": "THERMAL",
  "briefingSummary": "Llama 4: Satellite telemetry indicates elevated thermal activities within the targeted corridor. VIIRS and MODIS instruments confirm stabilized atmospheric density across monitoring zones.",
  "telemetry": {
    "viirsPoints": 14,
    "modisPoints": 2,
    "aodStatus": "STABLE",
    "cloudCoverPct": 34
  }
}
```

---

## 3. LIVE VERIFIED CREDENTIALS & ENDPOINTS
- **Meta API Key:** Authenticated & verified live with Meta's official Model API.
- **Live Endpoint:** `https://api.meta.ai/v1` (with support for `https://api.llama.com/compat/v1`).
- **Local Server Port:** Port 3005 (leaves default port 3000 free for the AI Studio frontend).
- **Operational Mode:** LIVE ONLY - NO FALLBACK - 1000% TRUE DATA (Strict AI.md Rule 1)
- **Core Endpoints:**
  - `POST /api/llama-reason` -> Autonomous Meta AI reasoning dispatcher (Live muse-spark-1.3)
  - `POST /api/query` -> Unified reasoning, ISRO orbits, and NASA EONET incidents
  - `GET /api/firms` -> NASA FIRMS live infrared thermal points
  - `GET /api/telemetry` -> Sensor telemetry metrics
  - `GET /api/orbits` -> ISRO Cartosat-3 / INSAT-3DR live TLE passes
  - `GET /api/incidents` -> NASA EONET v3 live global disaster events
