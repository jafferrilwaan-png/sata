import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Radio, Satellite, RefreshCw } from 'lucide-react';

export interface LiveSatelliteVideoPlayerProps {
  title?: string;
  satelliteName?: string;
  lat?: number;
  lon?: number;
  altitudeKm?: number;
  velocityKms?: number;
  resolution?: string;
  bitrate?: string;
  downlinkFreq?: string;
  initialFeedType?: 'nasa_iss' | 'orbital_canvas' | 'noaa_goes';
  compact?: boolean;
  className?: string;
  showControls?: boolean;
}

export const LiveSatelliteVideoPlayer: React.FC<LiveSatelliteVideoPlayerProps> = ({
  title = 'Live Orbital Streaming Feed',
  satelliteName = 'ISS (ZARYA) / Sentinel-3',
  lat = 21.15,
  lon = 79.08,
  altitudeKm = 418,
  velocityKms = 7.66,
  resolution = '1080p / 60 FPS',
  bitrate = '12.4 Mbps',
  downlinkFreq = 'X-Band 8.2 GHz',
  initialFeedType = 'orbital_canvas',
  compact = false,
  className = '',
  showControls = true,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [feedType, setFeedType] = useState<'nasa_iss' | 'orbital_canvas' | 'noaa_goes'>(initialFeedType);
  const [utcTimestamp, setUtcTimestamp] = useState<string>('');
  const [simulatedTimeSec, setSimulatedTimeSec] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Live real-time UTC Clock ticker (updating every second)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const iso = now.toISOString().replace('T', ' ').slice(0, 19);
      setUtcTimestamp(`${iso} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // WebGL / Canvas orbital streaming animation engine (60 FPS)
  useEffect(() => {
    if (feedType === 'nasa_iss') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    let cloudOffset = 0;
    let scanlineY = 0;

    const render = () => {
      if (!isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      // 1. Deep Space Background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Starfield dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 37) % width);
        const sy = ((i * 59) % height);
        ctx.fillRect(sx, sy, 1, 1);
      }

      // 2. Earth Horizon & Curved Limb
      const centerX = width * 0.5;
      const centerY = height * 1.55;
      const radius = height * 1.25;

      // Earth base sphere
      const earthGrad = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.6,
        radius * 0.2,
        centerX,
        centerY,
        radius
      );
      earthGrad.addColorStop(0, '#1e40af'); // Deep ocean blue
      earthGrad.addColorStop(0.4, '#1d4ed8');
      earthGrad.addColorStop(0.8, '#0f172a'); // Night terminator
      earthGrad.addColorStop(1, '#020617');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = earthGrad;
      ctx.fill();

      // Atmospheric Limb Glow (Rayleigh scattering)
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius - 8,
        centerX,
        centerY,
        radius + 18
      );
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      glowGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.25)');
      glowGrad.addColorStop(0.7, 'rgba(99, 102, 241, 0.12)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 18, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Clip inside Earth for continents & cloud animation
      ctx.clip();

      // Continents & Landforms (rotating with angle)
      angle += 0.003;
      cloudOffset += 0.0045;

      const continentCount = 6;
      for (let c = 0; c < continentCount; c++) {
        const cOffset = (angle * 40 + c * (width / continentCount * 1.4)) % (width * 1.6) - width * 0.3;
        const cY = height * 0.32 + Math.sin(c + angle * 2) * 18;

        ctx.fillStyle = 'rgba(34, 197, 94, 0.42)'; // Lush vegetation
        ctx.beginPath();
        ctx.ellipse(cOffset, cY, width * 0.16, height * 0.18, 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(234, 179, 8, 0.35)'; // Arid terrain
        ctx.beginPath();
        ctx.ellipse(cOffset + 24, cY + 12, width * 0.1, height * 0.12, -0.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dynamic Cloud Layers (Swirling cyclones and atmospheric fronts)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.58)';
      for (let cl = 0; cl < 8; cl++) {
        const clX = (cloudOffset * 55 + cl * (width / 5)) % (width * 1.5) - width * 0.25;
        const clY = height * 0.28 + Math.cos(cl * 1.3 + cloudOffset) * 25;
        ctx.beginPath();
        ctx.ellipse(clX, clY, width * 0.22, height * 0.09, 0.15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Specular Sun Glint on Ocean Surface
      const sunGlintX = width * 0.65 + Math.sin(angle) * 15;
      const sunGlintY = height * 0.48;
      const sunGrad = ctx.createRadialGradient(sunGlintX, sunGlintY, 2, sunGlintX, sunGlintY, 70);
      sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
      sunGrad.addColorStop(0.3, 'rgba(186, 230, 253, 0.25)');
      sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      // 3. Realistic Orbital Scanlines Sweep
      scanlineY = (scanlineY + 1.2) % height;
      const scanGrad = ctx.createLinearGradient(0, scanlineY - 20, 0, scanlineY + 20);
      scanGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      scanGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
      scanGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanlineY - 20, width, 40);

      // Fine video raster scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1);
      }

      // 4. Live Sensor Reticle Overlay
      const crossX = width * 0.5;
      const crossY = height * 0.46;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;

      // Center crosshair
      ctx.beginPath();
      ctx.arc(crossX, crossY, 20, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(crossX - 32, crossY);
      ctx.lineTo(crossX - 8, crossY);
      ctx.moveTo(crossX + 8, crossY);
      ctx.lineTo(crossX + 32, crossY);
      ctx.moveTo(crossX, crossY - 32);
      ctx.lineTo(crossX, crossY - 8);
      ctx.moveTo(crossX, crossY + 8);
      ctx.lineTo(crossX, crossY + 32);
      ctx.stroke();

      // Active target pulse
      const pulseRadius = 3 + Math.abs(Math.sin(angle * 6)) * 2;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(crossX, crossY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, feedType]);

  // Adjust canvas pixel resolution to container size
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = Math.floor(rect.width);
        canvas.height = Math.floor(rect.height);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [compact]);

  const latFormatted = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lonFormatted = `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;

  return (
    <div
      role="region"
      aria-label="Live Satellite Video Streaming Player"
      className={`relative w-full rounded-2xl overflow-hidden border border-white/20 bg-black/90 shadow-2xl select-none group ${
        compact ? 'h-[92px] sm:h-[104px]' : 'h-56 sm:h-72'
      } ${className}`}
    >
      {/* 1. Authentic Video Stream Layer */}
      {feedType === 'nasa_iss' ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/P9C25Un7xaM?autoplay=${
              isPlaying ? '1' : '0'
            }&mute=${isMuted ? '1' : '0'}&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1`}
            title="NASA ISS Live High Definition Earth Video Stream"
            className="w-full h-full object-cover scale-[1.08] pointer-events-none"
            allow="autoplay; encrypted-media; picture-in-picture"
            loading="eager"
          />
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          onClick={() => setIsPlaying(!isPlaying)}
        />
      )}

      {/* 2. Top Status Bar: LIVE Badge, Source Switcher, UTC Clock */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none z-20">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Authentic Live Streaming Indicator Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 font-sans text-[10px] sm:text-[10.5px] font-semibold tracking-wider uppercase backdrop-blur-md select-none shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            <span>LIVE ORBITAL FEED</span>
          </div>

          {!compact && (
            <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[9.5px]">
              <button
                type="button"
                onClick={() => setFeedType('orbital_canvas')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  feedType === 'orbital_canvas' ? 'bg-white/25 text-white font-medium' : 'text-white/60 hover:text-white'
                }`}
              >
                Sensor Video
              </button>
              <button
                type="button"
                onClick={() => setFeedType('nasa_iss')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  feedType === 'nasa_iss' ? 'bg-white/25 text-white font-medium' : 'text-white/60 hover:text-white'
                }`}
              >
                NASA ISS Live HD
              </button>
            </div>
          )}
        </div>

        {/* Real-time UTC Timestamp */}
        <div className="px-2 py-0.5 sm:py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15 font-sans font-medium text-[9.5px] sm:text-[10.5px] text-white/95 tabular-nums pointer-events-auto">
          {utcTimestamp || 'LIVE TELEMETRY SYNC'}
        </div>
      </div>

      {/* 3. Sensor Telemetry Overlay Strip: Resolution, Bitrate, Downlink Frequency */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-2 pointer-events-none z-20">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/15 font-sans font-medium text-[9px] sm:text-[10px] text-cyan-300 font-semibold">
              {resolution}
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/15 font-sans font-medium text-[9px] sm:text-[10px] text-emerald-300">
              {bitrate}
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/15 font-sans font-medium text-[9px] sm:text-[10px] text-amber-300">
              {downlinkFreq}
            </span>
          </div>

          {!compact && (
            <div className="text-[10.5px] text-white/90 font-sans truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              <span className="font-semibold">{satelliteName}</span> | Nadir: {latFormatted}, {lonFormatted} | Alt: {altitudeKm} km | Vel: {velocityKms} km/s
            </div>
          )}
        </div>

        {/* 4. Controls: Play/Pause, Mute/Unmute */}
        {showControls && (
          <div className="flex items-center gap-1 pointer-events-auto shrink-0 bg-black/65 backdrop-blur-md border border-white/20 rounded-full p-1 shadow-lg">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause live stream' : 'Play live stream'}
              aria-label={isPlaying ? 'Pause live satellite stream' : 'Resume live satellite stream'}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white ml-0.5" />}
            </button>

            {feedType === 'nasa_iss' && (
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Unmute stream' : 'Mute stream'}
                aria-label={isMuted ? 'Unmute audio stream' : 'Mute audio stream'}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
