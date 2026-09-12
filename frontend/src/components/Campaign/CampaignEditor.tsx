import React, { useState } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { CompressionLevel } from '../../models/campaign';
import { VIBE_STYLES } from '../../utils/vibeStyles';
import { Sliders, Image as ImageIcon, Type, Sparkles, Target, ChevronDown, ChevronUp, Palette, Tag, RotateCcw, Scissors, Plus, Trash2, Save, Download, Film } from 'lucide-react';
import { exportAdCanvasAsPng } from '../../utils/exportAdCanvas';
import { exportVideoAdAsMp4 } from '../../utils/exportVideoAd';
import { VIDEO_AD_PRESETS } from '../../data/videoAdSamples';

const FONT_OPTIONS = [
  { value: '"Plus Jakarta Sans", "Inter", sans-serif', label: 'Inter / Plus Jakarta' },
  { value: '"Syne", "Arial Black", sans-serif', label: 'Syne (Avant-Garde)' },
  { value: '"Space Grotesk", sans-serif', label: 'Space Grotesk (Tech)' },
  { value: '"Bebas Neue", "Impact", sans-serif', label: 'Bebas Neue (Poster)' },
  { value: '"Montserrat", "Arial Black", sans-serif', label: 'Montserrat (Heavy Geo)' },
  { value: '"Cinzel", "Playfair Display", serif', label: 'Cinzel (Luxury Serif)' },
  { value: '"Playfair Display", "Georgia", serif', label: 'Playfair (Editorial Serif)' },
  { value: '"Georgia", serif', label: 'Georgia (Classic Serif)' },
  { value: '"Abril Fatface", cursive', label: 'Abril Fatface (Heavy)' },
  { value: '"Orbitron", monospace', label: 'Orbitron (Cyberpunk)' },
  { value: '"Press Start 2P", monospace', label: 'Press Start (8-Bit)' },
  { value: '"JetBrains Mono", monospace', label: 'JetBrains Mono (Code)' },
  { value: '"Caveat", cursive', label: 'Caveat (Handwritten)' },
  { value: '"Permanent Marker", cursive', label: 'Permanent Marker (Brush)' },
  { value: '"Pacifico", cursive', label: 'Pacifico (Cursive Script)' },
  { value: '"Fredoka", sans-serif', label: 'Fredoka (Soft Rounded)' },
  { value: '"Oswald", sans-serif', label: 'Oswald (Tall Compact)' },
  { value: '"DM Sans", sans-serif', label: 'DM Sans (Minimalist)' },
  { value: '"Arial Black", "Impact", sans-serif', label: 'Arial Black (Heavy)' },
  { value: '"Outfit", "Plus Jakarta Sans", sans-serif', label: 'Outfit (Geometric)' },
];

