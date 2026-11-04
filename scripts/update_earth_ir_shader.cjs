const fs = require('fs');

const path = 'd:/GAME/remix-remix-earthui-designer/src/components/EarthGlobeCanvas.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. earthSurfaceMat uniforms: add uRadarMode
content = content.replace(
  `uRainStormIntensity: { value: 0.0 },\r\n          uIrThermalMode: { value: 0.0 },`,
  `uRainStormIntensity: { value: 0.0 },\r\n          uIrThermalMode: { value: 0.0 },\r\n          uRadarMode: { value: 0.0 },`
);
if (!content.includes('uRadarMode: { value: 0.0 }')) {
  content = content.replace(
    `uRainStormIntensity: { value: 0.0 },\n          uIrThermalMode: { value: 0.0 },`,
    `uRainStormIntensity: { value: 0.0 },\n          uIrThermalMode: { value: 0.0 },\n          uRadarMode: { value: 0.0 },`
  );
}

// 2. earthSurfaceMat fragment uniforms: add uniform float uRadarMode;
content = content.replace(
  `uniform float uRainStormIntensity;\r\n          uniform float uIrThermalMode;`,
  `uniform float uRainStormIntensity;\r\n          uniform float uIrThermalMode;\r\n          uniform float uRadarMode;`
);
if (!content.includes('uniform float uRadarMode;')) {
  content = content.replace(
    `uniform float uRainStormIntensity;\n          uniform float uIrThermalMode;`,
    `uniform float uRainStormIntensity;\n          uniform float uIrThermalMode;\n          uniform float uRadarMode;`
  );
}

// 3. cloudShellMat uniforms: add uIrThermalMode and uRadarMode
content = content.replace(
  `uRainStormIntensity: { value: 0.0 },\r\n          uSimCenter: { value: new THREE.Vector2(0.0, 0.0) },`,
  `uRainStormIntensity: { value: 0.0 },\r\n          uIrThermalMode: { value: 0.0 },\r\n          uRadarMode: { value: 0.0 },\r\n          uSimCenter: { value: new THREE.Vector2(0.0, 0.0) },`
);
if (!content.includes('uIrThermalMode: { value: 0.0 },\r\n          uRadarMode: { value: 0.0 },\r\n          uSimCenter:')) {
  content = content.replace(
    `uRainStormIntensity: { value: 0.0 },\n          uSimCenter: { value: new THREE.Vector2(0.0, 0.0) },`,
    `uRainStormIntensity: { value: 0.0 },\n          uIrThermalMode: { value: 0.0 },\n          uRadarMode: { value: 0.0 },\n          uSimCenter: { value: new THREE.Vector2(0.0, 0.0) },`
  );
}

// 4. cloudShellMat fragment uniforms: add uniform float uIrThermalMode; uniform float uRadarMode;
content = content.replace(
  `uniform float uRainStormIntensity;\r\n          uniform vec2 uSimCenter;`,
  `uniform float uRainStormIntensity;\r\n          uniform float uIrThermalMode;\r\n          uniform float uRadarMode;\r\n          uniform vec2 uSimCenter;`
);
if (!content.includes('uniform float uIrThermalMode;\r\n          uniform float uRadarMode;\r\n          uniform vec2 uSimCenter;')) {
  content = content.replace(
    `uniform float uRainStormIntensity;\n          uniform vec2 uSimCenter;`,
    `uniform float uRainStormIntensity;\n          uniform float uIrThermalMode;\n          uniform float uRadarMode;\n          uniform vec2 uSimCenter;`
  );
}

// 5. Replace thermal shader block in earthSurfaceMat
const oldThermalBlock = `            if (uIrThermalMode > 0.01) {
              // Delicate thermal radiant highlights over true-color terrain without darkening land
              float lum = dot(finalCol, vec3(0.299, 0.587, 0.114));
              vec3 thermalWarm = vec3(1.0, 0.45, 0.15) * smoothstep(0.75, 0.98, lum) * 0.40;
              finalCol += thermalWarm * uIrThermalMode * 0.35;
            }`;

