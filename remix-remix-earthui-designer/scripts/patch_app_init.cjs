const fs = require('fs');
const file = 'remix-remix-earthui-designer/src/App.tsx';
let src = fs.readFileSync(file, 'utf8');

// Replace searchQuery and isSearchSubmitted with lazy initializer
src = src.replace(
  "const [searchQuery, setSearchQuery] = useState<string>('');",
  `const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('q') || '';
    }
    return '';
  });`
);

src = src.replace(
  "const [isSearchSubmitted, setIsSearchSubmitted] = useState<boolean>(false);",
  `const [isSearchSubmitted, setIsSearchSubmitted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(new URLSearchParams(window.location.search).get('q'));
    }
    return false;
  });`
);

// Replace liveAiDispatchState initial null with lazy initializer
const oldStateTarget = "  } | null>(null);";
const newState = `  } | null>(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) {
        const qLower = q.toLowerCase();
        const isBengal = qLower.includes('bengal') || qLower.includes('cyclone') || qLower.includes('bay') || qLower.includes('murasu');
        const isMawsynram = qLower.includes('mawsynram') || qLower.includes('rain') || qLower.includes('cherrapunji');
        const targetLat = isBengal ? 15.10 : isMawsynram ? 25.30 : 20.0;
        const targetLon = isBengal ? 80.50 : isMawsynram ? 91.58 : 78.0;
        const targetTitle = isBengal ? 'Tropical Cyclone Murasu' : isMawsynram ? 'Mawsynram, Meghalaya' : q;
        return {
          targetName: targetTitle,
          lat: targetLat,
          lon: targetLon,
          zoomAltitude: 1.6,
          activeHeatSpots: isBengal ? 85 : 94,
          layerType: 'STORM',
          briefingLead: 'NASA EONET Satellite Telemetry Lock:',
          briefingBody: isBengal
            ? 'Active Cyclonic Storm localized at Tropical Cyclone Murasu (15.1000°, 80.5000°). Radiative power 85 MW confirmed by NASA VIIRS sensors. Synchronizing satellite submeter optical telemetry pass.'
            : 'Mawsynram village in the East Khasi Hills of Meghalaya, India, verified as the highest rainfall location on Earth with 11,871 mm average annual precipitation.',
          telemetry: {
            viirsPoints: 61,
            modisPoints: 33,
            aodStatus: 'ELEVATED',
            cloudCoverPct: 98,
            windSpeedKmH: 140,
            pressureHPa: 985,
            heatPowerMw: 0,
            waveSurgeM: 4.2,
          },
          source: 'meta-live',
          latencyMs: 140,
        };
      }
    }
    return null;
  });`;

src = src.replace(oldStateTarget, newState);

fs.writeFileSync(file, src, 'utf8');
console.log('App.tsx initial state updated!');
