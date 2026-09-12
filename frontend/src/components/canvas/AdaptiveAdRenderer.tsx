import React, { useState } from 'react';
import { LayoutCandidate } from '../../models/layout';
import { SurfaceDefinition } from '../../models/surface';
import { Campaign } from '../../models/campaign';
import { FocalPointCropper } from '../../engine/cropping/FocalPointCropper';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { Move, Scaling } from 'lucide-react';

interface AdaptiveAdRendererProps {
  candidate: LayoutCandidate;
  surface: SurfaceDefinition;
  campaign: Campaign;
  showOverlays?: boolean;
  scaleFactor?: number;
  interactive?: boolean;
  isDragModeEnabled?: boolean;
  is3DProductPopout?: boolean;
}

export const AdaptiveAdRenderer: React.FC<AdaptiveAdRendererProps> = ({
  candidate,
  surface,
  campaign,
  showOverlays = true,
  scaleFactor = 1.0,
  interactive = true,
  isDragModeEnabled = false,
  is3DProductPopout = false,
}) => {
  const { activeThemeTokens, selectedCandidate, setSelectedCandidate, isMotionAnimated, motionMode } = useAdaptXStore();
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const W = surface.width;
  const H = surface.height;
  const genome = candidate.genome;
  const safe = surface.safeZone;
  const theme = activeThemeTokens;

  // Safe zone insets in pixels
  const safeTopPx = (safe.top / 100) * H;
  const safeBottomPx = (safe.bottom / 100) * H;
  const safeLeftPx = (safe.left / 100) * W;
  const safeRightPx = (safe.right / 100) * W;

  const productEl = genome.elements.product;
  const headlineEl = genome.elements.headline;
  const logoEl = genome.elements.logo;
  const ctaEl = genome.elements.cta;
  const descEl = genome.elements.description;
  const legalEl = genome.elements.legalText;

  // Compute image focal crop
  const crop = productEl?.cropRect || FocalPointCropper.computeCrop(
    campaign.assets.productImageAspect,
    (productEl?.box.width || 300) / (productEl?.box.height || 200),
    campaign.assets.focalPoint
  );

  // Theme-Specific Identifiers
  const isBrutalist = theme.id === 'neo_brutalist';
  const isPixel = theme.id === 'pixel';
  const is3D = theme.id === 'spatial_3d' || theme.effects.tiltDeg !== 0;
  const isNeon = theme.id === 'neon';
  const isSketch = theme.id === 'hand_drawn';
  const isEditorial = theme.id === 'editorial';
  const isGlass = theme.id === 'glass';

  // Distinct Typography Helpers
  const getHeadingFont = () => {
    if (campaign.assets.fontFamily) return campaign.assets.fontFamily;
    if (isPixel) return '"Press Start 2P", "Courier New", monospace';
    if (isNeon) return '"Orbitron", "Trebuchet MS", sans-serif';
    if (isSketch) return '"Caveat", "Comic Sans MS", cursive';
    if (isEditorial) return '"Playfair Display", "Georgia", serif';
    if (is3D) return '"Plus Jakarta Sans", Inter, sans-serif';
    if (isGlass) return '"Outfit", Inter, sans-serif';
    if (isBrutalist) return '"Arial Black", Impact, sans-serif';
    return theme.typography?.headingFont || 'Inter, sans-serif';
  };

  const getBodyFont = () => {
    if (campaign.assets.fontFamily) return campaign.assets.fontFamily;
    if (isPixel) return '"Courier New", Courier, monospace';
    if (isNeon) return '"Courier New", Courier, monospace';
    if (isSketch) return '"Caveat", "Comic Sans MS", cursive';
    if (isEditorial) return 'Georgia, "Times New Roman", serif';
    if (is3D) return 'Inter, sans-serif';
    if (isGlass) return 'Inter, sans-serif';
    if (isBrutalist) return 'system-ui, sans-serif';
    return theme.typography?.bodyFont || 'sans-serif';
  };

  // Distinct Image Filter & Container Frame per Theme
  const getImageFilter = () => {
    if (isBrutalist) return 'contrast(1.25) saturate(1.2)';
    if (isPixel) return 'contrast(1.4) saturate(1.4) hue-rotate(-10deg)';
    if (isNeon) return 'contrast(1.35) saturate(1.5) drop-shadow(0 0 15px #06B6D4)';
    if (isSketch) return 'contrast(1.5) grayscale(0.3) sepia(0.25)';
    if (isEditorial) return 'contrast(1.2) grayscale(0.2)';
    if (is3D) return 'contrast(1.1) saturate(1.1)';
    if (isGlass) return 'contrast(1.15) saturate(1.1)';
    return 'none';
  };

  const getProductMotionClass = () => {
    if (!isMotionAnimated || motionMode === 'static') return '';
    if (motionMode === 'slow_360') return 'animate-poster-360-slow';
    if (motionMode === 'kinetic_3d') return 'animate-poster-float-3d';
    if (motionMode === 'pulse') return 'animate-poster-glow';
    if (motionMode === 'bounce_float') return 'animate-poster-bounce';
    if (motionMode === 'glitch_flicker') return 'animate-poster-glitch';
    if (motionMode === 'zoom_pulse') return 'animate-poster-zoom';
    return '';
  };

  const getCtaButtonStyles = () => {
    const styleOpt = campaign.constraints.ctaStyle || 'solid';
    const primaryColor = campaign.assets.brandColors.primary || theme.colors.primary || '#FFB000';

    let background = isPixel
      ? 'linear-gradient(180deg, #FFD700 0%, #FF8C00 100%)'
      : isNeon
      ? 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)'
      : isSketch
      ? '#FEF08A'
      : isEditorial
      ? '#FFFFFF'
      : is3D
      ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
      : isGlass
      ? 'rgba(255, 255, 255, 0.25)'
      : primaryColor;

    let color = campaign.assets.ctaTextColor || (isPixel || isSketch || isEditorial || isBrutalist ? '#000000' : '#FFFFFF');

    let border = isPixel
      ? '4px solid #000000'
      : isNeon
      ? '2px solid #38BDF8'
      : isSketch
      ? '2px dashed #000000'
      : isEditorial
      ? '2px solid #000000'
      : is3D || isGlass
      ? '1px solid rgba(255, 255, 255, 0.4)'
      : '3px solid #000000';

    let borderRadius = isPixel || isEditorial ? '0px' : isNeon ? '6px' : isSketch ? '12px' : is3D || isGlass ? '9999px' : '6px';

    if (styleOpt === 'pill') {
      borderRadius = '9999px';
    } else if (styleOpt === 'outline') {
      background = 'transparent';
      color = campaign.assets.ctaTextColor || primaryColor;
      border = `3px solid ${primaryColor}`;
      borderRadius = isPixel || isEditorial ? '0px' : '10px';
    } else if (styleOpt === 'gradient') {
      background = 'linear-gradient(135deg, #FFB000 0%, #FF5500 100%)';
      color = '#FFFFFF';
      borderRadius = isPixel || isEditorial ? '0px' : '12px';
    } else if (styleOpt === 'solid') {
      background = primaryColor;
      borderRadius = isPixel || isEditorial ? '0px' : '8px';
    }

    return { background, color, border, borderRadius };
  };

  // Mouse Drag Handler for Moving Elements using Cursor
  const handleMouseDown = (e: React.MouseEvent, elementKey: string) => {
    if (!interactive) return;
    setSelectedElement(elementKey);

    if (!isDragModeEnabled || !selectedCandidate) return;

    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;

    const el = genome.elements[elementKey as keyof typeof genome.elements];
    if (!el) return;

    const initBoxX = el.box.x;
    const initBoxY = el.box.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scaleFactor;
      const deltaY = (moveEvent.clientY - startY) / scaleFactor;

      const newX = Math.max(0, Math.min(W - el.box.width, Math.round(initBoxX + deltaX)));
      const newY = Math.max(0, Math.min(H - el.box.height, Math.round(initBoxY + deltaY)));

      const updatedGenome = {
        ...genome,
        elements: {
          ...genome.elements,
          [elementKey]: {
            ...el,
            box: {
              ...el.box,
              x: newX,
              y: newY,
            },
          },
        },
      };

      const updatedCandidate = {
        ...selectedCandidate,
        genome: updatedGenome,
      };

      setSelectedCandidate(updatedCandidate);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Mouse Drag Handler for Moving Custom Text Box Elements
  const handleCustomElemMouseDown = (e: React.MouseEvent, elemId: string) => {
    if (!interactive) return;
    e.preventDefault();
    e.stopPropagation();

    const customList = campaign.assets.customElements || [];
    const targetElem = customList.find((el) => el.id === elemId);
    if (!targetElem) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initX = targetElem.x;
    const initY = targetElem.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scaleFactor;
      const deltaY = (moveEvent.clientY - startY) / scaleFactor;

      const newX = Math.round(initX + deltaX);
      const newY = Math.round(initY + deltaY);

      const updatedList = customList.map((item) =>
        item.id === elemId ? { ...item, x: newX, y: newY } : item
      );

      useAdaptXStore.getState().updateAsset('customElements', updatedList);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Mouse Resize Handler for Adjusting Element Width & Height
  const handleResizeMouseDown = (e: React.MouseEvent, elementKey: string) => {
    if (!interactive || !selectedCandidate) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;

    const el = genome.elements[elementKey as keyof typeof genome.elements];
    if (!el) return;

    const initW = el.box.width;
    const initH = el.box.height;
    const initFont = el.fontSize || 16;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scaleFactor;
      const deltaY = (moveEvent.clientY - startY) / scaleFactor;

      const newW = Math.max(40, Math.min(W - el.box.x, Math.round(initW + deltaX)));
      const newH = Math.max(24, Math.min(H - el.box.y, Math.round(initH + deltaY)));
      const fontScale = newW / initW;
      const newFontSize = Math.max(10, Math.round(initFont * fontScale));

      const updatedGenome = {
        ...genome,
        elements: {
          ...genome.elements,
          [elementKey]: {
            ...el,
            fontSize: el.fontSize ? newFontSize : el.fontSize,
            box: {
              ...el.box,
              width: newW,
              height: newH,
            },
          },
        },
      };

      const updatedCandidate = {
        ...selectedCandidate,
        genome: updatedGenome,
      };

      setSelectedCandidate(updatedCandidate);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Dynamic Background & Border per Theme
  const getContainerBgColor = () => {
    if (isPixel) return '#020617';
    if (isNeon) return '#030712';
    if (isSketch) return '#FAF7F2';
    if (isEditorial) return '#0F172A';
    if (is3D) return '#0B0F19';
    if (isGlass) return 'rgba(15, 23, 42, 0.75)';
    if (isBrutalist) return '#F9F6F0';
    return theme.colors.background || campaign.assets.brandColors.background;
  };

  const getContainerTextColor = () => {
    if (isPixel) return '#F1F5F9';
    if (isNeon) return '#F8FAFC';
    if (isSketch) return '#1E293B';
    if (isEditorial) return '#F8FAFC';
    if (is3D) return '#FFFFFF';
    if (isGlass) return '#FFFFFF';
    if (isBrutalist) return '#000000';
    return theme.colors.text || campaign.assets.brandColors.text;
  };

  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 ease-out select-none ${
        isBrutalist
          ? 'border-4 border-black text-black shadow-[8px_8px_0px_#000000]'
          : isGlass
          ? 'backdrop-blur-xl border border-white/20 shadow-2xl'
          : isPixel
          ? 'border-4 border-[#38BDF8] text-[#F1F5F9] shadow-[8px_8px_0px_#000000]'
          : isSketch
          ? 'border-3 border-dashed border-slate-700 text-slate-900 shadow-[6px_6px_0px_rgba(0,0,0,0.15)]'
          : isNeon
          ? 'border-2 border-[#06B6D4] text-slate-100 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
          : isEditorial
          ? 'border border-slate-700 text-slate-100 shadow-2xl'
          : is3D
          ? 'border border-blue-500/40 text-white shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.3)]'
          : 'border border-slate-800 bg-slate-950'
      }`}
      style={{
        width: `${W * scaleFactor}px`,
        height: `${H * scaleFactor}px`,
        backgroundColor: getContainerBgColor(),
        fontFamily: getHeadingFont(),
        color: getContainerTextColor(),
        borderRadius: isBrutalist ? '4px' : isPixel ? '0px' : isEditorial ? '4px' : isSketch ? '16px' : isGlass ? '28px' : `${(theme.shape.cornerRadius || 12) * scaleFactor}px`,
        transform: isSketch ? 'rotate(-1.2deg)' : 'none',
        backgroundImage: isPixel
          ? 'radial-gradient(#38BDF8 1.5px, transparent 1.5px)'
          : isNeon
          ? 'linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px)'
          : isSketch
          ? 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)'
          : 'none',
        backgroundSize: isPixel ? '12px 12px' : isNeon ? '100% 4px' : isSketch ? '20px 20px' : 'auto',
      }}
    >
      {/* Neo-Brutalist Dot Grid Accent */}
      {isBrutalist && (
        <>
          <div
            className="absolute top-3 left-3 w-12 h-12 pointer-events-none opacity-40 z-20"
            style={{
              backgroundImage: 'radial-gradient(#000000 1.8px, transparent 1.8px)',
              backgroundSize: '6px 6px',
            }}
          />
          <div className="absolute top-3 right-3 w-7 h-7 bg-[#FFB000] border-2 border-black shadow-[3px_3px_0px_#000000] z-20" />
        </>
      )}

      {/* Kinetic Velocity Speed Lines Accent (For Chevrolet Corvette & Motion Posters) */}
      {isMotionAnimated && (campaign.id === 'corvette-3d-motion' || campaign.name.toLowerCase().includes('corvette')) && (
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-25"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #F43F5E 0px, #F43F5E 2px, transparent 2px, transparent 36px)',
            backgroundSize: '300px 100%',
            animation: 'speedStream 1.2s linear infinite',
          }}
        />
      )}

      {/* Live Motion Status Badge */}
      {isMotionAnimated && motionMode !== 'static' && (
        <div className="absolute top-2.5 right-2.5 z-40 pointer-events-none flex items-center gap-1.5 bg-black/85 border-2 border-black text-[#FFB000] px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black shadow-[2px_2px_0px_#000000] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB000] animate-ping" />
          <span>
            {motionMode === 'slow_360' && '360° SLOW ORBIT'}
            {motionMode === 'kinetic_3d' && '3D KINETIC FLOAT'}
            {motionMode === 'pulse' && 'PULSE & GLOW'}
            {motionMode === 'shimmer' && 'SHIMMER GLARE'}
            {motionMode === 'bounce_float' && 'BOUNCE & FLOAT'}
            {motionMode === 'glitch_flicker' && 'HOLOGRAPHIC GLITCH'}
            {motionMode === 'zoom_pulse' && 'ZOOM PULSE DEPTH'}
          </span>
        </div>
      )}

      {/* Product Image Element */}
      {productEl && productEl.visible && (
        <div
          onMouseDown={(e) => handleMouseDown(e, 'product')}
          className={`absolute transition-all duration-200 ${
            is3DProductPopout ? 'overflow-visible' : 'overflow-hidden'
          } ${
            isDragModeEnabled ? 'cursor-grab active:cursor-grabbing hover:outline-2 hover:outline-dashed hover:outline-black' : 'cursor-pointer'
          } ${selectedElement === 'product' ? 'ring-3 ring-[#FFB000]' : ''} ${getProductMotionClass()}`}
          style={{
            left: `${productEl.box.x * scaleFactor}px`,
            top: `${productEl.box.y * scaleFactor}px`,
            width: `${productEl.box.width * scaleFactor}px`,
            height: `${productEl.box.height * scaleFactor}px`,
            zIndex: productEl.zIndex + (is3DProductPopout ? 15 : is3D ? 10 : 0),
            transform: is3DProductPopout
              ? 'none'
              : is3D
              ? `perspective(1000px) translateZ(45px) scale(1.04)`
              : isSketch
              ? 'rotate(1deg)'
              : 'none',
            boxShadow: is3DProductPopout
              ? 'none'
              : is3D
              ? '0 25px 50px rgba(0,0,0,0.7), 0 0 25px rgba(59,130,246,0.4)'
              : isBrutalist
              ? '4px 4px 0px #000000'
              : isPixel
              ? '4px 4px 0px #000000, -2px -2px 0px #06B6D4 inset'
              : isNeon
              ? '0 0 20px rgba(6,182,212,0.6)'
              : isGlass
              ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
              : 'none',
            borderRadius: is3DProductPopout
              ? '0px'
              : isBrutalist ? '4px' : isPixel ? '0px' : isEditorial ? '2px' : isSketch ? '12px' : isGlass ? '20px' : '16px',
            border: is3DProductPopout
              ? 'none'
              : isBrutalist
              ? '3px solid #000000'
              : isPixel
              ? '4px solid #38BDF8'
              : isNeon
              ? '2px solid #06B6D4'
              : isSketch
              ? '2px dashed #334155'
              : isEditorial
              ? '1px solid #E2E8F0'
              : isGlass || is3D
              ? '1px solid rgba(255, 255, 255, 0.3)'
              : 'none',
          }}
        >
          <div
            className="w-full h-full relative transition-all duration-300 ease-out"
            style={{
              backgroundImage: `url(${campaign.assets.productImageUrl})`,
              backgroundPosition: `${crop.x * 100}% ${crop.y * 100}%`,
              backgroundSize: `${(1 / crop.width) * 100}% ${(1 / crop.height) * 100}%`,
              backgroundRepeat: 'no-repeat',
              filter: getImageFilter(),
              clipPath: (() => {
                const shapeCut = campaign.assets.productShapeCut || 'none';
                switch (shapeCut) {
                  case 'circle': return 'ellipse(48% 48% at 50% 50%)';
                  case 'arch': return 'polygon(0% 20%, 50% 0%, 100% 20%, 100% 100%, 0% 100%)';
                  case 'diamond': return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
                  case 'hexagon': return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
                  case 'badge': return 'polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)';
                  case 'card': return 'inset(4px round 24px)';
                  default: return 'none';
                }
              })(),
            }}
          >
            {/* 360° Interactive Product Showcase Badge Overlay */}
            {isMotionAnimated && motionMode === 'slow_360' && (
              <div className="absolute bottom-2 left-2 z-30 pointer-events-none bg-black/85 text-[#FFB000] border-2 border-black px-2 py-0.5 rounded-full text-[9px] font-mono font-black shadow-[2px_2px_0px_#000000] flex items-center gap-1 uppercase tracking-wider">
                <span>360° Slow Orbit</span>
              </div>
            )}
            {/* Shimmer Light Glare Motion Overlay */}
            {isMotionAnimated && (motionMode === 'shimmer' || motionMode === 'kinetic_3d') && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-poster-shimmer" />
              </div>
            )}
            {isDragModeEnabled && (
              <>
                <div className="absolute top-1 left-1 bg-[#FFB000] border border-black p-1 rounded shadow-sm text-black z-30 pointer-events-none">
                  <Move className="w-3 h-3" />
                </div>
                {/* Bottom Right Resize Handle */}
                <div
                  onMouseDown={(e) => handleResizeMouseDown(e, 'product')}
                  className="absolute bottom-1 right-1 w-5 h-5 bg-[#4ADE80] border border-black rounded flex items-center justify-center cursor-nwse-resize z-40 shadow-sm"
                  title="Drag to resize product image"
                >
                  <Scaling className="w-3 h-3 text-black stroke-[3]" />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Brand Logo Element */}
      {logoEl && logoEl.visible && (
        <div
          onMouseDown={(e) => handleMouseDown(e, 'logo')}
          className={`absolute flex items-center transition-all duration-200 ${
            isDragModeEnabled ? 'cursor-grab active:cursor-grabbing hover:outline-2 hover:outline-dashed hover:outline-black' : 'cursor-pointer'
          } ${selectedElement === 'logo' ? 'ring-3 ring-[#FFB000]' : ''}`}
          style={{
            left: `${logoEl.box.x * scaleFactor}px`,
            top: `${logoEl.box.y * scaleFactor}px`,
            width: `${(campaign.assets.logoWidth || logoEl.box.width) * scaleFactor}px`,
            height: `${((campaign.assets.logoWidth || logoEl.box.width) / (campaign.assets.logoAspect || 2.5)) * scaleFactor}px`,
            zIndex: logoEl.zIndex + (is3DProductPopout ? 50 : is3D ? 3 : 0),
          }}
        >
          <img
            src={campaign.assets.logoUrl}
            alt="Logo"
            className={`max-w-full max-h-full object-contain filter ${
              isPixel
                ? 'border-2 border-[#38BDF8] bg-black p-1 shadow-[2px_2px_0px_#000]'
                : isNeon
                ? 'border-2 border-[#06B6D4] bg-slate-900 p-1 shadow-[0_0_10px_#06B6D4]'
                : isSketch
                ? 'border-2 border-dashed border-black bg-amber-50 p-1'
                : isGlass
                ? 'border border-white/40 bg-white/20 backdrop-blur-md p-1 rounded-lg'
                : 'border-2 border-black bg-white p-1 rounded-sm shadow-[2px_2px_0px_#000]'
            }`}
          />
          {isDragModeEnabled && (
            <>
              <div className="absolute -top-2 -right-2 bg-[#FFB000] border border-black p-0.5 rounded shadow-sm text-black pointer-events-none">
                <Move className="w-3 h-3" />
              </div>
              <div
                onMouseDown={(e) => handleResizeMouseDown(e, 'logo')}
                className="absolute -bottom-2 -right-2 w-5 h-5 bg-[#4ADE80] border border-black rounded flex items-center justify-center cursor-nwse-resize z-40 shadow-sm"
                title="Drag to resize logo"
              >
                <Scaling className="w-3 h-3 text-black stroke-[3]" />
              </div>
            </>
          )}
        </div>
      )}

      {/* Headline Element */}
      {headlineEl && headlineEl.visible && (
        <div
          onMouseDown={(e) => handleMouseDown(e, 'headline')}
          className={`absolute flex items-center transition-all duration-200 font-extrabold uppercase tracking-normal leading-tight antialiased ${
            isDragModeEnabled ? 'cursor-grab active:cursor-grabbing hover:outline-2 hover:outline-dashed hover:outline-black' : 'cursor-pointer'
          } ${selectedElement === 'headline' ? 'ring-3 ring-[#FFB000]' : ''}`}
          style={{
            left: `${headlineEl.box.x * scaleFactor}px`,
            top: `${headlineEl.box.y * scaleFactor}px`,
            width: `${headlineEl.box.width * scaleFactor}px`,
            minHeight: `${Math.max(headlineEl.box.height, (campaign.assets.headlineFontSize || 24) * 1.3) * scaleFactor}px`,
            fontSize: `${(campaign.assets.headlineFontSize || headlineEl.fontSize || 24) * scaleFactor}px`,
            fontFamily: campaign.assets.headlineFontFamily || getHeadingFont(),
            color: campaign.assets.headlineColor || (isPixel
              ? '#38BDF8'
              : isNeon
              ? '#06B6D4'
              : isSketch
              ? '#0F172A'
              : isEditorial
              ? '#F8FAFC'
              : is3D || isGlass
              ? '#FFFFFF'
              : '#000000'),
            textShadow: isNeon
              ? '0 0 10px #06B6D4, 0 0 20px #06B6D4'
              : is3D || is3DProductPopout
              ? '0 4px 12px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)'
              : 'none',
            letterSpacing: isEditorial ? '0.04em' : 'normal',
            lineHeight: 1.2,
            fontStyle: isEditorial ? 'italic' : 'normal',
            transform: isSketch ? 'rotate(-0.8deg)' : 'none',
            zIndex: headlineEl.zIndex + (is3DProductPopout ? 50 : is3D ? 4 : 0),
          }}
        >
          <span>{headlineEl.textCopy || campaign.assets.headline}</span>
          {isDragModeEnabled && (
            <>
              <div className="absolute -top-2 -right-2 bg-[#FFB000] border border-black p-0.5 rounded shadow-sm text-black pointer-events-none">
                <Move className="w-3 h-3" />
              </div>
              <div
                onMouseDown={(e) => handleResizeMouseDown(e, 'headline')}
                className="absolute -bottom-2 -right-2 w-5 h-5 bg-[#4ADE80] border border-black rounded flex items-center justify-center cursor-nwse-resize z-40 shadow-sm"
                title="Drag to resize headline"
              >
                <Scaling className="w-3 h-3 text-black stroke-[3]" />
              </div>
            </>
          )}
        </div>
      )}

      {/* Description Element */}
      {descEl && descEl.visible && (
        <div
          onMouseDown={(e) => handleMouseDown(e, 'description')}
          className={`absolute flex items-center transition-all duration-200 font-medium leading-tight ${
            isDragModeEnabled ? 'cursor-grab active:cursor-grabbing hover:outline-2 hover:outline-dashed hover:outline-black' : 'cursor-pointer'
          } ${selectedElement === 'description' ? 'ring-3 ring-[#FFB000]' : ''}`}
          style={{
            left: `${descEl.box.x * scaleFactor}px`,
            top: `${descEl.box.y * scaleFactor}px`,
            width: `${descEl.box.width * scaleFactor}px`,
            minHeight: `${Math.max(descEl.box.height, (campaign.assets.descriptionFontSize || 14) * 1.3) * scaleFactor}px`,
            fontSize: `${(campaign.assets.descriptionFontSize || descEl.fontSize || 14) * scaleFactor}px`,
            fontFamily: campaign.assets.descriptionFontFamily || getBodyFont(),
            color: campaign.assets.descriptionColor || (isPixel
              ? '#CBD5E1'
              : isNeon
              ? '#E2E8F0'
              : isSketch
              ? '#334155'
              : isEditorial
              ? '#94A3B8'
              : is3D || isGlass
              ? '#E2E8F0'
              : '#1E293B'),
            textShadow: is3DProductPopout ? '0 2px 8px rgba(0,0,0,0.8)' : 'none',
            zIndex: descEl.zIndex + (is3DProductPopout ? 50 : is3D ? 3 : 0),
          }}
        >
          <span>{descEl.textCopy || campaign.assets.description}</span>
          {isDragModeEnabled && (
            <>
              <div className="absolute -top-2 -right-2 bg-[#FFB000] border border-black p-0.5 rounded shadow-sm text-black pointer-events-none">
                <Move className="w-3 h-3" />
              </div>
              <div
                onMouseDown={(e) => handleResizeMouseDown(e, 'description')}
                className="absolute -bottom-2 -right-2 w-5 h-5 bg-[#4ADE80] border border-black rounded flex items-center justify-center cursor-nwse-resize z-40 shadow-sm"
                title="Drag to resize description"
              >
                <Scaling className="w-3 h-3 text-black stroke-[3]" />
              </div>
            </>
          )}
        </div>
      )}

      {/* Call To Action (CTA) Button Element */}
      {ctaEl && ctaEl.visible && (
        <div
          onMouseDown={(e) => handleMouseDown(e, 'cta')}
          className={`absolute flex items-center justify-between transition-all duration-200 font-extrabold uppercase px-4 ${
            isDragModeEnabled ? 'cursor-grab active:cursor-grabbing hover:outline-2 hover:outline-dashed hover:outline-black ring-2 ring-emerald-500' : 'cursor-pointer transform hover:scale-105'
          } ${selectedElement === 'cta' ? 'ring-3 ring-[#FFB000]' : ''}`}
          style={{
            left: `${ctaEl.box.x * scaleFactor}px`,
            top: `${ctaEl.box.y * scaleFactor}px`,
            width: `${ctaEl.box.width * scaleFactor}px`,
            height: `${ctaEl.box.height * scaleFactor}px`,
            fontFamily: campaign.assets.ctaFontFamily || getHeadingFont(),
            fontSize: `${(campaign.assets.ctaFontSize || ctaEl.fontSize || 15) * scaleFactor}px`,
            zIndex: ctaEl.zIndex + (is3DProductPopout ? 50 : is3D ? 5 : 0),

            ...getCtaButtonStyles(),
            boxShadow: isPixel
              ? '4px 4px 0px #000000'
              : isNeon
              ? '0 0 20px #06B6D4, 0 0 40px rgba(6,182,212,0.4)'
              : isSketch
              ? '3px 3px 0px #000000'
              : is3D
              ? '0 12px 30px rgba(59,130,246,0.6)'
              : isGlass
              ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
              : '4px 4px 0px #000000',
            textShadow: isNeon ? '0 0 8px #FFFFFF' : 'none',
            letterSpacing: isEditorial ? '0.12em' : isPixel ? '-0.04em' : 'normal',
            transform: isSketch ? 'rotate(-1.5deg)' : is3D ? 'translateZ(25px)' : 'none',
            backdropFilter: isGlass ? 'blur(12px)' : 'none',
          }}
        >
          <span>{ctaEl.textCopy || campaign.assets.ctaText}</span>
          <span
            className={`ml-2 w-5 h-5 flex items-center justify-center font-extrabold text-xs inline-block transition-transform ${
              isPixel || isSketch || isEditorial || isBrutalist
                ? 'bg-black text-white rounded'
                : 'bg-white/20 text-white rounded-full'
            } ${isMotionAnimated ? 'animate-arrow-shift' : ''}`}
          >
            ➔
          </span>
          {isDragModeEnabled && (
            <>
              <div className="absolute -top-2 -right-2 bg-[#4ADE80] border border-black p-0.5 rounded shadow-sm text-black pointer-events-none">
                <Move className="w-3 h-3" />
              </div>
              <div
                onMouseDown={(e) => handleResizeMouseDown(e, 'cta')}
                className="absolute -bottom-2 -right-2 w-5 h-5 bg-[#4ADE80] border border-black rounded flex items-center justify-center cursor-nwse-resize z-40 shadow-sm"
                title="Drag to resize CTA button"
              >
                <Scaling className="w-3 h-3 text-black stroke-[3]" />
              </div>
            </>
          )}
        </div>
      )}

      {/* Legal Text Disclaimer */}
      {legalEl && legalEl.visible && (
        <div
          className="absolute flex items-center justify-center text-center opacity-70"
          style={{
            left: `${legalEl.box.x * scaleFactor}px`,
            top: `${legalEl.box.y * scaleFactor}px`,
            width: `${legalEl.box.width * scaleFactor}px`,
            height: `${legalEl.box.height * scaleFactor}px`,
            fontSize: `${(campaign.assets.legalFontSize || legalEl.fontSize || 9) * scaleFactor}px`,
            fontFamily: campaign.assets.legalFontFamily || getBodyFont(),
            color: campaign.assets.legalColor || getContainerTextColor(),
            zIndex: legalEl.zIndex,
          }}
        >
          {legalEl.textCopy || campaign.assets.legalText}
        </div>
      )}

      {/* Render Custom Added Movable Text Boxes */}
      {campaign.assets.customElements?.map((elem) => (
        <div
          key={elem.id}
          onMouseDown={(e) => handleCustomElemMouseDown(e, elem.id)}
          className="absolute z-40 cursor-grab active:cursor-grabbing border-2 border-black bg-[#FFB000] px-2.5 py-1 rounded-xl shadow-[3px_3px_0px_#000000] flex items-center gap-1.5 select-none hover:scale-[1.03] transition-transform"
          style={{
            left: `${elem.x * scaleFactor}px`,
            top: `${elem.y * scaleFactor}px`,
            fontSize: elem.fontSize ? `${elem.fontSize * scaleFactor}px` : '15px',
            color: elem.color || '#000000',
            fontFamily: elem.fontFamily || 'sans-serif',
          }}
          title="Click and drag to move text box"
        >
          <Move className="w-3.5 h-3.5 text-black stroke-[3] shrink-0 pointer-events-none" />
          <span className="font-extrabold uppercase tracking-wide leading-none">{elem.content}</span>
        </div>
      ))}

      {/* Safe Zone Border Overlays */}
      {showOverlays && (
        <div
          className="absolute border border-dashed border-red-500/40 pointer-events-none z-50 flex items-start justify-end p-1"
          style={{
            left: `${safeLeftPx * scaleFactor}px`,
            top: `${safeTopPx * scaleFactor}px`,
            right: `${safeRightPx * scaleFactor}px`,
            bottom: `${safeBottomPx * scaleFactor}px`,
          }}
        >
          <span className="text-[8px] font-mono px-1 py-0.2 rounded border bg-slate-950/90 text-red-300 border-red-500/30">
            SAFE ZONE
          </span>
        </div>
      )}
    </div>
  );
};
