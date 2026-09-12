import React, { useState, useEffect, useRef } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { RefreshCw, Zap, Move, Maximize2, Sparkles, Layers, Box } from 'lucide-react';
import { CANVAS_TEMPLATES } from '../../data/templatesData';

interface PosterCube3DProps {
  size?: number; // Size of individual cubelet in px (default: 48)
  className?: string;
  autoTwist?: boolean;
}

export const PosterCube3D: React.FC<PosterCube3DProps> = ({
  size = 54,
  className = '',
  autoTwist = true,
}) => {
  const { campaign } = useAdaptXStore();

  const [rotX, setRotX] = useState(-20);
  const [rotY, setRotY] = useState(30);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const [twistAngle, setTwistAngle] = useState(0);
  const [activeSlice, setActiveSlice] = useState<'top' | 'middle' | 'bottom' | 'front' | 'right' | 'none'>('top');

  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  const halfSize = size / 2;
  const gap = isExploded ? 22 : 3;

  // Active product image or fallback poster image
  const pImage = campaign.assets.productImageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';
  const tpl1Image = CANVAS_TEMPLATES[0]?.previewUrl || pImage;
  const tpl2Image = CANVAS_TEMPLATES[1]?.previewUrl || pImage;
  const tpl3Image = CANVAS_TEMPLATES[2]?.previewUrl || pImage;
  const tpl4Image = CANVAS_TEMPLATES[3]?.previewUrl || pImage;

  // Auto-rotate 3D scene animation loop
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isAutoRotate && !isDragging.current) {
        setRotY((prev) => (prev + delta * 25) % 360);
        setRotX((prev) => -20 + Math.sin(time / 1500) * 12);
      }

      if (autoTwist) {
        setTwistAngle((prev) => (prev + delta * 75) % 360);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isAutoRotate, autoTwist]);

  // Periodic slice switching for Rubik's cube poster transformation
  useEffect(() => {
    if (!autoTwist) return;
    const interval = setInterval(() => {
      const slices: ('top' | 'middle' | 'bottom' | 'front' | 'right')[] = ['top', 'middle', 'bottom', 'front', 'right'];
      const nextSlice = slices[Math.floor(Math.random() * slices.length)];
      setActiveSlice(nextSlice);
    }, 3500);
    return () => clearInterval(interval);
  }, [autoTwist]);

  // Mouse interaction handlers for manual 3D dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    setRotY((prev) => prev + deltaX * 0.8);
    setRotX((prev) => Math.max(-85, Math.min(85, prev - deltaY * 0.8)));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Build 3x3x3 grid coordinates: x, y, z in [-1, 0, 1]
  const cubelets = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubelets.push({ x, y, z, id: `${x}_${y}_${z}` });
      }
    }
  }

  // Calculate poster slice background offset for each face tile grid (0, 1, 2)
  const getSliceStyle = (col: number, row: number, bgImg: string, bgColor: string, badgeText: string) => {
    const bgPosX = col * 50; // 0%, 50%, 100%
    const bgPosY = row * 50; // 0%, 50%, 100%

    return {
      backgroundImage: `url(${bgImg})`,
      backgroundSize: '300% 300%',
      backgroundPosition: `${bgPosX}% ${bgPosY}%`,
      backgroundColor: bgColor,
    };
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D Scene Canvas */}
      <div
        className="w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '1000px' }}
      >
        {/* Main Rotatable 3D Poster Cube */}
        <div
          className="relative transition-transform duration-75 ease-out"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {cubelets.map(({ x, y, z, id }) => {
            // Grid indices 0, 1, 2
            const colX = x + 1;
            const rowY = y + 1;
            const colZ = z + 1;

            // Compute positions with gap
            let posX = x * (size + gap);
            let posY = y * (size + gap);
            let posZ = z * (size + gap);

            // Rubik's Slice Transformation Twist angles
            let sliceTransform = '';
            const angleVal = Math.sin(twistAngle * 0.06) * 90;
            if (activeSlice === 'top' && y === -1) {
              sliceTransform = `rotateY(${angleVal}deg)`;
            } else if (activeSlice === 'bottom' && y === 1) {
              sliceTransform = `rotateY(${-angleVal}deg)`;
            } else if (activeSlice === 'middle' && y === 0) {
              sliceTransform = `rotateY(${angleVal * 1.5}deg)`;
            } else if (activeSlice === 'front' && z === 1) {
              sliceTransform = `rotateZ(${angleVal}deg)`;
            } else if (activeSlice === 'right' && x === 1) {
              sliceTransform = `rotateX(${angleVal}deg)`;
            }

            return (
              <div
                key={id}
                className="absolute transition-all duration-500 ease-out"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  transformStyle: 'preserve-3d',
                  transform: `translate3d(${posX}px, ${posY}px, ${posZ}px) ${sliceTransform}`,
                }}
              >
                {/* 6 Cubelet Poster Faces */}

                {/* 1. FRONT FACE: Active Product & Campaign Poster */}
                <div
                  className="absolute inset-0 border-2 border-black rounded-sm shadow-[1px_1px_0px_#000] overflow-hidden bg-cover bg-center flex flex-col justify-between p-0.5"
                  style={{
                    transform: `translateZ(${halfSize}px)`,
                    ...getSliceStyle(colX, rowY, pImage, '#FFC72C', 'POSTER'),
                  }}
                >
                  <div className="bg-black/80 text-white font-black text-[7px] px-0.5 rounded leading-none uppercase truncate max-w-full">
                    {campaign.assets.headline || 'HERO AD'}
                  </div>
                  {rowY === 2 && colX === 1 && (
                    <div className="bg-[#FF4500] text-white border border-black font-black text-[6px] px-0.5 py-0.2 rounded text-center uppercase tracking-tighter">
                      {campaign.assets.ctaText || 'BUY NOW'}
                    </div>
                  )}
                </div>

                {/* 2. BACK FACE: 80s Retro Synthwave Template Poster */}
                <div
                  className="absolute inset-0 border-2 border-black rounded-sm shadow-[1px_1px_0px_#000] overflow-hidden bg-cover bg-center flex flex-col justify-between p-0.5"
                  style={{
                    transform: `rotateY(180deg) translateZ(${halfSize}px)`,
                    ...getSliceStyle(2 - colX, rowY, tpl1Image, '#B5A8F7', 'RETRO'),
                  }}
                >
                  <div className="bg-purple-900/90 text-yellow-300 font-black text-[7px] px-0.5 rounded leading-none uppercase truncate">
                    RETRO 80S
                  </div>
                </div>

                {/* 3. LEFT FACE: Haute Couture Fashion Poster */}
                <div
                  className="absolute inset-0 border-2 border-black rounded-sm shadow-[1px_1px_0px_#000] overflow-hidden bg-cover bg-center flex flex-col justify-between p-0.5"
                  style={{
                    transform: `rotateY(-90deg) translateZ(${halfSize}px)`,
                    ...getSliceStyle(colZ, rowY, tpl2Image, '#3B82F6', 'FASHION'),
                  }}
                >
                  <div className="bg-blue-900/90 text-white font-black text-[7px] px-0.5 rounded leading-none uppercase truncate">
                    HAUTE MODE
                  </div>
                </div>

                {/* 4. RIGHT FACE: Hypercar Dashboard Poster */}
                <div
                  className="absolute inset-0 border-2 border-black rounded-sm shadow-[1px_1px_0px_#000] overflow-hidden bg-cover bg-center flex flex-col justify-between p-0.5"
                  style={{
                    transform: `rotateY(90deg) translateZ(${halfSize}px)`,
                    ...getSliceStyle(2 - colZ, rowY, tpl3Image, '#22C55E', 'SPEED'),
                  }}
                >
                  <div className="bg-emerald-950/90 text-emerald-300 font-black text-[7px] px-0.5 rounded leading-none uppercase truncate">
                    HYPERCAR
                  </div>
                </div>

                {/* 5. TOP FACE: Raw Underground Street Art Poster */}
                <div
                  className="absolute inset-0 border-2 border-black rounded-sm shadow-[1px_1px_0px_#000] overflow-hidden bg-cover bg-center flex flex-col justify-between p-0.5"
                  style={{
                    transform: `rotateX(90deg) translateZ(${halfSize}px)`,
                    ...getSliceStyle(colX, colZ, tpl4Image, '#FF4500', 'STREET'),
                  }}
                >
                  <div className="bg-red-950/90 text-orange-300 font-black text-[7px] px-0.5 rounded leading-none uppercase truncate">
                    STREET ART
                  </div>
                </div>

                {/* 6. BOTTOM FACE: Brand Strategy Minimal Poster */}
                <div
                  className="absolute inset-0 border-2 border-black rounded-sm shadow-[1px_1px_0px_#000] overflow-hidden bg-cover bg-center flex flex-col justify-between p-0.5"
                  style={{
                    transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
                    ...getSliceStyle(colX, 2 - colZ, pImage, '#5CE1E6', 'VIBE'),
                  }}
                >
                  <div className="bg-black/90 text-cyan-300 font-black text-[7px] px-0.5 rounded leading-none uppercase truncate">
                    ADAPTIVE
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Mode Toggle Bar */}
      <div className="mt-3 flex items-center gap-2 bg-black text-white border-2 border-black px-3 py-1.5 rounded-full shadow-[3px_3px_0px_#FFC72C] text-[11px] font-black uppercase z-10">
        <button
          onClick={() => setIsExploded(!isExploded)}
          className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer ${
            isExploded ? 'bg-[#FFC72C] text-black font-black' : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isExploded ? 'Re-Assemble Cube' : '3D Poster Transform'}</span>
        </button>

        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer ${
            isAutoRotate ? 'bg-[#FF4500] text-white font-black' : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
          <span>{isAutoRotate ? '3D Orbiting' : 'Paused'}</span>
        </button>
      </div>
    </div>
  );
};
