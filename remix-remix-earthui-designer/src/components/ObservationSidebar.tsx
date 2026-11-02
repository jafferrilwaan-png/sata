import React, { useState, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  computeTemporalThermalState,
  computeSubmeterOpticalTileUrl,
  LiveOrbitPass,
  LiveIncidentItem,
} from '../utils/telemetryLogic';

interface ObservationSidebarProps {
  activeHeatSpots: number;
  aiInsightLead: string;
  aiInsightBody: string;
  adjustOrbitEnabled: boolean;
  onToggleAdjustOrbit: () => void;
  selectedTimelineDay: number;
  onSelectTimelineDay: (day: number) => void;
  isPlayingTimeline?: boolean;
  onTogglePlayTimeline?: () => void;
  liveOrbits?: LiveOrbitPass[];
  onSelectOrbitSatellite?: (pass: LiveOrbitPass) => void;
  liveIncidents?: LiveIncidentItem[];
  onSelectIncident?: (incident: LiveIncidentItem) => void;
  detectedCount?: number;
}

export const ObservationSidebar: React.FC<ObservationSidebarProps> = ({
  activeHeatSpots,
  aiInsightLead,
  aiInsightBody,
  adjustOrbitEnabled,
  onToggleAdjustOrbit,
  selectedTimelineDay,
  onSelectTimelineDay,
  isPlayingTimeline = false,
  onTogglePlayTimeline,
  liveOrbits = [],
  onSelectOrbitSatellite,
  liveIncidents = [],
  onSelectIncident,
  detectedCount,
}) => {
  const [activeSatIndex, setActiveSatIndex] = useState<number>(0);

  const defaultSatellites: LiveOrbitPass[] = [
    {
      id: 'SAT-ISRO-CARTOSAT3',
      satellite_name: 'Cartosat-3 (High-Res 0.28m Optical)',
      mission: 'ISRO PSLV-C47 Sun-Synchronous',
      agency: 'ISRO',
      pass_time: '14:22:10 UTC',
      altitude_km: 508,
      velocity_kms: 7.61,
      inclination_deg: 97.4,
      status: 'TRACKING',
    },
    {
      id: 'SAT-ISRO-EOS6',
      satellite_name: 'EOS-06 Oceansat-3 (Ocean Color & Scatterometer)',
      mission: 'ISRO PSLV-C54 Earth Observation',
      agency: 'ISRO',
      pass_time: '16:04:45 UTC',
      altitude_km: 736,
      velocity_kms: 7.49,
      inclination_deg: 98.4,
      status: 'SCHEDULED',
    },
    {
      id: 'SAT-HUBBLE',
      satellite_name: 'Hubble Space Telescope',
      mission: 'NASA ESA Deep-Space & Earth Imaging',
      agency: 'NASA ESA',
      pass_time: 'Continuous Watch',
      altitude_km: 540,
      velocity_kms: 7.59,
      inclination_deg: 28.5,
      status: 'TRACKING',
    },
  ];

  const satList = liveOrbits.length > 0 ? liveOrbits : defaultSatellites;
  const currentSat = satList[activeSatIndex % satList.length];
  const secondarySat = satList[(activeSatIndex + 1) % satList.length];

  const handleCycleSatellite = () => {
    const nextIdx = (activeSatIndex + 1) % satList.length;
    setActiveSatIndex(nextIdx);
    onSelectOrbitSatellite?.(satList[nextIdx]);
  };

  const rawSentences = useMemo(() => {
    if (!aiInsightBody) return [];
    const split = aiInsightBody
      .split(/(?<=[.?!:])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return split.length > 0 ? split : [aiInsightBody];
  }, [aiInsightBody]);

  return (
    <aside
      aria-label="Observation Briefing"
      className="sata-sidebar-glass w-full sm:w-[clamp(225px,24vw,326px)] shrink-0 rounded-[20px] sm:rounded-[24px] px-3.5 sm:px-3.5 pt-3 sm:pt-3 pb-3.5 sm:pb-3 flex flex-col h-auto sm:h-full sm:min-h-0 overflow-visible sm:overflow-hidden select-none"
    >
      {/* Fixed Top Header */}
      <div className="shrink-0 pb-1.5 sm:pb-2 border-b border-white/10 text-center">
        <h2 className="text-[12px] sm:text-[clamp(11.5px,0.95vw,14px)] font-normal tracking-[0.07em] text-[#f1f5f9] uppercase">
          OBSERVATION BRIEFING
        </h2>
      </div>

      {/* Scrollable Briefing Content Stack */}
      <div
        data-testid="observation-briefing-scroll"
        className="sata-sidebar-scroll flex-none sm:flex-1 sm:min-h-0 overflow-visible sm:overflow-y-auto sm:overscroll-contain flex flex-col justify-between gap-3 sm:gap-2.5 pt-2.5 sm:pt-2 pb-0.5 pr-0.5"
      >
        {/* Sub-Card 1: AI INSIGHTS (Pure Apple iOS Liquid Glass) */}
        <div className="sata-ai-card shrink-0 rounded-[18px] sm:rounded-[20px] p-3 sm:p-3.5">
          <div className="text-[11px] sm:text-[12px] font-normal tracking-[0.06em] text-[#a1a1aa] uppercase mb-1">
            AI Insights
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span
              data-testid="active-heat-spots-count"
              className="text-[clamp(26px,2.4vw,34px)] leading-none font-bold text-white tabular-nums tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]"
            >
              {activeHeatSpots}
            </span>
            <span className="text-[11px] sm:text-[12px] font-normal tracking-[0.04em] text-zinc-300 uppercase whitespace-nowrap">
              ACTIVE HEAT SPOTS
            </span>
          </div>

          {/* Clean Apple iOS Intelligence Typography */}
          <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1.5">
            <div className="text-[11.5px] sm:text-[12px] leading-[1.65] text-zinc-100 font-normal space-y-1.5 max-h-[145px] overflow-y-auto sata-sidebar-scroll pr-1 select-text">
              <p className="tracking-[0.01em]">
                <span className="text-white font-semibold">
                  {aiInsightLead ? (aiInsightLead.endsWith(':') ? aiInsightLead : `${aiInsightLead}:`) : 'Observation Insight:'}
                </span>{' '}
                {aiInsightBody}
              </p>
            </div>
          </div>

          {/* Tri-Agent Specialized Tasks Display */}
          <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/10 flex-wrap">
            <span className="sata-date-pill px-2 py-0.5 rounded-full text-[8.5px] font-normal text-white/95">
              Spatial Mapping
            </span>
            <span className="sata-date-pill px-2 py-0.5 rounded-full text-[8.5px] font-normal text-white/95">
              Atmospheric Physics
            </span>
            <span className="sata-date-pill px-2 py-0.5 rounded-full text-[8.5px] font-normal text-white/95">
              Surface Telemetry
            </span>
          </div>
        </div>

        {/* Section 2: SATELLITE ORBIT STATUS */}
        <div className="shrink-0 flex flex-col">
          <h3 className="text-center text-[clamp(10.5px,0.82vw,12px)] font-normal tracking-[0.06em] text-[#a1a1aa] uppercase mb-1 sm:mb-1.5 shrink-0">
            SATELLITE ORBIT STATUS
          </h3>

          <div className="relative rounded-[20px] sm:rounded-[22px] border border-white/15 bg-white/[0.04] backdrop-blur-2xl flex flex-col p-3 sm:p-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_12px_36px_rgba(0,0,0,0.4)]">
            <div className="relative z-10 flex items-center justify-between">
              <span className="sata-date-pill px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-[10px] tracking-wider uppercase font-medium text-white shadow-[0_2px_10px_rgba(56,189,248,0.25)]">
                {currentSat.agency} {currentSat.altitude_km.toFixed(0)} KM PASS
              </span>
              <button
                type="button"
                onClick={handleCycleSatellite}
                title="Switch active satellite"
                aria-label="Orbital Telemetry Action"
                className="sata-arrow-btn w-7 h-7 rounded-full flex items-center justify-center text-white/90 hover:text-white transition-colors cursor-pointer shrink-0 border border-white/25 bg-white/10 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]"
              >
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.75]" />
              </button>
            </div>

            {/* Complete 3D Optical Satellite Body */}
            <div className="relative w-full h-[62px] sm:h-[70px] my-1 flex items-center justify-center z-0">
              <img
                src="/assets/ui/hubble_clean.png?v=clean_full_hd"
                alt={currentSat.satellite_name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-500"
              />
            </div>

            <div className="relative z-10 pt-1.5 border-t border-white/12 flex flex-col gap-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-white/75 font-normal tracking-wide">
                  Live Orbital Telemetry
                </span>
                <span className="sata-status-pill px-2.5 py-0.5 rounded-full text-[9px] tracking-wider uppercase font-medium text-[#dbeafe] shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                  {currentSat.status}
                </span>
              </div>

              <div className="text-[12.5px] sm:text-[13.5px] font-semibold text-white tracking-tight leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] mt-0.5">
                {currentSat.satellite_name}
              </div>

              <div className="text-[10.5px] text-white/80 font-normal leading-normal">
                {currentSat.mission}
              </div>

              <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-white/10 text-[10px]">
                <span className="text-white/80">
                  {currentSat.inclination_deg}° Inclination
                </span>
                <span className="font-mono tabular-nums text-white/90">
                  {currentSat.velocity_kms} km s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: RECOMMENDATIONS (The Exact Original User Layout!) */}
        <div className="shrink-0 mt-1.5 sm:mt-2">
          <h3 className="text-center text-[clamp(10px,0.8vw,11.5px)] font-normal tracking-[0.06em] text-[#a1a1aa] uppercase mb-1 shrink-0">
            RECOMMENDATIONS
          </h3>

          <div className="rounded-[16px] sm:rounded-[18px] border border-white/14 bg-white/[0.03] backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 flex flex-col gap-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.20)]">
            {/* Row 1: Secondary live satellite */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="/assets/ui/hubble_clean.png?v=clean_full_hd"
                  alt={secondarySat.satellite_name}
                  referrerPolicy="no-referrer"
                  className="w-[clamp(30px,2.6vw,38px)] h-[clamp(24px,2.1vw,30px)] object-contain shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[clamp(9px,0.7vw,10px)] text-[#a1a1aa] leading-tight">
                    {secondarySat.agency === 'SpaceX' ? 'Low Earth Orbit' : `${secondarySat.agency} Orbital Track`}
                  </div>
                  <div className="text-[clamp(11.5px,0.88vw,13px)] font-medium text-white leading-tight mt-0.5 truncate">
                    {secondarySat.satellite_name}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCycleSatellite}
                title={`Track ${secondarySat.satellite_name}`}
                aria-label="Satellite Telemetry Action"
                className="sata-arrow-btn w-[clamp(24px,2vw,28px)] h-[clamp(24px,2vw,28px)] rounded-full flex items-center justify-center text-[#e4e4e7] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <ArrowUpRight className="w-3 h-3 stroke-[1.75]" />
              </button>
            </div>

            {/* Row 2: Adjust orbit toggle */}
            <div className="flex items-center justify-between py-0.5 px-0.5 border-b border-white/10 pb-1">
              <span className="text-[11.5px] sm:text-[12px] text-[#e4e4e7] font-normal">
                Adjust orbit
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={adjustOrbitEnabled}
                aria-label="Adjust orbit"
                onClick={onToggleAdjustOrbit}
                className={`w-[36px] h-[18px] rounded-full p-0.5 transition-colors flex items-center cursor-pointer border ${
                  adjustOrbitEnabled
                    ? 'bg-white/35 border-white/40 justify-end'
                    : 'bg-black/50 border-white/15 justify-start'
                }`}
              >
                <span className="w-[12px] h-[12px] rounded-full bg-white shadow-sm block" />
              </button>
            </div>

            {/* Row 3: Live NASA EONET Disasters (All 30 Scrollable Real Incidents) */}
            {liveIncidents && liveIncidents.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
                <div className="text-[10.5px] text-white/70 tracking-wider uppercase flex items-center justify-between">
                  <span>Live Disasters</span>
                  <span className="sata-date-pill px-2 py-0.5 rounded-full text-[9px] font-mono">
                    {detectedCount ?? liveIncidents.length} DETECTED
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 max-h-[190px] overflow-y-auto sata-sidebar-scroll pr-1">
                  {liveIncidents.map((inc, idx) => (
                    <button
                      key={inc.id || idx}
                      type="button"
                      onClick={() => onSelectIncident?.(inc)}
                      className="flex items-center gap-2.5 p-1.5 rounded-[12px] bg-white/[0.04] hover:bg-white/[0.09] border border-white/12 hover:border-white/30 hover:shadow-[0_2px_14px_rgba(255,255,255,0.08)] transition-all cursor-pointer text-left w-full group"
                    >
                      <div className="w-11 h-9 rounded-[8px] overflow-hidden shrink-0 border border-white/20 bg-black/60 relative">
                        <img
                          src={
                            inc.thumbnail_url ||
                            (inc.coordinates && inc.coordinates.length === 2
                              ? computeSubmeterOpticalTileUrl(inc.coordinates[0], inc.coordinates[1], 10)
                              : '/assets/ui/real_wildfire.png')
                          }
                          alt={inc.title}
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.onerror = null;
                            if (inc.coordinates && inc.coordinates.length === 2) {
                              target.src = computeSubmeterOpticalTileUrl(inc.coordinates[0], inc.coordinates[1], 8);
                            } else {
                              target.src = '/assets/ui/real_wildfire.png';
                            }
                          }}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[9.5px] text-[#93c5fd] font-medium tracking-wide truncate">
                          {inc.category}
                        </div>
                        <div className="text-[11px] font-medium text-white/95 truncate">
                          {inc.title}
                        </div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
