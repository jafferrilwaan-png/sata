const fs = require('fs');

const p = 'd:/GAME/remix-remix-earthui-designer/src/App.tsx';
let c = fs.readFileSync(p, 'utf8');

// 1. Add resolveTargetGeospatial before export default function App()
const helperCode = `export function resolveTargetGeospatial(query: string): { name: string; lat: number; lon: number; altitude: number; layer: string } | null {
  const qLower = query.toLowerCase();
  const wantsOpticalOr3D = qLower.includes('high-res') || qLower.includes('high res') || qLower.includes('optical') || qLower.includes('3d') || qLower.includes('resolution') || qLower.includes('zoom') || qLower.includes('close') || qLower.includes('detail') || qLower.includes('pass') || qLower.includes('see');
  const wantsThermal = qLower.includes('thermal') || qLower.includes('fire') || qLower.includes('heat') || qLower.includes('ir') || qLower.includes('infrared');
  const wantsWeather = qLower.includes('radar') || qLower.includes('weather') || qLower.includes('rain') || qLower.includes('storm') || qLower.includes('cyclone') || qLower.includes('cloud');
  const defaultLayer = wantsThermal ? 'VIIRS_NIGHT_THERMAL' : wantsWeather ? 'ATMOSPHERIC_AOD_CLOUDS' : 'MODIS_TRUE_COLOR_TERRAIN';
  const defaultAlt = wantsOpticalOr3D ? 1.28 : 1.35;

  if (qLower.includes('tamil nadu') || qLower.includes('tamilnadu') || qLower.includes('tamild nadu')) {
    return { name: 'Tamil Nadu, India', lat: 11.13, lon: 78.66, altitude: 1.25, layer: defaultLayer };
  }
  if (qLower.includes('chennai')) {
    return { name: 'Chennai, Tamil Nadu', lat: 13.08, lon: 80.27, altitude: 1.25, layer: defaultLayer };
  }
  if (qLower.includes('delhi')) {
    return { name: 'New Delhi, India', lat: 28.61, lon: 77.21, altitude: 1.25, layer: defaultLayer };
  }
  if (qLower.includes('mumbai') || qLower.includes('bombay')) {
    return { name: 'Mumbai, Maharashtra', lat: 19.07, lon: 72.88, altitude: 1.25, layer: defaultLayer };
  }
  if (qLower.includes('bengaluru') || qLower.includes('bangalore')) {
    return { name: 'Bengaluru, Karnataka', lat: 12.97, lon: 77.59, altitude: 1.25, layer: defaultLayer };
  }
  if (qLower.includes('kolkata') || qLower.includes('calcutta')) {
    return { name: 'Kolkata, West Bengal', lat: 22.57, lon: 88.36, altitude: 1.25, layer: defaultLayer };
  }
  if (qLower.includes('mawsynram') || qLower.includes('cherrapunji') || qLower.includes('meghalaya') || qLower.includes('wettest')) {
    return { name: 'Mawsynram, Meghalaya', lat: 25.30, lon: 91.58, altitude: 1.28, layer: wantsWeather ? 'ATMOSPHERIC_AOD_CLOUDS' : defaultLayer };
  }
  if (qLower.includes('india') || qLower.includes('indian')) {
    return { name: 'India', lat: 20.59, lon: 78.96, altitude: wantsOpticalOr3D ? 1.28 : 1.35, layer: defaultLayer };
  }
  if (qLower.includes('sydney') || qLower.includes('australia')) {
    return { name: 'Sydney, Australia', lat: -33.86, lon: 151.21, altitude: 1.28, layer: defaultLayer };
  }
  if (qLower.includes('tokyo') || qLower.includes('japan')) {
    return { name: 'Tokyo, Japan', lat: 35.68, lon: 139.69, altitude: 1.28, layer: defaultLayer };
  }
  if (qLower.includes('london') || qLower.includes('united kingdom') || qLower.includes('uk')) {
    return { name: 'London, United Kingdom', lat: 51.50, lon: -0.12, altitude: 1.28, layer: defaultLayer };
  }
  if (qLower.includes('paris') || qLower.includes('france')) {
    return { name: 'Paris, France', lat: 48.85, lon: 2.35, altitude: 1.28, layer: defaultLayer };
  }
  if (qLower.includes('new york') || qLower.includes('nyc')) {
    return { name: 'New York City, USA', lat: 40.71, lon: -74.00, altitude: 1.28, layer: defaultLayer };
  }
  if (qLower.includes('kennedy') || qLower.includes('cape canaveral') || qLower.includes('florida')) {
    return { name: 'Kennedy Space Center, Florida', lat: 28.57, lon: -80.65, altitude: 1.30, layer: defaultLayer };
  }
  if (qLower.includes('california')) {
    return { name: 'California, USA', lat: 36.77, lon: -119.41, altitude: 1.32, layer: defaultLayer };
  }
  if (qLower.includes('manaus') || qLower.includes('amazon') || qLower.includes('brazil')) {
    return { name: 'Manaus, Amazon Basin, Brazil', lat: -3.12, lon: -60.02, altitude: 1.30, layer: defaultLayer };
  }
  if (qLower.includes('dubai') || qLower.includes('uae')) {
    return { name: 'Dubai, UAE', lat: 25.20, lon: 55.27, altitude: 1.28, layer: defaultLayer };
  }
  if (qLower.includes('singapore')) {
    return { name: 'Singapore', lat: 1.35, lon: 103.82, altitude: 1.25, layer: defaultLayer };
  }
  if (qLower.includes('bay of bengal') || qLower.includes('bengal')) {
    return { name: 'Bay of Bengal Cyclonic Basin', lat: 14.80, lon: 88.50, altitude: 1.38, layer: 'ATMOSPHERIC_AOD_CLOUDS' };
  }
  return null;
}
`;

if (!c.includes('export function resolveTargetGeospatial')) {
  c = c.replace('export default function App() {', helperCode + '\nexport default function App() {');
  console.log('✅ Added resolveTargetGeospatial to App.tsx');
}

// 2. Fix telemetry access in lines 698, 705, 713
c = c.replace(
  'valueText: `${liveAiDispatchState.telemetry.viirsPoints} points`,',
  'valueText: `${liveAiDispatchState.telemetry?.viirsPoints ?? 0} points`,'
);

c = c.replace(
  'valueText: `${liveAiDispatchState.telemetry.modisPoints} points`,',
  'valueText: `${liveAiDispatchState.telemetry?.modisPoints ?? 0} points`,'
);

c = c.replace(
  'statusText: (liveAiDispatchState.telemetry.aodStatus as any) || \'STABLE\',',
  'statusText: (liveAiDispatchState.telemetry?.aodStatus as any) || \'STABLE\','
);

// 3. Fix telemetry fallback in onNavigateTo
const oldNavFallback = `lat,
                            lon,
                            zoomAltitude: altitude || 1.8,
                            layerType: 'ORBITAL',`;

const newNavFallback = `lat,
                            lon,
                            zoomAltitude: altitude || 1.28,
                            layerType: 'MODIS_TRUE_COLOR_TERRAIN',
                            telemetry: {
                              viirsPoints: 0,
                              modisPoints: 0,
                              aodStatus: 'STABLE',
                              cloudCoverPct: 0,
                            },`;

if (c.includes(oldNavFallback)) {
  c = c.replace(oldNavFallback, newNavFallback);
  console.log('✅ Fixed onNavigateTo telemetry fallback in App.tsx');
}

fs.writeFileSync(p, c, 'utf8');
console.log('✅ App.tsx fully patched and safe!');
