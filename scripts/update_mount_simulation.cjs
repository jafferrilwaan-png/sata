const fs = require('fs');
let code = fs.readFileSync('remix-remix-earthui-designer/src/App.tsx', 'utf8');

const mountSimHook = `      // 0. Auto-trigger Planetary Simulation if present in initial URL
      if (q) {
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
              \`Simulation Parameter Lock: Loaded coupled planetary equations for \${matchedSim.title}.\`,
              matchedSim.reasoning.museSpark13_Geospatial,
              matchedSim.reasoning.museWonder10_Physics,
              matchedSim.reasoning.museSpark12_ImpactCascades,
            ],
            recommendations: [
              { category: 'Phase 1 Immediate', action: matchedSim.reasoning.strategicProtocols.phase1_Immediate },
              { category: 'Phase 2 Stabilization', action: matchedSim.reasoning.strategicProtocols.phase2_Stabilization },
              { category: 'Phase 3 Governance', action: matchedSim.reasoning.strategicProtocols.phase3_Governance },
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
            source: 'meta-planetary-simulation-engine',
            latencyMs: 95,
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
        }
      }
`;

if (!code.includes("Auto-trigger Planetary Simulation if present in initial URL")) {
  code = code.replace(
    "const q = params.get('q');",
    "const q = params.get('q');\r\n" + mountSimHook
  );
}

fs.writeFileSync('remix-remix-earthui-designer/src/App.tsx', code, 'utf8');
console.log('Successfully updated mount simulation hook in App.tsx!');
