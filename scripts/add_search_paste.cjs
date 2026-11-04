const fs = require('fs');
const p = 'd:/GAME/remix-remix-earthui-designer/src/App.tsx';
let c = fs.readFileSync(p, 'utf8');

const targetStr = `          placeholder={isAiReasoning ? 'Analyzing satellite data...' : 'Search location, satellite, or hazard...'}`;
const replStr = `          onPaste={(e) => {
            const items = e.clipboardData?.items;
            if (items) {
              for (let i = 0; i < items.length; i++) {
                if (items[i].type.startsWith('image/')) {
                  const file = items[i].getAsFile();
                  if (file) {
                    e.preventDefault();
                    const imgName = file.name || 'pasted_imagery.png';
                    setSearchQuery('Analyzing imagery: ' + imgName);
                    handleExecuteSearch('Analyzing imagery: ' + imgName);
                    return;
                  }
                }
              }
            }
          }}
          placeholder={isAiReasoning ? 'Analyzing satellite data...' : 'Search location, satellite, or hazard...'}`;

c = c.replace(targetStr, replStr);
fs.writeFileSync(p, c, 'utf8');
console.log('Added onPaste to search input in App.tsx!');
