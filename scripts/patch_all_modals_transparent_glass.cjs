const fs = require('fs');

console.log('=== UPGRADING ALL MODALS TO ULTRA-TRANSPARENT CRYSTAL FROSTED GLASS ===');

// 1. MissionAlertsModal.tsx
const mamPath = 'd:/GAME/remix-remix-earthui-designer/src/components/MissionAlertsModal.tsx';
let mam = fs.readFileSync(mamPath, 'utf8');

// Replace dark backdrop
mam = mam.replace(
  'className="absolute inset-0 bg-black/65 backdrop-blur-md"',
  'className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"'
);

// Replace dialog container background
mam = mam.replace(
  'className="relative z-10 w-full max-w-lg rounded-[28px] p-6 border border-white/15 bg-black/60 backdrop-blur-[54px] shadow-[0_32px_80px_rgba(0,0,0,0.85),inset_0_1px_1.5px_rgba(255,255,255,0.22)] text-white overflow-hidden flex flex-col gap-4"',
  'className="relative z-10 w-full max-w-lg rounded-[28px] p-6 border border-white/25 bg-white/[0.08] backdrop-blur-[45px] saturate-[180%] shadow-[0_24px_70px_rgba(0,0,0,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.35)] text-white overflow-hidden flex flex-col gap-4"'
);

// Replace alert cards inside modal with transparent glass
mam = mam.replaceAll(
  'bg-white/[0.04] border border-white/10 flex flex-col gap-1.5 transition-colors hover:bg-white/[0.06]',
  'bg-white/[0.06] border border-white/18 backdrop-blur-md flex flex-col gap-1.5 transition-colors hover:bg-white/[0.12]'
);

fs.writeFileSync(mamPath, mam, 'utf8');
console.log('✅ MissionAlertsModal.tsx upgraded to transparent crystal glass!');

// 2. KeyboardShortcutsModal.tsx
const ksmPath = 'd:/GAME/remix-remix-earthui-designer/src/components/KeyboardShortcutsModal.tsx';
let ksm = fs.readFileSync(ksmPath, 'utf8');

ksm = ksm.replace(
  'className="absolute inset-0 bg-black/65 backdrop-blur-md"',
  'className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"'
);

ksm = ksm.replace(
  'className="relative w-full max-w-[480px] rounded-[24px] border border-white/16 bg-black/55 backdrop-blur-2xl p-5 shadow-[0_24px_64px_rgba(0,0,0,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.25)] flex flex-col gap-4 text-white z-10"',
  'className="relative w-full max-w-[480px] rounded-[24px] border border-white/25 bg-white/[0.08] backdrop-blur-[45px] saturate-[180%] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.35)] flex flex-col gap-4 text-white z-10"'
);

fs.writeFileSync(ksmPath, ksm, 'utf8');
console.log('✅ KeyboardShortcutsModal.tsx upgraded to transparent crystal glass!');

// 3. SatelliteTelemetryModal.tsx
const stmPath = 'd:/GAME/remix-remix-earthui-designer/src/components/SatelliteTelemetryModal.tsx';
let stm = fs.readFileSync(stmPath, 'utf8');

stm = stm.replace(
  'className="absolute inset-0 bg-black/70 backdrop-blur-md"',
  'className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"'
);

stm = stm.replace(
  'bg-black/45 backdrop-blur-[48px]',
  'bg-white/[0.08] backdrop-blur-[45px] saturate-[180%]'
);

fs.writeFileSync(stmPath, stm, 'utf8');
console.log('✅ SatelliteTelemetryModal.tsx upgraded to transparent crystal glass!');

// 4. CommanderProfileModal.tsx
const cpmPath = 'd:/GAME/remix-remix-earthui-designer/src/components/CommanderProfileModal.tsx';
let cpm = fs.readFileSync(cpmPath, 'utf8');

cpm = cpm.replace(
  'className="absolute inset-0 bg-black/45 backdrop-blur-[24px]"',
  'className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"'
);

fs.writeFileSync(cpmPath, cpm, 'utf8');
console.log('✅ CommanderProfileModal.tsx upgraded to transparent crystal glass!');

console.log('=== ALL MODALS UPGRADED TO PURE TRANSPARENT FROSTED GLASS ===');
