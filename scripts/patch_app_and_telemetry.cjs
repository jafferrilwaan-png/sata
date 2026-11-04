const fs = require('fs');

console.log('=== UPDATING App.tsx and telemetryLogic.ts FOR GREENER & COMPARISONS ===');

// 1. telemetryLogic.ts
const tlPath = 'd:/GAME/remix-remix-earthui-designer/src/utils/telemetryLogic.ts';
let tl = fs.readFileSync(tlPath, 'utf8');

const oldParseLayer = `  if (
    q.includes('true color') ||
    q.includes('terrain') ||
    q.includes('topograph') ||
    q.includes('blue marble')
  ) {
    return 'MODIS_TRUE_COLOR_TERRAIN';
  }`;

const newParseLayer = `  if (q.includes('greener') || q.includes('green') || q.includes('vegetation') || q.includes('ndvi') || q.includes('chlorophyll')) {
    return 'NDVI_VEGETATION';
  }
  if (q.includes('sar') || q.includes('radar microwave') || q.includes('microwave') || q.includes('risat')) {
    return 'SAR_MICROWAVE';
  }
  if (
    q.includes('true color') ||
    q.includes('terrain') ||
    q.includes('topograph') ||
    q.includes('blue marble')
  ) {
    return 'MODIS_TRUE_COLOR_TERRAIN';
  }`;

if (tl.includes(oldParseLayer)) {
  tl = tl.replace(oldParseLayer, newParseLayer);
  fs.writeFileSync(tlPath, tl, 'utf8');
  console.log('✅ Updated parseLayerModeFromQuery in telemetryLogic.ts');
}

// 2. App.tsx
const appPath = 'd:/GAME/remix-remix-earthui-designer/src/App.tsx';
let app = fs.readFileSync(appPath, 'utf8');

const oldGeoDef = `  const wantsOpticalOr3D = qLower.includes('high-res') || qLower.includes('high res') || qLower.includes('optical') || qLower.includes('3d') || qLower.includes('resolution') || qLower.includes('zoom') || qLower.includes('close') || qLower.includes('detail') || qLower.includes('pass') || qLower.includes('see');
  const wantsThermal = qLower.includes('thermal') || qLower.includes('fire') || qLower.includes('heat') || qLower.includes('ir') || qLower.includes('infrared');
  const wantsWeather = qLower.includes('radar') || qLower.includes('weather') || qLower.includes('rain') || qLower.includes('storm') || qLower.includes('cyclone') || qLower.includes('cloud');
  const defaultLayer = wantsThermal ? 'VIIRS_NIGHT_THERMAL' : wantsWeather ? 'ATMOSPHERIC_AOD_CLOUDS' : 'MODIS_TRUE_COLOR_TERRAIN';`;

const newGeoDef = `  const wantsOpticalOr3D = qLower.includes('high-res') || qLower.includes('high res') || qLower.includes('optical') || qLower.includes('3d') || qLower.includes('resolution') || qLower.includes('zoom') || qLower.includes('close') || qLower.includes('detail') || qLower.includes('pass') || qLower.includes('see');
  const wantsThermal = qLower.includes('thermal') || qLower.includes('fire') || qLower.includes('heat') || qLower.includes('ir') || qLower.includes('infrared') || qLower.includes('temperature') || qLower.includes('temp');
  const wantsWeather = qLower.includes('radar') || qLower.includes('weather') || qLower.includes('rain') || qLower.includes('storm') || qLower.includes('cyclone') || qLower.includes('cloud');
  const wantsGreen = qLower.includes('greener') || qLower.includes('green') || qLower.includes('vegetation') || qLower.includes('ndvi') || qLower.includes('chlorophyll');
  const defaultLayer = wantsGreen ? 'NDVI_VEGETATION' : wantsThermal ? 'VIIRS_NIGHT_THERMAL' : wantsWeather ? 'ATMOSPHERIC_AOD_CLOUDS' : 'MODIS_TRUE_COLOR_TERRAIN';`;

if (app.includes(oldGeoDef)) {
  app = app.replace(oldGeoDef, newGeoDef);
}

const compareSnippet = `  if (qLower.includes('bay of bengal') && qLower.includes('chennai')) {
    return { name: 'Bay of Bengal vs Chennai', lat: 13.80, lon: 83.20, altitude: 1.45, layer: 'VIIRS_NIGHT_THERMAL' };
  }\n`;

if (!app.includes('Bay of Bengal vs Chennai')) {
  app = app.replace(
    "  if (qLower.includes('tamil nadu')",
    compareSnippet + "  if (qLower.includes('tamil nadu')"
  );
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('✅ Updated App.tsx with Bay of Bengal vs Chennai and greener/NDVI support!');