const newThermalBlock = `            if (uIrThermalMode > 0.01) {
              // NASA VIIRS 375m & NOAA GOES False-Color Thermal Infrared (TIR 10.8µm) Spectrum
              // Converts Earth surface into distinct satellite thermal infrared radiometry:
              // - Ocean surface: Cool thermal marine indigo/cobalt gradient [18°C - 30°C]
              // - Land surface: Radiant thermal skin emission (ironbow false-color: crimson -> amber -> golden)
              float lum = dot(finalCol, vec3(0.299, 0.587, 0.114));
              vec3 oceanTir = mix(vec3(0.02, 0.06, 0.28), vec3(0.06, 0.18, 0.48), smoothstep(0.2, 0.8, vUv.y));
              
              vec3 landCool = vec3(0.65, 0.08, 0.22);
              vec3 landWarm = vec3(0.92, 0.40, 0.08);
              vec3 landHot  = vec3(1.0, 0.82, 0.25);
              vec3 landTir  = mix(landCool, landWarm, smoothstep(0.18, 0.52, lum));
              landTir       = mix(landTir, landHot, smoothstep(0.52, 0.88, lum));
              
              vec3 thermalComposite = mix(oceanTir, landTir, landMask);
              float irScanline = 0.96 + 0.04 * sin(vUv.y * 1200.0);
              thermalComposite *= irScanline;
              
              finalCol = mix(finalCol, thermalComposite, uIrThermalMode * 0.90);
            }

            if (uRadarMode > 0.01) {
              // NOAA / INSAT Doppler Weather Radar Composite Reflectivity (dBZ)
              float radarNoise = sin(vUv.x * 120.0 + uCloudOffset * 8.0) * cos(vUv.y * 120.0 - uCloudOffset * 6.0);
              float rainCell = smoothstep(0.35, 0.85, radarNoise * 0.5 + 0.5);
              
              vec3 dbzGreen  = vec3(0.05, 0.92, 0.20);
              vec3 dbzYellow = vec3(0.98, 0.85, 0.05);
              vec3 dbzRed    = vec3(0.95, 0.12, 0.08);
              vec3 radarCol  = mix(dbzGreen, dbzYellow, smoothstep(0.4, 0.7, rainCell));
              radarCol       = mix(radarCol, dbzRed, smoothstep(0.7, 0.95, rainCell));
              
              float radarSweep = sin(vUv.x * 6.28318 + uCloudOffset * 10.0);
              float sweepLine  = smoothstep(0.96, 1.0, radarSweep) * 0.35;
              
              finalCol = mix(finalCol, radarCol + vec3(sweepLine), rainCell * uRadarMode * 0.75);
            }`;

content = content.replace(oldThermalBlock.replace(/\r\n/g, '\n'), newThermalBlock);
content = content.replace(oldThermalBlock.replace(/\n/g, '\r\n'), newThermalBlock.replace(/\n/g, '\r\n'));

// 6. In cloudShellMat fragment shader, add thermal IR cloud coloring
const oldCloudColLine = `            vec3 cloudCol = mix(nightCloudCol, dayCloudCol, max(max(sunLit, rimLight * 0.45), 0.85));
            cloudCol = mix(cloudCol, twilightCloudCol, twilightGlow * 0.32);`;

const newCloudColLine = `            vec3 cloudCol = mix(nightCloudCol, dayCloudCol, max(max(sunLit, rimLight * 0.45), 0.85));
            cloudCol = mix(cloudCol, twilightCloudCol, twilightGlow * 0.32);

            if (uIrThermalMode > 0.01) {
              // High tropospheric cold cloud tops (-40°C to -80°C) in Thermal IR:
              // Convective storm cores radiate intense brilliant white-cyan
              vec3 irCloudCol = mix(vec3(0.35, 0.75, 1.0), vec3(1.0, 1.0, 1.0), smoothstep(0.3, 0.75, rawCloudDensity));
              cloudCol = mix(cloudCol, irCloudCol, uIrThermalMode * 0.90);
              cloudAlpha = mix(cloudAlpha, min(1.0, cloudAlpha * 1.35), uIrThermalMode);
            }`;

content = content.replace(oldCloudColLine.replace(/\r\n/g, '\n'), newCloudColLine);
content = content.replace(oldCloudColLine.replace(/\n/g, '\r\n'), newCloudColLine.replace(/\n/g, '\r\n'));

