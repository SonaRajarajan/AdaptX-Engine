import React, { useState } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { SURFACE_PRESETS } from '../../models/surface';
import { Monitor, Smartphone, Tv, Eye, Share2, Car, Watch, Building2 } from 'lucide-react';

export const SurfaceSelector: React.FC = () => {
  const { activeSurface, setActiveSurface, setCustomSurfaceDimensions } = useAdaptXStore();
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customW, setCustomW] = useState(1378);
  const [customH, setCustomH] = useState(431);

  const handleSelectPreset = (presetKey: string) => {
    setIsCustomMode(false);
    setActiveSurface(SURFACE_PRESETS[presetKey]);
  };

  const handleCustomApply = (w: number, h: number) => {
    setCustomW(w);
    setCustomH(h);
    setCustomSurfaceDimensions(w, h);
  };

  return (
    <div className="h-11 bg-stone-900/40 border-b border-stone-800/60 px-6 flex items-center justify-between gap-4 text-white select-none shrink-0 z-20 overflow-x-auto custom-scrollbar">
      {/* Surface Presets Bar */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider font-mono mr-1">
          Surfaces:
        </span>

        {Object.entries(SURFACE_PRESETS).map(([key, preset]) => {
          const isSelected = !isCustomMode && activeSurface.id === preset.id;
          return (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 ${
                isSelected
                  ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              {preset.id === 'vertical_skyscraper' ? (
                <Building2 className="w-3 h-3 text-emerald-400" />
              ) : preset.id === 'social_square' || preset.category === 'social' ? (
                <Share2 className="w-3 h-3 text-cyan-400" />
              ) : preset.id === 'in_car_display' || preset.category === 'in_car' ? (
                <Car className="w-3 h-3 text-purple-400" />
              ) : preset.id === 'wearable_smartwatch' || preset.category === 'wearable' ? (
                <Watch className="w-3 h-3 text-yellow-400" />
              ) : preset.category === 'mobile' ? (
                <Smartphone className="w-3 h-3 text-red-400" />
              ) : preset.category === 'tv' ? (
                <Tv className="w-3 h-3 text-amber-400" />
              ) : preset.category === 'billboard' ? (
                <Eye className="w-3 h-3 text-blue-400" />
              ) : (
                <Monitor className="w-3 h-3 text-rose-400" />
              )}
              <span>{preset.name}</span>
              <span className="font-mono text-[10px] text-stone-500">
                {preset.width}×{preset.height}
              </span>
            </button>
          );
        })}
      </div>

      {/* Arbitrary Custom Surface WxH Inputs */}
      <div className="flex items-center gap-2 text-xs shrink-0">
        <span className="text-[11px] font-mono text-stone-400 font-medium">Custom:</span>
        <div className="flex items-center gap-1 text-xs font-mono">
          <input
            type="number"
            value={customW}
            onChange={(e) => {
              const val = Number(e.target.value);
              setIsCustomMode(true);
              handleCustomApply(val, customH);
            }}
            className="w-14 bg-stone-950 border border-stone-800 rounded px-1.5 py-0.5 text-center text-stone-200 focus:outline-none focus:border-red-500"
          />
          <span className="text-stone-600">×</span>
          <input
            type="number"
            value={customH}
            onChange={(e) => {
              const val = Number(e.target.value);
              setIsCustomMode(true);
              handleCustomApply(customW, val);
            }}
            className="w-14 bg-stone-950 border border-stone-800 rounded px-1.5 py-0.5 text-center text-stone-200 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>
    </div>
  );
};
