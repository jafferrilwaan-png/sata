import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VoiceMessageBubbleProps {
  audioUrl: string;
  duration?: number;
  transcript?: string;
}

export const VoiceMessageBubble: React.FC<VoiceMessageBubbleProps> = ({
  audioUrl,
  duration = 0,
  transcript,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        setAudioDuration(audio.duration);
      }
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.warn('Audio play error:', err));
    }
  };

  const formatTime = (sec: number) => {
    const s = Math.floor(sec || 0);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  // 16 stylized waveform bars
  const barHeights = [28, 42, 65, 80, 50, 95, 75, 40, 85, 60, 35, 70, 90, 55, 38, 20];

  return (
    <div className="flex flex-col gap-1.5 w-full min-w-[210px] max-w-[280px]">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Apple iOS Voice Note Pill */}
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-[16px] bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
        <button
          type="button"
          onClick={togglePlay}
          title={isPlaying ? 'Pause voice message' : 'Play recorded voice'}
          className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0 cursor-pointer shadow-[0_2px_8px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-black stroke-black" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-black stroke-black ml-0.5" />
          )}
        </button>

        {/* Dynamic Waveform Visualizer */}
        <div
          className="flex-1 flex items-center gap-[2px] h-6 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            if (audioRef.current && audioDuration > 0) {
              audioRef.current.currentTime = clickPos * audioDuration;
            }
          }}
        >
          {barHeights.map((h, i) => {
            const barPct = (i / barHeights.length) * 100;
            const isPassed = barPct <= progress;
            return (
              <div
                key={i}
                className="flex-1 rounded-full transition-all duration-150"
                style={{
                  height: `${h}%`,
                  backgroundColor: isPassed ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.3)',
                }}
              />
            );
          })}
        </div>

        {/* Time display */}
        <span className="text-[10px] font-sans font-medium text-white/70 tracking-tight shrink-0">
          {isPlaying ? formatTime(currentTime) : formatTime(audioDuration || duration)}
        </span>
      </div>

      {/* Transcript Text Below Audio */}
      {transcript && (
        <p className="text-[11.5px] leading-relaxed text-white/90 px-1 select-text">
          {transcript}
        </p>
      )}
    </div>
  );
};
