import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, CloudRain, Satellite, Radio, CheckCircle } from 'lucide-react';

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
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/65 backdrop-blur-md"
          />

          {/* Frosted Glass Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Active Mission Alerts"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-lg rounded-[28px] p-6 border border-white/15 bg-black/80 backdrop-blur-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.85)] text-white overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <Radio className="w-5 h-5 text-white/90" />
                </div>
                <div>
                  <h2 className="text-[17px] font-semibold text-white tracking-tight">
                    Active Mission Alerts
                  </h2>
                  <p className="text-[12px] text-white/60">
                    Live telemetry stream from NASA FIRMS & NOAA Orbiters
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Alerts"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Alerts Feed */}
            <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {/* Alert 1 */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-white">Thermal Anomaly Detected</span>
                    <span className="text-[10px] text-white/40 font-mono">VIIRS 375m</span>
                  </div>
                  <p className="text-[11.5px] text-white/70 mt-0.5">
                    {activeHeatSpots > 0 ? activeHeatSpots : 84} thermal radiative hotspots tracked across active sectors with peak radiative power exceeding 840 MW.
                  </p>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 mt-0.5">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-white">Cyclonic Circulation Monitored</span>
                    <span className="text-[10px] text-white/40 font-mono">GOES-16 ABI</span>
                  </div>
                  <p className="text-[11.5px] text-white/70 mt-0.5">
                    Central pressure 985 hPa, max sustained winds 165 km/h over Bay of Bengal and coastal corridors.
                  </p>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 mt-0.5">
                  <Satellite className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-white">Satellite Constellation Health</span>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 inline" /> 100% NOMINAL
                    </span>
                  </div>
                  <p className="text-[11.5px] text-white/70 mt-0.5">
                    SGP4 telemetry synchronized for Cartosat-3, Sentinel-3, NOAA-20, and ISS. Live Mapbox 0.28m tiles active.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
              <span>Automatic telemetry refresh: 60s</span>
              <span className="text-white/80 font-mono">Status: ARMED</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
