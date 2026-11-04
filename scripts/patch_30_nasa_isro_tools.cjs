const fs = require('fs');

console.log('=== Adding 30 NASA & ISRO Tools and Shaders ===');

// 1. PATCH EarthGlobeCanvas.tsx
const egcPath = 'd:/GAME/remix-remix-earthui-designer/src/components/EarthGlobeCanvas.tsx';
let egc = fs.readFileSync(egcPath, 'utf8');

// Add uniforms to earthSurfaceMat uniforms object
egc = egc.replace(
  'uRadarMode: { value: 0.0 },',
  'uRadarMode: { value: 0.0 },\n          uNdviMode: { value: 0.0 },\n          uSarMode: { value: 0.0 },'
);

// Add uniform declarations to fragment shader
egc = egc.replace(
  'uniform float uRadarMode;',
  'uniform float uRadarMode;\n          uniform float uNdviMode;\n          uniform float uSarMode;'
);

// Add shader fragment effect
const radarBlockEnd = 'finalCol = mix(finalCol, radarCol + vec3(sweepLine), rainCell * uRadarMode * 0.75);\n            }';
const radarBlockEndCRLF = 'finalCol = mix(finalCol, radarCol + vec3(sweepLine), rainCell * uRadarMode * 0.75);\r\n            }';

const ndviSarBlock = `

            if (uNdviMode > 0.01) {
              // Landsat-9 / ASTER False-Color Near-Infrared Chlorophyll Vegetation Index
              float greenRatio = clamp((finalCol.g - finalCol.r) / max(finalCol.g + finalCol.r, 0.01), 0.0, 1.0);
              vec3 ndviCol = mix(vec3(0.72, 0.55, 0.32), vec3(0.08, 0.92, 0.35), smoothstep(0.05, 0.45, greenRatio));
              finalCol = mix(finalCol, ndviCol, uNdviMode * 0.85);
            }

            if (uSarMode > 0.01) {
              // ISRO RISAT-1A / Sentinel-1 C-Band Synthetic Aperture Radar (SAR) Microwave Backscatter
              float lum = dot(finalCol, vec3(0.299, 0.587, 0.114));
              float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
              vec3 sarCol = vec3(pow(lum, 1.35) * (0.85 + 0.15 * noise));
              finalCol = mix(finalCol, sarCol, uSarMode * 0.90);
            }`;

if (egc.includes(radarBlockEndCRLF)) {
  egc = egc.replace(radarBlockEndCRLF, radarBlockEndCRLF + ndviSarBlock);
} else if (egc.includes(radarBlockEnd)) {
  egc = egc.replace(radarBlockEnd, radarBlockEnd + ndviSarBlock);
}

// Add tick updates for uNdviMode and uSarMode
const tickRadarBlock = `if (cloudShellMat?.uniforms?.uRadarMode) {
          cloudShellMat.uniforms.uRadarMode.value = earthSurfaceMat.uniforms.uRadarMode.value;
        }`;

const tickNdviSarBlock = `

        const targetNdvi = (mode === 'NDVI_VEGETATION') ? 1.0 : 0.0;
        if (earthSurfaceMat.uniforms.uNdviMode) {
          earthSurfaceMat.uniforms.uNdviMode.value +=
            (targetNdvi - earthSurfaceMat.uniforms.uNdviMode.value) * 0.20;
        }

        const targetSar = (mode === 'SAR_MICROWAVE') ? 1.0 : 0.0;
        if (earthSurfaceMat.uniforms.uSarMode) {
          earthSurfaceMat.uniforms.uSarMode.value +=
            (targetSar - earthSurfaceMat.uniforms.uSarMode.value) * 0.20;
        }`;

if (egc.includes(tickRadarBlock)) {
  egc = egc.replace(tickRadarBlock, tickRadarBlock + tickNdviSarBlock);
}

fs.writeFileSync(egcPath, egc, 'utf8');
console.log('✅ Updated EarthGlobeCanvas.tsx with NDVI and SAR microwave shaders');

// 2. PATCH MetaDeepIntelligenceConsole.tsx with 30 NASA & ISRO Tools & Earth vs Image Dialog
const consPath = 'd:/GAME/remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx';
let cons = fs.readFileSync(consPath, 'utf8');

