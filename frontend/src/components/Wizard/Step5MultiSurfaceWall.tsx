import React from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { MultiSurfacePreviewWall } from '../PreviewWall/MultiSurfacePreviewWall';
import { ABCompareView } from '../Comparison/ABCompareView';
import { LayoutGenomeViewer } from '../Inspector/LayoutGenomeViewer';
import { VIBE_STYLES } from '../../utils/vibeStyles';
import { Grid, Columns, Code2, ArrowLeft, Lock } from 'lucide-react';

export const Step5MultiSurfaceWall: React.FC = () => {
  const { viewMode, setViewMode, prevStep, websiteVibe } = useAdaptXStore();
  const vibe = VIBE_STYLES[websiteVibe] || VIBE_STYLES.organic_pastel;
  const isClean = false;

  return (
    <div className="flex-1 bg-transparent overflow-hidden flex flex-col justify-between select-none">
      {/* View Mode Switcher Bar (Vivid Yellowish Orange Background) */}
      <div className="h-14 bg-[#FFA726] px-6 flex items-center justify-center sm:justify-end shrink-0 z-10">
        <div className="flex items-center p-1 rounded-2xl gap-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000000]">
          <button
            onClick={() => setViewMode('preview_wall')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all uppercase tracking-wide cursor-pointer ${
              viewMode === 'preview_wall'
                ? 'bg-blue-600 text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                : 'bg-white text-black hover:bg-amber-100 border-2 border-transparent font-bold'
            }`}
          >
            <Grid className="w-3.5 h-3.5 stroke-[2.5]" />
            Live Wall
          </button>

          <button
            onClick={() => setViewMode('ab_compare')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all uppercase tracking-wide cursor-pointer ${
              viewMode === 'ab_compare'
                ? 'bg-blue-600 text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                : 'bg-white text-black hover:bg-amber-100 border-2 border-transparent font-bold'
            }`}
          >
            <Columns className="w-3.5 h-3.5 stroke-[2.5]" />
            A/B Compare
          </button>

          <button
            onClick={() => setViewMode('genome_editor')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all uppercase tracking-wide cursor-pointer ${
              viewMode === 'genome_editor'
                ? 'bg-blue-600 text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                : 'bg-white text-black hover:bg-amber-100 border-2 border-transparent font-bold'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 stroke-[2.5]" />
            Genome
          </button>
        </div>
      </div>

      {/* Main Suite Content */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'ab_compare' ? <ABCompareView /> : viewMode === 'genome_editor' ? <LayoutGenomeViewer /> : <MultiSurfacePreviewWall />}
      </div>

      {/* Footer Navigation Bar */}
      <div className={`px-6 py-1.5 flex items-center justify-between z-30 shrink-0 ${isClean ? 'bg-white/90 backdrop-blur-md border-t border-purple-200/80 shadow-xs' : 'bg-white border-t-2 border-black'}`}>
        <button
          onClick={prevStep}
          className={`flex items-center gap-2 cursor-pointer ${vibe.buttonSecondary} ${isClean ? 'px-4 py-1.5 font-bold text-xs uppercase tracking-wider' : 'px-3.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-all transform hover:-translate-y-0.5 text-xs font-black'}`}
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Back to Layout Inspector</span>
        </button>

        <span className={isClean ? 'text-[11px] font-bold text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-lg shadow-2xs uppercase' : 'text-[11px] font-mono text-black font-black bg-[#FFB000] border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_#000000] uppercase'}>
          Multi-Surface Adaptation Engine Active
        </span>
      </div>
    </div>
  );
};
