import React, { useState } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { AdaptiveAdRenderer } from '../canvas/AdaptiveAdRenderer';
import { CandidateScoreInspector } from '../Inspector/CandidateScoreInspector';
import { FullscreenAdModal } from '../canvas/FullscreenAdModal';
import { VIBE_STYLES } from '../../utils/vibeStyles';
import { Layers, ArrowLeft, ArrowRight, Move, Maximize2 } from 'lucide-react';

export const Step4LayoutInspector: React.FC = () => {
  const { activeSurface, selectedCandidate, campaign, nextStep, prevStep, websiteVibe } = useAdaptXStore();
  const [isDragMode, setIsDragMode] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const vibe = VIBE_STYLES[websiteVibe] || VIBE_STYLES.organic_pastel;
  const isClean = false;

  const maxCanvasW = 820;
  const maxCanvasH = 640;
  const scaleFactor = Math.min(
    1.0,
    Math.min(maxCanvasW / activeSurface.width, maxCanvasH / activeSurface.height)
  );

  return (
    <div className="flex-1 bg-transparent overflow-hidden flex flex-col justify-between select-none">
      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Center Main Viewport */}
        <div className="flex-1 bg-transparent flex flex-col items-center justify-center p-8 relative overflow-auto custom-scrollbar">
          {/* Background Grid Accent */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#000000 1.5px, transparent 1.5px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Compact Viewport Info Bar */}
          <div className={`mb-3 z-10 ${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} px-4 py-2 rounded-2xl flex items-center justify-between gap-4 w-full max-w-4xl flex-wrap`}>
            <div className="flex items-center gap-2.5">
              <h2 className={`text-xs sm:text-sm uppercase tracking-tight flex items-center gap-2 ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                Layout Inspection & Priorities Audit
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className={isClean ? 'text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-xl shadow-2xs hidden md:flex items-center gap-1.5' : 'text-xs font-mono text-black font-black bg-[#FFC72C] border-2 border-black px-3 py-1 rounded-xl shadow-[1.5px_1.5px_0px_#000000] hidden md:flex items-center gap-1.5'}>
                <span>{activeSurface.name}</span>
                <span className={`text-[10px] ${isClean ? 'text-purple-600' : 'text-slate-700'}`}>({activeSurface.width}×{activeSurface.height}px)</span>
              </div>

              {/* Action Buttons: Edit Using Cursor & Fullscreen Modal Trigger */}
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

          {/* Active Ad Canvas Container */}
          {selectedCandidate ? (
            <div className="z-10 relative transition-all duration-300">
              <AdaptiveAdRenderer
                candidate={selectedCandidate}
                surface={activeSurface}
                campaign={campaign}
                showOverlays={true}
                scaleFactor={scaleFactor}
                interactive={true}
              />
            </div>
          ) : (
            <div className={isClean ? 'text-slate-600 text-xs font-medium bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs' : 'text-black text-xs font-mono font-bold bg-white border-2 border-black px-4 py-2 rounded-xl shadow-[3px_3px_0px_#000000]'}>
              Evaluating layout composition...
            </div>
          )}
        </div>

        {/* Right Score Inspector Sidebar */}
        <CandidateScoreInspector />
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
      <div className={`px-6 py-1.5 flex items-center justify-between z-30 shrink-0 ${isClean ? 'bg-white/90 backdrop-blur-md border-t border-purple-200/80 shadow-xs' : 'bg-white border-t-2 border-black'}`}>
        <button
          onClick={prevStep}
          className={`flex items-center gap-2 cursor-pointer ${vibe.buttonSecondary} ${isClean ? 'px-4 py-1.5 font-bold text-xs uppercase tracking-wider' : 'px-3.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-all transform hover:-translate-y-0.5 text-xs font-black'}`}
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Back to Visual Themes</span>
        </button>

        <button
          onClick={nextStep}
          className={`flex items-center gap-2 cursor-pointer ${vibe.buttonPrimary} ${isClean ? 'px-4 py-1.5 font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all' : 'px-3.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-all transform hover:-translate-y-0.5 text-xs font-black'}`}
        >
          <span>Continue to Live Wall</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
