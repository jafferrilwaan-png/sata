const fs = require('fs');
const path = require('path');

// 1. Clean metaLlamaService.ts
const llamaFile = path.resolve('src/services/metaLlamaService.ts');
let llamaCode = fs.readFileSync(llamaFile, 'utf8');

llamaCode = llamaCode.replace(
  `"targetName": "String (e.g. 'Mawsynram, Meghalaya, India' or 'Kennedy Space Center, Florida' or 'Mount Fuji, Japan')",`,
  `"targetName": "Mawsynram, Meghalaya, India",`
);

// Add sanitizer when extracting targetName
const targetCleanAnchor = `targetName: geoResult?.targetName ||`;
const targetCleanFix = `targetName: (geoResult?.targetName && !geoResult.targetName.toLowerCase().startsWith('string')) ? geoResult.targetName : (userQuery || 'Observation Target'),`;

if (llamaCode.includes(targetCleanAnchor)) {
  llamaCode = llamaCode.replace(/targetName:\s*geoResult\?\.targetName\s*\|\|[\s\S]*?,/, targetCleanFix);
  console.log('SUCCESS: Sanitized targetName in metaLlamaService.ts!');
}

fs.writeFileSync(llamaFile, llamaCode, 'utf8');

// 2. Clean App.tsx if it ever receives a raw String placeholder
const appFile = path.resolve('remix-remix-earthui-designer/src/App.tsx');
let appCode = fs.readFileSync(appFile, 'utf8');

appCode = appCode.replace(
  /targetName:\s*payload\.targetName/g,
  `targetName: (payload.targetName && !payload.targetName.toLowerCase().startsWith('string')) ? payload.targetName : q`
);

fs.writeFileSync(appFile, appCode, 'utf8');
console.log('SUCCESS: Sanitized targetName in App.tsx!');
