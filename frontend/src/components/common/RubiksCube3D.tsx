import React, { useState, useEffect, useRef } from 'react';

interface RubiksCube3DProps {
  size?: number; // Size of individual cubelet in px (default: 36)
  className?: string;
  showControls?: boolean;
  isPaused?: boolean;
}

export const RubiksCube3D: React.FC<RubiksCube3DProps> = ({
  size = 36,
  className = '',
  isPaused = false,
}) => {
  const [rotX, setRotX] = useState(-25);
  const [rotY, setRotY] = useState(35);
  const [isAutoRotate] = useState(true);
  const [isExploded] = useState(false);
  const [twistAngle, setTwistAngle] = useState(0);
  const [activeSlice, setActiveSlice] = useState<'top' | 'middle' | 'bottom' | 'front' | 'none'>('top');

  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  const halfSize = size / 2;
  const gap = isExploded ? 16 : 3;

  // Auto-rotate animation loop
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused && isAutoRotate && !isDragging.current) {
        setRotY((prev) => (prev + delta * 35) % 360);
        setRotX((prev) => -25 + Math.sin(time / 1200) * 15);
        setTwistAngle((prev) => (prev + delta * 60) % 360);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isAutoRotate, isPaused]);

  // Periodic slice switching for animated twisting
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const slices: ('top' | 'middle' | 'bottom' | 'front' | 'none')[] = ['top', 'middle', 'bottom', 'front'];
      const nextSlice = slices[Math.floor(Math.random() * slices.length)];
      setActiveSlice(nextSlice);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

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

  // 3x3x3 grid coordinates: x, y, z in [-1, 0, 1]
  const cubelets = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubelets.push({ x, y, z, id: `${x}_${y}_${z}` });
      }
    }
  }

  // Face colors palette (Neobrutalist theme matching the app)
  const faceColors = {
    front: 'bg-[#FF4500]',  // Vibrant Red-Orange
    back: 'bg-[#FFC72C]',   // Bright Yellow
    left: 'bg-[#3B82F6]',   // Electric Blue
    right: 'bg-[#22C55E]',  // Neon Green
    top: 'bg-white',        // Pure White
    bottom: 'bg-[#B5A8F7]', // Soft Lilac Purple
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D Scene Container */}
      <div
        className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '900px' }}
      >
        {/* Main Rotatable 3D Cube */}
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
            // Compute base positions with gaps
            const posX = x * (size + gap);
            const posY = y * (size + gap);
            const posZ = z * (size + gap);

            // Compute slice dynamic twist rotations
            let sliceTransform = '';
            if (activeSlice === 'top' && y === -1) {
              sliceTransform = `rotateY(${Math.sin(twistAngle * 0.05) * 90}deg)`;
            } else if (activeSlice === 'bottom' && y === 1) {
              sliceTransform = `rotateY(${-Math.cos(twistAngle * 0.05) * 90}deg)`;
            } else if (activeSlice === 'middle' && y === 0) {
              sliceTransform = `rotateY(${Math.sin(twistAngle * 0.08) * 180}deg)`;
            } else if (activeSlice === 'front' && z === 1) {
              sliceTransform = `rotateZ(${Math.sin(twistAngle * 0.05) * 90}deg)`;
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
                {/* 6 Cubelet Faces */}
                {/* Front */}
                <div
                  className={`absolute inset-0 border-2 border-black rounded-sm shadow-[1px_1px_0px_#000] ${faceColors.front}`}
                  style={{ transform: `translateZ(${halfSize}px)` }}
                />
                {/* Back */}
                <div
                  className={`absolute inset-0 border-2 border-black rounded-sm shadow-[1px_1px_0px_#000] ${faceColors.back}`}
                  style={{ transform: `rotateY(180deg) translateZ(${halfSize}px)` }}
                />
                {/* Left */}
                <div
                  className={`absolute inset-0 border-2 border-black rounded-sm shadow-[1px_1px_0px_#000] ${faceColors.left}`}
                  style={{ transform: `rotateY(-90deg) translateZ(${halfSize}px)` }}
                />
                {/* Right */}
                <div
                  className={`absolute inset-0 border-2 border-black rounded-sm shadow-[1px_1px_0px_#000] ${faceColors.right}`}
                  style={{ transform: `rotateY(90deg) translateZ(${halfSize}px)` }}
                />
                {/* Top */}
                <div
                  className={`absolute inset-0 border-2 border-black rounded-sm shadow-[1px_1px_0px_#000] ${faceColors.top}`}
                  style={{ transform: `rotateX(90deg) translateZ(${halfSize}px)` }}
                />
                {/* Bottom */}
                <div
                  className={`absolute inset-0 border-2 border-black rounded-sm shadow-[1px_1px_0px_#000] ${faceColors.bottom}`}
                  style={{ transform: `rotateX(-90deg) translateZ(${halfSize}px)` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
