const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'remix-remix-earthui-designer', 'src', 'components', 'EarthGlobeCanvas.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add import for PlanetarySimulationScenario
if (!code.includes("import type { PlanetarySimulationScenario }")) {
  code = code.replace(
    "} from '../utils/telemetryLogic';",
    "} from '../utils/telemetryLogic';\r\nimport type { PlanetarySimulationScenario } from '../data/planetarySimulations';"
  );
}

// 2. Add activeSimulation to EarthGlobeCanvasProps
if (!code.includes("activeSimulation?: PlanetarySimulationScenario | null;")) {
  code = code.replace(
    "activeLayerMode?: NasaGibsLayerMode;",
    "activeLayerMode?: NasaGibsLayerMode;\r\n  activeSimulation?: PlanetarySimulationScenario | null;"
  );
}

// 3. Add activeSimulation to component props destructuring
if (!code.includes("activeSimulation = null,")) {
  code = code.replace(
    "activeLayerMode = 'VIIRS_NIGHT_THERMAL',",
    "activeLayerMode = 'MODIS_TRUE_COLOR_TERRAIN',\r\n      activeSimulation = null,"
  );
}

// 4. Add activeSimulationRef
if (!code.includes("const activeSimulationRef =")) {
  code = code.replace(
    "const activeLayerModeRef = useRef<NasaGibsLayerMode>(activeLayerMode);",
    "const activeLayerModeRef = useRef<NasaGibsLayerMode>(activeLayerMode);\r\n  const activeSimulationRef = useRef<PlanetarySimulationScenario | null>(activeSimulation);\r\n  activeSimulationRef.current = activeSimulation;"
  );
}

// 5. Add uniforms to earthSurfaceMat
if (!code.includes("uSimCenter: {")) {
  code = code.replace(
    "uIrThermalMode: { value: 0.0 },",
    "uIrThermalMode: { value: 0.0 },\r\n          uSimCenter: { value: new THREE.Vector2(0.0, 0.0) },\r\n          uSimRadius: { value: 0.0 },\r\n          uSimIntensity: { value: 0.0 },\r\n          uSimType: { value: 0.0 },"
  );
}

// 6. Add uniforms to earthSurfaceMat fragmentShader
if (!code.includes("uniform vec2 uSimCenter;")) {
  code = code.replace(
    "uniform float uIrThermalMode;\r\n          varying vec2 vUv;",
    "uniform float uIrThermalMode;\r\n          uniform vec2 uSimCenter;\r\n          uniform float uSimRadius;\r\n          uniform float uSimIntensity;\r\n          uniform float uSimType;\r\n          varying vec2 vUv;"
  );
}

// 7. Add uniforms to cloudShellMat
if (!code.includes("uSimCenter: { value: new THREE.Vector2(0.0, 0.0) },\r\n          uSimRadius: {")) {
  code = code.replace(
    "uRainStormIntensity: { value: 0.0 },\r\n        },",
    "uRainStormIntensity: { value: 0.0 },\r\n          uSimCenter: { value: new THREE.Vector2(0.0, 0.0) },\r\n          uSimRadius: { value: 0.0 },\r\n          uSimIntensity: { value: 0.0 },\r\n          uSimType: { value: 0.0 },\r\n        },"
  );
}

// 8. Add uniforms to cloudShellMat fragmentShader
if (!code.includes("uniform vec2 uSimCenter;\r\n          uniform float uSimRadius;\r\n          uniform float uSimIntensity;\r\n          uniform float uSimType;\r\n          varying vec2 vUv;\r\n          varying vec3 vNormal;\r\n          varying vec3 vLocalNormal;")) {
  code = code.replace(
    "uniform float uRainStormIntensity;\r\n          varying vec2 vUv;\r\n          varying vec3 vNormal;\r\n          varying vec3 vLocalNormal;",
    "uniform float uRainStormIntensity;\r\n          uniform vec2 uSimCenter;\r\n          uniform float uSimRadius;\r\n          uniform float uSimIntensity;\r\n          uniform float uSimType;\r\n          varying vec2 vUv;\r\n          varying vec3 vNormal;\r\n          varying vec3 vLocalNormal;"
  );
}