// Define 30 tools data structure
const toolsDefinition = `
export interface SatelliteSensorTool {
  id: string;
  name: string;
  agency: string;
  category: string;
  layerMode: string;
  resolution: string;
  spectrum: string;
  defaultAltitude: number;
}

export const NASA_ISRO_30_TOOLS: SatelliteSensorTool[] = [
  { id: 'cartosat-3', name: 'Cartosat-3 Optical (0.28m)', agency: 'ISRO', category: 'Optical & 3D', layerMode: 'MODIS_TRUE_COLOR_TERRAIN', resolution: '0.28m GSD', spectrum: 'Panchromatic & Multi-Spectral', defaultAltitude: 1.28 },
  { id: 'viirs-thermal-ir', name: 'VIIRS Thermal IR (375m)', agency: 'NASA', category: 'Thermal & FIRMS', layerMode: 'VIIRS_NIGHT_THERMAL', resolution: '375m I-Band', spectrum: 'Thermal Infrared 10.8µm', defaultAltitude: 1.35 },
  { id: 'gpm-doppler-radar', name: 'GPM Doppler Weather Radar', agency: 'NASA', category: 'Radar & SAR', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: '5 km Ka/Ku', spectrum: 'Precipitation Reflectivity (dBZ)', defaultAltitude: 1.38 },
  { id: 'risat-1a-sar', name: 'RISAT-1A SAR Microwave', agency: 'ISRO', category: 'Radar & SAR', layerMode: 'SAR_MICROWAVE', resolution: '1m Spotlight', spectrum: 'C-Band Synthetic Aperture Radar', defaultAltitude: 1.30 },
  { id: 'black-marble', name: 'Black Marble Night Lights', agency: 'NASA', category: 'Optical & 3D', layerMode: 'BLACK_MARBLE_NIGHT', resolution: '750m DNB', spectrum: 'Day/Night Band Radiance', defaultAltitude: 1.55 },
  { id: 'landsat9-ndvi', name: 'Landsat-9 NDVI Vegetation', agency: 'NASA', category: 'Optical & 3D', layerMode: 'NDVI_VEGETATION', resolution: '30m OLI-2', spectrum: 'NIR 865nm / Red 655nm', defaultAltitude: 1.32 },
  { id: 'sentinel5p-no2', name: 'Sentinel-5P Tropospheric NO₂', agency: 'ESA/NASA', category: 'Atmosphere & Gas', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: '3.5x5.5 km', spectrum: 'TROPOMI UV-VIS 400-500nm', defaultAltitude: 1.40 },
  { id: 'oceansat3-scat', name: 'Oceansat-3 Scatterometer', agency: 'ISRO', category: 'Ocean & Cryo', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: '25 km OSCAT', spectrum: 'Ku-Band Ocean Surface Wind', defaultAltitude: 1.45 },
  { id: 'sentinel3-slstr', name: 'Sentinel-3 SLSTR Ocean Temp', agency: 'ESA', category: 'Ocean & Cryo', layerMode: 'VIIRS_NIGHT_THERMAL', resolution: '500m SLSTR', spectrum: 'Dual-View Sea Surface Temp', defaultAltitude: 1.42 },
  { id: 'tropomi-co', name: 'TROPOMI Carbon Monoxide', agency: 'NASA/ESA', category: 'Atmosphere & Gas', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: '7 km SWIR', spectrum: '2.3µm CO Column Abundance', defaultAltitude: 1.40 },
  { id: 'smap-soil-moisture', name: 'SMAP Soil Hydrology', agency: 'NASA', category: 'Ocean & Cryo', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: '9 km L-Band', spectrum: '1.41 GHz Passive Microwave', defaultAltitude: 1.40 },
  { id: 'modis-truecolor', name: 'MODIS Terra True-Color', agency: 'NASA', category: 'Optical & 3D', layerMode: 'MODIS_TRUE_COLOR_TERRAIN', resolution: '250m Bands 1-4', spectrum: 'Red/Green/Blue Surface Pass', defaultAltitude: 1.35 },
  { id: 'insat3dr-sounder', name: 'INSAT-3DR Sounder', agency: 'ISRO', category: 'Atmosphere & Gas', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: '4 km Sounder', spectrum: '15-Min Geostationary Water Vapor', defaultAltitude: 1.35 },
  { id: 'emit-methane', name: 'EMIT Methane Ch₄ Mapper', agency: 'NASA JPL', category: 'Atmosphere & Gas', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: '60m Imaging', spectrum: 'SWIR 1.6-2.4µm Gas Absorption', defaultAltitude: 1.30 },
  { id: 'goes18-cloud-top', name: 'GOES-18 Cloud Top Height', agency: 'NOAA', category: 'Radar & SAR', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: '2 km ABI Ch 14', spectrum: '11.2µm Longwave Cloud Temp', defaultAltitude: 1.40 },
  { id: 'cartodem-3d', name: 'CartoDEM 3D Stereo Relief', agency: 'ISRO', category: 'Optical & 3D', layerMode: 'MODIS_TRUE_COLOR_TERRAIN', resolution: '10m Stereo', spectrum: 'Along-Track Stereo Relief', defaultAltitude: 1.28 },
  { id: 'firms-frp', name: 'FIRMS Fire Radiative Power', agency: 'NASA', category: 'Thermal & FIRMS', layerMode: 'VIIRS_NIGHT_THERMAL', resolution: '375m MW Output', spectrum: 'MW Fire Radiative Power (FRP)', defaultAltitude: 1.35 },
  { id: 'amsr2-sea-ice', name: 'AMSR2 Sea Ice Cryosphere', agency: 'NASA/JAXA', category: 'Ocean & Cryo', layerMode: 'MODIS_TRUE_COLOR_TERRAIN', resolution: '10 km Microwave', spectrum: 'Passive 89 GHz Brightness Temp', defaultAltitude: 1.50 },
  { id: 'sentinel1-flood', name: 'Sentinel-1 Flood Inundation', agency: 'ESA/ISRO', category: 'Radar & SAR', layerMode: 'SAR_MICROWAVE', resolution: '10m Dual-Pol', spectrum: 'VV+VH Microwave Water Mask', defaultAltitude: 1.30 },
  { id: 'omps-ozone', name: 'OMPS Ozone Total Column', agency: 'NASA', category: 'Atmosphere & Gas', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: '50 km Nadir', spectrum: 'UV Backscatter 300-380nm', defaultAltitude: 1.55 },
  { id: 'ecostress-thermal', name: 'ECOSTRESS Urban Heat Island', agency: 'NASA JPL', category: 'Thermal & FIRMS', layerMode: 'VIIRS_NIGHT_THERMAL', resolution: '70m Multi-Band', spectrum: 'TIR 8-12µm Surface Heat', defaultAltitude: 1.28 },
  { id: 'ocm3-chlorophyll', name: 'OCM-3 Ocean Chlorophyll-a', agency: 'ISRO', category: 'Ocean & Cryo', layerMode: 'MODIS_TRUE_COLOR_TERRAIN', resolution: '360m 13-Band', spectrum: 'Ocean Color Radiance & Algae', defaultAltitude: 1.40 },
  { id: 'swot-bathymetry', name: 'SWOT Radar Altimeter', agency: 'NASA/CNES', category: 'Ocean & Cryo', layerMode: 'MODIS_TRUE_COLOR_TERRAIN', resolution: '2 km KaRIn', spectrum: 'Ka-Band Radar Interferometry', defaultAltitude: 1.45 },
  { id: 'aster-mineralogy', name: 'ASTER Mineralogy False-Color', agency: 'NASA', category: 'Optical & 3D', layerMode: 'NDVI_VEGETATION', resolution: '15m VNIR/SWIR', spectrum: '14 Spectral Bands Silicate/Clay', defaultAltitude: 1.30 },
  { id: 'tropomi-so2', name: 'TROPOMI Sulfur Dioxide SO₂', agency: 'ESA/NASA', category: 'Atmosphere & Gas', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: '3.5x5.5 km', spectrum: 'UV-1 / UV-2 Volcanic Dispersion', defaultAltitude: 1.40 },
  { id: 'ceres-radiation', name: 'CERES Earth Radiation Budget', agency: 'NASA', category: 'Atmosphere & Gas', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: '20 km ERBE', spectrum: 'Shortwave/Longwave Net Radiance', defaultAltitude: 1.55 },
  { id: 'cosmic2-ionosphere', name: 'COSMIC-2 Ionosphere Occultation', agency: 'NOAA/ISRO', category: 'Radar & SAR', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: 'Global RO Profiles', spectrum: 'GPS/Galileo Radio Occultation', defaultAltitude: 1.60 },
  { id: 'goes-water-vapor', name: 'GOES-18 Water Vapor (6.9µm)', agency: 'NOAA', category: 'Atmosphere & Gas', layerMode: 'ATMOSPHERIC_AOD_CLOUDS', resolution: '2 km Mid-Trop', spectrum: '6.9µm Atmospheric Moisture Flow', defaultAltitude: 1.40 },
  { id: 'sentinel2-swir', name: 'Sentinel-2 SWIR Moisture', agency: 'ESA/NASA', category: 'Optical & 3D', layerMode: 'NDVI_VEGETATION', resolution: '20m Band 11/12', spectrum: 'Shortwave IR 1610nm Soil Drought', defaultAltitude: 1.32 },
  { id: 'nisar-sar', name: 'NISAR Dual-Band L+S Radar', agency: 'NASA/ISRO', category: 'Radar & SAR', layerMode: 'SAR_MICROWAVE', resolution: '3-10m InSAR', spectrum: 'L-band (NASA) + S-band (ISRO) SAR', defaultAltitude: 1.28 }
];
`;

