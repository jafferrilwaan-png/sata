const fs = require('fs');
let code = fs.readFileSync('remix-remix-earthui-designer/src/App.tsx', 'utf8');

const regex = /if\s*\(isRainOrStorm\)\s*\{[\s\S]*?setActiveLayerMode\('HYBRID_ALL_LAYERS'\);\s*\}/;

const replacement = `const userWantsThermal = isFire || qLower.includes('thermal') || qLower.includes('infrared');
          if (userWantsThermal) {
            setActiveLayerMode('VIIRS_NIGHT_THERMAL');
          } else if (isRainOrStorm || payload.layerType === 'STORM') {
            setActiveLayerMode('ATMOSPHERIC_AOD_CLOUDS');
          } else if (isTsunami || payload.layerType === 'CRYO') {
            setActiveLayerMode('HYBRID_ALL_LAYERS');
          } else {
            setActiveLayerMode('MODIS_TRUE_COLOR_TERRAIN');
          }`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('remix-remix-earthui-designer/src/App.tsx', code, 'utf8');
  console.log('App.tsx layer mode regex replace SUCCESS');
} else {
  console.log('App.tsx regex FAILED');
}
