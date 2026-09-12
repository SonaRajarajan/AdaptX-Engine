import React from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { X, ArrowRightLeft, Move, Maximize2, Eye, RefreshCw } from 'lucide-react';

export const VisualDiffModal: React.FC = () => {
  const { isDiffModalOpen, visualDiffComparePair, closeDiffModal } = useAdaptXStore();

  if (!isDiffModalOpen || !visualDiffComparePair) return null;

  const [c1, c2] = visualDiffComparePair;

  // Analyze element box differences
  const diffs: { element: string; changeType: 'moved' | 'resized' | 'visibility' | 'reformatted'; details: string }[] = [];

  const keys = ['logo', 'headline', 'product', 'cta', 'description', 'legalText', 'decorative'];
  keys.forEach((key) => {
    const e1 = (c1.genome.elements as any)[key];
    const e2 = (c2.genome.elements as any)[key];

    if (e1 && e2) {
      if (e1.visible !== e2.visible) {
        diffs.push({
          element: key,
          changeType: 'visibility',
          details: `Visibility toggled from ${e1.visible ? 'Visible' : 'Hidden'} to ${e2.visible ? 'Visible' : 'Hidden'}.`,
        });
      } else if (e1.visible && e2.visible) {
        const dx = Math.abs(e1.box.x - e2.box.x);
        const dy = Math.abs(e1.box.y - e2.box.y);
        const dw = Math.abs(e1.box.width - e2.box.width);
        const dh = Math.abs(e1.box.height - e2.box.height);

        if (dx > 5 || dy > 5) {
          diffs.push({
            element: key,
            changeType: 'moved',
            details: `Position shifted by (${Math.round(dx)}px X, ${Math.round(dy)}px Y).`,
          });
        }
        if (dw > 5 || dh > 5) {
          diffs.push({
            element: key,
            changeType: 'resized',
            details: `Dimensions changed from ${Math.round(e1.box.width)}x${Math.round(e1.box.height)}px to ${Math.round(e2.box.width)}x${Math.round(e2.box.height)}px.`,
          });
        }
      }
    }
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <ArrowRightLeft className="w-5 h-5 text-blue-400" />
            Visual Diff Inspector ({c1.strategyName} vs {c2.strategyName})
          </div>
          <button
            onClick={closeDiffModal}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-200 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold">Base Candidate</div>
              <div className="text-white font-bold text-sm">{c1.strategyName}</div>
              <div className="text-emerald-400 font-bold">Score: {c1.score.totalScore}/100</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold">Target Candidate</div>
              <div className="text-white font-bold text-sm">{c2.strategyName}</div>
              <div className="text-purple-400 font-bold">Score: {c2.score.totalScore}/100</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-sm text-white">Detected Element Mutations ({diffs.length}):</h4>
            {diffs.map((d, i) => (
              <div
                key={i}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {d.changeType === 'moved' && <Move className="w-4 h-4 text-blue-400" />}
                  {d.changeType === 'resized' && <Maximize2 className="w-4 h-4 text-amber-400" />}
                  {d.changeType === 'visibility' && <Eye className="w-4 h-4 text-purple-400" />}
                  <div>
                    <div className="font-bold text-white capitalize">{d.element}</div>
                    <div className="text-slate-400 text-[11px]">{d.details}</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize border border-slate-700">
                  {d.changeType}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
