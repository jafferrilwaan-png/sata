const fs = require('fs');
let s = fs.readFileSync('d:/GAME/remix-remix-earthui-designer/src/components/SatelliteTelemetryModal.tsx', 'utf8');
s = s.replace(
  'className="w-full h-full object-cover"',
  'poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"\n                    className="w-full h-full object-cover"'
);
fs.writeFileSync('d:/GAME/remix-remix-earthui-designer/src/components/SatelliteTelemetryModal.tsx', s, 'utf8');
console.log('Added poster to satellite video!');
