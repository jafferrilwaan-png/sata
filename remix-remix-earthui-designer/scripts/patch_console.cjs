const fs = require('fs');
const file = 'remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let src = fs.readFileSync(file, 'utf8');

// 1. Add lat, lon to ChatMessage generatedImagery
src = src.replace(
  /generatedImagery\?:\s*\{[\s\S]*?resolution:\s*string;[\s\S]*?\};/,
  `generatedImagery?: {
    url: string;
    caption: string;
    sensor: string;
    resolution: string;
    lat?: number;
    lon?: number;
  };`
);

// 2. Update agencyName derivation
src = src.replace(
  'const isAmericas = lon >= -140 && lon <= -30;',
  `const isAmericas = lon >= -140 && lon <= -30;
  const isIndiaRegion = lon >= 65 && lon <= 100 && lat >= 5 && lat <= 38;
  const satelliteStreamLabel = isAmericas ? 'NOAA GOES-18' : isIndiaRegion ? 'ISRO INSAT-3DR / Cartosat-3' : 'ESA Sentinel-3';`
);

// 3. Update getVideoSource
const newGetVideoSource = `  // Selected video feed source — Strictly location-locked, authentic satellite passes (ZERO static GIF loop fallbacks)
  const getVideoSource = () => {
    const isStormOrCyclone =
      targetName.toLowerCase().includes('cyclon') ||
      targetName.toLowerCase().includes('storm') ||
      targetName.toLowerCase().includes('murasu') ||
      targetName.toLowerCase().includes('hurricane') ||
      targetName.toLowerCase().includes('typhoon');

    if (isStormOrCyclone) {
      const { x, y, z } = latLonToTileXYZ(lat, lon, 6);
      if (activeFeed === 'radar_ir') {
        return \`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_Bands721/default/2024-06-01/GoogleMapsCompatible_Level9/\${z}/\${y}/\${x}.jpg\`;
      }
      return \`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-06-01/GoogleMapsCompatible_Level9/\${z}/\${y}/\${x}.jpg\`;
    }

    if (activeFeed === 'geocolor') {
      return computeSubmeterOpticalTileUrl(lat, lon, 10);
    }
    if (activeFeed === 'radar_ir') {
      return computeSubmeterOpticalTileUrl(lat, lon, 11);
    }
    return computeSubmeterOpticalTileUrl(lat, lon, 12);
  };`;

src = src.replace(
  /\/\/\s*Selected video feed source[\s\S]*?return computeSubmeterOpticalTileUrl\(lat, lon, 14\);\s*\};/,
  newGetVideoSource
);

// 4. Update generatedImagery creation
src = src.replace(
  /generatedImagery\s*=\s*\{[\s\S]*?resolution:\s*imageryRes,[\s\S]*?\};/,
  `generatedImagery = {
            url: imageryUrl,
            caption: imageryCaption,
            sensor: imagerySensor,
            resolution: imageryRes,
            lat: resolvedLat,
            lon: resolvedLon,
          };`
);

// 5. Update header and labels in feed bar
src = src.replace('NOAA Satellite Stream • Live', '{satelliteStreamLabel} Stream • Live');
src = src.replace('NOAA GOES GeoColor Loop', '{satelliteStreamLabel} Multispectral Loop');

// 6. Update badge under image in ChatMessage
src = src.replace(
  /<span className="text-white\/60 text-\[9\.5px\] whitespace-nowrap">\s*\{latStr\},\s*\{lonStr\}\s*<\/span>/,
  `<span className="text-white/60 text-[9.5px] whitespace-nowrap">
                                  {m.generatedImagery.lat !== undefined && m.generatedImagery.lon !== undefined
                                    ? \`\${Math.abs(m.generatedImagery.lat).toFixed(2)}° \${m.generatedImagery.lat >= 0 ? 'N' : 'S'}, \${Math.abs(m.generatedImagery.lon).toFixed(2)}° \${m.generatedImagery.lon >= 0 ? 'E' : 'W'}\`
                                    : \`\${latStr}, \${lonStr}\`}
                                </span>`
);

fs.writeFileSync(file, src, 'utf8');
console.log('Successfully updated MetaDeepIntelligenceConsole.tsx!');