export const CampaignEditor: React.FC = () => {
  const { campaign, updateAsset, updateConstraint, setCopyMode, websiteVibe, userElementOverrides, resetUserElementOverrides, selectedCandidate, activeSurface, saveCurrentVersion, adMode, activeVideoAdId } = useAdaptXStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [videoExportStatus, setVideoExportStatus] = useState('');
  const vibe = VIBE_STYLES[websiteVibe] || VIBE_STYLES.organic_pastel;
  const isClean = false;

  const handleFocalPointClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = parseFloat(((e.clientX - rect.left) / rect.width).toFixed(2));
    const y = parseFloat(((e.clientY - rect.top) / rect.height).toFixed(2));
    updateAsset('focalPoint', { x, y });
  };

  return (
    <div className={`h-full flex flex-col ${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-3xl overflow-hidden`}>
      {/* Editor Header */}
      <div className={`p-4 border-b-2 border-black flex items-center justify-between bg-[#FFC72C] select-none shrink-0`}>
        <h2 className="font-black text-black text-sm uppercase tracking-wide flex items-center gap-2">
          <Sliders className={`w-4 h-4 ${isClean ? 'text-purple-600 stroke-[2.5]' : 'text-black stroke-[3]'}`} />
          Campaign Copy & Product Assets
        </h2>
        <span className={isClean ? 'text-[10px] font-bold bg-purple-200/80 text-purple-900 border border-purple-300 px-2.5 py-0.5 rounded-lg shadow-2xs' : 'text-[10px] font-mono font-black bg-[#EF4444] text-white border-2 border-black px-2.5 py-0.5 rounded-lg shadow-[2px_2px_0px_#000000] flex items-center gap-1.5'}>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          LIVE SYNC
        </span>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">
        {/* Global Quick Action Bar: Save & Download (PNG or MP4 Video) */}
        <div className="grid grid-cols-2 gap-2 pb-1">
          <button
            type="button"
            onClick={() => {
              saveCurrentVersion('Editor Manual Snapshot');
              setSavedToast(true);
              setTimeout(() => setSavedToast(false), 2000);
            }}
            className="py-2 px-3 bg-[#4ADE80] hover:bg-emerald-400 text-black font-black text-xs uppercase rounded-xl border-2 border-black flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000000] cursor-pointer transition-all"
          >
            <Save className="w-4 h-4 stroke-[3]" />
            <span>{savedToast ? 'Saved!' : 'Save'}</span>
          </button>

          {adMode === 'video' ? (
            <button
              type="button"
              disabled={isExportingVideo}
              onClick={async () => {
                const selectedVideoAd = VIDEO_AD_PRESETS.find(v => v.id === activeVideoAdId) || VIDEO_AD_PRESETS[0];
                setIsExportingVideo(true);
                setVideoExportStatus('0%');
                try {
                  await exportVideoAdAsMp4(selectedVideoAd, activeSurface, campaign, (pct) => {
                    setVideoExportStatus(`${Math.round(pct)}%`);
                  });
                } catch (err) {
                  console.error('Video Export Error:', err);
                } finally {
                  setIsExportingVideo(false);
                  setVideoExportStatus('');
                }
              }}
              className="py-2 px-3 bg-[#FF4500] hover:bg-orange-500 text-white font-black text-xs uppercase rounded-xl border-2 border-black flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000000] cursor-pointer transition-all disabled:opacity-80"
              title="Record and download commercial video as MP4 / WebM (12s - 15s)"
            >
              <Film className={`w-4 h-4 stroke-[3] ${isExportingVideo ? 'animate-spin' : ''}`} />
              <span>{isExportingVideo ? `Video (${videoExportStatus})` : 'Download MP4'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (selectedCandidate) {
                  exportAdCanvasAsPng(selectedCandidate, activeSurface, campaign);
                }
              }}
              className="py-2 px-3 bg-[#38BDF8] hover:bg-sky-400 text-black font-black text-xs uppercase rounded-xl border-2 border-black flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000000] cursor-pointer transition-all"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Download PNG</span>
            </button>
          )}
        </div>

        {/* Campaign Name */}
        <div className="space-y-1">
          <label className="font-black text-black block text-xs uppercase tracking-wide">
            Campaign Name
          </label>
          <input
            type="text"
            value={campaign.name}
            onChange={(e) => useAdaptXStore.setState({ campaign: { ...campaign, name: e.target.value } })}
            className="w-full bg-[#FAF7F2] border-2 border-black rounded-xl p-2.5 text-black focus:bg-yellow-50 focus:outline-none text-xs font-black shadow-[2px_2px_0px_#000000]"
          />
        </div>

        {/* Headline */}
        <div className="space-y-1">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <label className="font-black text-black flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <Type className="w-4 h-4 text-black stroke-[3]" />
              Headline Copy
            </label>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
              <div className="flex items-center gap-1">
                <span>Font:</span>
                <select
                  value={campaign.assets.headlineFontFamily || campaign.assets.fontFamily}
                  onChange={(e) => updateAsset('headlineFontFamily', e.target.value)}
                  className="bg-white border-2 border-black rounded px-1.5 py-0.5 text-[10px] font-black cursor-pointer shadow-[1px_1px_0px_#000] max-w-[110px] truncate focus:outline-none"
                  title="Headline Font Family"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <span>Color:</span>
                <input
                  type="color"
                  value={campaign.assets.headlineColor || '#000000'}
                  onChange={(e) => updateAsset('headlineColor', e.target.value)}
                  className="w-5 h-5 rounded border border-black cursor-pointer"
                  title="Headline Font Color"
                />
              </div>
              <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
                <span>Size:</span>
                <button
                  type="button"
                  onClick={() => updateAsset('headlineFontSize', Math.max(12, (campaign.assets.headlineFontSize || 24) - 2))}
                  className="w-4 h-4 flex items-center justify-center bg-slate-100 hover:bg-amber-200 border border-black rounded text-[11px] font-black cursor-pointer"
                  title="Decrease Headline Size"
                >
                  -
                </button>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={campaign.assets.headlineFontSize || 24}
                  onChange={(e) => updateAsset('headlineFontSize', Number(e.target.value))}
                  className="w-14 accent-[#FFB000] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => updateAsset('headlineFontSize', Math.min(72, (campaign.assets.headlineFontSize || 24) + 2))}
                  className="w-4 h-4 flex items-center justify-center bg-slate-100 hover:bg-amber-200 border border-black rounded text-[11px] font-black cursor-pointer"
                  title="Increase Headline Size"
                >
                  +
                </button>
                <span className="bg-[#FFB000] text-black px-1 py-0.2 rounded border border-black font-black">
                  {campaign.assets.headlineFontSize || 24}px
                </span>
              </div>
            </div>
          </div>
          <textarea
            value={campaign.assets.headline}
            onChange={(e) => updateAsset('headline', e.target.value)}
            rows={2}
            className="w-full bg-[#FAF7F2] border-2 border-black rounded-xl p-2.5 text-black focus:bg-yellow-50 focus:outline-none text-xs font-bold leading-relaxed shadow-[2px_2px_0px_#000000]"
          />
        </div>

        {/* Call To Action (CTA) Text */}
        <div className="space-y-1">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <label className="font-black text-black flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <Tag className="w-4 h-4 text-black stroke-[3]" />
              Call To Action (CTA) Text
            </label>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
              <div className="flex items-center gap-1">
                <span>Font:</span>
                <select
                  value={campaign.assets.ctaFontFamily || campaign.assets.fontFamily}
                  onChange={(e) => updateAsset('ctaFontFamily', e.target.value)}
                  className="bg-white border-2 border-black rounded px-1.5 py-0.5 text-[10px] font-black cursor-pointer shadow-[1px_1px_0px_#000] max-w-[110px] truncate focus:outline-none"
                  title="CTA Font Family"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <span>Color:</span>
                <input
                  type="color"
                  value={campaign.assets.ctaTextColor || '#000000'}
                  onChange={(e) => updateAsset('ctaTextColor', e.target.value)}
                  className="w-5 h-5 rounded border border-black cursor-pointer"
                  title="CTA Text Color"
                />
              </div>
              <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
                <span>Size:</span>
                <button
                  type="button"
                  onClick={() => updateAsset('ctaFontSize', Math.max(10, (campaign.assets.ctaFontSize || 15) - 1))}
                  className="w-4 h-4 flex items-center justify-center bg-slate-100 hover:bg-amber-200 border border-black rounded text-[11px] font-black cursor-pointer"
                  title="Decrease CTA Size"
                >
                  -
                </button>
                <input
                  type="range"
                  min="10"
                  max="36"
                  value={campaign.assets.ctaFontSize || 15}
                  onChange={(e) => updateAsset('ctaFontSize', Number(e.target.value))}
                  className="w-14 accent-[#FFB000] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => updateAsset('ctaFontSize', Math.min(36, (campaign.assets.ctaFontSize || 15) + 1))}
                  className="w-4 h-4 flex items-center justify-center bg-slate-100 hover:bg-amber-200 border border-black rounded text-[11px] font-black cursor-pointer"
                  title="Increase CTA Size"
                >
                  +
                </button>
                <span className="bg-[#FFB000] text-black px-1 py-0.2 rounded border border-black font-black">
                  {campaign.assets.ctaFontSize || 15}px
                </span>
              </div>
            </div>
          </div>
          <input
            type="text"
            value={campaign.assets.ctaText}
            onChange={(e) => updateAsset('ctaText', e.target.value)}
            className="w-full bg-[#FAF7F2] border-2 border-black rounded-xl p-2.5 text-black focus:bg-yellow-50 focus:outline-none text-xs font-black shadow-[2px_2px_0px_#000000]"
          />
        </div>

        {/* CTA Button Shape & Font Options */}
        <div className="grid grid-cols-2 gap-3 bg-[#FAF7F2] p-3 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000000]">
          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-black block mb-1">CTA Button Shape</label>
            <select
              value={campaign.constraints.ctaStyle || 'solid'}
              onChange={(e) => updateConstraint('ctaStyle', e.target.value)}
              className="w-full bg-white border-2 border-black rounded-xl p-1.5 text-black font-black text-xs focus:outline-none shadow-[1px_1px_0px_#000] cursor-pointer"
            >
              <option value="solid">Solid Box</option>
              <option value="pill">Pill Shape</option>
              <option value="outline">Outline</option>
              <option value="gradient">Gradient Glow</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-black block mb-1">Font Family Style</label>
            <select
              value={campaign.assets.fontFamily}
              onChange={(e) => updateAsset('fontFamily', e.target.value)}
              className="w-full bg-white border-2 border-black rounded-xl p-1.5 text-black font-black text-xs focus:outline-none shadow-[1px_1px_0px_#000] cursor-pointer"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Focal Point Picker */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-black text-black flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <ImageIcon className="w-4 h-4 text-black stroke-[3]" />
              Product Focal Point
            </label>
            <span className="text-[10px] font-mono text-black bg-[#FFB000] px-2 py-0.5 rounded-lg border-2 border-black font-black shadow-[2px_2px_0px_#000000]">
              ({campaign.assets.focalPoint.x.toFixed(2)}, {campaign.assets.focalPoint.y.toFixed(2)})
            </span>
          </div>

          <div
            onClick={handleFocalPointClick}
            className="relative rounded-2xl overflow-hidden border-3 border-black cursor-crosshair group shadow-[3px_3px_0px_#000000] bg-white"
          >
            <img
              src={campaign.assets.productImageUrl}
              alt="Product"
              className="w-full h-28 object-cover"
            />
            <div
              className="absolute w-6 h-6 border-2 border-black rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center bg-[#FFB000] shadow-[2px_2px_0px_#000000]"
              style={{
                left: `${campaign.assets.focalPoint.x * 100}%`,
                top: `${campaign.assets.focalPoint.y * 100}%`,
              }}
            >
              <Target className="w-3.5 h-3.5 text-black stroke-[3]" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-md border-t-2 border-black p-1 text-[10px] text-center text-black font-black uppercase">
              Click image to set focal target
            </div>
          </div>
        </div>

        {/* Shape Cut Feature (Product Mask) Selector - Shown ONLY for Static Ads */}
        {adMode !== 'video' && (
          <div className="space-y-1.5 bg-[#FAF7F2] p-3 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000000]">
            <label className="font-black text-black flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <Scissors className="w-4 h-4 text-black stroke-[3]" />
              Shape Cut Feature (Product Mask)
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'none', label: 'Full Photo', icon: '⬛' },
                { id: 'circle', label: 'Oval Cut', icon: '⭕' },
                { id: 'arch', label: 'Arch Cut', icon: '🏛️' },
                { id: 'diamond', label: 'Diamond', icon: '🔷' },
                { id: 'hexagon', label: 'Hexagon', icon: '⬡' },
                { id: 'card', label: 'Card Cut', icon: '💳' },
              ].map((shape) => {
                const isSelected = (campaign.assets.productShapeCut || 'none') === shape.id;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() => updateAsset('productShapeCut', shape.id)}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-black uppercase border-2 border-black flex flex-col items-center gap-0.5 transition-all shadow-[1px_1px_0px_#000] cursor-pointer ${
                      isSelected ? 'bg-[#FFB000] text-black ring-2 ring-black scale-[1.02]' : 'bg-white text-slate-800 hover:bg-amber-100'
                    }`}
                  >
                    <span className="text-sm">{shape.icon}</span>
                    <span>{shape.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Movable Text Box Overlay Control */}
        <div className="space-y-2 bg-[#FAF7F2] p-3 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000000]">
          <label className="font-black text-black flex items-center gap-1.5 text-xs uppercase tracking-wide">
            <Type className="w-4 h-4 text-black stroke-[3]" />
            Custom Movable Text Callout Box
          </label>

          <button
            type="button"
            onClick={() => {
              const currentList = campaign.assets.customElements || [];
              const newElem = {
                id: `txt_${Date.now()}`,
                type: 'text' as const,
                content: 'SPECIAL OFFER',
                x: 40 + (currentList.length % 5) * 20,
                y: 100 + (currentList.length % 5) * 25,
                fontSize: 18,
                color: '#000000',
              };
              updateAsset('customElements', [...currentList, newElem]);
            }}
            className="w-full py-2 px-3 bg-[#4ADE80] hover:bg-emerald-400 text-black border-2 border-black rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_#000000] cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> + Add Movable Text Box
          </button>

          {/* Active Movable Text Boxes Editors List */}
          {(campaign.assets.customElements || []).filter(e => e.type === 'text').length > 0 && (
            <div className="space-y-2 pt-1">
              {(campaign.assets.customElements || []).filter(e => e.type === 'text').map((item) => (
                <div key={item.id} className="bg-white p-2.5 rounded-xl border-2 border-black space-y-2 shadow-[1px_1px_0px_#000]">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.content}
                      onChange={(e) => {
                        const updatedList = (campaign.assets.customElements || []).map(el =>
                          el.id === item.id ? { ...el, content: e.target.value } : el
                        );
                        updateAsset('customElements', updatedList);
                      }}
                      className="flex-1 bg-[#FAF7F2] border-2 border-black rounded-lg px-2 py-1 text-xs font-black text-black focus:outline-none"
                      placeholder="Enter text callout..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedList = (campaign.assets.customElements || []).filter(e => e.id !== item.id);
                        updateAsset('customElements', updatedList);
                      }}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-lg border-2 border-black cursor-pointer shrink-0"
                      title="Delete text box"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                    <div className="flex items-center gap-1">
                      <span>Color:</span>
                      <input
                        type="color"
                        value={item.color || '#000000'}
                        onChange={(e) => {
                          const updatedList = (campaign.assets.customElements || []).map(el =>
                            el.id === item.id ? { ...el, color: e.target.value } : el
                          );
                          updateAsset('customElements', updatedList);
                        }}
                        className="w-4 h-4 rounded border border-black cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Size:</span>
                      <input
                        type="range"
                        min="10"
                        max="48"
                        value={item.fontSize || 18}
                        onChange={(e) => {
                          const updatedList = (campaign.assets.customElements || []).map(el =>
                            el.id === item.id ? { ...el, fontSize: Number(e.target.value) } : el
                          );
                          updateAsset('customElements', updatedList);
                        }}
                        className="w-16 accent-[#FFB000] cursor-pointer"
                      />
                      <span className="bg-[#FFB000] text-black px-1 py-0.2 rounded border border-black font-black">
                        {item.fontSize || 18}px
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Options Accordion Toggle */}
        <div className="pt-1">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full py-2 px-3 bg-[#FAF7F2] border-2 border-black rounded-xl flex items-center justify-between text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000]"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              More Options (Description, Legal & Colors)
            </span>
            {showAdvanced ? <ChevronUp className="w-4 h-4 stroke-[3]" /> : <ChevronDown className="w-4 h-4 stroke-[3]" />}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-3 bg-[#FAF7F2] border-2 border-black rounded-2xl space-y-3 shadow-[2px_2px_0px_#000000]">
              {/* Description */}
              <div className="space-y-1">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="font-black text-black block text-[11px] uppercase">Description Copy</label>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
                    <div className="flex items-center gap-1">
                      <span>Font:</span>
                      <select
                        value={campaign.assets.descriptionFontFamily || campaign.assets.fontFamily}
                        onChange={(e) => updateAsset('descriptionFontFamily', e.target.value)}
                        className="bg-white border-2 border-black rounded px-1.5 py-0.5 text-[10px] font-black cursor-pointer shadow-[1px_1px_0px_#000] max-w-[110px] truncate focus:outline-none"
                        title="Description Font Family"
                      >
                        {FONT_OPTIONS.map((f) => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Color:</span>
                      <input
                        type="color"
                        value={campaign.assets.descriptionColor || '#1E293B'}
                        onChange={(e) => updateAsset('descriptionColor', e.target.value)}
                        className="w-4 h-4 rounded border border-black cursor-pointer"
                        title="Description Font Color"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
                      <span>Size:</span>
                      <button
                        type="button"
                        onClick={() => updateAsset('descriptionFontSize', Math.max(8, (campaign.assets.descriptionFontSize || 14) - 1))}
                        className="w-4 h-4 flex items-center justify-center bg-slate-100 hover:bg-amber-200 border border-black rounded text-[11px] font-black cursor-pointer"
                        title="Decrease Description Size"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="8"
                        max="36"
                        value={campaign.assets.descriptionFontSize || 14}
                        onChange={(e) => updateAsset('descriptionFontSize', Number(e.target.value))}
                        className="w-12 accent-[#FFB000] cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => updateAsset('descriptionFontSize', Math.min(36, (campaign.assets.descriptionFontSize || 14) + 1))}
                        className="w-4 h-4 flex items-center justify-center bg-slate-100 hover:bg-amber-200 border border-black rounded text-[11px] font-black cursor-pointer"
                        title="Increase Description Size"
                      >
                        +
                      </button>
                      <span className="bg-white text-black px-1 py-0.2 rounded border border-black font-black">
                        {campaign.assets.descriptionFontSize || 14}px
                      </span>
                    </div>
                  </div>
                </div>
                <textarea
                  value={campaign.assets.description}
                  onChange={(e) => updateAsset('description', e.target.value)}
                  rows={2}
                  className="w-full bg-white border-2 border-black rounded-xl p-2 text-black focus:outline-none text-xs font-semibold shadow-[1px_1px_0px_#000000]"
                />
              </div>

              {/* Legal Disclaimer */}
              <div className="space-y-1">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="font-black text-black block text-[11px] uppercase">Legal Disclaimer Copy</label>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
                    <div className="flex items-center gap-1">
                      <span>Font:</span>
                      <select
                        value={campaign.assets.legalFontFamily || campaign.assets.fontFamily}
                        onChange={(e) => updateAsset('legalFontFamily', e.target.value)}
                        className="bg-white border-2 border-black rounded px-1.5 py-0.5 text-[10px] font-black cursor-pointer shadow-[1px_1px_0px_#000] max-w-[110px] truncate focus:outline-none"
                        title="Legal Copy Font Family"
                      >
                        {FONT_OPTIONS.map((f) => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Color:</span>
                      <input
                        type="color"
                        value={campaign.assets.legalColor || '#000000'}
                        onChange={(e) => updateAsset('legalColor', e.target.value)}
                        className="w-4 h-4 rounded border border-black cursor-pointer"
                        title="Legal Copy Color"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
                      <span>Size:</span>
                      <button
                        type="button"
                        onClick={() => updateAsset('legalFontSize', Math.max(6, (campaign.assets.legalFontSize || 9) - 1))}
                        className="w-4 h-4 flex items-center justify-center bg-slate-100 hover:bg-amber-200 border border-black rounded text-[11px] font-black cursor-pointer"
                        title="Decrease Legal Size"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="6"
                        max="24"
                        value={campaign.assets.legalFontSize || 9}
                        onChange={(e) => updateAsset('legalFontSize', Number(e.target.value))}
                        className="w-12 accent-[#FFB000] cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => updateAsset('legalFontSize', Math.min(24, (campaign.assets.legalFontSize || 9) + 1))}
                        className="w-4 h-4 flex items-center justify-center bg-slate-100 hover:bg-amber-200 border border-black rounded text-[11px] font-black cursor-pointer"
                        title="Increase Legal Size"
                      >
                        +
                      </button>
                      <span className="bg-white text-black px-1 py-0.2 rounded border border-black font-black">
                        {campaign.assets.legalFontSize || 9}px
                      </span>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  value={campaign.assets.legalText}
                  onChange={(e) => updateAsset('legalText', e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl p-2 text-black font-mono text-[11px] font-bold shadow-[1px_1px_0px_#000000]"
                />
              </div>

              {/* Logo Width Size Control */}
              <div className="space-y-1">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="font-black text-black block text-[11px] uppercase">Brand Logo Width</label>
                  <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border-2 border-black shadow-[1px_1px_0px_#000]">
                    <span>Size:</span>
                    <button
                      type="button"
                      onClick={() => updateAsset('logoWidth', Math.max(40, (campaign.assets.logoWidth || 120) - 10))}
                      className="w-4 h-4 flex items-center justify-center bg-slate-100 hover:bg-amber-200 border border-black rounded text-[11px] font-black cursor-pointer"
                      title="Decrease Logo Width"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="40"
                      max="300"
                      value={campaign.assets.logoWidth || 120}
                      onChange={(e) => updateAsset('logoWidth', Number(e.target.value))}
                      className="w-14 accent-[#FFB000] cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => updateAsset('logoWidth', Math.min(300, (campaign.assets.logoWidth || 120) + 10))}
                      className="w-4 h-4 flex items-center justify-center bg-slate-100 hover:bg-amber-200 border border-black rounded text-[11px] font-black cursor-pointer"
                      title="Increase Logo Width"
                    >
                      +
                    </button>
                    <span className="bg-[#FFB000] text-black px-1 py-0.2 rounded border border-black font-black text-[10px]">
                      {campaign.assets.logoWidth || 120}px
                    </span>
                  </div>
                </div>
              </div>

              {/* Brand Primary Color & Spatial Constraints (2 Boxes in a row) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between bg-white p-2 rounded-xl border-2 border-black shadow-[1px_1px_0px_#000]">
                  <span className="font-black text-black text-[11px] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    Primary Color
                  </span>
                  <input
                    type="color"
                    value={campaign.assets.brandColors.primary}
                    onChange={(e) =>
                      updateAsset('brandColors', {
                        ...campaign.assets.brandColors,
                        primary: e.target.value,
                      })
                    }
                    className="w-6 h-6 rounded border-2 border-black cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between bg-white p-2 rounded-xl border-2 border-black shadow-[1px_1px_0px_#000]">
                  <span className="font-black text-black text-[11px] uppercase">
                    Safe Margin
                  </span>
                  <span className="font-mono text-xs font-black text-black bg-[#FFB000] px-2 py-0.5 rounded border border-black">
                    {campaign.constraints.safeMargins}px
                  </span>
                </div>
              </div>

              {/* Copy Compression Mode */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setCopyMode('exact')}
                  className={`py-1.5 px-2 rounded-xl font-black border-2 border-black text-center text-xs uppercase ${
                    campaign.copyMode === 'exact'
                      ? 'bg-[#FFB000] text-black shadow-[2px_2px_0px_#000000]'
                      : 'bg-white text-slate-800'
                  }`}
                >
                  Exact Copy
                </button>
                <button
                  onClick={() => setCopyMode('adaptive')}
                  className={`py-1.5 px-2 rounded-xl font-black border-2 border-black text-center text-xs uppercase ${
                    campaign.copyMode === 'adaptive'
                      ? 'bg-[#FFB000] text-black shadow-[2px_2px_0px_#000000]'
                      : 'bg-white text-slate-800'
                  }`}
                >
                  Adaptive Copy
                </button>
              </div>

              {campaign.copyMode === 'adaptive' && (
                <div>
                  <label className="text-[10px] text-black block mb-1 font-mono font-bold uppercase">
                    Compression Level:
                  </label>
                  <select
                    value={campaign.compressionLevel}
                    onChange={(e) => setCopyMode('adaptive', e.target.value as CompressionLevel)}
                    className="w-full bg-white border-2 border-black rounded-xl p-2 text-black font-mono text-xs font-black shadow-[1px_1px_0px_#000000]"
                  >
                    <option value="Original">Level 1: Original Full Text</option>
                    <option value="Compact">Level 2: Compact Condensed</option>
                    <option value="Extreme">Level 3: Extreme Micro-Copy</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {Object.keys(userElementOverrides || {}).length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => resetUserElementOverrides()}
              className="w-full py-2 px-3 bg-rose-100 hover:bg-rose-200 border-2 border-black rounded-xl text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000000] cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Cursor Layout Overrides ({Object.keys(userElementOverrides).length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
