const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'remix-remix-earthui-designer', 'src', 'App.tsx');
let code = fs.readFileSync(appPath, 'utf8');

// 1. Add imports
if (!code.includes("import PlanetarySimulationModal")) {
  code = code.replace(
    "import Galaxy from './components/Galaxy';",
    "import Galaxy from './components/Galaxy';\r\nimport PlanetarySimulationModal from './components/PlanetarySimulationModal';\r\nimport { PLANETARY_SIMULATIONS_CATALOG, findPlanetarySimulation, type PlanetarySimulationScenario } from './data/planetarySimulations';"
  );
}

// 2. Fix activeLayerMode default
code = code.replace(
  "useState<NasaGibsLayerMode>('VIIRS_NIGHT_THERMAL');",
  "useState<NasaGibsLayerMode>('MODIS_TRUE_COLOR_TERRAIN');"
);

// 3. Fix customGeocodedPlace initial state
const oldCustomGeocoded = `  const [customGeocodedPlace, setCustomGeocodedPlace] = useState<{
    name: string;
    region: string;
    lat: number;
    lon: number;
  } | null>(() => {
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

const newCustomGeocoded = `  const [customGeocodedPlace, setCustomGeocodedPlace] = useState<{
    name: string;
    region: string;
    lat: number;
    lon: number;
  } | null>(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) {
        const qLower = q.toLowerCase();
        const isBengal = qLower.includes('bengal') || qLower.includes('cyclone') || qLower.includes('bay') || qLower.includes('murasu');
        const isMawsynram = qLower.includes('mawsynram') || qLower.includes('rain') || qLower.includes('cherrapunji');
        const isThar = qLower.includes('thar') || qLower.includes('snow');
        const targetLat = isBengal ? 15.10 : isMawsynram ? 25.30 : isThar ? 27.02 : 20.0;
        const targetLon = isBengal ? 80.50 : isMawsynram ? 91.58 : isThar ? 71.75 : 78.0;
        const targetTitle = isBengal ? 'Tropical Cyclone Murasu' : isMawsynram ? 'Mawsynram, Meghalaya' : isThar ? 'Thar Desert, Rajasthan' : q;
        return {
          name: targetTitle,
          region: isBengal ? 'CYCLONIC SECTOR' : isMawsynram ? 'EAST KHASI HILLS' : isThar ? 'CRYOSPHERE SHOCK ZONE' : 'ORBITAL TARGET',
          lat: targetLat,
          lon: targetLon,
        };
      }
    }
    return null;
  });`;

if (code.includes(oldCustomGeocoded.replace(/\r\n/g, '\n'))) {
  code = code.replace(oldCustomGeocoded.replace(/\r\n/g, '\n'), newCustomGeocoded);
} else if (code.includes(oldCustomGeocoded)) {
  code = code.replace(oldCustomGeocoded, newCustomGeocoded);
}

// 4. Add activeSimulation and isSimulationsModalOpen state
if (!code.includes("const [activeSimulation, setActiveSimulation]")) {
  code = code.replace(
    "const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);",
    "const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);\r\n  const [isSimulationsModalOpen, setIsSimulationsModalOpen] = useState<boolean>(false);\r\n  const [activeSimulation, setActiveSimulation] = useState<PlanetarySimulationScenario | null>(() => {\r\n    if (typeof window !== 'undefined') {\r\n      const q = new URLSearchParams(window.location.search).get('q');\r\n      if (q) return findPlanetarySimulation(q);\r\n    }\r\n    return null;\r\n  });"
  );
}

// 5. Update liveAiDispatchState type to include thinkingSteps, recommendations, keyMetrics
code = code.replace(
  "    source?: string;\r\n    latencyMs?: number;\r\n  } | null>(null);",
  "    thinkingSteps?: string[];\r\n    recommendations?: Array<{ category: string; action: string }>;\r\n    keyMetrics?: Array<{ label: string; value: string; delta: string; trend: 'critical-high' | 'critical-low' | 'neutral' | 'elevated' }>;\r\n    source?: string;\r\n    latencyMs?: number;\r\n  } | null>(null);"
);

// 6. Fix tab set in useEffect
code = code.replace(
  "if (tab) setActiveTab(tab.toUpperCase());",
  "if (tab) setActiveTab(tab.toUpperCase() as NavTab);"
);

// 7. Fix handleExecuteSearch to check for planetary simulations
const simSearchCheck = `    // Check if query is a Planetary Deep Reasoning Simulation
    const matchedSim = findPlanetarySimulation(q);
    if (matchedSim) {
      setActiveSimulation(matchedSim);
      setCustomGeocodedPlace({
        name: matchedSim.target.name,
        region: matchedSim.target.region,
        lat: matchedSim.target.lat,
        lon: matchedSim.target.lon,
      });
      setLiveAiDispatchState({
        targetName: matchedSim.target.name,
        lat: matchedSim.target.lat,
        lon: matchedSim.target.lon,
        zoomAltitude: matchedSim.target.altitude,
        activeHeatSpots: 47,
        layerType: matchedSim.shaderParams.simulationType === 1.0 ? 'CRYO_SNOW' : 'SIMULATION',
        briefingLead: \`Meta AI Swarm Planetary Simulation [\${matchedSim.category.toUpperCase()}]:\`,
        briefingBody: \`\${matchedSim.reasoning.swarmConsensusSummary}\\n\\n\${matchedSim.reasoning.museWonder10_Physics}\\n\\n\${matchedSim.reasoning.museSpark12_ImpactCascades}\`,
        thinkingSteps: [
          \`Simulation Initialization: Loaded geophysical parameters for \${matchedSim.title}.\`,
          matchedSim.reasoning.museSpark13_Geospatial,
          matchedSim.reasoning.museWonder10_Physics,
          matchedSim.reasoning.museSpark12_ImpactCascades,
        ],
        recommendations: [
          { category: 'Phase 1 Immediate', action: matchedSim.reasoning.strategicProtocols.phase1_Immediate },
          { category: 'Phase 2 Stabilization', action: matchedSim.reasoning.strategicProtocols.phase2_Stabilization },
          { category: 'Phase 3 Planetary Governance', action: matchedSim.reasoning.strategicProtocols.phase3_Governance },
        ],
        telemetry: {
          viirsPoints: 34,
          modisPoints: 28,
          aodStatus: 'SIMULATED',
          cloudCoverPct: matchedSim.shaderParams.simulationType === 1.0 ? 82 : 45,
          windSpeedKmH: 64,
          pressureHPa: 1024,
          heatPowerMw: 0,
          waveSurgeM: 2.4,
        },
        environmentalPhysics: {
          phenomenon: matchedSim.title,
          precipitationMm: matchedSim.shaderParams.simulationType === 1.0 ? 38.0 : 0.0,
          waveSurgeM: 1.5,
          windSpeedKmh: 45,
          cloudCoverPct: 80,
          cloudVorticity: 0.85,
          thermalRadiativeMw: 0,
          severity: 'HIGH_ANOMALY',
          tacticalProtocol: matchedSim.reasoning.strategicProtocols.phase1_Immediate,
          targetLat: matchedSim.target.lat,
          targetLon: matchedSim.target.lon,
        },
        source: 'meta-simulation-engine',
        latencyMs: 110,
      });

      globeRef.current?.pointOfView(
        {
          lat: matchedSim.target.lat,
          lng: matchedSim.target.lon,
          altitude: matchedSim.target.altitude,
          label: matchedSim.title,
        },
        1200
      );
      setIsSearchSubmitted(true);
      return;
    }
`;

if (!code.includes("findPlanetarySimulation(q)")) {
  code = code.replace(
    "const q = searchQuery.trim();\r\n    if (!q) return;",
    "const q = searchQuery.trim();\r\n    if (!q) return;\r\n" + simSearchCheck
  );
}

// 8. Fix TRUE_COLOR_DAY in search
code = code.replace(
  "setActiveLayerMode('TRUE_COLOR_DAY');",
  "setActiveLayerMode('MODIS_TRUE_COLOR_TERRAIN');"
);

// 9. Fix <form layout in renderSearchBar
code = code.replace(
  "<form\r\n      layout\r\n      layoutId=\"sata-command-search-bar\"",
  "<motion.form\r\n      layout\r\n      layoutId=\"sata-command-search-bar\""
);
code = code.replace(
  "</form>",
  "</motion.form>"
);

// 10. Pass activeSimulation to EarthGlobeCanvas
code = code.replace(
  "activeLayerMode={activeLayerMode}",
  "activeLayerMode={activeLayerMode}\r\n          activeSimulation={activeSimulation}"
);

// 11. Fix onApplyLayer typing
code = code.replace(
  "setActiveLayerMode(layer);",
  "setActiveLayerMode(layer as NasaGibsLayerMode);"
);

// 12. Fix defaultSats typing
code = code.replace(
  "const defaultSats = [",
  "const defaultSats: LiveOrbitPass[] = ["
);

// 13. Add Planetary Simulations quick launcher pill next to the search bar and render modal
const simModalRender = `
      {/* Planetary Deep Reasoning Simulations Modal (30 Scenarios) */}
      <PlanetarySimulationModal
        isOpen={isSimulationsModalOpen}
        onClose={() => setIsSimulationsModalOpen(false)}
        activeSimulationId={activeSimulation?.id}
        onSelectSimulation={(sim) => {
          setActiveSimulation(sim);
          setSearchQuery(sim.prompt);
          setCustomGeocodedPlace({
            name: sim.target.name,
            region: sim.target.region,
            lat: sim.target.lat,
            lon: sim.target.lon,
          });
          setLiveAiDispatchState({
            targetName: sim.target.name,
            lat: sim.target.lat,
            lon: sim.target.lon,
            zoomAltitude: sim.target.altitude,
            activeHeatSpots: 47,
            layerType: sim.shaderParams.simulationType === 1.0 ? 'CRYO_SNOW' : 'SIMULATION',
            briefingLead: \`Meta AI Swarm Planetary Simulation [\${sim.category.toUpperCase()}]:\`,
            briefingBody: \`\${sim.reasoning.swarmConsensusSummary}\\n\\n\${sim.reasoning.museWonder10_Physics}\\n\\n\${sim.reasoning.museSpark12_ImpactCascades}\`,
            thinkingSteps: [
              \`Simulation Initialization: Loaded geophysical parameters for \${sim.title}.\`,
              sim.reasoning.museSpark13_Geospatial,
              sim.reasoning.museWonder10_Physics,
              sim.reasoning.museSpark12_ImpactCascades,
            ],
            recommendations: [
              { category: 'Phase 1 Immediate', action: sim.reasoning.strategicProtocols.phase1_Immediate },
              { category: 'Phase 2 Stabilization', action: sim.reasoning.strategicProtocols.phase2_Stabilization },
              { category: 'Phase 3 Planetary Governance', action: sim.reasoning.strategicProtocols.phase3_Governance },
            ],
            telemetry: {
              viirsPoints: 34,
              modisPoints: 28,
              aodStatus: 'SIMULATED',
              cloudCoverPct: sim.shaderParams.simulationType === 1.0 ? 82 : 45,
              windSpeedKmH: 64,
              pressureHPa: 1024,
              heatPowerMw: 0,
              waveSurgeM: 2.4,
            },
            environmentalPhysics: {
              phenomenon: sim.title,
              precipitationMm: sim.shaderParams.simulationType === 1.0 ? 38.0 : 0.0,
              waveSurgeM: 1.5,
              windSpeedKmh: 45,
              cloudCoverPct: 80,
              cloudVorticity: 0.85,
              thermalRadiativeMw: 0,
              severity: 'HIGH_ANOMALY',
              tacticalProtocol: sim.reasoning.strategicProtocols.phase1_Immediate,
              targetLat: sim.target.lat,
              targetLon: sim.target.lon,
            },
            source: 'meta-simulation-engine',
            latencyMs: 110,
          });

          globeRef.current?.pointOfView(
            {
              lat: sim.target.lat,
              lng: sim.target.lon,
              altitude: sim.target.altitude,
              label: sim.title,
            },
            1200
          );
          setIsSearchSubmitted(true);
        }}
      />
`;

if (!code.includes("<PlanetarySimulationModal")) {
  code = code.replace(
    "{/* Top Floating Bar */}",
    simModalRender + "\r\n      {/* Top Floating Bar */}"
  );
}

// 14. Add a "Simulations (30)" action button in Home Mode near the search bar
const simButtonPill = `
                  <button
                    onClick={() => setIsSimulationsModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-[11px] font-sans font-medium transition-all shadow-sm shadow-cyan-950/20"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Planetary Simulations (30 Scenarios)</span>
                  </button>
`;

if (!code.includes("Planetary Simulations (30 Scenarios)")) {
  code = code.replace(
    "{renderSearchBar(\"sata-command-search-input\")}",
    "{renderSearchBar(\"sata-command-search-input\")}\r\n                  " + simButtonPill
  );
}

fs.writeFileSync(appPath, code, 'utf8');
console.log('Successfully updated App.tsx with 30 Planetary Simulations & Natural Earth Mode!');
