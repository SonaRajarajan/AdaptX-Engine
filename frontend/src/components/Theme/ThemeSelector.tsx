import React from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { THEME_PRESETS, ThemeId } from '../../models/theme';
import { ThemeEngine } from '../../engine/theme/ThemeEngine';
import { Sliders, Lock, Unlock, Sparkles, CheckCircle2 } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const {
    activeThemeId,
    setActiveThemeId,
    morphTargetThemeId,
    setMorphTargetThemeId,
    morphRatio,
    setMorphRatio,
    brandLockEnabled,
    setBrandLockEnabled,
    activeSurface,
    activeThemeTokens,
  } = useAdaptXStore();

  const compatibility = ThemeEngine.evaluateCompatibility(activeThemeId, activeSurface);

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 px-6 py-2.5 text-white flex items-center justify-between gap-6 select-none z-20 overflow-x-auto custom-scrollbar">
      {/* Theme Presets Bar */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mr-1">
          Visual Themes:
        </span>

        {Object.entries(THEME_PRESETS).map(([key, theme]) => {
          if (key === 'custom') return null;
          const isSelected = activeThemeId === key;
          return (
            <button
              key={key}
              onClick={() => setActiveThemeId(key as ThemeId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <span>{theme.icon}</span>
              <span>{theme.name}</span>
            </button>
          );
        })}
      </div>

      {/* Theme Morphing Slider & Brand Lock Controls */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Real-Time Theme Morphing & Mixer Slider */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-slate-400">Morph:</span>
          <span className="text-blue-400 font-bold">{THEME_PRESETS[activeThemeId]?.name}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={morphRatio}
            onChange={(e) => setMorphRatio(parseFloat(e.target.value))}
            className="w-24 accent-blue-500 cursor-pointer"
          />
          <select
            value={morphTargetThemeId}
            onChange={(e) => setMorphTargetThemeId(e.target.value as ThemeId)}
            className="bg-slate-900 text-purple-400 font-bold text-xs border border-slate-700 rounded px-1.5 py-0.5 focus:outline-none"
          >
            {Object.entries(THEME_PRESETS).map(([k, t]) => (
              <option key={k} value={k}>
                {t.name}
              </option>
            ))}
          </select>
          <span className="text-slate-400">{Math.round(morphRatio * 100)}%</span>
        </div>

        {/* Brand Lock Toggle (Section 74) */}
        <button
          onClick={() => setBrandLockEnabled(!brandLockEnabled)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
            brandLockEnabled
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
          title="Brand Safety Lock protects logo, primary brand colors, and essential assets"
        >
          {brandLockEnabled ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          {brandLockEnabled ? 'Brand Lock ON' : 'Brand Lock OFF'}
        </button>

        {/* Compatibility Score Badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400"
          title={compatibility.recommendation}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Compat: {compatibility.score}%</span>
        </div>
      </div>
    </div>
  );
};
