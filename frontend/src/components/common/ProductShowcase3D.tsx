import React, { useState, useEffect, useRef } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { Sparkles, RefreshCw, Layers, ShieldCheck, Tag, ExternalLink, Flame, Maximize2, Zap, ArrowRight } from 'lucide-react';
import { CANVAS_TEMPLATES } from '../../data/templatesData';

interface ProductShowcase3DProps {
  className?: string;
  isPaused?: boolean;
}

export const ProductShowcase3D: React.FC<ProductShowcase3DProps> = ({
  className = '',
  isPaused = false,
}) => {
  const { campaign, activeSurface, adMode } = useAdaptXStore();

  const [rotX, setRotX] = useState(-12);
  const [rotY, setRotY] = useState(18);
  const [activeView, setActiveView] = useState<'hero' | 'stack' | 'specs'>('hero');
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  // Active product details
  const pImage = campaign.assets.productImageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';
  const headline = campaign.assets.headline || 'APEX AUDIO';
  const description = campaign.assets.description || 'Studio spatial sound architecture built for immersive listening.';
  const ctaText = campaign.assets.ctaText || 'EXPLORE NOW ➔';
  const brandPrimary = campaign.assets.brandColors?.primary || '#FF4500';
  const brandBg = campaign.assets.brandColors?.background || '#FFC72C';

  // Smooth floating tilt animation
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused && !isDragging.current && !isHovered) {
        setRotY((prev) => (prev + delta * 15) % 360);
        setRotX((prev) => -12 + Math.sin(time / 1400) * 8);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPaused, isHovered]);

  // Mouse drag 3D orientation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    setRotY((prev) => prev + deltaX * 0.7);
    setRotX((prev) => Math.max(-45, Math.min(45, prev - deltaY * 0.7)));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
    >
      {/* 3D Motion Stage Viewport */}
      <div
        className="w-full max-w-sm sm:max-w-md h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing relative"
        style={{ perspective: '1200px' }}
      >
        {/* Floating Kinetic Ambient Glow Stage Base */}
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-35 animate-pulse pointer-events-none"
          style={{ backgroundColor: brandPrimary }}
        />

        {/* Rotatable 3D Product Motion Card Container */}
        <div
          className="relative transition-transform duration-100 ease-out"
          style={{
            width: '280px',
            height: '370px',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX}deg) rotateY(${rotY + (isFlipped ? 180 : 0)}deg)`,
          }}
        >
          {/* 1. HERO MAIN CARD (FRONT) */}
          <div
            className="absolute inset-0 rounded-3xl border-3 border-black p-5 shadow-[8px_8px_0px_#000000] flex flex-col justify-between overflow-hidden backdrop-blur-md transition-all duration-300"
            style={{
              backgroundColor: brandBg,
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0px)',
            }}
          >
            {/* Top Badge & Controls */}
            <div
              className="flex items-center justify-between z-20"
              style={{ transform: 'translateZ(30px)' }}
            >
              <span className="text-[9px] font-mono font-black uppercase bg-black text-white px-2 py-0.5 rounded-lg border border-black shadow-[1.5px_1.5px_0px_#fff]">
                {adMode === 'video' ? '3D COMMERCIAL' : '3D PRODUCT SHOWCASE'}
              </span>
              <span className="text-[9px] font-mono font-black uppercase bg-white text-black px-2 py-0.5 rounded-lg border border-black shadow-[1.5px_1.5px_0px_#000]">
                {activeSurface.name}
              </span>
            </div>

            {/* 3D POP-OUT PRODUCT CUTOUT */}
            <div
              className="relative w-full h-44 my-auto flex items-center justify-center z-30 transition-transform duration-300 hover:scale-110"
              style={{ transform: 'translateZ(50px)' }}
            >
              {/* Radial Backdrop Aura */}
              <div className="absolute w-36 h-36 rounded-full bg-white/40 border-2 border-black/20 shadow-inner flex items-center justify-center" />

              {/* Pop-Out Product Image with 3D Drop Shadow */}
              <img
                src={pImage}
                alt={campaign.name}
                className="w-40 h-40 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.45)] transition-all duration-300 transform hover:rotate-6"
              />
            </div>

            {/* Kinetic Typography & CTA (3D Lifted Front Panel) */}
            <div
              className="space-y-2.5 z-20 bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000]"
              style={{ transform: 'translateZ(40px)' }}
            >
              <h3 className="font-black text-black text-sm uppercase tracking-tight line-clamp-1 leading-none">
                {headline}
              </h3>
              <p className="text-[10px] font-semibold text-slate-700 line-clamp-2 leading-tight">
                {description}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                style={{ backgroundColor: brandPrimary }}
                className="w-full py-1.5 px-3 text-white font-black text-[10px] uppercase rounded-xl border-2 border-black flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000] cursor-pointer hover:scale-[1.02] transition-all"
              >
                <Sparkles className="w-3 h-3 stroke-[3]" />
                <span>{ctaText}</span>
              </button>
            </div>
          </div>

          {/* 2. CARD BACK (3D FLIP PRODUCT SPECS) */}
          <div
            className="absolute inset-0 rounded-3xl border-3 border-black p-5 shadow-[8px_8px_0px_#000000] flex flex-col justify-between bg-slate-900 text-white overflow-hidden backdrop-blur-md transition-all duration-300"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg) translateZ(0px)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-black uppercase bg-[#FFC72C] text-black px-2 py-0.5 rounded-lg border border-black">
                PRODUCT ARCHITECTURE
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="text-[9px] font-mono font-black bg-white text-black px-2 py-0.5 rounded-lg border border-black hover:bg-slate-200 cursor-pointer"
              >
                FLIP FRONT ➔
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-[9px] font-mono text-slate-400 uppercase">CAMPAIGN ID</span>
                <p className="font-black text-white truncate">{campaign.name}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-[9px] font-mono text-slate-400 uppercase">COLOR MATRIX</span>
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="w-5 h-5 rounded-full border border-white" style={{ backgroundColor: brandPrimary }} />
                  <div className="w-5 h-5 rounded-full border border-white" style={{ backgroundColor: brandBg }} />
                  <div className="w-5 h-5 rounded-full border border-white bg-white" />
                  <div className="w-5 h-5 rounded-full border border-white bg-black" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-[9px] font-mono text-slate-400 uppercase">ADAPTIVE ENGINE</span>
                <p className="font-bold text-emerald-400 text-[10px]">Realtime Geometry Auto-Fitting Passed</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="w-full py-2 bg-[#FF4500] text-white font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              RETURN TO AD CARD
            </button>
          </div>

          {/* 3. PARALLAX STACK CARD 2 (BEHIND HERO CARD) */}
          {activeView === 'stack' && (
            <div
              className="absolute inset-0 rounded-3xl border-3 border-black p-5 bg-[#3B82F6] opacity-75 shadow-lg pointer-events-none transition-transform duration-500"
              style={{
                transform: 'translateZ(-40px) translateX(25px) translateY(-15px) rotateZ(-5deg)',
              }}
            >
              <div className="text-white font-black text-xs uppercase">MOBILE STORY PREVIEW</div>
            </div>
          )}

          {/* 4. PARALLAX STACK CARD 3 (BEHIND HERO CARD) */}
          {activeView === 'stack' && (
            <div
              className="absolute inset-0 rounded-3xl border-3 border-black p-5 bg-[#22C55E] opacity-55 shadow-lg pointer-events-none transition-transform duration-500"
              style={{
                transform: 'translateZ(-80px) translateX(-25px) translateY(-30px) rotateZ(5deg)',
              }}
            >
              <div className="text-white font-black text-xs uppercase">DESKTOP LEADERBOARD</div>
            </div>
          )}
        </div>
      </div>

      {/* Floating 3D Showcase Mode Controls */}
      <div className="mt-2 flex items-center gap-2 bg-black text-white border-2 border-black px-3 py-1.5 rounded-full shadow-[3px_3px_0px_#FFC72C] text-[11px] font-black uppercase z-10">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer ${
            isFlipped ? 'bg-[#FF4500] text-white font-black' : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? 'Show Front' : 'Flip 3D Card'}</span>
        </button>

        <button
          onClick={() => setActiveView(activeView === 'hero' ? 'stack' : 'hero')}
          className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer ${
            activeView === 'stack' ? 'bg-[#FFC72C] text-black font-black' : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{activeView === 'stack' ? 'Single Card' : 'Multi-Card Stack'}</span>
        </button>
      </div>
    </div>
  );
};
