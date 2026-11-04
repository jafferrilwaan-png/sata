const fs = require('fs');
const path = require('path');

const canvasPath = path.resolve('remix-remix-earthui-designer/src/components/EarthGlobeCanvas.tsx');
let c = fs.readFileSync(canvasPath, 'utf8');

// 1. Replace the unnatural green canopy hue and land color distortion with pure NASA True Color
const oldLandShader = /float canopyMask = clamp\(\(dayCol\.b - dayCol\.r\) \* 6\.0, 0\.0, 1\.0\) \* landMask;[\s\S]*?finalCol = mix\(finalCol, daySurfaceLand, effectiveDayMix \* landMask\);/;

const newLandShader = `// Pure Photorealistic NASA Blue Marble True-Color Land Rendering
              float solarLandIllum = 0.65 + 0.45 * pow(sunDiffuse, 0.70);
              vec3 sunlitTerrain = dayCol * displacedRelief * solarLandIllum;
              vec3 nightSurfaceLand = dayCol * displacedRelief * 0.25 + goldLight * 0.15;
              vec3 daySurfaceLand = mix(nightSurfaceLand, sunlitTerrain, realTimeDaylight);
              finalCol = mix(finalCol, daySurfaceLand, effectiveDayMix * landMask);`;

if (oldLandShader.test(c)) {
  c = c.replace(oldLandShader, newLandShader);
  console.log('SUCCESS: Restored authentic NASA Blue Marble true-color land rendering!');
} else {
  console.log('WARN: oldLandShader not matched!');
}

// 2. Make IR thermal mode subtle and localized, NOT an orange blaster that turns whole deserts orange
const oldIrShader = /if \(uIrThermalMode > 0\.01\) \{\s*\/\/\s*False-color Infrared[\s\S]*?finalCol = mix\(finalCol, irRgb, uIrThermalMode\);\s*\}/;
const newIrShader = `if (uIrThermalMode > 0.01) {
              // Subtle False-Color Infrared / Thermal Radiometry (VIIRS / Sentinel-3 SLSTR)
              float lum = dot(finalCol, vec3(0.299, 0.587, 0.114));
              vec3 thermalWarm = vec3(1.0, 0.45, 0.15) * smoothstep(0.75, 0.98, lum) * 0.65;
              vec3 thermalCool = vec3(0.04, 0.10, 0.20) * smoothstep(0.25, 0.0, lum);
              vec3 irRgb = mix(finalCol, thermalCool + thermalWarm, 0.45);
              finalCol = mix(finalCol, irRgb, uIrThermalMode * 0.50);
            }`;

if (oldIrShader.test(c)) {
  c = c.replace(oldIrShader, newIrShader);
  console.log('SUCCESS: Softened IR shader to eliminate extreme orange blaster!');
} else {
  console.log('WARN: oldIrShader not matched!');
}

fs.writeFileSync(canvasPath, c, 'utf8');
console.log('EarthGlobeCanvas True Color Shader applied!');
