import React, { useState } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { VIBE_STYLES } from '../../utils/vibeStyles';
import { Award, AlertTriangle, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export const CandidateScoreInspector: React.FC = () => {
  const { evaluationResult, selectedCandidate, setSelectedCandidate, auditReport, websiteVibe } = useAdaptXStore();
  const [showExplanation, setShowExplanation] = useState(true);
  const vibe = VIBE_STYLES[websiteVibe] || VIBE_STYLES.organic_pastel;
  const isClean = false;

  if (!evaluationResult || !selectedCandidate) {
    return (
      <div className={`w-80 p-4 text-xs flex items-center justify-center font-bold ${isClean ? 'bg-slate-50 text-slate-600 border-l border-slate-200' : 'bg-[#FAF7F2] border-l-3 border-black text-black'}`}>
        Evaluating candidate layouts...
      </div>
    );
  }

  const { winningCandidate, candidates, conflictReport, explanationText } = evaluationResult;
  const score = selectedCandidate.score;

  return (
    <div className={`w-80 flex flex-col h-full overflow-hidden select-none shrink-0 z-10 ${isClean ? 'bg-white border-l border-slate-200 shadow-xs' : 'bg-[#FFFDF5] border-l-3 border-black shadow-md text-black'}`}>
      {/* Inspector Panel Title */}
      <div className={`p-4 flex items-center justify-between ${isClean ? 'bg-purple-50 border-b border-purple-200/80' : 'p-4 border-b-3 border-black bg-[#B5A8F7]'}`}>
        <h2 className={`text-xs uppercase tracking-wider flex items-center gap-2 ${isClean ? 'font-extrabold text-purple-950 font-sans' : 'font-black text-black font-mono'}`}>
          <Award className={`w-4 h-4 ${isClean ? 'text-purple-600 stroke-[2.5]' : 'text-black stroke-[3]'}`} />
          Layout Score & Audit
        </h2>
        <span className={isClean ? 'text-[11px] font-bold text-purple-900 bg-purple-200/80 px-2.5 py-0.5 rounded-lg border border-purple-300 shadow-2xs' : 'text-[11px] font-mono font-black text-black bg-[#FFC72C] px-2.5 py-0.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]'}>
          Score: {selectedCandidate.score.totalScore}
        </span>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
        {/* Candidate Strategy Selector Tabs */}
        <div className="space-y-1.5">
          <label className="font-black text-black block text-[11px] uppercase tracking-wider font-mono">
            Candidates ({candidates.length})
          </label>
          <div className="space-y-1.5">
            {candidates.map((candidate) => {
              const isSelected = selectedCandidate.id === candidate.id;
              const isWinner = candidate.id === winningCandidate.id;
              return (
                <button
                  key={candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border-2 border-black text-left transition-all font-bold ${
                    isSelected
                      ? 'bg-[#48BB78] text-black shadow-[3px_3px_0px_#000000]'
                      : 'bg-white text-slate-800 hover:bg-[#F5EFFE]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isWinner && <Award className="w-4 h-4 text-black shrink-0 stroke-[3]" />}
                    <span className="font-black text-xs truncate uppercase">{candidate.strategyName}</span>
                  </div>
                  <span className="font-mono text-xs font-black text-black ml-2 shrink-0">
                    {candidate.score.totalScore}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8-Dimension Score Breakdown */}
        <div className="bg-[#FAF7F2] border-2 border-black rounded-2xl p-3.5 space-y-3 shadow-[3px_3px_0px_#000000]">
          <div className="flex items-center justify-between">
            <span className="font-black text-black text-xs uppercase">8-Dimension Quality Score</span>
            <span className="font-mono text-black font-black bg-[#FFB000] px-2 py-0.5 rounded border-2 border-black">{score.totalScore}/100</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Readability', value: score.readability },
              { label: 'Hierarchy', value: score.visualHierarchy },
              { label: 'Brand Compl.', value: score.brandCompliance },
              { label: 'Visibility', value: score.contentVisibility },
              { label: 'CTA Focus', value: score.ctaVisibility },
              { label: 'Whitespace', value: score.whitespaceBalance },
              { label: 'Balance', value: score.visualBalance },
              { label: 'Safe Zone', value: score.safeZoneCompliance },
            ].map((metric) => (
              <div key={metric.label} className="bg-white p-2 rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_#000000] space-y-1">
                <div className="flex justify-between text-[10px] text-slate-800 font-bold">
                  <span className="truncate pr-1">{metric.label}</span>
                  <span className="font-mono font-black text-black">{metric.value}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-black">
                  <div
                    className="h-full rounded-full transition-all duration-300 bg-[#FFB000]"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explainable Decision AI (Section 77) */}
        <div className="bg-[#FAF7F2] border-2 border-black rounded-2xl p-3.5 space-y-2 shadow-[3px_3px_0px_#000000]">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full flex items-center justify-between font-black text-black text-xs uppercase tracking-wide"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-black stroke-[3]" />
              Explainable Decision Audit
            </span>
            {showExplanation ? <ChevronUp className="w-4 h-4 stroke-[3]" /> : <ChevronDown className="w-4 h-4 stroke-[3]" />}
          </button>

          {showExplanation && (
            <p className="text-[11px] text-black font-semibold leading-relaxed pt-1 bg-white p-2.5 rounded-xl border-2 border-black">
              {explanationText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
