import React, { useState } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { AD_SAMPLE_PRESETS, applyAdSampleToCampaign, AdSamplePreset } from '../../data/adSamples';
import { Sparkles, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';

export const AdSamplePicker: React.FC = () => {
  const { campaign, setCampaign, reevaluateLayout } = useAdaptXStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSelectSample = (preset: AdSamplePreset) => {
    const updated = applyAdSampleToCampaign(campaign, preset);
    setCampaign(updated);
    reevaluateLayout();
  };

  return (
    <div className="bg-[#FFFDF5] border-3 border-black rounded-3xl p-3 sm:p-4 shadow-[5px_5px_0px_#000000] space-y-2.5 transition-all">
      {/* Header bar with title, counter & collapse toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#B5A8F7] border-2 border-black text-black shadow-[2px_2px_0px_#000]">
            <Sparkles className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <h3 className="font-black text-xs text-black uppercase tracking-wider font-mono flex items-center gap-2">
              AD SAMPLE PRESETS
            </h3>
            <p className="text-[10px] text-slate-700 font-medium hidden sm:block">
              Click any sample below to instantly load product images, copy, colors, and layout configurations!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-black bg-[#B5A8F7] text-black border-2 border-black px-2 py-0.5 rounded-lg shadow-[1px_1px_0px_#000]">
            {AD_SAMPLE_PRESETS.length} Presets Available
          </span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 bg-[#F5EFFE] hover:bg-[#EBE2FE] border-2 border-black rounded-lg text-black transition-colors shadow-[1px_1px_0px_#000] cursor-pointer"
            title={isCollapsed ? 'Expand Ad Sample Presets' : 'Collapse Ad Sample Presets'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4 stroke-[3]" /> : <ChevronUp className="w-4 h-4 stroke-[3]" />}
          </button>
        </div>
      </div>

      {/* Grid of Preset Cards */}
      {!isCollapsed && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          {AD_SAMPLE_PRESETS.map((preset) => {
            const isActive = campaign.id === preset.id || campaign.name.includes(preset.name.split(' ')[0]);
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectSample(preset)}
                className={`p-2 rounded-2xl border-2 text-left transition-all flex flex-col justify-between relative group cursor-pointer shadow-[2px_2px_0px_#000] ${
                  isActive
                    ? 'bg-[#FFC72C] border-black text-black ring-2 ring-black scale-[1.02] shadow-[3px_3px_0px_#000]'
                    : 'bg-white border-black text-black hover:bg-[#F5EFFE] hover:scale-[1.01]'
                }`}
              >
                {/* Product Thumbnail background overlay */}
                <div className="relative h-12 sm:h-14 w-full rounded-xl overflow-hidden border border-black mb-1.5 shadow-[1px_1px_0px_#000]">
                  <img
                    src={preset.productImageUrl}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1 left-1 bg-black/80 text-white px-1.5 py-0.5 rounded text-[9px] font-mono font-bold backdrop-blur-xs flex items-center gap-1">
                    <span>{preset.icon}</span>
                  </div>
                  {isActive && (
                    <div className="absolute top-1 right-1 bg-[#48BB78] text-black p-0.5 rounded-full border border-black shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-[9px] font-mono font-bold text-slate-700 uppercase tracking-tight truncate">
                    {preset.category}
                  </div>
                  <h4 className="font-black text-[11px] leading-tight text-black line-clamp-1 uppercase mt-0.5">
                    {preset.name.split('—')[0]}
                  </h4>
                </div>

                {/* Color Palette Indicator */}
                <div className="flex items-center gap-1 mt-1.5 pt-1 border-t border-black/20">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black inline-block"
                    style={{ backgroundColor: preset.brandColors.primary }}
                    title="Primary Color"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black inline-block"
                    style={{ backgroundColor: preset.brandColors.background }}
                    title="Background Color"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black inline-block"
                    style={{ backgroundColor: preset.brandColors.accent }}
                    title="Accent Color"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