// 9. Fix natural Earth terrain colors in fragmentShader (remove unnatural yellow-green boosts)
const oldDayBlock = `              // Restore natural emerald-olive canopy hue where Blue Marble has dark bluish atmospheric haze over tropical rainforests
              float canopyMask = clamp((dayCol.b - dayCol.r) * 6.0, 0.0, 1.0) * landMask;
              vec3 canopyCorrectedDay = mix(dayCol, vec3(dayCol.r * 1.12, max(dayCol.g * 1.28, dayCol.b * 0.88), dayCol.b * 0.68), canopyMask * 0.85);
              // Soft filmic shoulder prevents high-albedo desert sands (Sahara/Arabia) from clipping
              vec3 balancedDayCol = canopyCorrectedDay / (1.0 + max(canopyCorrectedDay.r, max(canopyCorrectedDay.g, canopyCorrectedDay.b)) * 0.42);
              vec3 islandGreenTint = vec3(0.07, 0.22, 0.16) * (0.75 + 0.5 * microTerrainNoise);
              vec3 hypsometricTint = mix(
                balancedDayCol,
                balancedDayCol * vec3(1.10, 1.05, 0.94) + vec3(0.03, 0.025, 0.015) * modisTerrainElev,
                modisTerrainElev * uZoomDetail
              );
              // Multi-scale real-world satellite land synthesis on zoom:
              // Resolves sub-kilometer topographical contours, river basins, and terrain relief on land only
              float zoomLandFactor = smoothstep(0.08, 0.72, uZoomDetail);
              float microTopo = (noise2DSurf(vUv * 720.0) * 0.50 + noise2DSurf(vUv * 1920.0) * 0.32 + noise2DSurf(vUv * 5120.0) * 0.18) - 0.50;
              vec3 crispSatelliteLand = hypsometricTint * (1.0 + microTopo * 0.38 * zoomLandFactor);
              vec3 landAlbedo = mix(crispSatelliteLand, max(crispSatelliteLand, islandGreenTint), clamp(islandField * 1.5, 0.0, 1.0) * uZoomDetail);
              vec3 naturalTerrain = landAlbedo * displacedRelief * (0.72 + uZoomDetail * 0.24) + finalCol * 0.82;
              float solarLandIllum = 0.50 + 0.56 * pow(sunDiffuse, 0.65);
              vec3 sunlitTerrain =
                landAlbedo * displacedRelief * solarLandIllum * (0.98 + uZoomDetail * 0.16) +
                goldLight * 0.10;
              vec3 daySurfaceLand = mix(naturalTerrain, sunlitTerrain, realTimeDaylight);
              finalCol = mix(finalCol, daySurfaceLand, effectiveDayMix * landMask);`;

const newDayBlock = `              // Authentic photorealistic NASA True Color Blue Marble reflectance:
              // Natural golden-ochre/tan deserts and natural forest greens without artificial tinting
              vec3 balancedDayCol = dayCol;
              vec3 islandGreenTint = vec3(0.07, 0.18, 0.12) * (0.8 + 0.4 * microTerrainNoise);
              vec3 hypsometricTint = mix(
                balancedDayCol,
                balancedDayCol * vec3(1.04, 1.02, 0.98) + vec3(0.02, 0.015, 0.01) * modisTerrainElev,
                modisTerrainElev * uZoomDetail * 0.4
              );
              // Multi-scale real-world satellite land synthesis on zoom:
              float zoomLandFactor = smoothstep(0.08, 0.72, uZoomDetail);
              float microTopo = (noise2DSurf(vUv * 720.0) * 0.50 + noise2DSurf(vUv * 1920.0) * 0.32 + noise2DSurf(vUv * 5120.0) * 0.18) - 0.50;
              vec3 crispSatelliteLand = hypsometricTint * (1.0 + microTopo * 0.22 * zoomLandFactor);
              vec3 landAlbedo = mix(crispSatelliteLand, max(crispSatelliteLand, islandGreenTint), clamp(islandField * 1.5, 0.0, 1.0) * uZoomDetail);
              vec3 naturalTerrain = landAlbedo * displacedRelief * (0.85 + uZoomDetail * 0.15);
              float solarLandIllum = 0.55 + 0.50 * pow(sunDiffuse, 0.65);
              vec3 sunlitTerrain =
                landAlbedo * displacedRelief * solarLandIllum * (0.95 + uZoomDetail * 0.10) +
                goldLight * 0.08;
              vec3 daySurfaceLand = mix(naturalTerrain, sunlitTerrain, realTimeDaylight);
              finalCol = mix(finalCol, daySurfaceLand, effectiveDayMix * landMask);`;

