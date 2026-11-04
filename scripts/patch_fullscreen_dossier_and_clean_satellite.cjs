const fs = require('fs');
const path = require('path');

console.log('=== APPLYING USER FIXES: REMOVE PAYLOAD & SGP4 TEXT, DEDICATED FULLSCREEN DOSSIER PAGE, AND CHAT FOLDER SAVING ===');

// 1. SatelliteTelemetryModal.tsx: Remove Payload strip and Live SGP4 Orbit Propagation text
const satModalPath = path.join(__dirname, '../remix-remix-earthui-designer/src/components/SatelliteTelemetryModal.tsx');
let satContent = fs.readFileSync(satModalPath, 'utf8');

// Remove Sensor Specs / Payload card
satContent = satContent.replace(
  /\{\/\* Sensor Specs \*\/\}[\s\S]*?\{\/\* Action Footer \*\/\}/g,
  '{/* Action Footer */}'
);

// Remove Live SGP4 Orbit Propagation text
satContent = satContent.replace(
  /<span className="text-\[11px\] text-white\/50 font-mono">\s*Live SGP4 Orbit Propagation\s*<\/span>/g,
  ''
);

// Adjust Action Footer container to cleanly align Track Next Satellite button
satContent = satContent.replace(
  /<div className="pt-2 flex items-center justify-between gap-3">/g,
  '<div className="pt-2 flex items-center justify-end gap-3">'
);

fs.writeFileSync(satModalPath, satContent, 'utf8');
console.log('✅ SatelliteTelemetryModal.tsx: removed Payload and Live SGP4 Orbit Propagation text!');

// 2. Create missionArchiveStorage.ts utility so every chat automatically creates/updates an archive folder
const archiveUtilPath = path.join(__dirname, '../remix-remix-earthui-designer/src/utils/missionArchiveStorage.ts');
const archiveUtilContent = `export interface ArchivedMissionQuery {
  query: string;
  response: string;
  time: string;
}

export interface MissionArchiveFolder {
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
  queries: ArchivedMissionQuery[];
}

export const DEFAULT_ARCHIVE_FOLDERS: MissionArchiveFolder[] = [
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
    sensor: 'ISRO Oceansat-3 Ku-Band Scatterometer',
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

export function saveMissionChatToArchive(params: {
  title: string;
  sector?: string;
  lat: number;
  lon: number;
  altitude?: number;
  layer?: string;
  sensor?: string;
  query: string;
  response: string;
}) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('sata_mission_archive_folders');
    let folders: MissionArchiveFolder[] = raw ? JSON.parse(raw) : [...DEFAULT_ARCHIVE_FOLDERS];
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC';
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    // Look for existing folder by title or match query
    const cleanTitle = params.title.trim() || params.query.trim();
    const existingIdx = folders.findIndex(
      (f) => f.title.toLowerCase() === cleanTitle.toLowerCase() || f.queries.some(q => q.query.toLowerCase() === params.query.toLowerCase())
    );

    if (existingIdx !== -1) {
      folders[existingIdx].queries.push({
        query: params.query,
        response: params.response,
        time: timeStr,
      });
      folders[existingIdx].timestamp = timeStr;
      folders[existingIdx].summary = params.response.slice(0, 160) + '...';
      const [moved] = folders.splice(existingIdx, 1);
      folders.unshift(moved);
    } else {
      const newFolder: MissionArchiveFolder = {
        id: \`mission-\${Date.now()}\`,
        title: cleanTitle,
        sector: params.sector || \`\${Math.abs(params.lat).toFixed(1)}°\${params.lat >= 0 ? 'N' : 'S'}, \${Math.abs(params.lon).toFixed(1)}°\${params.lon >= 0 ? 'E' : 'W'}\`,
        lat: params.lat,
        lon: params.lon,
        altitude: params.altitude || 1.28,
        layer: params.layer || 'MODIS_TRUE_COLOR_TERRAIN',
        sensor: params.sensor || 'ISRO Cartosat-3 / Sentinel-3 Multi-Spectral',
        timestamp: timeStr,
        date: dateStr,
        summary: params.response.slice(0, 160) + '...',
        queries: [
          {
            query: params.query,
            response: params.response,
            time: timeStr,
          },
        ],
      };
      folders.unshift(newFolder);
    }

    folders = folders.slice(0, 40);
    localStorage.setItem('sata_mission_archive_folders', JSON.stringify(folders));
    window.dispatchEvent(new CustomEvent('sata-history-updated'));
  } catch (e) {
    console.warn('Failed to save to mission archive:', e);
  }
}
`;
fs.writeFileSync(archiveUtilPath, archiveUtilContent, 'utf8');
console.log('✅ missionArchiveStorage.ts created!');

