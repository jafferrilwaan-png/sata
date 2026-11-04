import React from 'react';
import { Square, X, Check } from 'lucide-react';

interface VoiceRecordingIndicatorProps {
  duration: number;
  onStop: () => void;
  onCancel: () => void;
}

export const VoiceRecordingIndicator: React.FC<VoiceRecordingIndicatorProps> = ({
  duration,
  onStop,
  onCancel,
}) => {
  const formatTime = (sec: number) => {
    const s = Math.floor(sec || 0);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m < 10 ? '0' : ''}${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-200">
      {/* Red Recording Dot */}
      <div className="relative flex items-center justify-center w-2.5 h-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </div>

      {/* Recording Time */}
      <span className="text-[11.5px] font-sans font-medium text-white tracking-wider">
        {formatTime(duration)}
      </span>

      {/* Animated Voice Waveform Bars */}
      <div className="flex items-center gap-[2px] h-3.5 px-1">
        <span className="w-[2px] h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
        <span className="w-[2px] h-3.5 bg-white/90 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <span className="w-[2px] h-2.5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        <span className="w-[2px] h-3 bg-white/90 rounded-full animate-pulse" style={{ animationDelay: '75ms' }} />
        <span className="w-[2px] h-1.5 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '225ms' }} />
      </div>

      {/* Discard / Cancel Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
        title="Discard recording"
        className="w-5 h-5 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Finish / Send Voice Recording Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onStop();
        }}
        title="Send voice query"
        className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 shadow-[0_2px_8px_rgba(255,255,255,0.3)] transition-all cursor-pointer active:scale-95"
      >
        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
};
