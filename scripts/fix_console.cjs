const fs = require('fs');
let code = fs.readFileSync('remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx', 'utf8');
code = code.replace('let liveWeather: any = null;', 'let liveWeather: any = null;\r\n      let metaData: any = null;');
code = code.replace('const [weatherData, metaData] = await Promise.all([weatherPromise, metaPromise]);', 'const [weatherData, fetchedMeta] = await Promise.all([weatherPromise, metaPromise]);\r\n        metaData = fetchedMeta;');
code = code.replace("onApplyLayer?.('TRUE_COLOR_DAY');", "onApplyLayer?.('MODIS_TRUE_COLOR_TERRAIN');");
fs.writeFileSync('remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx', code, 'utf8');
console.log('Fixed MetaDeepIntelligenceConsole.tsx');
