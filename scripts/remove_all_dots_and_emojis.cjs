const fs = require('fs');

console.log('=== REMOVING ALL DOTS, BULLETS, EMOJIS, AND TOP BANNER ===');

// 1. EarthGlobeCanvas.tsx: Remove the entire top banner that contained the red/green dots and bullet dots
const egcPath = 'd:/GAME/remix-remix-earthui-designer/src/components/EarthGlobeCanvas.tsx';
let egc = fs.readFileSync(egcPath, 'utf8');

// Remove Active Sensor Mode Status Pill
const bannerRegex = /\{\/\* Active Sensor Mode Status Pill \*\/\}[\s\S]*?\{\/\* Full-Viewport Clean 3D Earth Globe Canvas Mount \*\/\}/;
if (bannerRegex.test(egc)) {
  egc = egc.replace(bannerRegex, '{/* Full-Viewport Clean 3D Earth Globe Canvas Mount */}');
  console.log('✅ Removed Active Sensor Mode Status Pill and all red/green/bullet dots from EarthGlobeCanvas.tsx');
} else {
  console.log('⚠️ Could not match bannerRegex in EarthGlobeCanvas.tsx, checking manual replace');
  // Manual replacement fallback
  const startIdx = egc.indexOf('{/* Active Sensor Mode Status Pill */}');
  const endIdx = egc.indexOf('{/* Full-Viewport Clean 3D Earth Globe Canvas Mount */}');
  if (startIdx !== -1 && endIdx !== -1) {
    egc = egc.slice(0, startIdx) + egc.slice(endIdx);
    console.log('✅ Manually removed Active Sensor Mode Status Pill from EarthGlobeCanvas.tsx');
  }
}
fs.writeFileSync(egcPath, egc, 'utf8');

// 2. MetaDeepIntelligenceConsole.tsx: Remove emojis, dots, middle dots, and make pure text
const consPath = 'd:/GAME/remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let cons = fs.readFileSync(consPath, 'utf8');

// Replace {activeSelectedTool.agency} · {activeSelectedTool.resolution}
cons = cons.replace(
  '{activeSelectedTool.agency} · {activeSelectedTool.resolution}',
  '{activeSelectedTool.agency} {activeSelectedTool.resolution}'
);

// Replace emojis in buttons with pure clean text
cons = cons.replace('🌍 Apply to 3D Earth', 'Apply to 3D Earth');
cons = cons.replace('🖼️ Apply to Image', 'Apply to Image');

// Ensure cancel button is clean text
cons = cons.replace(
  '<button\n                type="button"\n                onClick={() => setActiveSelectedTool(null)}\n                aria-label="Cancel"\n                className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-white/60 hover:text-white cursor-pointer"\n              >\n                ✕\n              </button>',
  '<button\n                type="button"\n                onClick={() => setActiveSelectedTool(null)}\n                aria-label="Cancel"\n                className="px-2.5 py-1 rounded-full text-[11px] bg-white/10 hover:bg-white/20 text-white/80 hover:text-white cursor-pointer transition-colors"\n              >\n                Cancel\n              </button>'
);
cons = cons.replace(
  '<button type="button" onClick={() => setActiveSelectedTool(null)} aria-label="Cancel" className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-white/60 hover:text-white cursor-pointer">\n                ✕\n              </button>',
  '<button type="button" onClick={() => setActiveSelectedTool(null)} aria-label="Cancel" className="px-2.5 py-1 rounded-full text-[11px] bg-white/10 hover:bg-white/20 text-white/80 hover:text-white cursor-pointer transition-colors">Cancel</button>'
);

fs.writeFileSync(consPath, cons, 'utf8');
console.log('✅ Cleaned MetaDeepIntelligenceConsole.tsx: zero emojis, zero dots, pure clean text buttons');

// 3. App.tsx: remove middle dots from region strings
const appPath = 'd:/GAME/remix-remix-earthui-designer/src/App.tsx';
let app = fs.readFileSync(appPath, 'utf8');
app = app.replaceAll(' · VIIRS SCAN', ' VIIRS SCAN');
fs.writeFileSync(appPath, app, 'utf8');
console.log('✅ Cleaned App.tsx: zero middle dots');

// 4. CommanderProfileModal.tsx: remove middle dots
const profPath = 'd:/GAME/remix-remix-earthui-designer/src/components/CommanderProfileModal.tsx';
if (fs.existsSync(profPath)) {
  let prof = fs.readFileSync(profPath, 'utf8');
  prof = prof.replaceAll('{activeFolder.date} · {activeFolder.timestamp}', '{activeFolder.date} {activeFolder.timestamp}');
  fs.writeFileSync(profPath, prof, 'utf8');
  console.log('✅ Cleaned CommanderProfileModal.tsx');
}

// 5. LiquidTimeline.tsx: remove middle dots
const ltPath = 'd:/GAME/remix-remix-earthui-designer/src/components/LiquidTimeline.tsx';
if (fs.existsSync(ltPath)) {
  let lt = fs.readFileSync(ltPath, 'utf8');
  lt = lt.replaceAll('{temporal.isoDate} · {temporal.relativeLabel}', '{temporal.isoDate} {temporal.relativeLabel}');
  fs.writeFileSync(ltPath, lt, 'utf8');
  console.log('✅ Cleaned LiquidTimeline.tsx');
}

// 6. SatelliteTelemetryModal.tsx: remove bullet dots
const satPath = 'd:/GAME/remix-remix-earthui-designer/src/components/SatelliteTelemetryModal.tsx';
if (fs.existsSync(satPath)) {
  let sat = fs.readFileSync(satPath, 'utf8');
  sat = sat.replaceAll(' • ', ' ');
  fs.writeFileSync(satPath, sat, 'utf8');
  console.log('✅ Cleaned SatelliteTelemetryModal.tsx');
}

// 7. SearchIntelligenceDossier.tsx: remove bullet dots
const sidPath = 'd:/GAME/remix-remix-earthui-designer/src/components/SearchIntelligenceDossier.tsx';
if (fs.existsSync(sidPath)) {
  let sid = fs.readFileSync(sidPath, 'utf8');
  sid = sid.replaceAll('<span className="text-white/30">•</span>', '');
  fs.writeFileSync(sidPath, sid, 'utf8');
  console.log('✅ Cleaned SearchIntelligenceDossier.tsx');
}

// 8. autonomousAgent.ts: remove middle dots
const aaPath = 'd:/GAME/remix-remix-earthui-designer/src/agent/autonomousAgent.ts';
if (fs.existsSync(aaPath)) {
  let aa = fs.readFileSync(aaPath, 'utf8');
  aa = aa.replaceAll(' · ', ' ');
  fs.writeFileSync(aaPath, aa, 'utf8');
  console.log('✅ Cleaned autonomousAgent.ts');
}

console.log('=== ALL DOTS, BULLETS, EMOJIS, AND BANNERS ELIMINATED! ===');
