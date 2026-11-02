import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Satellite, Compass, Gauge, Radio, ArrowRight, ShieldCheck } from 'lucide-react';
import { LiveOrbitPass, computeSubmeterOpticalTileUrl } from '../utils/telemetryLogic';

interface SatelliteTelemetryModalProps {
  satellite: LiveOrbitPass | null;
  onClose: () => void;
  onNextSatellite?: () => void;
}

export const SatelliteTelemetryModal: React.FC<SatelliteTelemetryModalProps> = ({
  satellite,
  onClose,
  onNextSatellite,
}) => {
  // Coords mapping for live satellites
  const satCoords: Record<string, { lat: number; lon: number; region: string; sensor: string }> = {
    'Cartosat-3': { lat: 21.15, lon: 79.08, region: 'Central India Corridor', sensor: '0.28m Panchromatic / 1.12m Multispectral' },
    'Sentinel-3': { lat: 43.71, lon: 10.40, region: 'Mediterranean Basin', sensor: 'SLSTR Thermal IR + OLCI Ocean Colour' },
    'NOAA-20': { lat: 28.57, lon: -80.65, region: 'Atlantic Space Coast', sensor: 'VIIRS 375m Day/Night Band Radiometer' },
    'ISS (ZARYA)': { lat: 14.80, lon: 88.50, region: 'Bay of Bengal Orbital Plane', sensor: 'Multi-Mission Earth Science Payload' },
  };

  const coords = satellite ? (satCoords[satellite.satellite_name] || {
    lat: 20.0,
    lon: 78.0,
    region: 'Active Ground Track',
    sensor: 'High-Resolution Optical & Thermal Sensor',
  }) : { lat: 0, lon: 0, region: '', sensor: '' };

  const latStr = `${Math.abs(coords.lat).toFixed(2)}° ${coords.lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(coords.lon).toFixed(2)}° ${coords.lon >= 0 ? 'E' : 'W'}`;
  const opticalPassUrl = computeSubmeterOpticalTileUrl(coords.lat, coords.lon, 11);

  return (
    <AnimatePresence>
      {satellite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none pointer-events-auto">
        {/* Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Clean iOS Liquid Frosted Glass Dossier */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Orbital Telemetry for ${satellite.satellite_name}`}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 340 }}
          className="relative z-10 w-full max-w-xl rounded-[28px] p-5 sm:p-6 border border-white/20 bg-black/80 backdrop-blur-[42px] shadow-[0_32px_90px_rgba(0,0,0,0.9),inset_0_1px_1.5px_rgba(255,255,255,0.25)] text-white overflow-hidden flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-white/10 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                    {satellite.agency} • {satellite.status}
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h2 className="text-[19px] sm:text-[22px] font-semibold text-white tracking-tight truncate">
                  {satellite.satellite_name}
                </h2>
                <p className="text-[12px] text-white/70 truncate">
                  {satellite.mission}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Satellite Dossier"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Optical Ground Pass Imagery */}
          <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-inner group">
            <img
              src={opticalPassUrl}
              alt={`Live optical view beneath ${satellite.satellite_name}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Minimal Inset Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-white/60">
                  Sub-Satellite Nadir Point
                </div>
                <div className="text-[13px] font-medium text-white">
                  {coords.region}
                </div>
                <div className="text-[11px] font-mono text-white/80">
                  {latStr}, {lonStr}
                </div>
              </div>
              <span className="text-[10px] font-mono bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-white">
                0.28m Ground Resolution
              </span>
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                <Gauge className="w-3 h-3 text-white/70" /> Orbital Velocity
              </span>
              <span className="text-[16px] font-semibold text-white font-mono mt-1">
                {satellite.velocity_kms} km/s
              </span>
              <span className="text-[10px] text-white/60">~{(satellite.velocity_kms * 3600).toLocaleString()} km/h</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-white/70" /> Altitude (LEO)
              </span>
              <span className="text-[16px] font-semibold text-white font-mono mt-1">
                {satellite.altitude_km} km
              </span>
              <span className="text-[10px] text-white/60">Low Earth Orbit</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-white/70" /> Inclination
              </span>
              <span className="text-[16px] font-semibold text-white font-mono mt-1">
                {satellite.inclination_deg}°
              </span>
              <span className="text-[10px] text-white/60">Sun-Synchronous</span>
            </div>
          </div>

          {/* Sensor Specs */}
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-[11.5px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-white/70">Payload:</span>
              <span className="text-white font-medium">{coords.sensor}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-[11px] text-white/50 font-mono">
              Live SGP4 Orbit Propagation
            </span>
            {onNextSatellite && (
              <button
                type="button"
                onClick={onNextSatellite}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[12px] font-medium text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Track Next Satellite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
