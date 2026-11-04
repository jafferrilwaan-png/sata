const fs = require('fs');

const p = 'd:/GAME/remix-remix-earthui-designer/src/App.tsx';
let content = fs.readFileSync(p, 'utf8');

// Find lines 1018-1035
const searchStart = 'const matchedIncident = liveIncidents.find((inc) =>';
const searchEnd = 'globeRef.current?.pointOfView(\n      {\n        lat: targetLat,\n        lng: targetLon,\n        altitude: targetAltitude,\n        label: matchedIncident ? matchedIncident.title : q,\n      },\n      2000\n    );';

const searchEndCRLF = 'globeRef.current?.pointOfView(\r\n      {\r\n        lat: targetLat,\r\n        lng: targetLon,\r\n        altitude: targetAltitude,\r\n        label: matchedIncident ? matchedIncident.title : q,\r\n      },\r\n      2000\r\n    );';

const replacement = `const geoTarget = resolveTargetGeospatial(q);
    const matchedIncident = liveIncidents.find((inc) =>
      inc.title.toLowerCase().includes(q.toLowerCase()) ||
      q.toLowerCase().includes(inc.title.toLowerCase())
    );
    const wantsOpticalOr3D = qLower.includes('high-res') || qLower.includes('high res') || qLower.includes('optical') || qLower.includes('3d') || qLower.includes('resolution') || qLower.includes('zoom') || qLower.includes('close') || qLower.includes('detail') || qLower.includes('pass') || qLower.includes('see');

    const cleanTargetTitle = geoTarget
      ? geoTarget.name
      : matchedIncident
      ? matchedIncident.title
      : qLower.includes('india')
      ? 'India'
      : (q.length > 25 ? 'Target Observation Sector' : q);

    const targetLat = geoTarget ? geoTarget.lat : matchedIncident ? matchedIncident.coordinates[0] : (baseEval.targetPointOfView?.lat || 20.59);
    const targetLon = geoTarget ? geoTarget.lon : matchedIncident ? matchedIncident.coordinates[1] : (baseEval.targetPointOfView?.lng || 78.96);
    const targetAltitude = geoTarget ? geoTarget.altitude : wantsOpticalOr3D ? 1.28 : matchedIncident ? 1.45 : (baseEval.targetPointOfView?.altitude || 1.35);

    if (geoTarget) {
      setActiveLayerMode(geoTarget.layer as any);
    } else if (wantsOpticalOr3D) {
      setActiveLayerMode('MODIS_TRUE_COLOR_TERRAIN');
    }

    globeRef.current?.pointOfView(
      {
        lat: targetLat,
        lng: targetLon,
        altitude: targetAltitude,
        label: cleanTargetTitle,
      },
      2000
    );`;

const startIdx = content.indexOf(searchStart);
let endIdx = content.indexOf('2000\r\n    );', startIdx);
let endOffset = '2000\r\n    );'.length;
if (endIdx === -1) {
  endIdx = content.indexOf('2000\n    );', startIdx);
  endOffset = '2000\n    );'.length;
}

if (startIdx !== -1 && endIdx !== -1) {
  const oldBlock = content.slice(startIdx, endIdx + endOffset);
  content = content.replace(oldBlock, replacement);
  console.log('✅ Replaced target resolution & clean label in App.tsx');
} else {
  console.log('❌ Could not locate block in App.tsx');
}

// Also update initial liveAiDispatchState targetName
content = content.replace(
  'targetName: matchedIncident ? matchedIncident.title : q,',
  'targetName: cleanTargetTitle,'
);

// Also update payload receiving targetName
content = content.replace(
  `targetName: (payload.targetName && !payload.targetName.toLowerCase().startsWith('string')) ? payload.targetName : q || q,`,
  `targetName: cleanTargetTitle,`
);

content = content.replace(
  `name: payload.targetName || q,`,
  `name: cleanTargetTitle,`
);

content = content.replace(
  `label: payload.targetName || q,`,
  `label: cleanTargetTitle,`
);

fs.writeFileSync(p, content, 'utf8');
console.log('✅ Finished patching App.tsx');
