# SATA Orbital Telemetry — NASA GIBS/FIRMS & Autonomous `pointOfView` Architecture

Integrate the autonomous `pointOfView({ lat, lng, altitude }, 2000)` camera fly-to controller, 84 NASA FIRMS thermal anomaly surface points (`pointsMerge` instanced GPU buffer), and NASA GIBS VIIRS night-light layer blending directly into the 3D Earth stage while keeping 100% of the existing SATA glassmorphic UI untouched.

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Zero UI Modification**: The TopNavbar, compact 48px Search Bar, Bottom 3 Glass Cards (`RECENT ACCIDENTS`, `RELEASES`, `SENSOR TELEMETRY`), and scrollable `OBSERVATION BRIEFING` sidebar remain 100% visually untouched.
> - **No Bulky 3D Cylinders or Clutter**: Avoid protruding 3D cylinder bars or noisy HTML markers that obscure the Earth's city lights. Render the 84 FIRMS thermal anomalies as flush, anti-aliased surface micro-luminance nodes (`#06b6d4` electric cyan & thermal gold) with delicate tangent concentric pulse rings at primary sectors (`Chennai`, `Kanchipuram`, `Sichuan-Yunnan`, `Indus-Thar`, `Arabian Sea`, `Red Sea`, `Malacca Strait`).
> - **Autonomous `pointOfView` Fly-To**: Natural-language queries in the SATA command bar (e.g., `"Chennai"`, `"Kanchipuram"`, `"Red Sea"`, `"Sichuan"`, `"Indus"`) automatically parse target coordinates `[lat, lng, altitude]` and trigger a smooth 2000ms cubic-bezier camera fly-to (`pointOfView({ lat, lng, altitude }, 2000)`).

---

## 1. Overview & Core Concept

- **What It Does**: Combines the photorealistic SATA 3D Earth globe and NASA GIBS/VIIRS night-time thermal imagery with an autonomous `pointOfView` camera controller and 84 merged FIRMS thermal anomaly points.
- **Target Audience / Persona**: Orbital telemetry operators and Meta Hackathon judges evaluating live 60 FPS WebGL execution, real-time query-to-coordinate camera choreography, and zero-slop obsidian/cyan visual craft.
- **Key Value**: Delivers 60 FPS rendering with a single merged GPU buffer for all 84 thermal hotspots, instant 3D raycast picking, and seamless camera fly-to driven by natural-language search queries.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Autonomous Query Fly-To*: Typing `"Chennai"` or `"Show thermal hotspots near Chennai"` into the search bar parses `[lat: 13.0827, lng: 80.2707]`, smoothly interpolates the 3D globe orientation and camera distance (`altitude: 1.72`) over `2000ms`, illuminates the Chennai thermal cluster, and updates the Observation Briefing sidebar.
  2. *Direct 3D Globe Hotspot Selection*: Clicking any primary thermal sector node on the 3D globe raycasts against the surface node, triggers `pointOfView` focus, and updates the active heat spots count and Llama 4 insight briefing.
  3. *Orbit & Tab Synchronization*: Switching between `HOME`, `SATELLITES`, `ORBITS`, and `RELEASES` or toggling `Adjust orbit` smoothly adjusts orbital inclination and active telemetry calibration.

- **Visual Identity & Theme**:
  - *Obsidian & Electric Cyan Discipline*: Deep space black (`#000000`) with atmospheric sapphire-cyan Fresnel rim glow, warm VIIRS golden city lights, and calibrated `#06b6d4` electric cyan / `#fde075` thermal accent rings flush to the sphere curvature.

---

## 3. Technical Architecture & Data Strategy

```
┌───────────────────────────────────────────────────────────────────┐
│                    SATA Command Search Bar                        │
│   "Show thermal hotspots near Chennai" -> evaluateObservationQuery│
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────────┐
│               Autonomous Coordinate Parser (Llama 4)              │
│   Returns targetPointOfView: { lat: 13.08, lng: 80.27, alt: 1.72 }│
│   + 84 FIRMS Thermal Points (firmsData) + Active Sector Summary   │
└───────────────┬───────────────────────────────────┬───────────────┘
                │                                   │
                ▼                                   ▼
┌──────────────────────────────────┐ ┌──────────────────────────────┐
│        EarthGlobeCanvas          │ │      ObservationSidebar      │
│ - pointOfView(pov, 2000ms)       │ │ - Pinned Header              │
│ - NASA GIBS + SATA VIIRS Texture │ │ - Smooth Scrollable Body     │
│ - 84 Merged FIRMS Surface Points │ │ - 84 Active Heat Spots       │
│ - Flush Tangent Radar Ripples    │ │ - Llama 4 Thermal Briefing   │
└──────────────────────────────────┘ └──────────────────────────────┘
```
