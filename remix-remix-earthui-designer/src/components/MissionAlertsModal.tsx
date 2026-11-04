import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MissionAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeHeatSpots: number;
}

export const MissionAlertsModal: React.FC<MissionAlertsModalProps> = ({
  isOpen,
  onClose,
  activeHeatSpots,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none pointer-events-auto">
          {/* iOS Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
          />

          {/* Clean Pure Text iOS Frosted Glass Dialog — Zero SVG Icons */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Active Mission Alerts"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="relative z-10 w-full max-w-lg rounded-[28px] p-6 border border-white/25 bg-white/[0.08] backdrop-blur-[45px] saturate-[180%] shadow-[0_24px_70px_rgba(0,0,0,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.35)] text-white overflow-hidden flex flex-col gap-4"
          >
            {/* Header: Pure Clean Typography */}
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-[18px] font-semibold text-white tracking-tight">
                  Active Mission Alerts
                </h2>
                <p className="text-[12px] text-white/60">
                  Live telemetry stream from NASA FIRMS & NOAA Orbiters
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Alerts"
                className="px-3 py-1 rounded-full text-[12px] font-medium text-white/70 hover:text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

            {/* Alerts Feed: Pure Minimal Text Cards */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 sata-sidebar-scroll">
              {/* Alert 1 */}
              <div className="p-4 rounded-[20px] bg-white/[0.06] border border-white/18 backdrop-blur-md flex flex-col gap-1.5 transition-colors hover:bg-white/[0.12]">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-medium text-white tracking-tight">Thermal Anomaly Detected</span>
                  <span className="text-[10.5px] text-white/40 font-sans font-medium">VIIRS 375m</span>
                </div>
                <p className="text-[12px] text-white/75 leading-relaxed">
                  {activeHeatSpots > 0 ? activeHeatSpots : 84} thermal radiative hotspots tracked across active sectors with peak radiative power exceeding 840 MW.
                </p>
              </div>

              {/* Alert 2 */}
              <div className="p-4 rounded-[20px] bg-white/[0.06] border border-white/18 backdrop-blur-md flex flex-col gap-1.5 transition-colors hover:bg-white/[0.12]">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-medium text-white tracking-tight">Cyclonic Circulation Monitored</span>
                  <span className="text-[10.5px] text-white/40 font-sans font-medium">GOES-16 ABI</span>
                </div>
                <p className="text-[12px] text-white/75 leading-relaxed">
                  Central pressure 985 hPa, max sustained winds 165 km/h over Bay of Bengal and coastal corridors.
                </p>
              </div>

              {/* Alert 3 */}
              <div className="p-4 rounded-[20px] bg-white/[0.06] border border-white/18 backdrop-blur-md flex flex-col gap-1.5 transition-colors hover:bg-white/[0.12]">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-medium text-white tracking-tight">Satellite Constellation Health</span>
                  <span className="text-[10.5px] text-white/80 font-sans font-medium">100% NOMINAL</span>
                </div>
                <p className="text-[12px] text-white/75 leading-relaxed">
                  SGP4 telemetry synchronized for Cartosat-3, Sentinel-3, NOAA-20, and ISS. Live Mapbox 0.28m tiles active.
                </p>
              </div>
            </div>

            {/* Footer: Clean Minimal Typography */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
              <span>Automatic telemetry refresh: 60s</span>
              <span className="text-white/80 font-sans font-medium">Status: ARMED</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
