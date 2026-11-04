const fs = require('fs');
const path = require('path');

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      search(full);
    } else if (f.endsWith('.tsx')) {
      const code = fs.readFileSync(full, 'utf8');
      const lines = code.split('\n');
      lines.forEach((line, i) => {
        // check for dot like divs or spans: e.g. w-1 h-1 rounded-full, w-2 h-2 rounded-full, etc.
        if (/(w-[123](\.5)?\s+h-[123](\.5)?\s+rounded-full|h-[123](\.5)?\s+w-[123](\.5)?\s+rounded-full|rounded-full\s+w-[123](\.5)?\s+h-[123](\.5)?|rounded-full\s+h-[123](\.5)?\s+w-[123](\.5)?)/.test(line)) {
          console.log(`${full}:${i + 1}: ${line.trim()}`);
        }
        // check for bullet characters
        if (/[●•·]/.test(line)) {
          console.log(`BULLET ${full}:${i + 1}: ${line.trim()}`);
        }
        // check for animate-ping or animate-pulse dots
        if (/animate-ping/.test(line)) {
          console.log(`PING ${full}:${i + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

search('remix-remix-earthui-designer/src');
