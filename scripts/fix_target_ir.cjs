const fs = require('fs');
const p = 'd:/GAME/remix-remix-earthui-designer/src/components/EarthGlobeCanvas.tsx';
let c = fs.readFileSync(p, 'utf8');

const targetStr = `        // Smooth GPU False-Color Infrared / Thermal Radiometry transition (VIIRS / Sentinel-3 SLSTR)
        const targetIr = (mode === 'VIIRS_NIGHT_THERMAL' && isSearchSubmitted) ? 1.0 : 0.0;
        if (targetIr === 0.0) {
          earthSurfaceMat.uniforms.uIrThermalMode.value = 0.0;
        } else {
          earthSurfaceMat.uniforms.uIrThermalMode.value +=
            (targetIr - earthSurfaceMat.uniforms.uIrThermalMode.value) * 0.25;
        }`;

const replStr = `        // Smooth GPU False-Color Infrared / Thermal Radiometry transition (VIIRS / Sentinel-3 SLSTR)
        const targetIr = (mode === 'VIIRS_NIGHT_THERMAL') ? 1.0 : 0.0;
        earthSurfaceMat.uniforms.uIrThermalMode.value +=
          (targetIr - earthSurfaceMat.uniforms.uIrThermalMode.value) * 0.20;
        if (cloudShellMat?.uniforms?.uIrThermalMode) {
          cloudShellMat.uniforms.uIrThermalMode.value = earthSurfaceMat.uniforms.uIrThermalMode.value;
        }

        // Smooth GPU Doppler Weather Radar Composite Reflectivity transition
        const targetRadar = (mode === 'ATMOSPHERIC_AOD_CLOUDS') ? 1.0 : 0.0;
        earthSurfaceMat.uniforms.uRadarMode.value +=
          (targetRadar - earthSurfaceMat.uniforms.uRadarMode.value) * 0.20;
        if (cloudShellMat?.uniforms?.uRadarMode) {
          cloudShellMat.uniforms.uRadarMode.value = earthSurfaceMat.uniforms.uRadarMode.value;
        }`;

c = c.replace(targetStr.replace(/\r\n/g, '\n'), replStr);
c = c.replace(targetStr.replace(/\n/g, '\r\n'), replStr.replace(/\n/g, '\r\n'));

// Also adjust HUD banner position to top-16 sm:top-[72px]
c = c.replace(/absolute top-4 left-1\/2/g, 'absolute top-16 sm:top-[72px] left-1/2');

fs.writeFileSync(p, c, 'utf8');
console.log('Fixed animate loop targetIr and HUD positioning!');
