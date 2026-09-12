import React, { useState, useEffect, useRef } from 'react';
import { VideoAdPreset } from '../../data/videoAdSamples';
import { SurfaceDefinition } from '../../models/surface';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { Play, Pause, Volume2, VolumeX, ExternalLink, Sparkles, Film, Radio, Music, Flame } from 'lucide-react';

interface Props {
  videoAd: VideoAdPreset;
  surface: SurfaceDefinition;
  scaleFactor?: number;
  interactive?: boolean;
}

export const VideoAdRenderer: React.FC<Props> = ({
  videoAd,
  surface,
  scaleFactor = 1.0,
  interactive = true,
}) => {
  const { campaign } = useAdaptXStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);

  const duration = videoAd.durationSeconds || 15;

  const containerW = surface.width * scaleFactor;
  const containerH = surface.height * scaleFactor;

  const headlineText = campaign?.assets?.headline || videoAd.headline;
  const descriptionText = campaign?.assets?.description || videoAd.bodyDescription;
  const ctaText = campaign?.assets?.ctaText || videoAd.ctaText;
  const headlineColor = campaign?.assets?.headlineColor || '#ffffff';
  const headlineFontFamily = campaign?.assets?.headlineFontFamily || campaign?.assets?.fontFamily || 'inherit';
  const ctaBgColor = campaign?.assets?.brandColors?.primary || videoAd.brandColors.primary;
  const ctaTextColor = campaign?.assets?.ctaTextColor || videoAd.brandColors.text;

  // Real-time Motion Timer Engine Loop
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastTime) / 1000;
        setElapsedTime((prev) => {
          const next = prev + delta;
          if (next >= duration) return 0; // Continuous Loop
          return next;
        });
      }
      lastTime = now;
      animFrame = requestAnimationFrame(updateLoop);
    };

    animFrame = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, duration]);

  // Sync progress percentage with elapsed time
  useEffect(() => {
    setProgress((elapsedTime / duration) * 100);
  }, [elapsedTime, duration]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    setElapsedTime((val / 100) * duration);
  };

  // Motion Style Transformations (Driven by real-time elapsedTime)
  const getMotionTransform = () => {
    if (!isPlaying) return {};

    const t = elapsedTime;
    switch (videoAd.motionStyle) {
      case '360° Slow Orbit':
        return {
          transform: `scale(${1.05 + Math.sin(t * 1.5) * 0.05}) rotateY(${Math.sin(t * 1.2) * 15}deg) rotateX(${Math.cos(t * 1.2) * 8}deg)`,
          transition: 'transform 0.1s linear',
        };
      case 'Bounce & Float':
        return {
          transform: `translateY(${Math.abs(Math.sin(t * 3.5)) * -22}px) scale(${1.0 + Math.sin(t * 3.5) * 0.04})`,
          transition: 'transform 0.1s linear',
        };
      case 'Zoom Pulse':
        return {
          transform: `scale(${1.0 + Math.sin(t * 0.8) * 0.12}) translate(${Math.sin(t * 0.5) * 10}px, ${Math.cos(t * 0.5) * 8}px)`,
          transition: 'transform 0.1s linear',
        };
      case 'Holographic Glitch':
        return {
          transform: `scale(${1.04 + Math.sin(t * 4) * 0.03}) translate(${Math.sin(t * 8) * 3}px, ${Math.cos(t * 8) * 2}px)`,
          filter: `hue-rotate(${Math.sin(t * 3) * 30}deg) drop-shadow(0 0 12px ${ctaBgColor})`,
          transition: 'transform 0.05s linear',
        };
      case 'Shimmer Glare':
      default:
        return {
          transform: `scale(${1.06 + Math.cos(t * 2) * 0.04}) rotate(${Math.sin(t * 1.5) * 2}deg)`,
          transition: 'transform 0.1s linear',
        };
    }
  };

  return (
    <div
      style={{ width: containerW, height: containerH }}
      className="relative overflow-hidden rounded-2xl bg-black border-3 border-black shadow-[6px_6px_0px_#000000] select-none flex flex-col justify-between group"
    >
      {/* Background Product Image Container with Motion Video Engine */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950 flex items-center justify-center">
        <div style={getMotionTransform()} className="w-full h-full relative">
          <img
            src={videoAd.productImageUrl}
            alt={videoAd.name}
            className="w-full h-full object-cover filter brightness-90 contrast-110"
          />
        </div>
      </div>

      {/* Cyber Gradient Overlay & Animated Scanline Glitch Grid */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/50 z-10 pointer-events-none" />

      {/* Equalizer Audio Frequency Waveform Overlay */}
      {isPlaying && (
        <div className="absolute top-12 left-4 z-20 flex items-end gap-1 pointer-events-none opacity-80">
          <div className="w-1 bg-amber-400 rounded-full animate-bounce h-5" style={{ animationDelay: '0.1s' }} />
          <div className="w-1 bg-cyan-400 rounded-full animate-bounce h-7" style={{ animationDelay: '0.2s' }} />
          <div className="w-1 bg-rose-500 rounded-full animate-bounce h-4" style={{ animationDelay: '0.3s' }} />
          <div className="w-1 bg-emerald-400 rounded-full animate-bounce h-6" style={{ animationDelay: '0.15s' }} />
        </div>
      )}

      {/* Center Kinetic Headline & Product Overlay */}
      <div className="relative z-20 p-4 text-center my-auto space-y-2">
        <h2
          style={{
            fontSize: campaign?.assets?.headlineFontSize ? `${campaign.assets.headlineFontSize}px` : Math.max(16, Math.min(30, containerW * 0.055)),
            color: headlineColor,
            fontFamily: headlineFontFamily,
          }}
          className="font-black tracking-tight uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight"
        >
          {headlineText}
        </h2>
        <p className="text-xs text-slate-200 font-semibold max-w-md mx-auto line-clamp-2 drop-shadow-md">
          {descriptionText}
        </p>
      </div>

      {/* Bottom Controls Bar & CTA */}
      <div className="relative z-20 p-3 space-y-2 bg-gradient-to-t from-black via-black/80 to-transparent">
        {/* CTA Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={togglePlay}
            style={{
              backgroundColor: ctaBgColor,
              color: ctaTextColor,
              fontFamily: campaign?.assets?.ctaFontFamily || headlineFontFamily,
              fontSize: campaign?.assets?.ctaFontSize ? `${campaign.assets.ctaFontSize}px` : undefined,
            }}
            className="w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000000] cursor-pointer hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 stroke-[3]" />
            <span>{ctaText}</span>
          </button>
        </div>

        {/* Video Scrubber & Playback Controls */}
        {interactive && (
          <div className="flex items-center gap-2 text-white text-[10px] font-mono pt-1">
            <button
              onClick={togglePlay}
              className="p-1.5 bg-white/20 hover:bg-white/40 border border-white/30 rounded-lg text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 bg-white/20 hover:bg-white/40 border border-white/30 rounded-lg text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            {/* Progress Scrubber */}
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-2 bg-slate-800 border border-white/20 rounded-lg appearance-none cursor-pointer accent-[#FFC72C]"
            />

            <span className="text-slate-200 font-bold shrink-0">
              {Math.floor(elapsedTime)}s / {duration}s
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
