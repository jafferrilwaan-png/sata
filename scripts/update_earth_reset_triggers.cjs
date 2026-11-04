const fs = require('fs');
const appPath = 'remix-remix-earthui-designer/src/App.tsx';
let code = fs.readFileSync(appPath, 'utf8');

// 1. In onClose of MetaDeepIntelligenceConsole
const onCloseTarget = /onClose=\{\(\) => \{[\s\S]*?globeRef\.current\?\.pointOfView\(\{ lat: 20, lng: 78, altitude: 2\.4, label: 'Overview' \}, 2000\);\s*\}\}/;
const onCloseReplacement = `onClose={() => {
                    setIsSearchSubmitted(false);
                    setSearchQuery('');
                    setLiveAiDispatchState(null);
                    setSelectedHotspotId(null);
                    setAgentInsightOverride(null);
                    setActiveLayerMode('MODIS_TRUE_COLOR_TERRAIN');
                    setActiveSimulation(null);
                    globeRef.current?.pointOfView({ lat: 20, lng: 78, altitude: 2.4, label: 'Overview' }, 1800);
                  }}`;

if (onCloseTarget.test(code)) {
  code = code.replace(onCloseTarget, onCloseReplacement);
  console.log('onClose reset updated in App.tsx');
} else {
  console.log('onClose target not found');
}

// 2. In HOME tab click
const homeTabTarget = /if\s*\(tab === 'HOME'\)\s*\{[\s\S]*?globeRef\.current\?\.pointOfView\(\{ lat: 20, lng: 0, altitude: 2\.8 \}, 1200\);\s*\}/;
const homeTabReplacement = `if (tab === 'HOME') {
              setSelectedHotspotId(null);
              setZoomSectorId(null);
              setZoomTelemetryCoords(null);
              setSearchQuery('');
              setCustomGeocodedPlace(null);
              setIsSearchSubmitted(false);
              setLiveAiDispatchState(null);
              setAgentInsightOverride(null);
              setActiveLayerMode('MODIS_TRUE_COLOR_TERRAIN');
              setActiveSimulation(null);
              globeRef.current?.pointOfView({ lat: 20, lng: 78, altitude: 2.4, label: 'Overview' }, 1500);
            }`;

if (homeTabTarget.test(code)) {
  code = code.replace(homeTabTarget, homeTabReplacement);
  console.log('HOME tab reset updated in App.tsx');
} else {
  console.log('HOME tab target not found');
}

// 3. In Search bar reset icon click
const searchResetTarget = /onClick=\{\(e\) => \{[\s\S]*?globeRef\.current\?\.pointOfView\(\{ lat: 20, lng: 78, altitude: 2\.4, label: 'Overview' \}, 2000\);\s*\}\}/;
const searchResetReplacement = `onClick={(e) => {
            e.stopPropagation();
            setIsSearchSubmitted(false);
            setSearchQuery('');
            setLiveAiDispatchState(null);
            setSelectedHotspotId(null);
            setAgentInsightOverride(null);
            setActiveLayerMode('MODIS_TRUE_COLOR_TERRAIN');
            setActiveSimulation(null);
            globeRef.current?.pointOfView({ lat: 20, lng: 78, altitude: 2.4, label: 'Overview' }, 1800);
          }}`;

if (searchResetTarget.test(code)) {
  code = code.replace(searchResetTarget, searchResetReplacement);
  console.log('Search reset button updated in App.tsx');
} else {
  console.log('Search reset button target not found');
}

fs.writeFileSync(appPath, code, 'utf8');
