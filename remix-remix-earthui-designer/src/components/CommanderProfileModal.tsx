import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, FolderOpen } from 'lucide-react';
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
    a.download = `sata_missions_${new Date().toISOString().slice(0, 10)}.json`;
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
            // High-resolution cosmic satellite Earth orbital vista clearly visible through translucent frosted glass
            backgroundImage: `linear-gradient(to bottom, rgba(8, 15, 35, 0.42), rgba(2, 6, 23, 0.75)), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#030712',
          }}
        >
          {/* Top Fullscreen Header Navigation */}
          <header className="w-full px-5 sm:px-8 py-4 sm:py-5 border-b border-white/12 flex items-center justify-between shrink-0 bg-white/[0.03] backdrop-blur-[40px]">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-white/50">
                  SATA ARCHIVE
                </span>
                <span className="text-[11px] text-white/30">|</span>
                <span className="text-[11px] text-white/70 font-sans font-medium">
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
                <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-white/70">
                  Chat & Mission Folders ({folders.length})
                </span>
                <span className="text-[10px] text-white/40 font-sans font-medium">
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
                      className={`w-full text-left p-4 rounded-[18px] transition-all cursor-pointer flex flex-col gap-1.5 border ${
                        isSelected
                          ? 'bg-white/[0.18] border-white/40 shadow-[0_4px_24px_rgba(255,255,255,0.12),inset_0_1px_1px_rgba(255,255,255,0.35)]'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <Folder className="w-4 h-4 text-white/70 shrink-0" />
                          <span className="text-[13.5px] font-semibold text-white tracking-tight truncate">
                            {f.title}
                          </span>
                        </div>
                        <span className="text-[10.5px] text-white/40 font-sans font-medium shrink-0">
                          {f.timestamp}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-white/60 line-clamp-1">
                        {f.sector}
                      </div>
                      <div className="flex items-center justify-between pt-1 text-[10.5px] text-white/45 font-sans font-medium">
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
                        <span className="px-3 py-0.5 rounded-full text-[10px] font-sans font-medium tracking-wider uppercase bg-white/10 border border-white/15 text-white/80">
                          Archived Dossier
                        </span>
                        <span className="text-[11px] text-white/50 font-sans font-medium">
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
                      <div className="text-[9.5px] uppercase font-sans font-medium tracking-wider text-white/50">
                        Coordinates
                      </div>
                      <div className="text-[12.5px] font-sans font-medium text-white/90 mt-0.5">
                        {activeFolder.lat.toFixed(2)}° N, {activeFolder.lon.toFixed(2)}° E
                      </div>
                    </div>

                    <div className="p-3.5 rounded-[16px] bg-white/[0.04] border border-white/10">
                      <div className="text-[9.5px] uppercase font-sans font-medium tracking-wider text-white/50">
                        Primary Sensor
                      </div>
                      <div className="text-[12.5px] font-medium text-white/90 mt-0.5 truncate">
                        {activeFolder.sensor}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-[16px] bg-white/[0.04] border border-white/10">
                      <div className="text-[9.5px] uppercase font-sans font-medium tracking-wider text-white/50">
                        Layer Mode
                      </div>
                      <div className="text-[12.5px] font-sans font-medium text-white/80 mt-0.5 truncate">
                        {activeFolder.layer}
                      </div>
                    </div>
                  </div>

                  {/* Executive Briefing Card */}
                  <div className="p-4 rounded-[18px] bg-white/[0.04] border border-white/10">
                    <div className="text-[10px] uppercase font-sans font-medium tracking-wider text-white/50 mb-1">
                      Observation Brief
                    </div>
                    <p className="text-[13px] text-white/85 leading-relaxed">
                      {activeFolder.summary}
                    </p>
                  </div>

                  {/* Conversation History For This Specific Chat Folder */}
                  <div className="space-y-3">
                    <div className="text-[10.5px] uppercase font-sans font-medium tracking-wider text-white/50">
                      Chat Queries & Telemetry Deductions ({activeFolder.queries.length})
                    </div>

                    {activeFolder.queries.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-[18px] bg-white/[0.04] border border-white/10 space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11.5px] text-white/60">
                          <span className="font-semibold text-white/95">User: "{q.query}"</span>
                          <span className="font-sans font-medium text-[10.5px]">{q.time}</span>
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
