const fs = require('fs');
const p = 'd:/GAME/remix-remix-earthui-designer/src/App.tsx';
let c = fs.readFileSync(p, 'utf8');

const idx = c.indexOf('const targetLat = isKennedy');
const endIdx = c.indexOf('const bodyText = isKennedy', idx);
if (idx !== -1 && endIdx !== -1) {
  const slice = c.slice(idx, endIdx);
  const replacement = `const geo = resolveTargetGeospatial(q);
        const targetLat = geo ? geo.lat : (isKennedy ? 28.57 : isBengal ? 14.8 : 20.59);
        const targetLon = geo ? geo.lon : (isKennedy ? -80.65 : isBengal ? 88.5 : 78.96);
        const targetAlt = geo ? geo.altitude : (isKennedy ? 1.30 : isBengal ? 1.38 : 1.28);

        const targetTitle = geo ? geo.name : (isKennedy ? 'Kennedy Space Center, Florida' : isBengal ? 'Bay of Bengal Cyclonic Basin' : qLower.includes('india') ? 'India' : (q.length > 25 ? 'Target Sector' : q));
        `;
  c = c.replace(slice, replacement);
  fs.writeFileSync(p, c, 'utf8');
  console.log('✅ REPLACED APP URL TARGET SUCCESSFULLY!');
} else {
  console.log('❌ Indices not found:', idx, endIdx);
}
