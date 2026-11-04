import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Globe, Compass, ArrowRight, Search, Activity, ShieldAlert } from 'lucide-react';
import {
  PLANETARY_SIMULATIONS_CATALOG,
  PlanetarySimulationScenario,
  SimulationCategory,
} from '../data/planetarySimulations';

interface PlanetarySimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSimulation: (simulation: PlanetarySimulationScenario) => void;
  activeSimulationId?: string | null;
}

const CATEGORIES: SimulationCategory[] = [
  'Cryosphere & Climate Shock',
  'Atmospheric & Extreme Weather',
  'Oceanic & Marine Collapse',
  'Geoengineering & Biosphere',
  'Tectonic & Volcanic',
  'Hydrological Crisis',
];

export default function PlanetarySimulationModal({
  isOpen,
  onClose,
  onSelectSimulation,
  activeSimulationId,
}: PlanetarySimulationModalProps) {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredSimulations = PLANETARY_SIMULATIONS_CATALOG.filter((sim) => {
    const matchesCategory =
      selectedCategory === 'ALL' || sim.category === selectedCategory;
    const matchesSearch =
      !searchFilter ||
      sim.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      sim.target.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      sim.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xl pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-[24px] bg-[#0c121d]/90 border border-white/15 shadow-2xl shadow-cyan-950/40 text-white overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-semibold text-white tracking-tight">
                    Planetary Deep Reasoning Simulations
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-sans font-medium border border-cyan-400/30">
                    30 Scenarios
                  </span>
                </div>
                <p className="text-[12px] text-white/60">
                  Select or type any scenario to execute 3D Earth physical shader transformations & Meta AI multi-agent reasoning.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="px-6 py-3.5 border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 bg-white/[0.02]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search simulations (e.g. Thar Desert Snowfall, Marine Heatwave, Yellowstone)..."
                className="w-full h-9 pl-9 pr-4 rounded-xl bg-white/[0.06] border border-white/10 text-[12.5px] text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
            </div>
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-200'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-200'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Cards Grid */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredSimulations.map((sim) => {
                const isActive = activeSimulationId === sim.id;
                return (
                  <div
                    key={sim.id}
                    onClick={() => {
                      onSelectSimulation(sim);
                      onClose();
                    }}
                    className={`group relative p-4 rounded-[18px] border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-400/60 shadow-lg shadow-cyan-950/30'
                        : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        
                        <span className="text-[10px] uppercase font-sans font-medium tracking-wider font-semibold text-cyan-300">
                          {sim.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-sans font-medium text-white/40 group-hover:text-cyan-300 flex items-center gap-1 transition-colors">
                        Launch 3D <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>

                    <h3 className="text-[14px] font-medium text-white group-hover:text-cyan-200 transition-colors leading-snug mb-1">
                      {sim.title}
                    </h3>
                    <p className="text-[11px] text-white/60 font-sans line-clamp-2 leading-relaxed mb-3">
                      {sim.prompt}
                    </p>

                    <div className="flex items-center justify-between text-[10.5px] font-sans font-medium text-white/50 pt-2.5 border-t border-white/5">
                      <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                        <Compass className="w-3 h-3 text-white/40 shrink-0" />
                        <span className="truncate">{sim.target.name}</span>
                      </div>
                      <div className="text-cyan-400 font-medium shrink-0">
                        {sim.shaderParams.surfaceTempDelta.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 bg-white/[0.01] shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full 3D Earth shader reaction: snow cover, marine heatwaves, ash plumes, megadroughts & floods.</span>
            </div>
            <span className="font-sans font-medium text-white/40">SATA Planetary Engine</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
