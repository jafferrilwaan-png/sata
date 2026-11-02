# SATA (SataQuery Sentinel) — Backend Engine
> Autonomous Geospatial Reasoning & NASA Earth Observation API for Meta Global AI Developer Hackathon 2026

This repository hosts the **pure backend, AI orchestration, and NASA satellite telemetry pipeline** for **SATA (SataQuery Sentinel)**. The frontend UI is designed and rendered in Antigravity Argon.

---

## 🛰️ Architecture & Endpoints

| Endpoint | Method | Description | Primary Consumers |
| :--- | :--- | :--- | :--- |
| `/api/query` | `POST / GET` | **Meta Llama 4 Maverick** orchestrator: extracts target coordinates, bounding boxes, sensor layers, and generates 2-sentence briefings. | Omnibar, AI Insights Sidebar, Globe Camera Fly-To |
| `/api/firms` | `GET` | **NASA FIRMS** (VIIRS NOAA-20 & MODIS Terra NRT) active thermal anomalies & heat spots. | 3D Globe Thermal Pulse Layer (`react-globe.gl`) |
| `/api/telemetry` | `GET` | Live sensor metrics: active VIIRS/MODIS counts, AOD atmospheric stability, and cloud cover %. | Sensor Telemetry Card (Bottom-Right) |
| `/api/orbits` | `GET` | Satellite orbital passes and schedules (ISRO Cartosat-3, NOAA-20, Sentinel-2, Starlink). | Releases / Orbit Schedule Card (Bottom-Center) |
| `/api/incidents` | `GET` | Satellite-detected incident feed with coordinate fly-to targets (IND-01, IDN-04). | Recent Accidents Card (Bottom-Left) |
| `/api/gibs` | `GET` | NASA GIBS tile URLs & Black Marble night textures. | 3D Globe Texture Streamer |

---

## ⚡ Integration with Antigravity Argon UI

### 1. Natural Language Omnibar Query
Send a POST request when the user types or speaks:
```typescript
const res = await fetch("http://localhost:3000/api/query", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "Show active heat spots near Chennai last 3 days" }),
});
const data = await res.json();

// 1. Animate 3D Globe Camera
globeRef.current.pointOfView({
  lat: data.reasoning.center.lat,
  lng: data.reasoning.center.lng,
  altitude: data.reasoning.camera_altitude,
}, 2000);

// 2. Plot Cyan Hotspots
setPoints(data.thermal_points);

// 3. Update AI Insights Card
setBriefing(data.reasoning.briefing);
setTelemetry(data.telemetry);
```

### 2. Incident Card Click (Fly-To)
```typescript
function onIncidentCardClick(incident) {
  globeRef.current.pointOfView({
    lat: incident.coordinates[0],
    lng: incident.coordinates[1],
    altitude: 1.5,
  }, 1800);
}
```

---

## 🧠 Meta Llama 4 Maverick Integration
- **Model:** `Llama-4-Maverick-17B-128E-Instruct` via Meta Model API.
- **Budget Compliance:** Powered by $150 free developer credits with strict $1 billing cap.
- **Resilient Fallback:** Automatically switches to high-fidelity deterministic Chennai spatial data if network or API keys are unavailable, guaranteeing **0 crashes** during live judging.

---

## 🎨 Color & System Compliance
- **Zero Red Rules:** All anomalies and alerts strictly use Electric Cyan (`#06b6d4`), Sky Blue (`#38bdf8`), and Obsidian Slate.
