const fs = require('fs');
const canvasPath = 'remix-remix-earthui-designer/src/components/EarthGlobeCanvas.tsx';
let code = fs.readFileSync(canvasPath, 'utf8');

// 1. Fix thermal shader block
const thermalShaderTarget = /if\s*\(uIrThermalMode > 0\.01\)\s*\{[\s\S]*?finalCol = mix\(finalCol, irRgb, uIrThermalMode \* 0\.85\);\s*\}/;
const thermalShaderReplacement = `if (uIrThermalMode > 0.01) {
              // False-color Infrared / Thermal Radiometry Look (VIIRS / Sentinel-3 SLSTR)
              float lum = dot(finalCol, vec3(0.299, 0.587, 0.114));
              vec3 thermalWarm = vec3(1.0, 0.38, 0.10) * smoothstep(0.55, 0.90, lum) * 1.3;
              vec3 thermalCool = vec3(0.04, 0.12, 0.28) * smoothstep(0.35, 0.0, lum);
              vec3 irRgb = mix(finalCol, thermalCool + thermalWarm, 0.65);
              finalCol = mix(finalCol, irRgb, uIrThermalMode);
            }`;

if (thermalShaderTarget.test(code)) {
  code = code.replace(thermalShaderTarget, thermalShaderReplacement);
  console.log('Thermal shader in EarthGlobeCanvas.tsx updated');
} else {
  console.log('Thermal shader target not found');
}

// 2. Fix animation loop reset when chat closes or !isSearchSubmitted
const simLoopTarget = /if\s*\(activeSim\)\s*\{[\s\S]*?cloudShellMat\.uniforms\.uSimIntensity\.value = earthSurfaceMat\.uniforms\.uSimIntensity\.value;\s*\}\s*else\s*\{[\s\S]*?cloudShellMat\.uniforms\.uSimIntensity\.value = earthSurfaceMat\.uniforms\.uSimIntensity\.value;\s*\}/;
const simLoopReplacement = `if (activeSim && isSearchSubmitted) {
          earthSurfaceMat.uniforms.uSimType.value = activeSim.shaderParams.simulationType;
          earthSurfaceMat.uniforms.uSimCenter.value.set(activeSim.target.lat, activeSim.target.lon);
          earthSurfaceMat.uniforms.uSimRadius.value = activeSim.shaderParams.radiusDeg;
          earthSurfaceMat.uniforms.uSimIntensity.value +=
            (activeSim.shaderParams.intensity - earthSurfaceMat.uniforms.uSimIntensity.value) * 0.15;
          cloudShellMat.uniforms.uSimIntensity.value = earthSurfaceMat.uniforms.uSimIntensity.value;
        } else {
          earthSurfaceMat.uniforms.uSimIntensity.value = 0.0;
          cloudShellMat.uniforms.uSimIntensity.value = 0.0;
        }`;

if (simLoopTarget.test(code)) {
  code = code.replace(simLoopTarget, simLoopReplacement);
  console.log('Simulation reset loop in EarthGlobeCanvas.tsx updated');
} else {
  console.log('Simulation reset loop target not found');
}

// 3. Fix targetIr to immediately snap to 0 when !isSearchSubmitted or mode is not VIIRS
const irAnimTarget = /const targetIr = mode === 'VIIRS_NIGHT_THERMAL' \? 1\.0 : 0\.0;\s*earthSurfaceMat\.uniforms\.uIrThermalMode\.value \+=[\s\S]*?\(targetIr - earthSurfaceMat\.uniforms\.uIrThermalMode\.value\) \* 0\.15;/;
const irAnimReplacement = `const targetIr = (mode === 'VIIRS_NIGHT_THERMAL' && isSearchSubmitted) ? 1.0 : 0.0;
        if (targetIr === 0.0) {
          earthSurfaceMat.uniforms.uIrThermalMode.value = 0.0;
        } else {
          earthSurfaceMat.uniforms.uIrThermalMode.value +=
            (targetIr - earthSurfaceMat.uniforms.uIrThermalMode.value) * 0.25;
        }`;

if (irAnimTarget.test(code)) {
  code = code.replace(irAnimTarget, irAnimReplacement);
  console.log('IR thermal mode animation in EarthGlobeCanvas.tsx updated');
} else {
  console.log('IR thermal mode animation target not found');
}

fs.writeFileSync(canvasPath, code, 'utf8');
