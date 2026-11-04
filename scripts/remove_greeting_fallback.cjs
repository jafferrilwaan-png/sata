const fs = require('fs');
const path = require('path');

console.log('=== REMOVING HARDCODED GREETING FALLBACK & PRESERVING REAL USER QUERY ===');

// 1. App.tsx: Remove the hardcoded greeting block
const appPath = path.join(__dirname, '../remix-remix-earthui-designer/src/App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Target the if (isGreeting) { setLiveAiDispatchState({ targetName: 'SATA Aerospace Command... return; }
const greetingTarget = `    if (isGreeting) {
      setLiveAiDispatchState({
        targetName: 'SATA Aerospace Command   Meta AI Swarm',
        lat: 25.0,
        lon: 10.0,
        zoomAltitude: 2.8,
        activeHeatSpots: 0,
        layerType: 'Autonomous Operations Swarm',
        briefingLead: 'Meta AI Operations Commander:',
        briefingBody: 'SATA Aerospace Sentinel online. Real-time satellite downlinks, NASA FIRMS thermal telemetry, and multi-spectral atmospheric chemistry sensors are synchronized and ready for tasking. You can command me to inspect any global coordinates, run hazard dispersion simulations, evaluate moisture levels, or analyze thermal hotspots.',
        telemetry: {
          viirsPoints: 0,
          modisPoints: 0,
          aodStatus: 'STABLE',
          cloudCoverPct: 20,
        },
        source: 'meta-copilot',
        latencyMs: 120,
      });
      globeRef.current?.pointOfView({ lat: 25, lng: 10, altitude: 2.8, label: 'Global Space Operations Orbit' }, 2000);
      setIsAiReasoning(false);
      return;
    }`;

if (appContent.includes(greetingTarget)) {
  appContent = appContent.replace(greetingTarget, '// Greeting routed to live AI reasoning');
  console.log('✅ App.tsx: removed greeting fallback block!');
} else {
  // Regex match in case of whitespace/CRLF differences
  const greetingRegex = /if \(isGreeting\) \{\s*setLiveAiDispatchState\(\{\s*targetName: 'SATA Aerospace Command[\s\S]*?setIsAiReasoning\(false\);\s*return;\s*\}/;
  if (greetingRegex.test(appContent)) {
    appContent = appContent.replace(greetingRegex, '// Greeting routed to live AI reasoning');
    console.log('✅ App.tsx: removed greeting fallback block via regex!');
  } else {
    console.warn('⚠️ Greeting block not matched directly');
  }
}

// Pass userQuery prop to MetaDeepIntelligenceConsole in App.tsx
appContent = appContent.replace(
  /<MetaDeepIntelligenceConsole\s*initialVoiceMessage=\{activeVoiceMessage \|\| undefined\}\s*targetName=\{liveAiDispatchState\?\.targetName \|\| customGeocodedPlace\?\.name \|\| searchQuery \|\| 'Target Observation Sector'\}/g,
  `<MetaDeepIntelligenceConsole
                  userQuery={searchQuery}
                  initialVoiceMessage={activeVoiceMessage || undefined}
                  targetName={liveAiDispatchState?.targetName || customGeocodedPlace?.name || 'Global Observation'}`
);

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('✅ App.tsx updated to pass userQuery!');

// 2. MetaDeepIntelligenceConsole.tsx: accept userQuery and use it for the user prompt
const consolePath = path.join(__dirname, '../remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx');
let consoleContent = fs.readFileSync(consolePath, 'utf8');

// Add userQuery to interface
consoleContent = consoleContent.replace(
  /interface MetaDeepIntelligenceConsoleProps \{\s*targetName: string;/,
  'interface MetaDeepIntelligenceConsoleProps {\n  userQuery?: string;\n  targetName: string;'
);

// Destructure userQuery
consoleContent = consoleContent.replace(
  /export const MetaDeepIntelligenceConsole: React\.FC<MetaDeepIntelligenceConsoleProps> = \(\{\s*targetName,/,
  'export const MetaDeepIntelligenceConsole: React.FC<MetaDeepIntelligenceConsoleProps> = ({\n  userQuery,\n  targetName,'
);

// Use userQuery for initialQuery
consoleContent = consoleContent.replace(
  /const initialQuery = initialVoiceMessage\?\.transcript \|\| targetName \|\| 'Global Observation';/g,
  'const initialQuery = initialVoiceMessage?.transcript || userQuery || targetName || "Global Observation";'
);

// In the useEffect that syncs messages:
consoleContent = consoleContent.replace(
  /const userPrompt = targetName;/g,
  'const userPrompt = userQuery || targetName;'
);

fs.writeFileSync(consolePath, consoleContent, 'utf8');
console.log('✅ MetaDeepIntelligenceConsole.tsx updated to display real user query!');

console.log('=== GREETING FALLBACK REMOVED SUCCESSFULLY ===');