// 3. Connect saveMissionChatToArchive in App.tsx
let appContent = fs.readFileSync(path.join(__dirname, '../remix-remix-earthui-designer/src/App.tsx'), 'utf8');
if (!appContent.includes('saveMissionChatToArchive')) {
  appContent = `import { saveMissionChatToArchive } from './utils/missionArchiveStorage';\n` + appContent;
  
  // When search reasoning arrives in App.tsx
  appContent = appContent.replace(
    /setLiveAiDispatchState\(data\);/g,
    `setLiveAiDispatchState(data);
        saveMissionChatToArchive({
          title: q,
          sector: data.targetName,
          lat: data.lat,
          lon: data.lon,
          layer: data.layerType,
          query: q,
          response: data.briefingSummary || data.briefingBody || 'Observation synchronized.',
        });`
  );
  fs.writeFileSync(path.join(__dirname, '../remix-remix-earthui-designer/src/App.tsx'), appContent, 'utf8');
  console.log('✅ App.tsx connected to saveMissionChatToArchive!');
}

// 4. Connect saveMissionChatToArchive in MetaDeepIntelligenceConsole.tsx
let consoleContent = fs.readFileSync(path.join(__dirname, '../remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx'), 'utf8');
if (!consoleContent.includes('saveMissionChatToArchive')) {
  consoleContent = `import { saveMissionChatToArchive } from '../utils/missionArchiveStorage';\n` + consoleContent;
  
  // When follow-up agentReply arrives
  consoleContent = consoleContent.replace(
    /setMessages\(\(prev\) => \[\.\.\.prev, agentReply\]\);/g,
    `setMessages((prev) => [...prev, agentReply]);
        saveMissionChatToArchive({
          title: q,
          sector: targetName,
          lat,
          lon,
          query: q,
          response: replyText,
        });`
  );
  fs.writeFileSync(path.join(__dirname, '../remix-remix-earthui-designer/src/components/MetaDeepIntelligenceConsole.tsx'), consoleContent, 'utf8');
  console.log('✅ MetaDeepIntelligenceConsole.tsx connected to saveMissionChatToArchive!');
}

