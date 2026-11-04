const fs = require('fs');
let content = fs.readFileSync('remix-remix-earthui-designer/src/App.tsx', 'utf8');

const regex = /\/\/\s*Immediately display active Tri-Model Meta reasoning in the intelligence briefing[\s\S]*?briefingBody:\s*selectedMetaModel === 'tri-agent-swarm'[\s\S]*?: `Retrieving satellite coordinates and thermal observations for "\$\{q\}"\.\.\.`,/;

const replacement = `const isFireQuery = q.toLowerCase().includes('fire') || q.toLowerCase().includes('wildfire') || q.toLowerCase().includes('heat') || q.toLowerCase().includes('thermal') || q.toLowerCase().includes('firms');
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
      ? \`The current local time in **\${matchedIncident ? matchedIncident.title : q}** is **\${immediateTimeStr}** (\${isIndiaTarget ? 'Indian Standard Time, UTC+5:30' : 'UTC'}). Coordinates: \${Math.abs(targetLat).toFixed(2)}° \${targetLat >= 0 ? 'N' : 'S'}, \${Math.abs(targetLon).toFixed(2)}° \${targetLon >= 0 ? 'E' : 'W'}. Local satellite pass geometry locked.\`
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

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('remix-remix-earthui-designer/src/App.tsx', content, 'utf8');
  console.log('App.tsx regex replace SUCCESS');
} else {
  console.log('App.tsx regex FAILED to match');
}