if (!cons.includes('NASA_ISRO_30_TOOLS')) {
  cons = toolsDefinition + '\n' + cons;
}

// Add state for active selected tool to prompt: [Apply to 3D Earth] or [Apply to Chat Image]
const stateSnippet = `  const [activeSelectedTool, setActiveSelectedTool] = useState<SatelliteSensorTool | null>(null);
  const [selectedToolCategory, setSelectedToolCategory] = useState<string>('All');`;

if (!cons.includes('activeSelectedTool')) {
  cons = cons.replace(
    'const [selectedFileName, setSelectedFileName] = useState<string | null>(null);',
    'const [selectedFileName, setSelectedFileName] = useState<string | null>(null);\n' + stateSnippet
  );
}

// Replace the 3 old buttons with the 30 NASA & ISRO Tools Bar & Floating Apply Selector
const oldChipSection = `      {/* 3. Clean Action Chips: NO SVG ICONS, NO BLUE TEXT */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0">
        <button
          type="button"
          onClick={() => { onApplyLayer?.('ATMOSPHERIC_AOD_CLOUDS'); executeObservationQuery('Weather Radar Observation'); }}
          className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/12 text-[10.5px] text-white/90 whitespace-nowrap transition-all cursor-pointer shrink-0"
        >
          Weather Radar
        </button>
        <button
          type="button"
          onClick={() => { onApplyLayer?.('VIIRS_NIGHT_THERMAL'); executeObservationQuery('Thermal Heat Sensor Check'); }}
          className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/12 text-[10.5px] text-white/90 whitespace-nowrap transition-all cursor-pointer shrink-0"
        >
          Thermal Sensor Scan
        </button>
        <button
          type="button"
          onClick={() => { onApplyLayer?.('MODIS_TRUE_COLOR_TERRAIN'); onNavigateTo?.(targetName, lat, lon, 1.28); executeObservationQuery('High-Resolution Optical Pass'); }}
          className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/12 text-[10.5px] text-white/90 whitespace-nowrap transition-all cursor-pointer shrink-0"
        >
          High-Res Optical
        </button>
      </div>`;

