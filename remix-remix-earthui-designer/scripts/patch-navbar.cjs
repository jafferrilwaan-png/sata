const fs = require('fs');
let content = fs.readFileSync('remix-remix-earthui-designer/src/App.tsx', 'utf-8');
content = content.replace(
  /unreadAlertsCount=\{temporalState\.activeHeatSpots\}\s*\/>/,
  'unreadAlertsCount={temporalState.activeHeatSpots}\n        >\n          {null}\n        </TopNavbar>'
);
fs.writeFileSync('remix-remix-earthui-designer/src/App.tsx', content);
console.log('Updated with closing tag');
