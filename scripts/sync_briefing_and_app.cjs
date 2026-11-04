const fs = require('fs');

// 1. Update App.tsx
const appPath = 'remix-remix-earthui-designer/src/App.tsx';
let appCode = fs.readFileSync(appPath, 'utf8');

// Replace optimistic layerType and briefingBody in handleSearchSubmit
const appTarget = `    // Immediately display active Tri-Model Meta reasoning in the intelligence briefing
    setLiveAiDispatchState({
      targetName: matchedIncident ? matchedIncident.title : q,
      lat: targetLat,
      lon: targetLon,
      zoomAltitude: targetAltitude,
      activeHeatSpots: matchedIncident ? (matchedIncident.category === 'Fire' ? 84 : 0) : 0,
      layerType: matchedIncident ? matchedIncident.category : 'THERMAL',
      briefingLead: 'Observation Analysis:',
      briefingBody: selectedMetaModel === 'tri-agent-swarm'
        ? \`Meta AI Tri-Agent Swarm actively reasoning over atmospheric chemistry and satellite telemetry for "\${q}"...\`
        : \`Retrieving satellite coordinates and thermal observations for "\${q}"...\`,`;

const appReplacement = `    const isFireQuery = q.toLowerCase().includes('fire') || q.toLowerCase().includes('wildfire') || q.toLowerCase().includes('heat') || q.toLowerCase().includes('thermal') || q.toLowerCase().includes('firms');
    const isRainOrStormQuery = q.toLowerCase().includes('rain') || q.toLowerCase().includes('storm') || q.toLowerCase().includes('cyclone') || q.toLowerCase().includes('flood');
    const isTimeQuery = q.toLowerCase().includes('time') || q.toLowerCase().includes('clock') || q.toLowerCase().includes('date');
    const isIndiaTarget = (targetLat >= 6 && targetLat <= 38 && targetLon >= 68 && targetLon <= 97);

    const immediateTimeStr = isTimeQuery
      ? new Intl.DateTimeFormat('en-US', {
          timeZone: isIndiaTarget ? 'Asia/Kolkata' : 'UTC',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short',
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }).format(new Date())
      : '';

    const initialBriefing = isTimeQuery
      ? \`The current local time in **\${matchedIncident ? matchedIncident.title : q}** is **\${immediateTimeStr}** (\${isIndiaTarget ? 'Indian Standard Time, UTC+5:30' : 'UTC'}). Coordinates: \${Math.abs(targetLat).toFixed(2)}° \${targetLat >= 0 ? 'N' : 'S'}, \${Math.abs(targetLon).toFixed(2)}° \${targetLon >= 0 ? 'E' : 'W'}. Orbital position synchronized.\`
      : selectedMetaModel === 'tri-agent-swarm'
        ? \`Meta AI Tri-Agent Swarm actively reasoning over atmospheric chemistry and satellite telemetry for "\${q}"...\`
        : \`Retrieving satellite coordinates and observations for "\${q}"...\`;

    // Immediately display active Tri-Model Meta reasoning in the intelligence briefing
    setLiveAiDispatchState({
      targetName: matchedIncident ? matchedIncident.title : q,
      lat: targetLat,
      lon: targetLon,
      zoomAltitude: targetAltitude,
      activeHeatSpots: matchedIncident ? (matchedIncident.category === 'Fire' ? 84 : 0) : 0,
      layerType: isFireQuery ? 'VIIRS_NIGHT_THERMAL' : isRainOrStormQuery ? 'ATMOSPHERIC_AOD_CLOUDS' : 'MODIS_TRUE_COLOR_TERRAIN',
      briefingLead: 'Observation Analysis:',
      briefingBody: initialBriefing,`;

if (appCode.includes(appTarget)) {
  appCode = appCode.replace(appTarget, appReplacement);
  fs.writeFileSync(appPath, appCode, 'utf8');
  console.log('App.tsx updated successfully');
} else {
  console.log('App.tsx target not found');
}

// 2. Update MetaDeepIntelligenceConsole.tsx to sync briefingBody when it updates
const consolePath = 'remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let consoleCode = fs.readFileSync(consolePath, 'utf8');

const effectSyncCode = `
  useEffect(() => {
    if (briefingBody) {
      const cleanReply = briefingBody.replace(/^(?:Llama 4|Meta Muse):\\s*/i, '');
      setMessages((prev) => {
        if (prev.length >= 2 && prev[1].id === 'initial-meta-msg') {
          const updated = [...prev];
          updated[1] = {
            ...updated[1],
            text: cleanReply,
            thinkingSteps: thinkingSteps && thinkingSteps.length > 0 ? thinkingSteps : updated[1].thinkingSteps,
            recommendations: recommendations && recommendations.length > 0 ? recommendations : updated[1].recommendations,
          };
          return updated;
        }
        return prev;
      });
    }
  }, [briefingBody, thinkingSteps, recommendations]);
`;

if (!consoleCode.includes('briefingBody.replace(/^(?:Llama 4|Meta Muse)')) {
  consoleCode = consoleCode.replace(
    'useEffect(() => {\n    let isMounted = true;',
    effectSyncCode + '\n  useEffect(() => {\n    let isMounted = true;'
  );
  fs.writeFileSync(consolePath, consoleCode, 'utf8');
  console.log('MetaDeepIntelligenceConsole.tsx updated with briefingBody sync effect');
}
