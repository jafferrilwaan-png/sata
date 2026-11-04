const fs = require('fs');
const path = require('path');

console.log('=== APPLYING COMPLETE USER FIXES: MODEL SELECTOR, ZERO OVERLAYS, ZERO DOTS, ZERO SVGS ON DOSSIER, PURE ISO GLASS ===');

// 1. App.tsx: Restore Model Selector permanently in search bar and position properly when top
const appPath = path.join(__dirname, '../remix-remix-earthui-designer/src/App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Remove {!isSearchSubmitted && ( and its closing )}
appContent = appContent.replace(/\{\!isSearchSubmitted && \(\s*<div className="relative">/g, '<div className="relative">');
// Find the closing )} of this block right before </div>\s*</motion.form>
appContent = appContent.replace(/(\s*<\/div>\s*)\}\)\s*(<\/div>\s*<\/motion\.form>)/g, '$1$2');

// Fix the dropdown positioning so it opens downwards when bar is at top
appContent = appContent.replace(
  /className="absolute right-0 bottom-full mb-2 w-\[220px\] rounded-\[18px\] border border-white\/15 bg-black\/60 backdrop-blur-2xl p-1\.5 shadow-\[0_20px_50px_rgba\(0,0,0,0\.65\),inset_0_1px_1px_rgba\(255,255,255,0\.22\)\] z-50 flex flex-col gap-1 text-white"/g,
  'className={`absolute right-0 ${isSearchSubmitted ? "top-full mt-2" : "bottom-full mb-2"} w-[220px] rounded-[18px] border border-white/20 bg-white/[0.08] backdrop-blur-[40px] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)] z-50 flex flex-col gap-1 text-white`}'
);

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('✅ App.tsx model selector restored permanently & positioning fixed!');

// 2. ObservationSidebar.tsx: Remove overlay badge on video/image and all dots
const sidebarPath = path.join(__dirname, '../remix-remix-earthui-designer/src/components/ObservationSidebar.tsx');
let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Remove the overlay badge on top of the video completely
sidebarContent = sidebarContent.replace(
  /<div className="absolute top-1\.5 left-2 px-2 py-0\.5 rounded-full bg-black\/65 backdrop-blur-md border border-white\/20 text-\[8\.5px\] font-mono uppercase tracking-wider text-white flex items-center gap-1\.5 pointer-events-none">[\s\S]*?<\/div>/g,
  ''
);

// Remove any remaining animate-ping or emerald dots
sidebarContent = sidebarContent.replace(/<span className="w-1\.5 h-1\.5 rounded-full bg-emerald-400 animate-pulse" \/>/g, '');
sidebarContent = sidebarContent.replace(/<span className="w-1\.5 h-1\.5 rounded-full bg-emerald-400 animate-ping" \/>/g, '');

fs.writeFileSync(sidebarPath, sidebarContent, 'utf8');
console.log('✅ ObservationSidebar.tsx video overlays and dots removed!');

// 3. SatelliteTelemetryModal.tsx: Remove video overlays, remove dots, clean glass
const telemetryPath = path.join(__dirname, '../remix-remix-earthui-designer/src/components/SatelliteTelemetryModal.tsx');
let satContent = fs.readFileSync(telemetryPath, 'utf8');

// Remove video overlays (watermark & nadir telemetry strip)
satContent = satContent.replace(
  /\{\/\* Live Broadcast Watermark & Speed Indicator \*\/\}[\s\S]*?\{\/\* Clean Sub-Satellite Nadir Point/g,
  '{/* Clean Sub-Satellite Nadir Point'
);

// Modal container to pure transparent frosted glass
satContent = satContent.replace(/bg-black\/90/g, 'bg-black/20');
satContent = satContent.replace(/bg-black\/80/g, 'bg-black/20');
satContent = satContent.replace(/bg-white\/\[0\.07\]/g, 'bg-white/[0.08]');
satContent = satContent.replace(/shadow-\[0_32px_90px_rgba\(0,0,0,0\.9\)/g, 'shadow-[0_24px_70px_rgba(0,0,0,0.35)');
satContent = satContent.replace(/text-emerald-400/g, 'text-white/80');
satContent = satContent.replace(/·/g, ' ');
satContent = satContent.replace(/•/g, ' ');

fs.writeFileSync(telemetryPath, satContent, 'utf8');
console.log('✅ SatelliteTelemetryModal.tsx video overlays, dark shadows, and dots removed!');

// 4. CommanderProfileModal.tsx: Pure Text, Zero SVGs, Zero Green Badges, Full-Page Frosted ISO Glass
const profileModalContent = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface MissionFolder {
  id: string;
  title: string;
  sector: string;
  lat: number;
  lon: number;
  altitude: number;
  layer: string;
  sensor: string;
  timestamp: string;
  date: string;
  summary: string;
  queries: { query: string; response: string; time: string }[];
}

const DEFAULT_ARCHIVE_FOLDERS: MissionFolder[] = [
  {
    id: 'mission-india-highres',
    title: 'India Submeter Optical Pass',
    sector: 'Indian Subcontinent (Peninsular & Deccan)',
    lat: 20.59,
    lon: 78.96,
    altitude: 1.28,
    layer: 'MODIS_TRUE_COLOR_TERRAIN',
    sensor: 'ISRO Cartosat-3 (0.28m GSD) + Sentinel-3',
    timestamp: '21:15 UTC',
    date: 'Nov 03, 2026',
    summary: 'Submeter panchromatic and 1.12m multi-spectral true-color satellite reconnaissance across India with along-track stereo 3D terrain elevation.',
    queries: [
      {
        query: 'HIGH-RES FOR INDIA WITH CLEAR RESOLUTION OF 3D',
        response: 'Cartosat-3 submeter nadir pass locked at 0.28m resolution over India. 3D digital elevation model synchronized with clear-sky atmospheric transmission.',
        time: '21:12 UTC',
      },
      {
        query: 'High-Resolution Optical Pass',
        response: 'Active 0.28m optical downlink confirmed. Multi-spectral reflectance calibrated for topography, canopy, and urban sectors.',
        time: '21:15 UTC',
      },
    ],
  },
  {
    id: 'mission-sydney-radar',
    title: 'Sydney Coastal Surveillance',
    sector: 'New South Wales, Australia',
    lat: -33.86,
    lon: 151.21,
    altitude: 1.28,
    layer: 'MODIS_TRUE_COLOR_TERRAIN',
    sensor: 'NOAA-20 VIIRS + Doppler Weather Radar',
    timestamp: '20:35 UTC',
    date: 'Nov 03, 2026',
    summary: 'Coastal marine boundary observation, Tasman Sea sea-surface temperature, and high-definition orbital tracking across Sydney Harbour basin.',
    queries: [
      {
        query: 'Sydney, Australia',
        response: 'Geospatial lock established over Sydney (33.86° S, 151.21° E). Surface temperature 22°C with calm coastal sea breezes.',
        time: '20:35 UTC',
      },
    ],
  },
  {
    id: 'mission-mawsynram-precip',
    title: 'Mawsynram Extreme Hydrology',
    sector: 'East Khasi Hills, Meghalaya, India',
    lat: 25.30,
    lon: 91.58,
    altitude: 1.28,
    layer: 'ATMOSPHERIC_AOD_CLOUDS',
    sensor: 'NASA GPM Dual-Frequency Radar + INSAT-3DR',
    timestamp: '19:42 UTC',
    date: 'Nov 03, 2026',
    summary: 'Orographic condensation study over the wettest inhabited sector on Earth (11,872mm annual precipitation) with deep cloud column vorticity.',
    queries: [
      {
        query: 'Which place has highest rainfall on Earth?',
        response: 'Mawsynram, Meghalaya officially records the highest annual rainfall on Earth due to intense Bay of Bengal monsoon moisture trapped in deep plateau valleys.',
        time: '19:42 UTC',
      },
    ],
  },
  {
    id: 'mission-bay-bengal-cyclone',
    title: 'Bay of Bengal Deep Depression',
    sector: 'Bay of Bengal Marine Sector',
    lat: 15.00,
    lon: 88.00,
    altitude: 1.28,
    layer: 'VIIRS_NIGHT_THERMAL',
    sensor: 'ISRO Oceansat-3 + GOES-16 ABI',
    timestamp: '18:50 UTC',
    date: 'Nov 03, 2026',
    summary: 'Oceanic thermal boundary scan, Ku-band scatterometer surface wind field velocity, and cyclonic vortex atmospheric moisture detection.',
    queries: [
      {
        query: 'Bay of Bengal cyclonic circulation',
        response: 'Central pressure 985 hPa, max sustained winds 165 km/h. Sea surface temperatures monitored at 29.4°C across marine swath.',
        time: '18:50 UTC',
      },
    ],
  },
];

interface CommanderProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFlyToLocation?: (name: string, lat: number, lon: number, altitude: number, layer: string) => void;
}

export const CommanderProfileModal: React.FC<CommanderProfileModalProps> = ({
  isOpen,
  onClose,
  onFlyToLocation,
}) => {
  const [folders, setFolders] = useState<MissionFolder[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sata_mission_archive_folders');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load mission folders:', e);
      }
    }
    return DEFAULT_ARCHIVE_FOLDERS;
  });

  const [selectedFolderId, setSelectedFolderId] = useState<string>(
    DEFAULT_ARCHIVE_FOLDERS[0]?.id || ''
  );

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('sata_mission_archive_folders');
        if (saved) {
          const parsed = JSON.parse(saved);
          setFolders(parsed);
          if (parsed.length > 0 && !parsed.some((f: MissionFolder) => f.id === selectedFolderId)) {
            setSelectedFolderId(parsed[0].id);
          }
        }
      } catch (e) {
        console.warn('Failed to reload folders:', e);
      }
    };
    window.addEventListener('sata-history-updated', handleUpdate);
    return () => window.removeEventListener('sata-history-updated', handleUpdate);
  }, [selectedFolderId]);

  const activeFolder = folders.find((f) => f.id === selectedFolderId) || folders[0];

  const handleExportHistory = () => {
    const blob = new Blob([JSON.stringify(folders, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`sata_missions_\${new Date().toISOString().slice(0, 10)}.json\`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all mission archive folders?')) {
      localStorage.removeItem('sata_mission_archive_folders');
      setFolders(DEFAULT_ARCHIVE_FOLDERS);
      setSelectedFolderId(DEFAULT_ARCHIVE_FOLDERS[0].id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 select-none pointer-events-auto">
          {/* Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
          />

          {/* Full-Page Clean Frosted ISO Glass Dossier Modal — ZERO SVGs, ZERO Green */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mission History and Flight Dossier"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-6xl h-[90vh] rounded-[28px] p-5 sm:p-7 border border-white/25 bg-white/[0.08] backdrop-blur-[50px] saturate-[180%] shadow-[0_24px_80px_rgba(0,0,0,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.35)] text-white flex flex-col overflow-hidden"
          >
            {/* Top Clean Glass Header: Pure Typography */}
            <div className="flex items-center justify-between pb-4 border-b border-white/12 shrink-0 gap-4">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-[20px] sm:text-[23px] font-semibold tracking-tight text-white">
                  Mission History & Flight Dossier
                </h2>
                <p className="text-[12px] text-white/60">
                  Archived Satellite Observations and Geospatial Telemetry Folders
                </p>
              </div>

              {/* Action Buttons: Pure Text Pills */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportHistory}
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-[11.5px] font-medium text-white/90 transition-all cursor-pointer"
                >
                  Export
                </button>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/12 text-[11.5px] font-medium text-white/70 hover:text-white transition-all cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Dossier"
                  className="px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-[12px] font-medium text-white transition-all cursor-pointer ml-1"
                >
                  Done
                </button>
              </div>
            </div>

            {/* Main Two-Column Clean Glass Dossier Layout */}
            <div className="flex-1 min-h-0 pt-4 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 overflow-hidden">
              {/* Left Column: Mission Archive Folders List */}
              <div className="md:col-span-5 flex flex-col min-h-0 rounded-[20px] bg-white/[0.04] border border-white/12 p-3 overflow-hidden backdrop-blur-md">
                <div className="flex items-center justify-between px-2 pb-2.5 border-b border-white/10 shrink-0">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                    Archived Missions ({folders.length})
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    Local Archive
                  </span>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 mt-2.5 sata-sidebar-scroll">
                  {folders.map((f) => {
                    const isSelected = f.id === activeFolder?.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setSelectedFolderId(f.id)}
                        className={\`w-full text-left p-3.5 rounded-[16px] transition-all cursor-pointer flex flex-col gap-1.5 border \${
                          isSelected
                            ? 'bg-white/[0.15] border-white/35 shadow-[0_4px_20px_rgba(255,255,255,0.1),inset_0_1px_1px_rgba(255,255,255,0.3)]'
                            : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                        }\`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-semibold text-white tracking-tight truncate">
                            {f.title}
                          </span>
                          <span className="text-[10px] text-white/40 font-mono shrink-0">
                            {f.timestamp}
                          </span>
                        </div>
                        <div className="text-[11px] text-white/60 line-clamp-1">
                          {f.sector}
                        </div>
                        <div className="flex items-center justify-between pt-1 text-[10px] text-white/45 font-mono">
                          <span>{f.lat.toFixed(1)}°N, {f.lon.toFixed(1)}°E</span>
                          <span className="text-white/60 font-sans">{f.queries.length} queries</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Mission Telemetry Dossier Details */}
              <div className="md:col-span-7 flex flex-col min-h-0 rounded-[20px] bg-white/[0.04] border border-white/12 p-4 sm:p-5 overflow-hidden backdrop-blur-md">
                {activeFolder ? (
                  <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto pr-1 sata-sidebar-scroll">
                    {/* Mission Header Strip — Clean Pure Typography, No Green */}
                    <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-white/10 border border-white/15 text-white/80">
                            Archived Dossier
                          </span>
                          <span className="text-[11px] text-white/50 font-mono">
                            {activeFolder.date} {activeFolder.timestamp}
                          </span>
                        </div>
                        <h3 className="text-[18px] sm:text-[20px] font-semibold text-white tracking-tight">
                          {activeFolder.title}
                        </h3>
                        <p className="text-[12px] text-white/60">
                          {activeFolder.sector}
                        </p>
                      </div>

                      {onFlyToLocation && (
                        <button
                          type="button"
                          onClick={() => {
                            onFlyToLocation(
                              activeFolder.title,
                              activeFolder.lat,
                              activeFolder.lon,
                              activeFolder.altitude,
                              activeFolder.layer
                            );
                            onClose();
                          }}
                          className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-[11.5px] font-medium text-white transition-all cursor-pointer shrink-0"
                        >
                          Fly to Sector on 3D Earth
                        </button>
                      )}
                    </div>

                    {/* Sensor Telemetry Badges Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-[14px] bg-white/[0.05] border border-white/10">
                        <div className="text-[9.5px] uppercase font-mono tracking-wider text-white/50">
                          Coordinates
                        </div>
                        <div className="text-[12px] font-mono text-white/90 mt-0.5">
                          {activeFolder.lat.toFixed(2)}° N, {activeFolder.lon.toFixed(2)}° E
                        </div>
                      </div>

                      <div className="p-3 rounded-[14px] bg-white/[0.05] border border-white/10">
                        <div className="text-[9.5px] uppercase font-mono tracking-wider text-white/50">
                          Primary Sensor
                        </div>
                        <div className="text-[12px] font-medium text-white/90 mt-0.5 truncate">
                          {activeFolder.sensor}
                        </div>
                      </div>

                      <div className="p-3 rounded-[14px] bg-white/[0.05] border border-white/10">
                        <div className="text-[9.5px] uppercase font-mono tracking-wider text-white/50">
                          Digital Twin Layer
                        </div>
                        <div className="text-[12px] font-mono text-white/80 mt-0.5 truncate">
                          {activeFolder.layer}
                        </div>
                      </div>
                    </div>

                    {/* Mission Executive Summary */}
                    <div className="p-3.5 rounded-[16px] bg-white/[0.04] border border-white/10">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-white/50 mb-1">
                        Executive Observation Brief
                      </div>
                      <p className="text-[12.5px] text-white/80 leading-relaxed">
                        {activeFolder.summary}
                      </p>
                    </div>

                    {/* Query & Telemetry Deductions History */}
                    <div className="space-y-2.5">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-white/50">
                        Query History & Telemetry Deductions ({activeFolder.queries.length})
                      </div>

                      {activeFolder.queries.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-[16px] bg-white/[0.04] border border-white/10 space-y-2"
                        >
                          <div className="flex items-center justify-between text-[11px] text-white/60">
                            <span className="font-medium text-white/90">User: "{q.query}"</span>
                            <span className="font-mono text-[10px]">{q.time}</span>
                          </div>
                          <div className="text-[12px] text-white/75 leading-relaxed pt-1 border-t border-white/10">
                            {q.response}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-white/40 text-[12px]">
                    No mission archive selected
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
`;

const profileModalPath = path.join(__dirname, '../remix-remix-earthui-designer/src/components/CommanderProfileModal.tsx');
fs.writeFileSync(profileModalPath, profileModalContent, 'utf8');
console.log('✅ CommanderProfileModal.tsx rewritten to Pure Text, Zero SVGs, Zero Green, Full-Page Frosted ISO Glass!');

console.log('=== ALL COMPONENT PATCHES COMPLETED ===');
