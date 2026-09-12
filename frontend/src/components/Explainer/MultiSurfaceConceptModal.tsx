import React from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { SURFACE_PRESETS } from '../../models/surface';
import { THEME_PRESETS, ThemeId } from '../../models/theme';
import { X, Sparkles, Monitor, Smartphone, Tv, Radio, Watch, Car, Layout, Zap, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiSurfaceConceptModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { setActiveSurface, setActiveThemeId } = useAdaptXStore();

  if (!isOpen) return null;

  const handleApplyCombo = (surfaceId: string, themeId: ThemeId) => {
    if (SURFACE_PRESETS[surfaceId]) {
      setActiveSurface(SURFACE_PRESETS[surfaceId]);
    }
    if (THEME_PRESETS[themeId]) {
      setActiveThemeId(themeId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in select-none">
      <div className="bg-[#FAF7F2] border-4 border-black rounded-3xl max-w-4xl w-full p-6 text-black shadow-[8px_8px_0px_#000000] relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white hover:bg-rose-100 border-2 border-black p-2 rounded-xl text-black font-black cursor-pointer shadow-[2px_2px_0px_#000] transition-colors"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#FFC72C] border-3 border-black p-2.5 rounded-2xl shadow-[3px_3px_0px_#000]">
            <Sparkles className="w-6 h-6 text-black stroke-[3]" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase bg-[#B5A8F7] border border-black px-2 py-0.5 rounded text-black">
              Core Layout Engine Assignment Concept
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-black mt-0.5">
              What is Multi-Surface Advertising?
            </h2>
          </div>
        </div>

        {/* One-Sentence Summary Highlight Banner */}
        <div className="bg-[#B5A8F7]/30 border-3 border-black p-4 rounded-2xl mb-6 shadow-[3px_3px_0px_#000]">
          <p className="text-xs font-black text-black leading-relaxed">
            <span className="underline decoration-2">In One Sentence:</span> Multi-surface ads are advertisements designed to work across different screens and physical/digital placements, where each surface requires a different layout, typography, cropping, interaction model, and visual treatment.
          </p>
        </div>

        {/* Problem & Surfaces Table */}
        <div className="space-y-3 mb-6">
          <h3 className="font-black text-sm uppercase tracking-wide flex items-center gap-2 text-black">
            <Layout className="w-4 h-4 text-black stroke-[3]" />
            1. The Surface Constraint Matrix
          </h3>
          <div className="overflow-x-auto border-3 border-black rounded-2xl shadow-[4px_4px_0px_#000] bg-white">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#FFC72C] border-b-3 border-black text-black font-black uppercase">
                  <th className="p-2.5">Surface</th>
                  <th className="p-2.5">Format</th>
                  <th className="p-2.5">Constraint Problem</th>
                  <th className="p-2.5">Adaptive Solution</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                <tr className="hover:bg-amber-50/50">
                  <td className="p-2.5 font-bold flex items-center gap-1.5"><Smartphone className="w-4 h-4" /> Mobile</td>
                  <td className="p-2.5">9:16 Portrait</td>
                  <td className="p-2.5 text-rose-700 font-bold">Very limited width</td>
                  <td className="p-2.5 text-emerald-800 font-extrabold">Vertical stack & touch CTA</td>
                </tr>
                <tr className="hover:bg-amber-50/50">
                  <td className="p-2.5 font-bold flex items-center gap-1.5"><Monitor className="w-4 h-4" /> Desktop</td>
                  <td className="p-2.5">16:9 Banner</td>
                  <td className="p-2.5 text-rose-700 font-bold">More horizontal space</td>
                  <td className="p-2.5 text-emerald-800 font-extrabold">Multi-column hero layout</td>
                </tr>
                <tr className="hover:bg-amber-50/50">
                  <td className="p-2.5 font-bold flex items-center gap-1.5"><Layout className="w-4 h-4" /> Social Post</td>
                  <td className="p-2.5">1:1 Square</td>
                  <td className="p-2.5 text-rose-700 font-bold">Square composition</td>
                  <td className="p-2.5 text-emerald-800 font-extrabold">Centered focal text & product</td>
                </tr>
                <tr className="hover:bg-amber-50/50">
                  <td className="p-2.5 font-bold flex items-center gap-1.5"><Tv className="w-4 h-4" /> TV Display</td>
                  <td className="p-2.5">16:9 Landscape</td>
                  <td className="p-2.5 text-rose-700 font-bold">3.5m viewing distance</td>
                  <td className="p-2.5 text-emerald-800 font-extrabold">High contrast oversize text</td>
                </tr>
                <tr className="hover:bg-amber-50/50">
                  <td className="p-2.5 font-bold flex items-center gap-1.5"><Radio className="w-4 h-4" /> Billboard</td>
                  <td className="p-2.5">32:9 Ultra-Wide</td>
                  <td className="p-2.5 text-rose-700 font-bold">25m distance + fast speed</td>
                  <td className="p-2.5 text-emerald-800 font-extrabold">Horizontal 1-line readability</td>
                </tr>
                <tr className="hover:bg-amber-50/50">
                  <td className="p-2.5 font-bold flex items-center gap-1.5"><Car className="w-4 h-4" /> In-Car Display</td>
                  <td className="p-2.5">21:9 Console</td>
                  <td className="p-2.5 text-rose-700 font-bold">Safety + limited attention</td>
                  <td className="p-2.5 text-emerald-800 font-extrabold">Glanceable micro-copy</td>
                </tr>
                <tr className="hover:bg-amber-50/50">
                  <td className="p-2.5 font-bold flex items-center gap-1.5"><Watch className="w-4 h-4" /> Wearable</td>
                  <td className="p-2.5">1:1 Tiny (240px)</td>
                  <td className="p-2.5 text-rose-700 font-bold">Extremely limited content</td>
                  <td className="p-2.5 text-emerald-800 font-extrabold">Focal icon + micro CTA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ASCII Composition Diagrams */}
        <div className="space-y-3 mb-6">
          <h3 className="font-black text-sm uppercase tracking-wide flex items-center gap-2 text-black">
            <Zap className="w-4 h-4 text-black stroke-[3]" />
            2. Layout Engine Composition Transformation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mobile Composition Box */}
            <div className="bg-[#FAF7F2] p-3.5 border-3 border-black rounded-2xl shadow-[3px_3px_0px_#000]">
              <span className="text-[10px] font-mono font-black uppercase text-purple-900 bg-purple-200 px-2 py-0.5 rounded border border-black block w-fit mb-2">
                Mobile (9:16 Vertical Stack)
              </span>
              <pre className="font-mono text-[10px] leading-tight text-slate-900 bg-white p-2.5 border-2 border-black rounded-xl overflow-x-auto select-all">
{`┌──────────────┐
│ LOGO         │
│              │
│    [HERO]    │
│              │
│ THE FUTURE   │
│ IS ELECTRIC  │
│              │
│ [EXPLORE]    │
└──────────────┘`}
              </pre>
            </div>

            {/* Billboard Composition Box */}
            <div className="bg-[#FAF7F2] p-3.5 border-3 border-black rounded-2xl shadow-[3px_3px_0px_#000]">
              <span className="text-[10px] font-mono font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded border border-black block w-fit mb-2">
                Billboard (32:9 Horizontal Line)
              </span>
              <pre className="font-mono text-[10px] leading-tight text-slate-900 bg-white p-2.5 border-2 border-black rounded-xl overflow-x-auto select-all">
{`┌──────────────────────────────────────────┐
│ LOGO  THE FUTURE IS ELECTRIC  [HERO] [EXPLORE]│
└──────────────────────────────────────────┘`}
              </pre>
            </div>
          </div>
        </div>

        {/* 2D Matrix: One Campaign -> Surface x Style */}
        <div className="bg-[#99E5C9] border-3 border-black p-4 rounded-2xl mb-6 shadow-[4px_4px_0px_#000]">
          <h3 className="font-black text-sm uppercase text-black mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
            3. The 2D Combinatorial Engine: (Surface × Theme Style)
          </h3>
          <p className="text-xs text-black font-semibold mb-3">
            Our Adaptive Layout Engine combines <strong>Screen Geometry</strong> with <strong>Visual Theme Styles</strong> while strictly preserving campaign message, focal points, CTA text, and brand constraints:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => handleApplyCombo('mobile_portrait', 'pixel')}
              className="p-2.5 bg-white hover:bg-yellow-200 border-2 border-black rounded-xl text-left text-xs font-mono font-black cursor-pointer shadow-[2px_2px_0px_#000] transition-all"
            >
              <div className="text-[10px] text-slate-600">Mobile</div>
              <div className="text-black uppercase font-extrabold">+ Pixel Art</div>
            </button>
            <button
              onClick={() => handleApplyCombo('desktop_leaderboard', 'minimal')}
              className="p-2.5 bg-white hover:bg-yellow-200 border-2 border-black rounded-xl text-left text-xs font-mono font-black cursor-pointer shadow-[2px_2px_0px_#000] transition-all"
            >
              <div className="text-[10px] text-slate-600">Desktop</div>
              <div className="text-black uppercase font-extrabold">+ Minimal Clean</div>
            </button>
            <button
              onClick={() => handleApplyCombo('smart_tv_4k', 'spatial_3d')}
              className="p-2.5 bg-white hover:bg-yellow-200 border-2 border-black rounded-xl text-left text-xs font-mono font-black cursor-pointer shadow-[2px_2px_0px_#000] transition-all"
            >
              <div className="text-[10px] text-slate-600">Smart TV</div>
              <div className="text-black uppercase font-extrabold">+ 3D Spatial</div>
            </button>
            <button
              onClick={() => handleApplyCombo('highway_billboard', 'neo_brutalist')}
              className="p-2.5 bg-white hover:bg-yellow-200 border-2 border-black rounded-xl text-left text-xs font-mono font-black cursor-pointer shadow-[2px_2px_0px_#000] transition-all"
            >
              <div className="text-[10px] text-slate-600">Billboard</div>
              <div className="text-black uppercase font-extrabold">+ Neo-Brutalist</div>
            </button>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between border-t-3 border-black pt-4">
          <span className="text-[11px] font-mono font-bold text-slate-700">
            Powered by CanvasSync Adaptive Layout Engine
          </span>
          <button
            onClick={onClose}
            className="py-2.5 px-6 bg-[#FFC72C] hover:bg-yellow-400 border-3 border-black rounded-xl text-black font-black text-xs uppercase shadow-[3px_3px_0px_#000] cursor-pointer transition-transform hover:scale-105"
          >
            Explore Engine Live
          </button>
        </div>
      </div>
    </div>
  );
};
