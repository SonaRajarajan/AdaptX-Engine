import React, { useState } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { SURFACE_PRESETS } from '../../models/surface';
import { AdaptiveAdRenderer } from '../canvas/AdaptiveAdRenderer';
import { CandidateGenerator } from '../../engine/optimizer/CandidateGenerator';
import { ConstraintSolver } from '../../engine/constraints/ConstraintSolver';
import { LayoutScoringEngine } from '../../engine/scoring/LayoutScoringEngine';
import { LayoutCandidate } from '../../models/layout';
import { MultiSurfaceConceptModal } from '../Explainer/MultiSurfaceConceptModal';
import { RealWorld3DFrame } from '../common/RealWorld3DFrame';
import { Grid, Sparkles, CheckCircle2, HelpCircle, Box, Layers } from 'lucide-react';

export const MultiSurfacePreviewWall: React.FC = () => {
  const { campaign, scoreWeights } = useAdaptXStore();
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [active3DMap, setActive3DMap] = useState<Record<string, boolean>>({});

  const previewSurfaces = [
    SURFACE_PRESETS.mobile_portrait,
    SURFACE_PRESETS.desktop_leaderboard,
    SURFACE_PRESETS.smart_tv_4k,
    SURFACE_PRESETS.social_square,
    SURFACE_PRESETS.highway_billboard,
    SURFACE_PRESETS.in_car_display,
    SURFACE_PRESETS.wearable_smartwatch,
    SURFACE_PRESETS.vertical_skyscraper,
  ].filter(Boolean);

  const toggle3D = (surfaceId: string) => {
    setActive3DMap((prev) => ({
      ...prev,
      [surfaceId]: !prev[surfaceId],
    }));
  };

  const toggleAll3D = (enable: boolean) => {
    const nextMap: Record<string, boolean> = {};
    previewSurfaces.forEach((s) => {
      nextMap[s.id] = enable;
    });
    setActive3DMap(nextMap);
  };

  const any3DActive = Object.values(active3DMap).some(Boolean);

  return (
    <div className="flex-1 bg-[#FFA726] p-8 overflow-y-auto custom-scrollbar select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Wall Banner Header */}
        <div className="bg-white border-2 border-blue-500/80 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
              <Grid className="w-6 h-6 text-blue-600" />
              Multi-Surface Live Preview Wall
            </h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              One campaign. Real-time synchronous adaptation. Default 2D preview — click any card to activate 3D Pop-Out view.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => toggleAll3D(!any3DActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase shadow-sm transition-transform hover:scale-105 cursor-pointer border-2 border-black ${
                any3DActive
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Box className="w-4 h-4 stroke-[2.5]" />
              {any3DActive ? 'Reset to 2D' : 'Enable 3D Pop-Out All'}
            </button>
            <button
              onClick={() => setShowConceptModal(true)}
              className="flex items-center gap-2 bg-[#FFC72C] hover:bg-yellow-400 text-black px-4 py-2 rounded-2xl text-xs font-black uppercase shadow-sm transition-transform hover:scale-105 cursor-pointer border-2 border-black"
            >
              <HelpCircle className="w-4 h-4 stroke-[3]" />
              Multi-Surface Concept Guide
            </button>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-2xl text-xs font-mono text-blue-800 font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              {previewSurfaces.length} Surfaces Active
            </div>
          </div>
        </div>

        {/* Live Surface Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewSurfaces.map((surface) => {
            const rawGenomes = CandidateGenerator.generateCandidates(campaign, surface);
            const candidates: LayoutCandidate[] = rawGenomes.map((g) => {
              const check = ConstraintSolver.solveAndValidate(g, surface, campaign.priorities);
              const scoring = LayoutScoringEngine.scoreCandidate(check.genome, campaign, surface, scoreWeights);
              return {
                id: g.id,
                strategyName: g.strategyName,
                genome: check.genome,
                score: scoring.breakdown,
                winReasons: scoring.winReasons,
                penalties: scoring.penalties,
              };
            });

            candidates.sort((a, b) => b.score.totalScore - a.score.totalScore);
            const winner = candidates[0];

            const maxW = 380;
            const maxH = 260;
            const scaleFactor = Math.min(maxW / surface.width, maxH / surface.height);
            const is3D = Boolean(active3DMap[surface.id]);

            return (
              <div
                key={surface.id}
                className={`bg-white border-2 rounded-3xl p-5 space-y-4 shadow-md transition-all flex flex-col justify-between cursor-pointer ${
                  is3D
                    ? 'border-purple-600 ring-2 ring-purple-500/30'
                    : 'border-purple-600/80 hover:border-purple-800'
                }`}
                onClick={() => toggle3D(surface.id)}
              >
                {/* Surface Card Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      {surface.name}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>
                        {surface.width}×{surface.height}px
                      </span>
                      <span>•</span>
                      <span>{surface.viewingDistance}m Distance</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle3D(surface.id);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase transition-all border ${
                        is3D
                          ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {is3D ? '3D Pop-Out ON' : '2D Mode'}
                    </button>
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-700 px-2.5 py-1 rounded-xl text-xs font-mono font-extrabold shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {winner.score.totalScore}/100
                    </div>
                  </div>
                </div>

                {/* Real-World 3D Anamorphic Container Frame */}
                <div className="flex items-center justify-center bg-slate-50/80 p-2 rounded-2xl border border-slate-200 min-h-[260px] overflow-visible shadow-inner">
                  <RealWorld3DFrame surface={surface} scaleFactor={scaleFactor} showAnamorphicPopout={is3D}>
                    <AdaptiveAdRenderer
                      candidate={winner}
                      surface={surface}
                      campaign={campaign}
                      showOverlays={false}
                      scaleFactor={scaleFactor}
                      interactive={false}
                    />
                  </RealWorld3DFrame>
                </div>

                {/* Strategy Strategy Name Badge */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span className="font-bold text-slate-800">Strategy: {winner.strategyName}</span>
                  <span className="font-mono text-purple-700 font-bold uppercase">{surface.orientation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <MultiSurfaceConceptModal
        isOpen={showConceptModal}
        onClose={() => setShowConceptModal(false)}
      />
    </div>
  );
};
