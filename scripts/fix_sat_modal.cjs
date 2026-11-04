const fs = require('fs');
const filePath = 'd:/GAME/remix-remix-earthui-designer/src/components/SatelliteTelemetryModal.tsx';
let s = fs.readFileSync(filePath, 'utf8');

const target = `                className="w-full h-full object-cover"
              />

              {/* Clean Sub-Satellite Nadir Point`;

const targetCRLF = `                className="w-full h-full object-cover"\r\n              />\r\n\r\n              {/* Clean Sub-Satellite Nadir Point`;

const replacement = `                className="w-full h-full object-cover"
              />
            </div>

            {/* Clean Sub-Satellite Nadir Point`;

const replacementCRLF = `                className="w-full h-full object-cover"\r\n              />\r\n            </div>\r\n\r\n            {/* Clean Sub-Satellite Nadir Point`;

if (s.includes(targetCRLF)) {
  s = s.replace(targetCRLF, replacementCRLF);
} else if (s.includes(target)) {
  s = s.replace(target, replacement);
} else {
  console.log('Target not found directly, looking for index...');
  const vIdx = s.indexOf('className="w-full h-full object-cover"');
  if (vIdx !== -1) {
    const afterSlash = s.indexOf('/>', vIdx);
    s = s.slice(0, afterSlash + 2) + '\n            </div>' + s.slice(afterSlash + 2);
  }
}

fs.writeFileSync(filePath, s, 'utf8');
console.log('SatelliteTelemetryModal.tsx closed correctly!');
