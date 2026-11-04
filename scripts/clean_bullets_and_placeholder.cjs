const fs = require('fs');
const filePath = 'remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Replace bullet dot in RichTelemetryText
code = code.replace(
  /<div key=\{`li-\$\{idx\}`\} className="flex items-start gap-1\.5 text-white\/85 text-\[12px\] leading-relaxed my-0\.5">[\s\S]*?<span className="text-white\/40 mt-1">•<\/span>[\s\S]*?<span>\{trimmed\.replace\(\/\^\[-\*\]\\s\*\/, ''\)\}<\/span>[\s\S]*?<\/div>/,
  `<div key={\`li-\${idx}\`} className="text-white/85 text-[12px] leading-relaxed my-1 pl-2.5 border-l border-white/15">
            <span>{trimmed.replace(/^[-*]\\s*/, '')}</span>
          </div>`
);

// Update input placeholder
code = code.replace(
  'placeholder="Ask about satellite telemetry or observations..."',
  'placeholder="Ask Meta AI anything about Earth, weather, time, or sensors..."'
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Cleaned bullets in RichTelemetryText and updated input placeholder');
