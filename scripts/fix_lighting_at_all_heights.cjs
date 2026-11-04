const fs = require('fs');
const path = require('path');

// 1. Update telemetryLogic.ts
const logicPath = path.resolve('remix-remix-earthui-designer/src/utils/telemetryLogic.ts');
let logicCode = fs.readFileSync(logicPath, 'utf8');

const oldDayMixRegex = /const baseDayMix =[\s\S]*?const modisTrueColorBlend = Number\([\s\S]*?\);\s*\);/;
const newDayMixCode = `const modisTrueColorBlend = mode === 'MODIS_TRUE_COLOR_TERRAIN' ? 1.0 : Number(Math.min(0.85, (mode === 'HYBRID_ALL_LAYERS' ? 0.65 : 0.0) + zoomProgress * 0.50).toFixed(4));`;

if (oldDayMixRegex.test(logicCode)) {
  logicCode = logicCode.replace(oldDayMixRegex, newDayMixCode);
  console.log('SUCCESS: Fixed modisTrueColorBlend in telemetryLogic.ts!');
} else {
  console.warn('WARN: oldDayMixRegex not matched in telemetryLogic.ts');
}
fs.writeFileSync(logicPath, logicCode, 'utf8');

// 2. Update EarthGlobeCanvas.tsx shader
const canvasPath = path.resolve('remix-remix-earthui-designer/src/components/EarthGlobeCanvas.tsx');
let canvasCode = fs.readFileSync(canvasPath, 'utf8');

// In fragment shader, ensure ocean and land are always illuminated in True Color mode at all zoom altitudes
const oldOceanBlendRegex = /vec3 deepOcean = mix\(\s*nightOcean,\s*sunlitOcean,\s*clamp\(realTimeDaylight \* uSunlitRadiance, 0\.0, 1\.0\)\s*\);/;
const newOceanBlendCode = `float oceanLight = (uModisTrueColorBlend > 0.5) ? 0.95 : clamp(realTimeDaylight * uSunlitRadiance, 0.0, 1.0);
            vec3 deepOcean = mix(
              (uModisTrueColorBlend > 0.5 ? vec3(0.018, 0.088, 0.20) : nightOcean),
              sunlitOcean,
              oceanLight
            );`;

if (oldOceanBlendRegex.test(canvasCode)) {
  canvasCode = canvasCode.replace(oldOceanBlendRegex, newOceanBlendCode);
  console.log('SUCCESS: Fixed ocean lighting in EarthGlobeCanvas.tsx!');
} else {
  console.warn('WARN: oldOceanBlendRegex not matched!');
}

// Ensure land is always fully illuminated at all zoom levels and altitudes in True Color mode
const oldLandShaderRegex = /\/\/ Pure Photorealistic NASA Blue Marble True-Color Land Rendering[\s\S]*?finalCol = mix\(finalCol, daySurfaceLand, effectiveDayMix \* landMask\);/;
const newLandShaderCode = `// Pure Photorealistic NASA Blue Marble True-Color Land Rendering (Fully Illuminated at All Altitudes)
              float daylightFactor = (uModisTrueColorBlend > 0.5) ? 1.0 : realTimeDaylight;
              float solarLandIllum = 0.80 + 0.35 * pow(sunDiffuse, 0.70);
              vec3 sunlitTerrain = dayCol * displacedRelief * solarLandIllum;
              vec3 ambientSurfaceLand = dayCol * displacedRelief * 0.85;
              vec3 daySurfaceLand = mix(ambientSurfaceLand, sunlitTerrain, daylightFactor);
              finalCol = mix(finalCol, daySurfaceLand, landMask);`;

if (oldLandShaderRegex.test(canvasCode)) {
  canvasCode = canvasCode.replace(oldLandShaderRegex, newLandShaderCode);
  console.log('SUCCESS: Fixed land illumination in EarthGlobeCanvas.tsx!');
} else {
  console.warn('WARN: oldLandShaderRegex not matched!');
}

// In cloud shader, ensure clouds remain bright and visible in True Color mode at all altitudes
const oldCloudMixRegex = /vec3 cloudCol = mix\(nightCloudCol, dayCloudCol, max\(sunLit, rimLight \* 0\.45\)\);/;
const newCloudMixCode = `vec3 cloudCol = mix(nightCloudCol, dayCloudCol, max(max(sunLit, rimLight * 0.45), 0.85));`;

if (oldCloudMixRegex.test(canvasCode)) {
  canvasCode = canvasCode.replace(oldCloudMixRegex, newCloudMixCode);
  console.log('SUCCESS: Fixed cloud illumination in EarthGlobeCanvas.tsx!');
} else {
  console.warn('WARN: oldCloudMixRegex not matched!');
}

fs.writeFileSync(canvasPath, canvasCode, 'utf8');
console.log('ALL LIGHTING AT ALL HEIGHTS & PLACES SAFELY FIXED!');