// 5. CommanderProfileModal.tsx: Make it a FULLSCREEN SEPARATE PAGE with satellite/space image background, ZERO EARTH
const profileModalContent = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DEFAULT_ARCHIVE_FOLDERS,
  type MissionArchiveFolder,
} from '../utils/missionArchiveStorage';

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
  const [folders, setFolders] = useState<MissionArchiveFolder[]>(() => {
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

  const [selectedFolderId, setSelectedFolderId] = useState<string>(() => {
    return folders[0]?.id || DEFAULT_ARCHIVE_FOLDERS[0]?.id || '';
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('sata_mission_archive_folders');
        if (saved) {
          const parsed = JSON.parse(saved);
          setFolders(parsed);
          if (parsed.length > 0 && !parsed.some((f: MissionArchiveFolder) => f.id === selectedFolderId)) {
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] w-screen h-screen flex flex-col select-none overflow-hidden"
          style={{
            // High-resolution cosmic satellite background image with dark vignette (ZERO 3D globe)
            backgroundImage: \`radial-gradient(ellipse at center, rgba(10, 15, 30, 0.82) 0%, rgba(3, 7, 18, 0.95) 70%, rgba(0, 0, 0, 0.99) 100%), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")\`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#030712',
          }}
        >
          {/* Top Fullscreen Header Navigation */}
          <header className="w-full px-5 sm:px-8 py-4 sm:py-5 border-b border-white/12 flex items-center justify-between shrink-0 bg-white/[0.03] backdrop-blur-[40px]">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">
                  SATA ARCHIVE
                </span>
                <span className="text-[11px] text-white/30">|</span>
                <span className="text-[11px] text-white/70 font-mono">
                  {folders.length} MISSION FOLDERS SAVED
                </span>
              </div>
              <h1 className="text-[20px] sm:text-[24px] font-semibold tracking-tight text-white">
                Mission History & Flight Dossier
              </h1>
            </div>

            {/* Actions: Pure Text Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportHistory}
                className="px-4 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-[12px] font-medium text-white/90 transition-all cursor-pointer"
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={handleClearHistory}
                className="px-4 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/12 text-[12px] font-medium text-white/60 hover:text-white transition-all cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Back to 3D Globe"
                className="px-5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/25 text-[12px] font-medium text-white transition-all cursor-pointer shadow-lg ml-1"
              >
                Back to 3D Globe
              </button>
            </div>
          </header>

          {/* Full-Page Two-Column ISO Frosted Glass Workspace */}
          <div className="flex-1 min-h-0 w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 overflow-hidden">
            {/* Left Column: Mission Archive Folders List */}
            <div className="md:col-span-5 flex flex-col min-h-0 rounded-[24px] bg-white/[0.05] border border-white/15 p-4 overflow-hidden backdrop-blur-[45px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between px-2 pb-3 border-b border-white/10 shrink-0">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Chat & Mission Folders ({folders.length})
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  Auto-Synchronized
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1 mt-3 sata-sidebar-scroll">
                {folders.map((f) => {
                  const isSelected = f.id === activeFolder?.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFolderId(f.id)}
                      className={\`w-full text-left p-4 rounded-[18px] transition-all cursor-pointer flex flex-col gap-1.5 border \${
                        isSelected
                          ? 'bg-white/[0.18] border-white/40 shadow-[0_4px_24px_rgba(255,255,255,0.12),inset_0_1px_1px_rgba(255,255,255,0.35)]'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                      }\`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13.5px] font-semibold text-white tracking-tight truncate">
                          {f.title}
                        </span>
                        <span className="text-[10.5px] text-white/40 font-mono shrink-0">
                          {f.timestamp}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-white/60 line-clamp-1">
                        {f.sector}
                      </div>
                      <div className="flex items-center justify-between pt-1 text-[10.5px] text-white/45 font-mono">
                        <span>{f.lat.toFixed(1)}°N, {f.lon.toFixed(1)}°E</span>
                        <span className="text-white/70 font-sans">{f.queries.length} {f.queries.length === 1 ? 'chat query' : 'chat queries'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Mission Telemetry & Chat Queries Dossier */}
            <div className="md:col-span-7 flex flex-col min-h-0 rounded-[24px] bg-white/[0.05] border border-white/15 p-5 sm:p-7 overflow-hidden backdrop-blur-[45px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              {activeFolder ? (
                <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto pr-1 sata-sidebar-scroll">
                  {/* Header Strip */}
                  <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-white/10 border border-white/15 text-white/80">
                          Archived Dossier
                        </span>
                        <span className="text-[11px] text-white/50 font-mono">
                          {activeFolder.date} {activeFolder.timestamp}
                        </span>
                      </div>
                      <h2 className="text-[20px] sm:text-[22px] font-semibold text-white tracking-tight">
                        {activeFolder.title}
                      </h2>
                      <p className="text-[12.5px] text-white/60">
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
                        className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-[12px] font-medium text-white transition-all cursor-pointer shrink-0"
                      >
                        Fly to Sector on 3D Earth
                      </button>
                    )}
                  </div>

                  {/* Sensor Coordinates & Specs Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-[16px] bg-white/[0.04] border border-white/10">
                      <div className="text-[9.5px] uppercase font-mono tracking-wider text-white/50">
                        Coordinates
                      </div>
                      <div className="text-[12.5px] font-mono text-white/90 mt-0.5">
                        {activeFolder.lat.toFixed(2)}° N, {activeFolder.lon.toFixed(2)}° E
                      </div>
                    </div>

                    <div className="p-3.5 rounded-[16px] bg-white/[0.04] border border-white/10">
                      <div className="text-[9.5px] uppercase font-mono tracking-wider text-white/50">
                        Primary Sensor
                      </div>
                      <div className="text-[12.5px] font-medium text-white/90 mt-0.5 truncate">
                        {activeFolder.sensor}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-[16px] bg-white/[0.04] border border-white/10">
                      <div className="text-[9.5px] uppercase font-mono tracking-wider text-white/50">
                        Layer Mode
                      </div>
                      <div className="text-[12.5px] font-mono text-white/80 mt-0.5 truncate">
                        {activeFolder.layer}
                      </div>
                    </div>
                  </div>

                  {/* Executive Briefing Card */}
                  <div className="p-4 rounded-[18px] bg-white/[0.04] border border-white/10">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-white/50 mb-1">
                      Observation Brief
                    </div>
                    <p className="text-[13px] text-white/85 leading-relaxed">
                      {activeFolder.summary}
                    </p>
                  </div>

                  {/* Conversation History For This Specific Chat Folder */}
                  <div className="space-y-3">
                    <div className="text-[10.5px] uppercase font-mono tracking-wider text-white/50">
                      Chat Queries & Telemetry Deductions ({activeFolder.queries.length})
                    </div>

                    {activeFolder.queries.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-[18px] bg-white/[0.04] border border-white/10 space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11.5px] text-white/60">
                          <span className="font-semibold text-white/95">User: "{q.query}"</span>
                          <span className="font-mono text-[10.5px]">{q.time}</span>
                        </div>
                        <div className="text-[12.5px] text-white/80 leading-relaxed pt-2 border-t border-white/10">
                          {q.response}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/40 text-[13px]">
                  No mission folder selected
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
`;

const profileModalFile = path.join(__dirname, '../remix-remix-earthui-designer/src/components/CommanderProfileModal.tsx');
fs.writeFileSync(profileModalFile, profileModalContent, 'utf8');
console.log('✅ CommanderProfileModal.tsx rewritten to Dedicated Fullscreen Page with Satellite Image Background (Zero 3D Earth)!');

console.log('=== ALL USER CHANGES COMPLETED ===');
