const fs = require('fs');
const path = require('path');

const appPath = path.resolve('remix-remix-earthui-designer/src/App.tsx');
let code = fs.readFileSync(appPath, 'utf8');

// 1. Fix pointsData in EarthGlobeCanvas: only show points when activeLayerMode === 'VIIRS_NIGHT_THERMAL'
const oldPoints = /pointsData=\{\s*liveFirmsPoints\.length > 0\s*\?\s*liveFirmsPoints\s*:\s*temporalState\.modulatedFirmsPoints\s*\}/;
const newPoints = `pointsData={
            activeLayerMode === 'VIIRS_NIGHT_THERMAL'
              ? (liveFirmsPoints.length > 0
                  ? liveFirmsPoints
                  : temporalState.modulatedFirmsPoints)
              : []
          }`;

if (oldPoints.test(code)) {
  code = code.replace(oldPoints, newPoints);
  console.log('SUCCESS: Updated pointsData to only render in VIIRS_NIGHT_THERMAL mode!');
} else {
  console.warn('WARN: oldPoints pattern not matched, checking if already updated...');
}

// 2. Fix currentDisplayedIncidents to ALWAYS use genuine NASA EONET incidents (never fake search queries)
const oldIncidentsPattern = /const currentDisplayedIncidents = useMemo\(\(\) => \{[\s\S]*?return liveIncidents;\s*\}, \[liveIncidents, liveAiDispatchState\]\);/;

const newIncidentsCode = `const currentDisplayedIncidents = useMemo(() => {
    if (!liveIncidents || liveIncidents.length === 0) return [];
    if (liveAiDispatchState && typeof liveAiDispatchState.lat === 'number' && typeof liveAiDispatchState.lon === 'number') {
      const targetLat = liveAiDispatchState.lat;
      const targetLon = liveAiDispatchState.lon;
      const q = (liveAiDispatchState.targetName || '').toLowerCase();
      // Sort real NASA EONET incidents: matching/nearest incidents prioritized
      return [...liveIncidents].sort((a, b) => {
        const aMatches = a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
        const bMatches = b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        const distA = a.coordinates ? Math.hypot(a.coordinates[0] - targetLat, a.coordinates[1] - targetLon) : 999;
        const distB = b.coordinates ? Math.hypot(b.coordinates[0] - targetLat, b.coordinates[1] - targetLon) : 999;
        return distA - distB;
      });
    }
    return liveIncidents;
  }, [liveIncidents, liveAiDispatchState]);`;

if (oldIncidentsPattern.test(code)) {
  code = code.replace(oldIncidentsPattern, newIncidentsCode);
  console.log('SUCCESS: Updated currentDisplayedIncidents to always preserve real NASA EONET hazards!');
} else {
  console.warn('WARN: oldIncidentsPattern not matched!');
}

// 3. Fix floating console max-height to avoid any collision with bottom cards
const oldConsoleClass = /className="fixed left-3 sm:left-6 top-\[68px\] z-30 pointer-events-auto w-\[clamp\(320px,36vw,500px\)\] max-h-\[calc\(100vh-230px\)\] flex flex-col shadow-\[0_24px_70px_rgba\(0,0,0,0\.8\)\]"/;

const newConsoleClass = `className="fixed left-3 sm:left-6 top-[68px] z-30 pointer-events-auto w-[clamp(300px,34vw,460px)] max-h-[clamp(300px,46vh,440px)] flex flex-col shadow-[0_24px_70px_rgba(0,0,0,0.8)]"`;

if (oldConsoleClass.test(code)) {
  code = code.replace(oldConsoleClass, newConsoleClass);
  console.log('SUCCESS: Adjusted console max-height to avoid bottom card collision!');
} else {
  console.warn('WARN: oldConsoleClass pattern not matched!');
}

fs.writeFileSync(appPath, code, 'utf8');
console.log('ALL APP.TSX FIXES WRITTEN!');
