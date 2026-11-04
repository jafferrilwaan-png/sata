const fs = require('fs');

// Fix EarthGlobeCanvas duplicate prop in App.tsx
let appStr = fs.readFileSync('d:/GAME/remix-remix-earthui-designer/src/App.tsx', 'utf8');
appStr = appStr.replace('          timelineDay={selectedTimelineDay}\n          isSearchSubmitted={isSearchSubmitted}', '          timelineDay={selectedTimelineDay}');
appStr = appStr.replace('          timelineDay={selectedTimelineDay}\r\n          isSearchSubmitted={isSearchSubmitted}', '          timelineDay={selectedTimelineDay}');
fs.writeFileSync('d:/GAME/remix-remix-earthui-designer/src/App.tsx', appStr, 'utf8');
console.log('Fixed App.tsx duplicate prop!');

// Fix coords in SatelliteTelemetryModal.tsx
let satStr = fs.readFileSync('d:/GAME/remix-remix-earthui-designer/src/components/SatelliteTelemetryModal.tsx', 'utf8');
satStr = satStr.replace(
  ": { lat: 0, lon: 0, region: '', sensor: '' };",
  ": { lat: 0, lon: 0, region: '', sensor: '', videoUrl: '' };"
);
fs.writeFileSync('d:/GAME/remix-remix-earthui-designer/src/components/SatelliteTelemetryModal.tsx', satStr, 'utf8');
console.log('Fixed SatelliteTelemetryModal coords videoUrl!');
