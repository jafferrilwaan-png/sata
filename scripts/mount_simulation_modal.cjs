const fs = require('fs');
let code = fs.readFileSync('remix-remix-earthui-designer/src/App.tsx', 'utf8');

// 1. Mount PlanetarySimulationModal
const simModalCode = `      <PlanetarySimulationModal
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
              \`Simulation Parameter Lock: Loaded coupled planetary equations for \${sim.title}.\`,
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
            source: 'meta-planetary-simulation-engine',
            latencyMs: 95,
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
      />\r\n\r\n`;

if (!code.includes("<PlanetarySimulationModal")) {
  code = code.replace(
    "<KeyboardShortcutsModal",
    simModalCode + "      <KeyboardShortcutsModal"
  );
}

// 2. Fix initial liveAiDispatchState when query has simulation
const oldInitialLive = "const [liveAiDispatchState, setLiveAiDispatchState] = useState<{\r\n    targetName: string;";
const newInitialLive = `const [liveAiDispatchState, setLiveAiDispatchState] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) {
        const sim = findPlanetarySimulation(q);
        if (sim) {
          return {
            targetName: sim.target.name,
            lat: sim.target.lat,
            lon: sim.target.lon,
            zoomAltitude: sim.target.altitude,
            activeHeatSpots: 47,
            layerType: sim.shaderParams.simulationType === 1.0 ? 'CRYO_SNOW' : 'SIMULATION',
            briefingLead: \`Meta AI Swarm Planetary Simulation [\${sim.category.toUpperCase()}]:\`,
            briefingBody: \`\${sim.reasoning.swarmConsensusSummary}\\n\\n\${sim.reasoning.museWonder10_Physics}\\n\\n\${sim.reasoning.museSpark12_ImpactCascades}\`,
            thinkingSteps: [
              \`Simulation Parameter Lock: Loaded coupled planetary equations for \${sim.title}.\`,
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
            source: 'meta-planetary-simulation-engine',
            latencyMs: 95,
          };
        }
      }
    }
    return null;
  });\r\n  const [_unusedDispatchType] = useState<{ targetName: string;`;

if (!code.includes("findPlanetarySimulation(q)")) {
  // Already has it, or let's check
}
code = code.replace(oldInitialLive, newInitialLive);

fs.writeFileSync('remix-remix-earthui-designer/src/App.tsx', code, 'utf8');
console.log('Successfully mounted PlanetarySimulationModal in App.tsx!');
