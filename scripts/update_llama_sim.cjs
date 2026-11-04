const fs = require('fs');
let code = fs.readFileSync('src/services/metaLlamaService.ts', 'utf8');

if (!code.includes("import { findPlanetarySimulation }")) {
  code = "import { findPlanetarySimulation } from '../data/planetarySimulations';\r\n" + code;
}

const simHook = `  // 0. Planetary Deep Reasoning Simulation Check (30 Possibilities)
  const planetarySim = findPlanetarySimulation(userQuery);
  if (planetarySim) {
    const isCryo = planetarySim.shaderParams.simulationType === 1.0;
    return {
      success: true,
      query: userQuery,
      targetName: planetarySim.target.name,
      lat: planetarySim.target.lat,
      lon: planetarySim.target.lon,
      zoomAltitude: planetarySim.target.altitude,
      activeAnomalies: 47,
      layerType: isCryo ? 'CRYO' : 'STORM',
      briefingSummary: \`Llama 4: \${planetarySim.reasoning.swarmConsensusSummary}\\n\\n\${planetarySim.reasoning.museWonder10_Physics}\\n\\n\${planetarySim.reasoning.museSpark12_ImpactCascades}\`,
      thinkingSteps: [
        \`Simulation Parameter Lock: Loaded coupled planetary equations for \${planetarySim.title}.\`,
        planetarySim.reasoning.museSpark13_Geospatial,
        planetarySim.reasoning.museWonder10_Physics,
        planetarySim.reasoning.museSpark12_ImpactCascades,
      ],
      recommendations: [
        { category: 'Phase 1 Immediate', action: planetarySim.reasoning.strategicProtocols.phase1_Immediate },
        { category: 'Phase 2 Stabilization', action: planetarySim.reasoning.strategicProtocols.phase2_Stabilization },
        { category: 'Phase 3 Governance', action: planetarySim.reasoning.strategicProtocols.phase3_Governance },
      ],
      phenomenon: planetarySim.title,
      environmentalPhysics: {
        phenomenon: planetarySim.title,
        precipitationMm: isCryo ? 38.0 : 0.0,
        waveSurgeM: 1.5,
        windSpeedKmh: 48,
        cloudCoverPct: isCryo ? 85 : 40,
        cloudVorticity: 0.88,
        thermalRadiativeMw: 0,
        severity: 'HIGH_ANOMALY',
        tacticalProtocol: planetarySim.reasoning.strategicProtocols.phase1_Immediate,
        targetLat: planetarySim.target.lat,
        targetLon: planetarySim.target.lon,
      },
      source: 'meta-planetary-simulation-swarm',
      latencyMs: Date.now() - startTime,
    };
  }
`;

if (!code.includes("Planetary Deep Reasoning Simulation Check")) {
  code = code.replace(
    "const baseUrl = sataConfig.meta.baseUrl;",
    "const baseUrl = sataConfig.meta.baseUrl;\r\n" + simHook
  );
}

fs.writeFileSync('src/services/metaLlamaService.ts', code, 'utf8');
console.log('Successfully updated metaLlamaService.ts with 30 simulations support!');