if (code.includes(oldDayBlock.replace(/\r\n/g, '\n'))) {
  code = code.replace(oldDayBlock.replace(/\r\n/g, '\n'), newDayBlock);
} else if (code.includes(oldDayBlock)) {
  code = code.replace(oldDayBlock, newDayBlock);
}

// 10. Add the 30-scenario simulation shader effects into earthSurfaceMat fragmentShader
const simShaderInsert = `
            // Dynamic Autonomous Planetary Simulation Shaders (30 Possibilities)
            if (uSimIntensity > 0.005) {
              vec2 dSim = fragLatLon - uSimCenter;
              float distDeg = length(dSim);
              if (distDeg < uSimRadius) {
                float simMask = smoothstep(uSimRadius, uSimRadius * 0.20, distDeg) * uSimIntensity;
                if (abs(uSimType - 1.0) < 0.2) {
                  // Type 1: Snowfall & Cryo-freeze (e.g. Thar Desert snowfall, Polar freeze)
                  // High-albedo procedural crystalline snow blanket with specular sparkle
                  float snowNoise = sin(vUv.x * 3200.0) * cos(vUv.y * 3200.0) * 0.08;
                  vec3 snowColor = vec3(0.94, 0.96, 0.99) * (0.96 + snowNoise);
                  float snowGlint = pow(max(dot(normal, halfVec), 0.0), 28.0) * 0.55;
                  vec3 frozenSurface = (snowColor + vec3(snowGlint)) * (0.80 + 0.35 * sunDiffuse);
                  finalCol = mix(finalCol, frozenSurface, simMask * landMask * 0.94);
                } else if (abs(uSimType - 2.0) < 0.2) {
                  // Type 2: Oceanic thermal surge / Marine heatwave (e.g. Bay of Bengal, Mediterranean, Reef)
                  float heatPulse = 0.80 + 0.20 * sin(uCloudOffset * 15.0 - distDeg * 0.6);
                  vec3 thermalOceanGlow = vec3(1.0, 0.25, 0.05) * heatPulse;
                  finalCol = mix(finalCol, finalCol + thermalOceanGlow * 0.90, simMask * waterMask);
                } else if (abs(uSimType - 3.0) < 0.2) {
                  // Type 3: Megadrought / Canopy desiccation (e.g. Amazon megadrought, Sahel)
                  vec3 parchedSoil = vec3(0.52, 0.38, 0.22) * (0.85 + 0.25 * microTerrainNoise);
                  finalCol = mix(finalCol, parchedSoil * (0.70 + 0.30 * sunDiffuse), simMask * landMask * 0.85);
                } else if (abs(uSimType - 4.0) < 0.2) {
                  // Type 4: Volcanic ash / Stratospheric aerosol veil (e.g. Yellowstone, Pinatubo, Afar)
                  float ashPattern = sin(vUv.x * 600.0 + uCloudOffset * 10.0) * cos(vUv.y * 600.0) * 0.5 + 0.5;
                  vec3 ashColor = vec3(0.26, 0.24, 0.22) * (0.85 + 0.30 * ashPattern);
                  finalCol = mix(finalCol, ashColor, simMask * 0.88);
                } else if (abs(uSimType - 5.0) < 0.2) {
                  // Type 5: Biosphere re-greening / Algal bloom (e.g. Sahara re-greening, Baltic Sea)
                  vec3 lushCanopy = vec3(0.10, 0.42, 0.16) * (0.88 + 0.25 * microTerrainNoise);
                  finalCol = mix(finalCol, lushCanopy * (0.75 + 0.30 * sunDiffuse), simMask * landMask * 0.90);
                } else if (abs(uSimType - 6.0) < 0.2) {
                  // Type 6: Inundation deluge / Megaflood (e.g. California ARkStorm, Indus GLOF, Atacama, Sundarbans)
                  vec3 floodTone = vec3(0.06, 0.22, 0.36) * (0.85 + 0.15 * sin(uCloudOffset * 12.0));
                  finalCol = mix(finalCol, floodTone, simMask * landMask * 0.82);
                } else if (abs(uSimType - 7.0) < 0.2) {
                  // Type 7: Toxic dust / Hyper-arid sandstorm plume (e.g. Lake Chad, Sistan Basin, Aral Sea)
                  vec3 toxicDust = vec3(0.85, 0.74, 0.54) * (0.90 + 0.20 * microTerrainNoise);
                  finalCol = mix(finalCol, toxicDust, simMask * 0.82);
                }
              }
            }
`;

