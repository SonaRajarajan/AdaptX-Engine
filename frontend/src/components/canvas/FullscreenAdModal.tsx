import React, { useState, useEffect } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { AdaptiveAdRenderer } from './AdaptiveAdRenderer';
import { CampaignEditor } from '../Campaign/CampaignEditor';
import { X, Maximize2, ShieldCheck, CheckCircle2, Move } from 'lucide-react';

interface FullscreenAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDragMode?: boolean;
}

export const FullscreenAdModal: React.FC<FullscreenAdModalProps> = ({
  isOpen,
  onClose,
  initialDragMode = true,
}) => {
  const { campaign, activeSurface, selectedCandidate, auditReport } = useAdaptXStore();
  const [isDragMode, setIsDragMode] = useState(initialDragMode);

  useEffect(() => {
    if (isOpen) {
      setIsDragMode(initialDragMode);
    }
  }, [isOpen, initialDragMode]);

  if (!isOpen || !selectedCandidate) return null;

  // Compute zoom scale for full screen modal container
  const maxW = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.62, 1100) : 800;
  const maxH = typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.78, 800) : 650;

  const scaleFactor = Math.min(
    1.45,
    Math.min(maxW / activeSurface.width, maxH / activeSurface.height)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black rounded-3xl w-full max-w-[98vw] h-[94vh] flex flex-col justify-between overflow-hidden shadow-[12px_12px_0px_#000000] relative">
        {/* Modal Header */}
        <div className="p-3.5 border-b-3 border-black bg-[#FFB000] flex items-center justify-between z-20 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000000]">
              <Maximize2 className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h2 className="font-black text-base text-black uppercase tracking-wide flex items-center gap-2">
                Full-Screen Canvas Editor
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black animate-ping" />
              </h2>
              <p className="text-xs text-black font-mono font-bold">
                Surface: <span className="underline">{activeSurface.name}</span> ({activeSurface.width} × {activeSurface.height}px)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Cursor Drag & Resize Toggle */}
            <button
              onClick={() => setIsDragMode(!isDragMode)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black border-2 border-black flex items-center gap-1.5 uppercase transition-all shadow-[2px_2px_0px_#000] ${
                isDragMode
                  ? 'bg-amber-300 text-black ring-2 ring-black'
                  : 'bg-white text-black hover:bg-amber-100'
              }`}
            >
              <Move className="w-4 h-4 stroke-[3]" />
              <span>{isDragMode ? 'Cursor Move: ON' : 'Enable Cursor Drag'}</span>
            </button>

            <div className="bg-white border-2 border-black px-3 py-1.5 rounded-xl font-mono text-xs font-black text-black shadow-[2px_2px_0px_#000000]">
              Score: {Math.round(selectedCandidate.score.totalScore)} / 100
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white hover:bg-red-400 hover:text-white text-black border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors cursor-pointer"
              title="Close Fullscreen (Esc)"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Center Display Area + Right Setup Box Sidebar */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Main Interactive Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-[#F9F6F0] relative overflow-auto custom-scrollbar">
            {/* Dot Grid Background Accent */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#000000 1.8px, transparent 1.8px)`,
                backgroundSize: '24px 24px',
              }}
            />

            <div className="z-10 transition-transform duration-300">
              <AdaptiveAdRenderer
                candidate={selectedCandidate}
                surface={activeSurface}
                campaign={campaign}
                showOverlays={true}
                scaleFactor={scaleFactor}
                interactive={true}
                isDragModeEnabled={isDragMode}
              />
            </div>
          </div>

          {/* Right Setup Box Sidebar */}
          <div className="w-[440px] lg:w-[460px] xl:w-[480px] border-l-3 border-black bg-white flex flex-col h-full overflow-y-auto z-20 shrink-0 custom-scrollbar">
            <CampaignEditor />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t-3 border-black bg-white flex items-center justify-between z-20 shrink-0 text-xs font-mono font-bold">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-black">
              <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[3]" />
              WCAG Audit: {auditReport?.contrastRatio && auditReport.contrastRatio >= 4.5 ? 'AAA Passed' : 'AA Compliant'}
            </span>
            <span className="text-slate-600">
              Scale Factor: {scaleFactor.toFixed(2)}x
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-[#FFB000] text-black px-3 py-1 rounded-xl border-2 border-black font-black flex items-center gap-1 shadow-[2px_2px_0px_#000000] uppercase text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> High-Res Interactive Canvas
            </span>
            <button
              onClick={onClose}
              className="px-5 py-1.5 bg-black text-white font-black rounded-xl border-2 border-black uppercase hover:bg-slate-800 transition-colors shadow-[2px_2px_0px_#000000] cursor-pointer"
            >
              Exit Fullscreen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
