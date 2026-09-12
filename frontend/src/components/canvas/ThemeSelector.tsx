import React from 'react';
import { useCanvasStore, CanvasTheme } from '../../store/useCanvasStore';
import { Palette } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { canvasTheme, setCanvasTheme } = useCanvasStore();

  const themes: { id: CanvasTheme; label: string; color: string }[] = [
    { id: 'obsidian', label: 'Obsidian Blue (Default)', color: '#0f172a' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', color: '#050515' },
    { id: 'slate_light', label: 'Clean Slate Light', color: '#f8fafc' },
    { id: 'dark_charcoal', label: 'Dark Charcoal', color: '#121212' },
    { id: 'blueprint', label: 'Retro Blueprint', color: '#0c2340' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 shadow-2xl">
      <div className="px-2 text-slate-400 text-xs font-semibold flex items-center gap-1">
        <Palette className="w-3.5 h-3.5 text-indigo-400" />
        <span>Theme:</span>
      </div>
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setCanvasTheme(t.id)}
          title={t.label}
          className={`w-6 h-6 rounded-xl border transition-all ${
            canvasTheme === t.id ? 'ring-2 ring-indigo-500 scale-110 border-white' : 'border-slate-700 hover:scale-105'
          }`}
          style={{ backgroundColor: t.color }}
        />
      ))}
    </div>
  );
};
