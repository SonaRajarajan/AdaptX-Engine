import React, { useState } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { SURFACE_PRESETS } from '../../models/surface';
import { AdaptiveAdRenderer } from '../canvas/AdaptiveAdRenderer';
import { FullscreenAdModal } from '../canvas/FullscreenAdModal';
import { VIBE_STYLES } from '../../utils/vibeStyles';
import { Monitor, Smartphone, Tv, Eye, Share2, Car, Watch, Building2, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Move, Maximize2 } from 'lucide-react';

export const Step2SurfaceSelection: React.FC = () => {
  const { campaign, activeSurface, selectedCandidate, auditReport, setActiveSurface, setCustomSurfaceDimensions, nextStep, prevStep, websiteVibe } = useAdaptXStore();
  const [customW, setCustomW] = useState(1378);
  const [customH, setCustomH] = useState(431);
  const [isDragMode, setIsDragMode] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const vibe = VIBE_STYLES[websiteVibe] || VIBE_STYLES.organic_pastel;
  const isClean = false;

  const handleCustomApply = () => {
    setCustomSurfaceDimensions(customW, customH);
  };

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
              Step 2 of 5
            </span>
            <div className="flex items-center gap-1.5">
              <Monitor className={`w-4 h-4 ${isClean ? 'text-purple-600 stroke-[2.5]' : 'text-black stroke-[3]'}`} />
              <h2 className={`text-xs sm:text-sm uppercase tracking-tight ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                Select Display Surface & Spatial Constraints
              </h2>
            </div>
          </div>

          <div className={isClean ? 'bg-purple-100 text-purple-900 border border-purple-200 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs' : 'bg-[#FFC72C] border-2 border-black px-3 py-1 rounded-xl text-xs font-mono font-black text-black flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_#000000]'}>
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Active Surface: <strong className="uppercase">{activeSurface.name}</strong></span>
          </div>
        </div>

        {/* 2-Column Split View: Options Left (2 Boxes per row), Prominent Large Live Preview Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Surface Selection & Custom Dimensions Controls (2 Boxes in a row) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Surface Cards Grid (2 Boxes in a row) */}
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(SURFACE_PRESETS).map(([key, preset]) => {
                const isSelected = activeSurface.id === preset.id;
                return (
                  <div
                    key={key}
                    onClick={() => setActiveSurface(preset)}
                    className={`p-4 rounded-3xl cursor-pointer transition-all flex flex-col justify-between space-y-2.5 ${
                      isClean
                        ? isSelected
                          ? 'bg-purple-50/90 border-2 border-purple-600 text-purple-950 shadow-md ring-2 ring-purple-500/20 scale-[1.02]'
                          : 'bg-white border border-slate-200/90 text-slate-800 hover:border-purple-300 hover:bg-purple-50/30 shadow-2xs'
                        : isSelected
                        ? 'bg-[#48BB78] border-3 border-black text-black ring-2 ring-black shadow-[4px_4px_0px_#000000]'
                        : 'bg-[#FFFDF5] border-3 border-black text-black hover:bg-[#F5EFFE] shadow-[4px_4px_0px_#000000]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={isClean ? 'p-2 rounded-2xl bg-purple-100/80 border border-purple-200 text-purple-700 shadow-2xs' : 'p-2 rounded-2xl bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000000]'}>
                          {preset.id === 'vertical_skyscraper' ? (
                            <Building2 className="w-4 h-4 stroke-[2.5]" />
                          ) : preset.id === 'social_square' || preset.category === 'social' ? (
                            <Share2 className="w-4 h-4 stroke-[2.5]" />
                          ) : preset.id === 'in_car_display' || preset.category === 'in_car' ? (
                            <Car className="w-4 h-4 stroke-[2.5]" />
                          ) : preset.id === 'wearable_smartwatch' || preset.category === 'wearable' ? (
                            <Watch className="w-4 h-4 stroke-[2.5]" />
                          ) : preset.category === 'mobile' ? (
                            <Smartphone className="w-4 h-4 stroke-[2.5]" />
                          ) : preset.category === 'tv' ? (
                            <Tv className="w-4 h-4 stroke-[2.5]" />
                          ) : preset.category === 'billboard' ? (
                            <Eye className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <Monitor className="w-4 h-4 stroke-[2.5]" />
                          )}
                        </div>
                        <div>
                          <h3 className={`text-xs uppercase ${isClean ? 'font-bold text-slate-900' : 'font-black'}`}>{preset.name}</h3>
                          <div className={`text-[11px] font-mono font-bold mt-0.5 ${isClean ? 'text-slate-600' : ''}`}>
                            {preset.width} × {preset.height} px
                          </div>
                        </div>
                      </div>

                      {isSelected && <CheckCircle2 className={`w-5 h-5 shrink-0 stroke-[2.5] ${isClean ? 'text-purple-600' : 'text-black'}`} />}
                    </div>

                    <div className={`grid grid-cols-2 gap-2 text-[10px] p-2 rounded-2xl ${isClean ? 'bg-slate-50 border border-slate-200 text-slate-700 font-sans' : 'bg-[#FAF7F2] border-2 border-black text-black font-mono font-bold'}`}>
                      <div>
                        <span className={`block text-[9px] uppercase ${isClean ? 'text-slate-500' : 'text-slate-700'}`}>Viewing Distance</span>
                        <span className={`font-bold ${isClean ? 'text-slate-900' : 'font-black'}`}>{preset.viewingDistance} meters</span>
                      </div>
                      <div>
                        <span className={`block text-[9px] uppercase ${isClean ? 'text-slate-500' : 'text-slate-700'}`}>Interaction</span>
                        <span className={`font-bold capitalize ${isClean ? 'text-slate-900' : 'font-black'}`}>{preset.interactionType}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Surface Dimension Builder (2 Boxes in a row) */}
            <div className={`${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-3xl p-4 space-y-3`}>
              <h3 className={`text-xs flex items-center gap-2 uppercase tracking-wide ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                <span>Custom Dimensions Constraints</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className={isClean ? 'bg-slate-50 p-2.5 rounded-2xl border border-slate-200 space-y-1 shadow-2xs' : 'bg-[#FAF7F2] p-2.5 rounded-2xl border-2 border-black space-y-1 shadow-[2px_2px_0px_#000000]'}>
                  <label className={`text-[10px] block font-sans uppercase ${isClean ? 'font-semibold text-slate-600' : 'font-bold text-black'}`}>Width (px):</label>
                  <input
                    type="number"
                    value={customW}
                    onChange={(e) => setCustomW(Number(e.target.value))}
                    className={isClean ? 'w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 font-bold focus:border-purple-500 focus:outline-none' : 'w-full bg-white border-2 border-black rounded-xl px-2.5 py-1.5 text-black font-black focus:bg-yellow-50 focus:outline-none shadow-[1px_1px_0px_#000000]'}
                  />
                </div>
                <div className={isClean ? 'bg-slate-50 p-2.5 rounded-2xl border border-slate-200 space-y-1 shadow-2xs' : 'bg-[#FAF7F2] p-2.5 rounded-2xl border-2 border-black space-y-1 shadow-[2px_2px_0px_#000000]'}>
                  <label className={`text-[10px] block font-sans uppercase ${isClean ? 'font-semibold text-slate-600' : 'font-bold text-black'}`}>Height (px):</label>
                  <input
                    type="number"
                    value={customH}
                    onChange={(e) => setCustomH(Number(e.target.value))}
                    className={isClean ? 'w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 font-bold focus:border-purple-500 focus:outline-none' : 'w-full bg-white border-2 border-black rounded-xl px-2.5 py-1.5 text-black font-black focus:bg-yellow-50 focus:outline-none shadow-[1px_1px_0px_#000000]'}
                  />
                </div>
              </div>

              <button
                onClick={handleCustomApply}
                className={`w-full py-2.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer ${vibe.buttonPrimary}`}
              >
                Apply Custom Dimensions
              </button>
            </div>
          </div>

          {/* Right Column: Prominent Large Live Surface Transformation Canvas */}
          <div className={`lg:col-span-7 h-[680px] ${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden`}>
            {/* Background Grid Accent */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#000000 1.5px, transparent 1.5px)`,
                backgroundSize: '18px 18px',
              }}
            />

            {/* Top Bar with Cursor Drag & Fullscreen Buttons */}
            <div className={`flex items-center justify-between pb-3 z-10 flex-wrap gap-2 ${isClean ? 'border-b border-slate-200' : 'border-b-2 border-black'}`}>
              <div className="flex items-center gap-2">
                <div className={isClean ? 'p-1.5 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 shadow-2xs' : 'p-1.5 rounded-lg bg-[#48BB78] border-2 border-black text-black shadow-[2px_2px_0px_#000000]'}>
                  <Monitor className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className={`text-xs uppercase flex items-center gap-1.5 ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                    Surface Spatial Transform Preview
                  </h3>
                  <p className={`text-[10px] font-mono font-bold ${isClean ? 'text-slate-500' : 'text-slate-700'}`}>
                    Active Target: {activeSurface.name} ({activeSurface.width}×{activeSurface.height}px)
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

            {/* Center Canvas */}
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
                  Adapting layout to surface constraints...
                </div>
              )}
            </div>

            {/* Bottom Audit */}
            <div className={`pt-3 z-10 flex items-center justify-between text-xs font-mono font-bold ${isClean ? 'border-t border-slate-200 text-slate-700' : 'border-t-2 border-black text-black'}`}>
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                Safe Zone Compliance: 100%
              </span>
              <span className={isClean ? 'font-bold flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-lg text-[10px] shadow-2xs' : 'font-black flex items-center gap-1 bg-[#48BB78] border-2 border-black px-2 py-0.5 rounded-lg shadow-[1.5px_1.5px_0px_#000000] text-[10px] text-black'}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Real-time Surface Sync
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
      <div className={`max-w-7xl mx-auto w-full pt-4 flex items-center justify-between mt-4 ${isClean ? 'border-t border-purple-200/80' : 'border-t-3 border-black'}`}>
        <button
          onClick={prevStep}
          className={`flex items-center gap-2 cursor-pointer ${vibe.buttonSecondary} ${isClean ? 'px-5 py-2.5 font-bold text-xs uppercase tracking-wider' : 'px-5 py-2.5 border-3 border-black shadow-[3px_3px_0px_#000000] transition-all transform hover:-translate-y-0.5 text-xs font-black'}`}
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to Campaign Setup</span>
        </button>

        <button
          onClick={nextStep}
          className={`flex items-center gap-2 cursor-pointer ${vibe.buttonPrimary} ${isClean ? 'px-6 py-3 font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all' : 'px-5 py-2.5 border-3 border-black shadow-[3px_3px_0px_#000000] transition-all transform hover:-translate-y-0.5 text-xs font-black'}`}
        >
          <span>Continue to Visual Themes</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
