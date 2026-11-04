const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'remix-remix-earthui-designer', 'public', 'assets', 'textures');
fs.readdirSync(dir).forEach(file => {
  const stat = fs.statSync(path.join(dir, file));
  console.log(`${file}: ${stat.size} bytes`);
});
