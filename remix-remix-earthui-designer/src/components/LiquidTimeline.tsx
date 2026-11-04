import React from 'react';
import { Play, Pause } from 'lucide-react';
import {
  computeTemporalThermalState,
  SEVEN_DAY_TIMELINE_STEPS,
} from '../utils/telemetryLogic';

interface LiquidTimelineProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const LiquidTimeline = React.memo<LiquidTimelineProps>(({
  selectedDay,
  onSelectDay,
  isPlaying,
  onTogglePlay,
}) => {
  const temporal = computeTemporalThermalState(selectedDay);

  // Friendly date labels for the Oct 24 to Nov 3 range
  const dateTicks = [
    { day: 10, label: 'Oct 24' },
    { day: 18, label: 'Oct 27' },
    { day: 26, label: 'Oct 30' },
    { day: 28, label: 'Nov 01' },
    { day: 31, label: 'Nov 03' },
  ];

  return (
    <div
      aria-label="Liquid Historical Timeline"
      className="sata-date-pill px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-3 sm:gap-4 shadow-[0_12px_40px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.35)] backdrop-blur-2xl border border-white/20 select-none max-w-[94vw] sm:max-w-[560px] w-full"
    >
      {/* Play / Pause Toggle Button */}
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause Timeline' : 'Play Timeline'}
        className="w-[28px] h-[28px] sm:w-[30px] sm:h-[30px] rounded-full bg-white/10 hover:bg-white/20 border border-white/25 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
      >
        {isPlaying ? (
          <Pause className="w-3 h-3 fill-current" />
        ) : (
          <Play className="w-3 h-3 fill-current ml-0.5" />
        )}
      </button>

      {/* Timeline Scrub Track & Date Ticks */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#93c5fd]/90 font-medium tracking-wider uppercase mb-1">
          <span>Oct 24</span>
          <span className="text-white font-semibold drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
            {temporal.isoDate} {temporal.relativeLabel}
          </span>
          <span>Nov 03</span>
        </div>

        <div className="relative h-[12px] flex items-center">
          {/* Base Track */}
          <div className="w-full h-[2.5px] rounded-full bg-white/15" />

          {/* Active Glowing Progress Segment */}
          <div
            className="absolute h-[2.5px] rounded-full bg-sky-400 transition-all duration-150"
            style={{
              left: 0,
              width: `${temporal.thumbPct}%`,
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.95)',
            }}
          />

          {/* Native Scrub Range Slider */}
          <input
            type="range"
            min={10}
            max={31}
            step={1}
            value={temporal.timelineDay}
            onChange={(e) => onSelectDay(Number(e.target.value))}
            aria-label="Scrub temporal timeline Oct 24 to Nov 3"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 m-0"
          />

          {/* Scrub Thumb Knob */}
          <div
            style={{ left: `${temporal.thumbPct}%` }}
            className="absolute -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border border-sky-300 pointer-events-none z-10 transition-all duration-150 shadow-[0_0_12px_rgba(255,255,255,0.9)]"
          />
        </div>
      </div>

      {/* Dedicated 'NOW' Reset Button — Pure Apple iOS Liquid Glass */}
      <button
        type="button"
        onClick={() => onSelectDay(28)}
        title="Jump to current live satellite telemetry (Now)"
        className={`px-3 py-1 rounded-full text-[10.5px] font-medium tracking-wide uppercase transition-all cursor-pointer shrink-0 ${
          temporal.timelineDay === 28
            ? 'sata-date-pill text-white shadow-[0_2px_12px_rgba(56,189,248,0.35)]'
            : 'bg-white/10 hover:bg-white/20 text-white/80 border border-white/20 backdrop-blur-md'
        }`}
      >
        Now
      </button>
    </div>
  );
});
