import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const isMac =
    typeof window !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcutGroups = [
    {
      title: 'Navigation & Intelligence Search',
      items: [
        { keys: [modKey, 'K'], orKey: '/', desc: 'Focus Satellite Search' },
        { keys: ['Esc'], desc: 'Unfocus search / Return to orbit overview' },
        { keys: ['Enter'], desc: 'Execute satellite query' },
        { keys: ['V'], desc: 'Toggle satellite voice dictation' },
      ],
    },
    {
      title: 'Analysis Models & Modes',
      items: [
        { keys: ['1'], desc: 'Multi-Sensor Consensus (Parallel Analysis)' },
        { keys: ['2'], desc: 'Spatial Analytics (Precision Mapping)' },
        { keys: ['3'], desc: 'Rapid Geocoder (Instant Coordinates)' },
        { keys: ['4'], desc: 'Spectral Reasoner (Physics & Infrared)' },
      ],
    },
    {
      title: 'Orbital & Planetary Controls',
      items: [
        { keys: ['S'], desc: 'Cycle active tracking satellite (ISRO / NASA)' },
        { keys: ['O'], desc: 'Toggle orbit adjustment calibration' },
        { keys: ['Space'], desc: 'Play / Pause temporal timeline scrub' },
        { keys: ['?'], desc: 'Open / Close this shortcut guide' },
      ],
    },
  ];

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
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="relative w-full max-w-[480px] rounded-[24px] border border-white/16 bg-black/55 backdrop-blur-2xl saturate-[180%] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.35)] flex flex-col gap-4 text-white z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/15">
                  <Keyboard className="w-4 h-4 text-white/90" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-white tracking-wide">
                    Keyboard Shortcuts
                  </h3>
                  <p className="text-[11px] text-white/60">
                    Quick keyboard navigation and controls
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close shortcuts dialog"
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Shortcuts Content */}
            <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto sata-sidebar-scroll pr-1">
              {shortcutGroups.map((group) => (
                <div key={group.title} className="flex flex-col gap-1.5">
                  <h4 className="text-[10.5px] font-semibold uppercase tracking-wider text-sky-300/80">
                    {group.title}
                  </h4>
                  <div className="rounded-[16px] bg-white/[0.03] border border-white/10 p-2 flex flex-col gap-1.5">
                    {group.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-[11.5px] py-1 px-1.5 rounded-[8px] hover:bg-white/[0.04] transition-colors"
                      >
                        <span className="text-white/85 font-normal">
                          {item.desc}
                        </span>
                        <div className="flex items-center gap-1 shrink-0 font-sans font-medium text-[10.5px]">
                          {item.keys.map((k, ki) => (
                            <kbd
                              key={ki}
                              className="px-2 py-0.5 rounded-[6px] bg-white/10 border border-white/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] min-w-[22px] text-center"
                            >
                              {k}
                            </kbd>
                          ))}
                          {item.orKey && (
                            <>
                              <span className="text-white/40 text-[10px] px-0.5">
                                or
                              </span>
                              <kbd className="px-2 py-0.5 rounded-[6px] bg-white/10 border border-white/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] min-w-[22px] text-center">
                                {item.orKey}
                              </kbd>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Tip */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10.5px] text-white/50">
              <span>Press <kbd className="px-1.5 py-0.5 rounded-[4px] bg-white/10 text-white font-sans font-medium text-[9.5px]">Esc</kbd> anytime to dismiss</span>
              <span className="text-sky-400 font-sans font-medium">SATA v2.4</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