if (!code.includes("uSimType - 1.0")) {
  code = code.replace(
    "gl_FragColor = vec4(finalCol, 1.0);",
    simShaderInsert + "\r\n            gl_FragColor = vec4(finalCol, 1.0);"
  );
}

// 11. Add Blizzard / atmospheric vortex in cloudShellMat
const cloudBlizzardInsert = `
            // Dynamic Blizzard & Extreme Synoptic Vortex for Planetary Simulations
            if (uSimIntensity > 0.005 && abs(uSimType - 1.0) < 0.2) {
              float fragLat = (0.5 - vUv.y) * 180.0;
              float fragLon = (vUv.x - 0.5) * 360.0;
              vec2 dSim = vec2(fragLat, fragLon) - uSimCenter;
              float distDeg = length(dSim);
              if (distDeg < uSimRadius * 1.35) {
                float blizzardMask = smoothstep(uSimRadius * 1.35, uSimRadius * 0.25, distDeg) * uSimIntensity;
                float blizzardSpiral = sin(distDeg * 0.55 - uAdvectionTime * 3.5 + atan(dSim.y, dSim.x) * 2.0) * 0.5 + 0.5;
                cloudFragAlpha = max(cloudFragAlpha, blizzardMask * blizzardSpiral * 0.85);
              }
            }
`;

if (!code.includes("blizzardSpiral")) {
  code = code.replace(
    "gl_FragColor = vec4(cloudRgb, cloudFragAlpha);",
    cloudBlizzardInsert + "\r\n            gl_FragColor = vec4(cloudRgb, cloudFragAlpha);"
  );
}

// 12. Update animation loop to drive uSim uniforms
const animUniformUpdate = `
        // Drive Dynamic Planetary Simulation Shader State (30 Possibilities)
        if (activeSimulationRef.current) {
          const sim = activeSimulationRef.current;
          const [simLat, simLon] = sim.shaderParams.center;
          earthSurfaceMat.uniforms.uSimCenter.value.set(simLat, simLon);
          earthSurfaceMat.uniforms.uSimRadius.value = sim.shaderParams.radiusDeg;
          earthSurfaceMat.uniforms.uSimType.value = sim.shaderParams.simulationType;
          earthSurfaceMat.uniforms.uSimIntensity.value +=
            (sim.shaderParams.intensity - earthSurfaceMat.uniforms.uSimIntensity.value) * 0.12;

          cloudShellMat.uniforms.uSimCenter.value.set(simLat, simLon);
          cloudShellMat.uniforms.uSimRadius.value = sim.shaderParams.radiusDeg;
          cloudShellMat.uniforms.uSimType.value = sim.shaderParams.simulationType;
          cloudShellMat.uniforms.uSimIntensity.value = earthSurfaceMat.uniforms.uSimIntensity.value;
        } else {
          earthSurfaceMat.uniforms.uSimIntensity.value +=
            (0.0 - earthSurfaceMat.uniforms.uSimIntensity.value) * 0.12;
          cloudShellMat.uniforms.uSimIntensity.value = earthSurfaceMat.uniforms.uSimIntensity.value;
        }
`;

if (!code.includes("Drive Dynamic Planetary Simulation Shader State")) {
  code = code.replace(
    "earthSurfaceMat.uniforms.uModisTrueColorBlend.value +=",
    animUniformUpdate + "\r\n        earthSurfaceMat.uniforms.uModisTrueColorBlend.value +="
  );
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated EarthGlobeCanvas.tsx!');
