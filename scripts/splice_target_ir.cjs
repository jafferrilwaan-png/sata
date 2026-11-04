const fs = require('fs');
const p = 'd:/GAME/remix-remix-earthui-designer/src/components/EarthGlobeCanvas.tsx';
const lines = fs.readFileSync(p, 'utf8').split('\n');

const idx = lines.findIndex(l => l.includes("const targetIr = (mode === 'VIIRS_NIGHT_THERMAL' && isSearchSubmitted)"));
console.log('Found targetIr at line:', idx);

if (idx !== -1) {
  // Find where this block ends (around idx + 6)
  let endIdx = idx;
  while (endIdx < lines.length && !lines[endIdx].includes('highResAlpha')) {
    endIdx++;
  }
  console.log('Replacing from', idx, 'to', endIdx);
  const newLines = [
    "        // Smooth GPU False-Color Infrared / Thermal Radiometry transition (VIIRS / Sentinel-3 SLSTR)",
    "        const targetIr = (mode === 'VIIRS_NIGHT_THERMAL') ? 1.0 : 0.0;",
    "        earthSurfaceMat.uniforms.uIrThermalMode.value +=",
    "          (targetIr - earthSurfaceMat.uniforms.uIrThermalMode.value) * 0.20;",
    "        if (cloudShellMat?.uniforms?.uIrThermalMode) {",
    "          cloudShellMat.uniforms.uIrThermalMode.value = earthSurfaceMat.uniforms.uIrThermalMode.value;",
    "        }",
    "",
    "        // Smooth GPU Doppler Weather Radar Composite Reflectivity transition",
    "        const targetRadar = (mode === 'ATMOSPHERIC_AOD_CLOUDS') ? 1.0 : 0.0;",
    "        earthSurfaceMat.uniforms.uRadarMode.value +=",
    "          (targetRadar - earthSurfaceMat.uniforms.uRadarMode.value) * 0.20;",
    "        if (cloudShellMat?.uniforms?.uRadarMode) {",
    "          cloudShellMat.uniforms.uRadarMode.value = earthSurfaceMat.uniforms.uRadarMode.value;",
    "        }",
    "",
    "        // Drive high-resolution satellite alpha as camera approaches Earth"
  ];
  lines.splice(idx - 1, (endIdx - idx) + 2, ...newLines);
  fs.writeFileSync(p, lines.join('\n'), 'utf8');
  console.log('Successfully spliced animate loop targetIr and targetRadar!');
} else {
  console.error('targetIr not found!');
}
