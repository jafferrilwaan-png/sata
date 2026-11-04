const fs = require('fs');
const path = require('path');

// 1. Clean App.tsx
const appPath = path.resolve('remix-remix-earthui-designer/src/App.tsx');
let appCode = fs.readFileSync(appPath, 'utf8');

appCode = appCode.replace(/import PlanetarySimulationModal from '\.\/components\/PlanetarySimulationModal';\r?\n?/, '');
appCode = appCode.replace(/<PlanetarySimulationModal[\s\S]*?\/>\r?\n?/, '');

fs.writeFileSync(appPath, appCode, 'utf8');
console.log('SUCCESS: Removed PlanetarySimulationModal from App.tsx');

// 2. Clean TopNavbar.tsx
const navPath = path.resolve('remix-remix-earthui-designer/src/components/TopNavbar.tsx');
let navCode = fs.readFileSync(navPath, 'utf8');
navCode = navCode.replace(
  'className="relative z-40 flex flex-wrap sm:flex-nowrap',
  'className="sticky top-0 z-40 flex flex-wrap sm:flex-nowrap'
);
fs.writeFileSync(navPath, navCode, 'utf8');
console.log('SUCCESS: Set TopNavbar to sticky top-0!');
