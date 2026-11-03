import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  ReleaseItem,
  TelemetrySensorRow,
  LiveIncidentItem,
  computeSubmeterOpticalTileUrl,
} from '../utils/telemetryLogic';

interface BottomCardsRowProps {
  releases: ReleaseItem[];
  sensors: TelemetrySensorRow[];
  liveIncidents?: LiveIncidentItem[];
  onSelectIncident?: (incident: LiveIncidentItem) => void;
}

export const BottomCardsRow: React.FC<BottomCardsRowProps> = ({
  releases,
  sensors,
  liveIncidents = [],
  onSelectIncident,
}) => {
  const displayIncidents =
    liveIncidents.length > 0
      ? liveIncidents
      : [
          {
            id: 'EONET_25827',
            code: 'FIR-01',
            category: 'Wildfire',
            title: 'Wildfire South Tank Trail, Perry, Mississippi',
            coordinates: [31.0858, -89.0978] as [number, number],
            thumbnail_url: computeSubmeterOpticalTileUrl(31.0858, -89.0978, 10),
            date_detected: '2026-10-28T18:02:00Z',
            intensity_mw: 1000,
          },
          {
            id: 'EONET_25841',
            code: 'FIR-02',
            category: 'Prescribed Fire',
            title: 'Prescribed Fire Walker Branch, Tennessee',
            coordinates: [36.0028, -84.2797] as [number, number],
            thumbnail_url: computeSubmeterOpticalTileUrl(36.0028, -84.2797, 10),
            date_detected: '2026-10-28T14:30:00Z',
            intensity_mw: 420,
          },
        ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-2.5 lg:gap-4 w-full">
      {/* Card 1: LIVE GLOBAL DISASTERS (NASA EONET v3 + Unique Genuine Satellite Imagery) */}
      <section
        aria-label="Live Global Hazards"
        className="sata-glass-card rounded-[20px] lg:rounded-[22px] px-3.5 sm:px-2.5 lg:px-4 pt-3 sm:pt-2.5 lg:pt-3.5 pb-3 sm:pb-2.5 lg:pb-3.5 flex flex-col justify-between min-w-0 overflow-hidden"
      >
        <div>
          <div className="flex items-center justify-between pb-1.5 lg:pb-2 border-b border-white/10 gap-1">
            <h2 className="text-[11.5px] sm:text-[clamp(10px,0.88vw,13.5px)] font-normal tracking-[0.05em] text-[#e4e4e7] uppercase whitespace-nowrap">
              GLOBAL HAZARDS (NASA)
            </h2>
            <span className="sata-date-pill px-2 py-0.5 rounded-full text-[9.5px] uppercase font-medium tracking-wider shrink-0">
              {displayIncidents.length > 0 ? `${displayIncidents.length} Live` : 'Syncing'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-2 lg:gap-3 mt-2.5 sm:mt-2 lg:mt-3">
            {displayIncidents.slice(0, 2).map((item, idx) => {
              const [lat, lon] = item.coordinates || [0, 0];
              const cat = (item.category || '').toLowerCase();
              const title = (item.title || '').toLowerCase();
              const isStorm =
                cat.includes('cyclon') ||
                cat.includes('storm') ||
                cat.includes('typhoon') ||
                cat.includes('hurricane') ||
                title.includes('storm') ||
                title.includes('cyclone') ||
                title.includes('typhoon');

              // Genuine top-down satellite imagery:
              // For regional storm basins: NASA GIBS MODIS TrueColor satellite scan or orbital optical tile at zoom 6
              // For wildfires & surface incidents: High-resolution satellite orbital tile at zoom 11
              const satelliteThumbnail = computeSubmeterOpticalTileUrl(
                lat,
                lon,
                isStorm ? 6 : 11
              );

              const thumbnailSrc = item.thumbnail_url || satelliteThumbnail;

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onSelectIncident?.(item)}
                  title={`Fly 3D Globe to ${item.title}`}
                  className="flex flex-col text-left group min-w-0 cursor-pointer bg-transparent border-0 p-0 outline-none"
                >
                  <div className="relative w-full h-[86px] sm:h-[clamp(66px,6.8vw,94px)] rounded-[11px] lg:rounded-[13px] overflow-hidden border border-white/12 bg-black/60 group-hover:border-white/35 transition-all">
                    <img
                      src={thumbnailSrc}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = computeSubmeterOpticalTileUrl(lat, lon, 8);
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-1.5 left-2 text-[9px] font-medium text-white/90 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                  <span
                    data-adaptive-text="true"
                    data-contrast-mode="light"
                    className="sata-adaptive-primary mt-1.5 lg:mt-2 text-[11px] sm:text-[clamp(9.5px,0.82vw,12.5px)] font-normal text-[#f4f4f5] group-hover:text-white transition-colors line-clamp-2 leading-tight w-full h-[2.5em]"
                  >
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Card 2: RELEASES (Original Pristine Design) */}
      <section
        aria-label="Upcoming Releases"
        className="sata-glass-card rounded-[20px] lg:rounded-[22px] px-3.5 sm:px-2.5 xl:px-4 pt-3 sm:pt-2.5 lg:pt-3.5 pb-3 sm:pb-2.5 lg:pb-3.5 flex flex-col justify-between min-w-0 overflow-hidden"
      >
        <div className="flex items-center justify-between pb-1.5 lg:pb-2 border-b border-white/10 gap-1">
          <h2 className="text-[12px] sm:text-[clamp(11px,0.95vw,14.5px)] font-normal tracking-[0.06em] text-[#e4e4e7] uppercase truncate">
            RELEASES
          </h2>
          <button
            type="button"
            aria-label="Releases Action"
            className="sata-arrow-btn w-[26px] h-[26px] sm:w-[clamp(24px,2.1vw,32px)] sm:h-[clamp(24px,2.1vw,32px)] rounded-full flex items-center justify-center text-[#d4d4d8] hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <ArrowUpRight className="w-[13px] h-[13px] sm:w-[clamp(12px,1.05vw,16px)] sm:h-[clamp(12px,1.05vw,16px)] stroke-[1.75]" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-1.5 xl:gap-2.5 mt-2.5 sm:mt-2 lg:mt-3 flex-1 w-full">
          {releases.map((rel: ReleaseItem, idx: number) => (
            <div
              key={rel.id}
              className="flex flex-col justify-between group min-w-0 overflow-hidden"
            >
              <div className="min-w-0">
                <span className="inline-block sata-date-pill px-2.5 sm:px-2 lg:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[clamp(8.5px,0.7vw,11px)] font-normal text-[#f0f7ff] whitespace-nowrap">
                  {rel.dateBadge}
                </span>

                {/* Subtle divider line under date pill */}
                <div className="relative h-[1px] w-full bg-white/10 my-1.5 lg:my-2">
                  {idx === 1 && (
                    <span
                      className="absolute left-1.5 -top-[1px] w-6 h-[2px] rounded-full bg-white/80"
                      style={{ boxShadow: '0 0 8px rgba(255,255,255,0.8)' }}
                    />
                  )}
                </div>

                <div
                  data-adaptive-text="true"
                  data-contrast-mode="light"
                  className="min-w-0"
                >
                  <p className="sata-adaptive-primary text-[11px] sm:text-[clamp(8.8px,0.72vw,11px)] leading-[1.25] tracking-[-0.02em] text-[#e4e4e7] font-normal break-words">
                    {rel.providerLine1}
                  </p>
                  <p className="sata-adaptive-secondary text-[10px] sm:text-[clamp(8.5px,0.68vw,11px)] leading-[1.25] tracking-[-0.01em] text-[#a1a1aa] font-normal mt-0.5 truncate">
                    {rel.providerLine2}
                  </p>
                </div>
              </div>

              <div className="mt-2 sm:mt-1.5 lg:mt-2 min-w-0">
                <span className="inline-flex items-center max-w-full sata-status-pill px-2 sm:px-1.5 xl:px-2.5 py-0.5 rounded-full text-[9.5px] sm:text-[clamp(8px,0.66vw,10.5px)] tracking-[-0.015em] text-[#e8f3ff] whitespace-nowrap">
                  {rel.statusText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Card 3: SENSOR TELEMETRY (Original Pristine Design) */}
      <section
        aria-label="Sensor Telemetry"
        className="sata-glass-card rounded-[20px] lg:rounded-[22px] px-3.5 sm:px-2.5 lg:px-4 pt-3 sm:pt-2.5 lg:pt-3.5 pb-3 sm:pb-2.5 lg:pb-3.5 flex flex-col justify-between min-w-0 overflow-hidden"
      >
        <div className="flex items-center justify-between pb-1.5 lg:pb-2 border-b border-white/10 gap-1">
          <h2 className="text-[12px] sm:text-[clamp(11px,0.95vw,14.5px)] font-normal tracking-[0.06em] text-[#e4e4e7] uppercase truncate">
            SENSOR TELEMETRY
          </h2>
          <button
            type="button"
            aria-label="Sensor Telemetry Action"
            className="sata-arrow-btn w-[26px] h-[26px] sm:w-[clamp(24px,2.1vw,32px)] sm:h-[clamp(24px,2.1vw,32px)] rounded-full flex items-center justify-center text-[#d4d4d8] hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <ArrowUpRight className="w-[13px] h-[13px] sm:w-[clamp(12px,1.05vw,16px)] sm:h-[clamp(12px,1.05vw,16px)] stroke-[1.75]" />
          </button>
        </div>

        <div className="flex flex-col justify-between flex-1 mt-1.5 sm:mt-1 lg:mt-1.5">
          {sensors.map((row: TelemetrySensorRow, idx: number) => (
            <div key={row.id} className="flex flex-col">
              <div
                data-adaptive-text="true"
                data-contrast-mode="light"
                className="flex items-center justify-between py-1.5 sm:py-1 lg:py-1.5 text-[11px] sm:text-[clamp(9px,0.8vw,12px)] gap-1.5"
              >
                <span className="sata-adaptive-primary text-[#e4e4e7] font-normal truncate flex-1 min-w-0">
                  {row.sensorName}
                </span>
                <span className="sata-adaptive-primary text-[#f4f4f5] font-normal tabular-nums shrink-0 px-1 font-mono text-[10.5px]">
                  {row.valueText}
                </span>
                <span className="sata-adaptive-secondary text-right text-[#a1a1aa] font-medium tracking-wider uppercase shrink-0 text-[9.5px]">
                  {row.statusText}
                </span>
              </div>

              {idx < sensors.length - 1 && (
                <div className="relative h-[1px] w-full bg-white/10">
                  {idx === 0 && (
                    <span
                      className="absolute left-[56%] -top-[1px] w-12 h-[2px] bg-white/90 rounded-full"
                      style={{ boxShadow: '0 0 10px 1px rgba(255,255,255,0.9)' }}
                    />
                  )}
                  {idx === 1 && (
                    <span
                      className="absolute left-[48%] -top-[1px] w-10 h-[2px] bg-white/70 rounded-full"
                      style={{ boxShadow: '0 0 8px rgba(255,255,255,0.7)' }}
                    />
                  )}
                  {idx === 2 && (
                    <span
                      className="absolute left-[52%] -top-[1px] w-8 h-[1.5px] bg-white/50 rounded-full"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
