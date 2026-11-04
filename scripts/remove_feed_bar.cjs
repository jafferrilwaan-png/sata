const fs = require('fs');
const path = require('path');

const file = path.resolve('remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx');
let code = fs.readFileSync(file, 'utf8');

// Target the block from line 726 to 814
const feedBarStart = code.indexOf('{/* Clean Satellite Feed Bar');
const threadStart = code.indexOf('{/* Observation Interaction Thread */}');

if (feedBarStart !== -1 && threadStart !== -1) {
  code = code.slice(0, feedBarStart) + code.slice(threadStart);
  console.log('SUCCESS: Removed satellite feed bar and video controls entirely!');
} else {
  console.warn('WARN: feedBarStart or threadStart not found!');
}

fs.writeFileSync(file, code, 'utf8');