// 7. Update targetIr and targetRadar in animate loop
const oldIrAnimate = `        // Smooth GPU False-Color Infrared / Thermal Radiometry transition (VIIRS / Sentinel-3 SLSTR)
        const targetIr = (mode === 'VIIRS_NIGHT_THERMAL' && isSearchSubmitted) ? 1.0 : 0.0;
        if (targetIr === 0.0) {
          earthSurfaceMat.uniforms.uIrThermalMode.value = 0.0;
        } else {
          earthSurfaceMat.uniforms.uIrThermalMode.value +=
            (targetIr - earthSurfaceMat.uniforms.uIrThermalMode.value) * 0.25;
        }`;

const newIrAnimate = `        // Smooth GPU False-Color Infrared / Thermal Radiometry transition (VIIRS / Sentinel-3 SLSTR)
        const targetIr = (mode === 'VIIRS_NIGHT_THERMAL') ? 1.0 : 0.0;
        earthSurfaceMat.uniforms.uIrThermalMode.value +=
          (targetIr - earthSurfaceMat.uniforms.uIrThermalMode.value) * 0.20;
        cloudShellMat.uniforms.uIrThermalMode.value =
          earthSurfaceMat.uniforms.uIrThermalMode.value;

        // Smooth GPU Doppler Weather Radar Composite Reflectivity transition
        const targetRadar = (mode === 'ATMOSPHERIC_AOD_CLOUDS') ? 1.0 : 0.0;
        earthSurfaceMat.uniforms.uRadarMode.value +=
          (targetRadar - earthSurfaceMat.uniforms.uRadarMode.value) * 0.20;
        cloudShellMat.uniforms.uRadarMode.value =
          earthSurfaceMat.uniforms.uRadarMode.value;`;

content = content.replace(oldIrAnimate.replace(/\r\n/g, '\n'), newIrAnimate);
content = content.replace(oldIrAnimate.replace(/\n/g, '\r\n'), newIrAnimate.replace(/\n/g, '\r\n'));

// 8. Add HUD layer status banner in JSX
const oldJsxStage = `<div
        data-testid="earth-globe-stage"
        data-pov-locked={targetPointOfView ? 'true' : 'false'}
        data-pov-label={targetPointOfView?.label || 'global'}
        data-layer-mode={activeLayerMode}
        data-points-count={pointsData.length}
        data-points-merge={pointsMerge ? 'true' : 'false'}
        className="relative w-full h-full overflow-hidden select-none pointer-events-auto"
      >`;

const newJsxStage = `<div
        data-testid="earth-globe-stage"
        data-pov-locked={targetPointOfView ? 'true' : 'false'}
        data-pov-label={targetPointOfView?.label || 'global'}
        data-layer-mode={activeLayerMode}
        data-points-count={pointsData.length}
        data-points-merge={pointsMerge ? 'true' : 'false'}
        className="relative w-full h-full overflow-hidden select-none pointer-events-auto"
      >
        {/* Active Sensor Mode Status Pill */}
        {activeLayerMode === 'VIIRS_NIGHT_THERMAL' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/50 backdrop-blur-md shadow-[0_0_24px_rgba(239,68,68,0.4)] animate-pulse">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-[11px] font-mono tracking-wider text-red-200 uppercase font-semibold">
              THERMAL INFRARED SENSOR ACTIVE • VIIRS 375m TIR (10.8µm)
            </span>
          </div>
        )}
        {activeLayerMode === 'ATMOSPHERIC_AOD_CLOUDS' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 backdrop-blur-md shadow-[0_0_24px_rgba(16,185,129,0.4)] animate-pulse">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono tracking-wider text-emerald-200 uppercase font-semibold">
              DOPPLER WEATHER RADAR ACTIVE • COMPOSITE REFLECTIVITY (dBZ)
            </span>
          </div>
        )}`;

content = content.replace(oldJsxStage.replace(/\r\n/g, '\n'), newJsxStage);
content = content.replace(oldJsxStage.replace(/\n/g, '\r\n'), newJsxStage.replace(/\n/g, '\r\n'));

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated EarthGlobeCanvas.tsx!');