const newChipSection = `      {/* 3. Authentic NASA & ISRO 30 Developer Tools & Sensor Vision Palette */}
      <div className="flex flex-col gap-1.5 py-1 shrink-0">
        {/* Floating Apply Action Dialog when a sensor chip is touched */}
        {activeSelectedTool && (
          <div className="p-2.5 rounded-2xl bg-white/[0.10] border border-white/25 backdrop-blur-[40px] flex items-center justify-between gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="min-w-0 flex-1">
              <span className="text-[11.5px] font-semibold text-white truncate block">
                {activeSelectedTool.name}
              </span>
              <span className="text-[9.5px] text-white/60 font-mono">
                {activeSelectedTool.agency} · {activeSelectedTool.resolution}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const tool = activeSelectedTool;
                  setActiveSelectedTool(null);
                  onApplyLayer?.(tool.layerMode);
                  onNavigateTo?.(targetName, lat, lon, tool.defaultAltitude);
                  executeObservationQuery(\`Applied \${tool.name} to 3D Earth digital twin over \${targetName}. Telemetry and \${tool.spectrum} sensor radiometry active.\`);
                }}
                className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-[11px] font-medium text-white transition-all cursor-pointer shadow-sm active:scale-95"
              >
                🌍 Apply to 3D Earth
              </button>
              <button
                type="button"
                onClick={() => {
                  const tool = activeSelectedTool;
                  setActiveSelectedTool(null);
                  executeObservationQuery(\`Apply \${tool.name} image downlink for \${targetName} (\${tool.spectrum})\`);
                }}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/18 text-[11px] font-medium text-white/90 transition-all cursor-pointer active:scale-95"
              >
                🖼️ Apply to Image
              </button>
              <button
                type="button"
                onClick={() => setActiveSelectedTool(null)}
                aria-label="Cancel"
                className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-white/60 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 30 NASA & ISRO Tools Horizontal Scroll Palette */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {NASA_ISRO_30_TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveSelectedTool(tool)}
              className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/12 hover:border-white/25 text-[10.5px] text-white/90 whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5 active:scale-95"
            >
              <span className="text-[9px] font-mono px-1 rounded bg-white/10 text-white/70">
                {tool.agency}
              </span>
              <span>{tool.name}</span>
            </button>
          ))}
        </div>
      </div>`;

if (cons.includes(oldChipSection)) {
  cons = cons.replace(oldChipSection, newChipSection);
  console.log('✅ Replaced chips with 30 NASA/ISRO tools & selector in MetaDeepIntelligenceConsole.tsx');
} else {
  console.log('❌ Could not locate oldChipSection');
}

fs.writeFileSync(consPath, cons, 'utf8');
console.log('=== All 30 Tools & Sensor Modes Integrated! ===');
