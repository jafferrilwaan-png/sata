const fs = require('fs');
const path = require('path');

// 1. Remove rings, arcs, labels, and points from the 3D globe in App.tsx
const appPath = path.resolve('remix-remix-earthui-designer/src/App.tsx');
let appCode = fs.readFileSync(appPath, 'utf8');

appCode = appCode.replace(/ringsData=\{HOTSPOT_NODES\}/g, 'ringsData={[]}');
appCode = appCode.replace(/arcsData=\{telemetryArcs\}/g, 'arcsData={[]}');
appCode = appCode.replace(/labelsData=\{HOTSPOT_NODES\}/g, 'labelsData={[]}');
appCode = appCode.replace(/pointsData=\{[\s\S]*?\}/g, 'pointsData={[]}');

// Remove bullet dot characters in strings
appCode = appCode.replace(/•/g, ' ');

fs.writeFileSync(appPath, appCode, 'utf8');
console.log('SUCCESS: Removed all dots, rings, arcs, and labels from 3D Earth in App.tsx!');

// 2. Remove all bullet dots from MetaDeepIntelligenceConsole.tsx
const consolePath = path.resolve('remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx');
let consoleCode = fs.readFileSync(consolePath, 'utf8');

consoleCode = consoleCode.replace(/•/g, ' ');
consoleCode = consoleCode.replace(/<span className="text-white\/30"> • <\/span>/g, '<span className="text-white/20"> | </span>');

fs.writeFileSync(consolePath, consoleCode, 'utf8');
console.log('SUCCESS: Removed all bullet dots from MetaDeepIntelligenceConsole.tsx!');

// 3. Remove all bullet dots from ObservationSidebar.tsx
const sidePath = path.resolve('remix-remix-earthui-designer/src/components/ObservationSidebar.tsx');
let sideCode = fs.readFileSync(sidePath, 'utf8');
sideCode = sideCode.replace(/•/g, ' ');
fs.writeFileSync(sidePath, sideCode, 'utf8');
console.log('SUCCESS: Removed all bullet dots from ObservationSidebar.tsx!');
