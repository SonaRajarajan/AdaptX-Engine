import React, { useState } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { THEME_PRESETS, ThemeId } from '../../models/theme';
import { AdaptiveAdRenderer } from '../canvas/AdaptiveAdRenderer';
import { FullscreenAdModal } from '../canvas/FullscreenAdModal';
import { VIBE_STYLES } from '../../utils/vibeStyles';
import { Sparkles, Lock, Unlock, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Palette, Move, Maximize2 } from 'lucide-react';

export const Step3ThemeSelection: React.FC = () => {
  const {
    campaign,
    activeThemeId,
    setActiveThemeId,
    morphTargetThemeId,
    setMorphTargetThemeId,
    morphRatio,
    setMorphRatio,
    brandLockEnabled,
    setBrandLockEnabled,
    activeSurface,
    selectedCandidate,
    nextStep,
    prevStep,
    updateAsset,
    websiteVibe,
  } = useAdaptXStore();

  const [isDragMode, setIsDragMode] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const vibe = VIBE_STYLES[websiteVibe] || VIBE_STYLES.organic_pastel;
  const isClean = false;

  const maxCanvasW = 680;
  const maxCanvasH = 580;
  const scaleFactor = Math.min(
    1.0,
    Math.min(maxCanvasW / activeSurface.width, maxCanvasH / activeSurface.height)
  );

  return (
    <div className="flex-1 bg-transparent p-6 md:p-8 overflow-y-auto custom-scrollbar select-none flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Compact Top Header Banner */}
        <div className={`${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3`}>
          <div className="flex items-center gap-2.5">
            <span className={isClean ? 'text-[10px] font-bold text-purple-900 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-lg uppercase shadow-2xs' : 'text-[10px] font-mono font-black text-black bg-[#B5A8F7] border-2 border-black px-2 py-0.5 rounded-lg shadow-[1.5px_1.5px_0px_#000000] uppercase'}>
              Step 3 of 5
            </span>
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-4 h-4 ${isClean ? 'text-purple-600 stroke-[2.5]' : 'text-black stroke-[3]'}`} />
              <h2 className={`text-xs sm:text-sm uppercase tracking-tight ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                Select Visual Design System & Brand Rules
              </h2>
            </div>
          </div>

          <button
            onClick={() => setBrandLockEnabled(!brandLockEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs uppercase cursor-pointer transition-all ${
              isClean
                ? brandLockEnabled
                  ? 'bg-purple-100 text-purple-900 border border-purple-300 font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 font-semibold'
                : brandLockEnabled
                ? 'bg-[#FFC72C] text-black border-2 border-black font-black shadow-[1.5px_1.5px_0px_#000000]'
                : 'bg-[#FFFDF5] text-black border-2 border-black font-black hover:bg-[#F5EFFE] shadow-[1.5px_1.5px_0px_#000000]'
            }`}
          >
            {brandLockEnabled ? <Lock className="w-3.5 h-3.5 stroke-[2.5]" /> : <Unlock className="w-3.5 h-3.5 stroke-[2.5]" />}
            {brandLockEnabled ? 'Brand Lock ON' : 'Brand Lock OFF'}
          </button>
        </div>

        {/* 2-Column Split View: Options Left (2 Boxes per row), Expanded Live Preview Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Theme Morphing & Brand Rules (2 Boxes per row) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Real-Time Theme Morphing Slider Controls */}
            <div className={`${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-3xl p-5 space-y-4`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs flex items-center gap-1.5 uppercase tracking-wide ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                  <Sparkles className={`w-4 h-4 ${isClean ? 'text-purple-600' : 'text-black'}`} />
                  Theme Morphing Mixer
                </span>
                <span className={isClean ? 'text-[10px] font-bold text-purple-900 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-lg shadow-2xs' : 'text-[10px] font-mono font-black text-black bg-[#FFB000] border-2 border-black px-2 py-0.5 rounded-lg shadow-[2px_2px_0px_#000000]'}>
                  {Math.round((1 - morphRatio) * 100)}% Base / {Math.round(morphRatio * 100)}% Target
                </span>
              </div>

              <div className={`flex flex-col gap-2.5 p-3 rounded-2xl ${isClean ? 'bg-slate-50 border border-slate-200 shadow-2xs' : 'bg-[#FAF7F2] border-2 border-black shadow-[3px_3px_0px_#000000]'}`}>
                <div className={`text-[11px] uppercase truncate ${isClean ? 'font-bold text-slate-800' : 'font-mono font-black text-black'}`}>
                  Base: {THEME_PRESETS[activeThemeId]?.name}
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={morphRatio}
                  onChange={(e) => setMorphRatio(parseFloat(e.target.value))}
                  className={`w-full cursor-pointer h-3 rounded-lg ${isClean ? 'accent-purple-600 bg-slate-200' : 'accent-black bg-white border-2 border-black'}`}
                />

                <select
                  value={morphTargetThemeId}
                  onChange={(e) => setMorphTargetThemeId(e.target.value as ThemeId)}
                  className={`text-xs rounded-xl px-2.5 py-1.5 focus:outline-none uppercase w-full cursor-pointer ${
                    isClean
                      ? 'bg-white border border-slate-300 font-bold text-slate-900 focus:border-purple-500 shadow-2xs'
                      : 'bg-white text-black font-black border-2 border-black shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  {Object.entries(THEME_PRESETS).map(([k, t]) => (
                    <option key={k} value={k}>
                      Morph To: {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Theme Presets Grid (2 Boxes in a row) */}
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(THEME_PRESETS).map(([key, theme]) => {
                if (key === 'custom') return null;
                const isSelected = activeThemeId === key;

                return (
                  <div
                    key={key}
                    onClick={() => setActiveThemeId(key as ThemeId)}
                    className={`p-3.5 rounded-3xl cursor-pointer transition-all flex flex-col justify-between space-y-2.5 ${
                      isClean
                        ? isSelected
                          ? 'bg-purple-50/90 border-2 border-purple-600 text-purple-950 shadow-md ring-2 ring-purple-500/20 scale-[1.02]'
                          : 'bg-white border border-slate-200/90 text-slate-800 hover:border-purple-300 hover:bg-purple-50/30 shadow-2xs'
                        : isSelected
                        ? 'bg-[#FFB000] border-3 border-black text-black ring-2 ring-black shadow-[4px_4px_0px_#000000]'
                        : 'bg-white border-3 border-black text-black hover:bg-amber-100 shadow-[4px_4px_0px_#000000]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{theme.icon}</span>
                        <div>
                          <h3 className={`text-xs uppercase ${isClean ? 'font-bold text-slate-900' : 'font-black'}`}>{theme.name}</h3>
                          <div className={`text-[10px] font-mono capitalize ${isClean ? 'text-slate-500 font-semibold' : 'font-bold'}`}>
                            Style: {theme.typography.style}
                          </div>
                        </div>
                      </div>

                      {isSelected && <CheckCircle2 className={`w-5 h-5 shrink-0 stroke-[2.5] ${isClean ? 'text-purple-600' : 'text-black'}`} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Brand Colors & Constraints Box */}
            <div className={`${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-3xl p-4 space-y-3`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xs uppercase flex items-center gap-2 tracking-wider ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                  <Palette className={`w-4 h-4 ${isClean ? 'text-purple-600' : 'text-black stroke-[3]'}`} />
                  Brand Palette
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(campaign.assets.brandColors).map(([name, val]) => (
                  <div key={name} className={`flex items-center justify-between p-2 rounded-xl ${isClean ? 'bg-slate-50 border border-slate-200 shadow-2xs' : 'bg-[#FAF7F2] border-2 border-black shadow-[1px_1px_0px_#000000]'}`}>
                    <div className="truncate pr-1">
                      <div className={`text-[9px] capitalize truncate ${isClean ? 'text-slate-700 font-semibold' : 'text-slate-700 font-bold uppercase'}`}>{name}</div>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) =>
                          updateAsset('brandColors', {
                            ...campaign.assets.brandColors,
                            [name]: e.target.value,
                          })
                        }
                        className={`text-[9px] font-mono px-1 w-14 uppercase focus:outline-none rounded ${isClean ? 'bg-white border border-slate-300 text-slate-800 font-bold' : 'text-black font-black bg-white border border-black'}`}
                      />
                    </div>
                    <input
                      type="color"
                      value={val.startsWith('#') && (val.length === 4 || val.length === 7) ? val : '#000000'}
                      onChange={(e) =>
                        updateAsset('brandColors', {
                          ...campaign.assets.brandColors,
                          [name]: e.target.value,
                        })
                      }
                      className={`w-6 h-6 rounded cursor-pointer shrink-0 ${isClean ? 'border border-slate-300' : 'border-2 border-black'}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Large Live Theme Canvas */}
          <div className={`lg:col-span-7 h-[680px] ${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden`}>
            {/* Background Grid Accent */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#000000 1.5px, transparent 1.5px)`,
                backgroundSize: '18px 18px',
              }}
            />

            {/* Header / Info bar */}
            <div className={`flex items-center justify-between pb-3 z-10 flex-wrap gap-2 ${isClean ? 'border-b border-slate-200' : 'border-b-2 border-black'}`}>
              <div className="flex items-center gap-2">
                <div className={isClean ? 'p-1.5 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 shadow-2xs' : 'p-1.5 rounded-lg bg-[#FFB000] border-2 border-black text-black shadow-[2px_2px_0px_#000000]'}>
                  <Palette className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className={`text-xs uppercase flex items-center gap-1.5 ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                    Live Theme Preview
                    <span className="w-2 h-2 rounded-full bg-emerald-500 border border-black animate-ping" />
                  </h3>
                  <p className={`text-[10px] font-mono font-bold ${isClean ? 'text-slate-500' : 'text-slate-700'}`}>
                    Active Theme: {THEME_PRESETS[activeThemeId]?.name}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Edit Using Cursor & Fullscreen Modal Trigger */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsDragMode(true);
                    setIsFullscreenOpen(true);
                  }}
                  className={isClean ? 'px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 uppercase transition-all shadow-xs cursor-pointer' : 'px-2.5 py-1 rounded-xl text-xs font-mono font-black border-2 border-black bg-[#4ADE80] hover:bg-[#22C55E] text-black flex items-center gap-1.5 uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer'}
                  title="Open Fullscreen Canvas Editor with mouse cursor drag & resize mode active"
                >
                  <Move className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Edit using Cursor</span>
                </button>

                <button
                  onClick={() => setIsFullscreenOpen(true)}
                  className={isClean ? 'px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1 uppercase transition-all shadow-xs cursor-pointer' : 'px-2.5 py-1 rounded-xl text-xs font-mono font-black border-2 border-black bg-[#FFB000] hover:bg-[#FFC107] text-black flex items-center gap-1 uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer'}
                  title="Open live canvas preview in Fullscreen Modal"
                >
                  <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Fullscreen</span>
                </button>
              </div>
            </div>

            {/* Center Canvas Display Area */}
            <div
              onClick={() => !isDragMode && setIsFullscreenOpen(true)}
              className={`flex-1 flex items-center justify-center py-4 relative z-10 overflow-hidden cursor-pointer group ${
                isDragMode ? 'cursor-default' : 'hover:scale-[1.01] transition-transform'
              }`}
              title={isDragMode ? 'Drag elements with cursor' : 'Click preview canvas to view Fullscreen'}
            >
              {selectedCandidate ? (
                <div className="transition-all duration-300 relative">
                  <AdaptiveAdRenderer
                    candidate={selectedCandidate}
                    surface={activeSurface}
                    campaign={campaign}
                    showOverlays={true}
                    scaleFactor={scaleFactor}
                    interactive={true}
                    isDragModeEnabled={isDragMode}
                  />
                  {!isDragMode && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 pointer-events-none">
                      <span className={isClean ? 'bg-purple-900/90 text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase shadow-md flex items-center gap-1.5' : 'bg-black text-white px-3 py-1.5 rounded-xl font-mono text-xs font-black uppercase border-2 border-white shadow-lg flex items-center gap-1.5'}>
                        <Maximize2 className="w-3.5 h-3.5" /> Click for Fullscreen
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`text-xs font-mono flex items-center gap-2 font-bold ${isClean ? 'text-slate-600' : 'text-black'}`}>
                  <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
                  Applying visual design system tokens...
                </div>
              )}
            </div>

            {/* Bottom Real-Time Audit Badges */}
            <div className={`pt-3 z-10 flex items-center justify-between text-xs font-mono font-bold ${isClean ? 'border-t border-slate-200 text-slate-700' : 'border-t-2 border-black text-black'}`}>
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                Brand Color Enforcement: {brandLockEnabled ? 'Active' : 'Disabled'}
              </span>
              <span className={isClean ? 'font-bold flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-lg text-[10px] shadow-2xs' : 'font-black flex items-center gap-1 bg-[#FFB000] border-2 border-black px-2 py-0.5 rounded-lg shadow-[1.5px_1.5px_0px_#000000] text-[10px] text-black'}>
                Real-Time Theme Engine Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal View */}
      <FullscreenAdModal
        isOpen={isFullscreenOpen}
        onClose={() => {
          setIsFullscreenOpen(false);
          setIsDragMode(false);
        }}
        initialDragMode={isDragMode}
      />

      {/* Footer Navigation Bar */}
      <div className={`max-w-7xl mx-auto w-full pt-2 flex items-center justify-between mt-2 ${isClean ? 'border-t border-purple-200/80' : 'border-t-2 border-black'}`}>
        <button
          onClick={prevStep}
          className={`flex items-center gap-2 cursor-pointer ${vibe.buttonSecondary} ${isClean ? 'px-4 py-1.5 font-bold text-xs uppercase tracking-wider' : 'px-3.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-all transform hover:-translate-y-0.5 text-xs font-black'}`}
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Back to Geometry & Surfaces</span>
        </button>

        <button
          onClick={nextStep}
          className={`flex items-center gap-2 cursor-pointer ${vibe.buttonPrimary} ${isClean ? 'px-4 py-1.5 font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all' : 'px-3.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-all transform hover:-translate-y-0.5 text-xs font-black'}`}
        >
          <span>Continue to Layout Inspector</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
