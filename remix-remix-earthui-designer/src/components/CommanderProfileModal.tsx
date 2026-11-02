import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, UserCheck, Cpu, Globe2, Radio } from 'lucide-react';

interface CommanderProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommanderProfileModal: React.FC<CommanderProfileModalProps> = ({
  isOpen,
  onClose,
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
            aria-label="Mission Commander Profile"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-md rounded-[28px] p-6 border border-white/15 bg-black/85 backdrop-blur-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.85)] text-white overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-[18px] font-semibold text-white tracking-tight">
                    Orbital Flight Controller
                  </h2>
                  <p className="text-[12px] text-white/60 font-mono">
                    Callsign: SENTINEL-OPERATOR-1
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Profile"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Credentials */}
            <div className="mt-5 space-y-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-white/60" />
                  <span className="text-[12.5px] text-white/80">Security Clearance</span>
                </div>
                <span className="text-[12px] font-semibold text-white font-mono bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  ORBITAL-ALPHA
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-white/60" />
                  <span className="text-[12.5px] text-white/80">Autonomous AI Copilot</span>
                </div>
                <span className="text-[12px] text-white/90 font-mono">
                  Meta muse-spark-1.3
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Globe2 className="w-4 h-4 text-white/60" />
                  <span className="text-[12.5px] text-white/80">Optical Tile Resolution</span>
                </div>
                <span className="text-[12px] text-white/90 font-mono">
                  0.28m Submeter (Mapbox)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Radio className="w-4 h-4 text-white/60" />
                  <span className="text-[12.5px] text-white/80">Telemetry Feeds</span>
                </div>
                <span className="text-[12px] text-emerald-400 font-mono">
                  NASA FIRMS + NOAA GOES
                </span>
              </div>
            </div>

            {/* Status Footer */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
              <span>Session Authenticated</span>
              <span className="text-white/80 font-mono">100% OPERATIONAL</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
