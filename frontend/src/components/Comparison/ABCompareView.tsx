import React from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { AdaptiveAdRenderer } from '../canvas/AdaptiveAdRenderer';
import { Columns, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

export const ABCompareView: React.FC = () => {
  const { evaluationResult, activeSurface, campaign, setDiffComparePair } = useAdaptXStore();

  if (!evaluationResult || evaluationResult.candidates.length < 2) {
    return (
      <div className="flex-1 bg-[#FFA726] p-8 flex items-center justify-center text-stone-700 text-sm font-mono">
        Need at least 2 candidate layouts to compare.
      </div>
    );
  }

  const candidateA = evaluationResult.candidates[0];
  const candidateB = evaluationResult.candidates[1];

  const maxW = 420;
  const maxH = 460;
  const scaleFactor = Math.min(maxW / activeSurface.width, maxH / activeSurface.height);

  return (
    <div className="flex-1 bg-[#FFA726] p-8 overflow-y-auto custom-scrollbar select-none text-stone-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white border-2 border-blue-500/80 rounded-3xl p-6 flex items-center justify-between shadow-md">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
              <Columns className="w-6 h-6 text-blue-600" />
              Side-by-Side A/B Candidate Comparison
            </h2>
            <p className="text-xs text-slate-600 mt-1.5">
              Compare composition quality, spatial efficiency, and constraint scores between candidates.
            </p>
          </div>

          <button
            onClick={() => setDiffComparePair(candidateA, candidateB)}
            className="flex items-center gap-2.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all border-2 border-black"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Launch Visual Diff Inspector
          </button>
        </div>

        {/* Side by Side Split Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Candidate A Card */}
          <div className="bg-white border-2 border-purple-600/80 rounded-3xl p-6 space-y-5 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md font-bold border border-emerald-300">
                  Candidate A (Winner ⭐)
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1.5">{candidateA.strategyName}</h3>
              </div>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono">
                {candidateA.score.totalScore}/100
              </div>
            </div>

            <div className="flex items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-200 min-h-[300px]">
              <AdaptiveAdRenderer
                candidate={candidateA}
                surface={activeSurface}
                campaign={campaign}
                showOverlays={false}
                scaleFactor={scaleFactor}
                interactive={false}
              />
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-xs">Primary Win Reasons:</div>
              {candidateA.winReasons.map((r, i) => (
                <div key={i} className="text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate B Card */}
          <div className="bg-white border-2 border-purple-600/80 rounded-3xl p-6 space-y-5 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md font-bold border border-amber-300">
                  Candidate B (Alternative)
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1.5">{candidateB.strategyName}</h3>
              </div>
              <div className="text-2xl font-extrabold text-amber-700 font-mono">
                {candidateB.score.totalScore}/100
              </div>
            </div>

            <div className="flex items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-200 min-h-[300px]">
              <AdaptiveAdRenderer
                candidate={candidateB}
                surface={activeSurface}
                campaign={campaign}
                showOverlays={false}
                scaleFactor={scaleFactor}
                interactive={false}
              />
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-xs">Primary Penalties:</div>
              {candidateB.penalties.map((p, i) => (
                <div key={i} className="text-amber-800 flex items-start gap-2 font-mono">
                  <span>-</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
