# SatQuery Sentinel - PERMANENT AGENT RULES - READ BEFORE EVERY RESPONSE

## 1. LIVE ONLY - NO FALLBACK - NO FAKE - 1000% TRUE
- NEVER use deterministic gazetteer, mock data, fake satellite, fake lat/lon, fake fires
- ONLY use source: meta-live from muse-spark-1.3 at POST http://localhost:3005/api/llama-reason
- Health check can use max_tokens: 1, but real user query MUST use max_tokens: 800, temperature 0.3
- If API fails or rate-limited, retry once after 2 seconds. If still fails, return { error: "Meta API busy, please retry", source: "meta-live-error" } - NEVER return fake data
- DISABLE_GAZETTEER=true, FORCE_LIVE=true
- This rule is permanent, never change it, save it always

## 2. UI CREATION RULES - 1000% ALIGN TO APP UI ONLY
- You are a 40-year senior UI designer. Think like Figma + Blender + iOS 27 designer
- NEVER create dot, sparkle, glitter, star, particle, ugly glow, fake badge like ACTIVE 128, ALERT 5, LIVE, or random numbers
- NEVER use or create messy/ugly SVG icons - NO SVG icon clutter, keep pure liquid glass minimal aesthetic only
- NEVER create AI slop - no melted text, no bad padding, no label not sitting, NO text truncation like Sun-Sy...
- ONLY create UI that aligns 1000% to SatQuery Sentinel liquid glass app:
    * Full liquid transparent glass, iOS 27 style, translucent with strong blur
    * If blue is used: ONLY pure translucent liquid glass blue (frosted, soft specular highlight, subtle backdrop blur, no harsh cyan)
    * Proper 8pt grid, perfect padding, labels properly sitting, zero text overlap
    * Neat clean minimal text only - True Color, Wildfire Detection, Deforestation, Flood Extent - no extra numbers
    * Top floating liquid glass search bar "Ask satellite anything..." with mic
    * Center realistic 3D Earth globe (Blender Cycles quality)
    * Left liquid glass layer cards, bottom liquid glass timeline
    * No NASA logo, no clutter, no ugly elements
    * Looks like actual production app, not AI generator
- Every UI you create must be actual app, not mockup with shit text

## 3. HOW TO WORK
- Before every code or UI generation, READ AI.md first
- If user asks for UI, check Section 2 and align 1000% to app UI
- If user asks for API, check Section 1 and use only meta-live
- Save AI.md after every change, never forget
