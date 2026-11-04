const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/App.tsx',
  'src/components/BottomCardsRow.tsx',
  'src/components/KeyboardShortcutsModal.tsx',
  'src/components/MetaDeepIntelligenceConsole.tsx',
  'src/components/MissionAlertsModal.tsx',
  'src/components/ObservationSidebar.tsx',
  'src/components/SearchIntelligenceDossier.tsx',
  'src/components/LiveSatelliteVideoPlayer.tsx',
  'src/components/VoiceRecordingIndicator.tsx',
  'src/components/SatelliteTelemetryModal.tsx',
  'src/components/PlanetarySimulationModal.tsx',
  'src/components/VoiceMessageBubble.tsx',
];

for (const relPath of filesToUpdate) {
  const fullPath = path.resolve('remix-remix-earthui-designer', relPath);
  if (!fs.existsSync(fullPath)) continue;
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace font-mono with font-sans font-medium or font-sans
  content = content.replace(/font-mono font-medium/g, 'font-sans font-medium');
  content = content.replace(/font-mono/g, 'font-sans font-medium');

  // Specific cleanups:
  // In SearchIntelligenceDossier: font-semibold text-white font-sans font-medium -> font-semibold text-white font-sans
  content = content.replace(/font-semibold text-white font-sans font-medium/g, 'font-semibold text-white font-sans');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated font-mono in ${relPath}`);
}
