import React, { useState } from 'react';
import { useAdaptXStore, MotionMode } from '../../store/useAdaptXStore';
import { AD_SAMPLE_PRESETS, applyAdSampleToCampaign, AdSamplePreset } from '../../data/adSamples';
import { VIDEO_AD_PRESETS, VideoAdPreset } from '../../data/videoAdSamples';
import { CANVAS_TEMPLATES, CanvasTemplatePreset } from '../../data/templatesData';
import { THEME_PRESETS, ThemeId } from '../../models/theme';
import { SURFACE_PRESETS, SurfaceDefinition } from '../../models/surface';
import { CampaignEditor } from '../Campaign/CampaignEditor';
import { AdaptiveAdRenderer } from '../canvas/AdaptiveAdRenderer';
import { VideoAdRenderer } from '../canvas/VideoAdRenderer';
import { FullscreenAdModal } from '../canvas/FullscreenAdModal';
import { DeviceRealWorldModal } from '../canvas/DeviceRealWorldModal';
import { MultiSurfaceConceptModal } from '../Explainer/MultiSurfaceConceptModal';
import { VIBE_STYLES } from '../../utils/vibeStyles';
import { RubiksCube3D } from '../common/RubiksCube3D';
import { ProductShowcase3D } from '../common/ProductShowcase3D';
import { RealWorld3DFrame } from '../common/RealWorld3DFrame';
import {
  Search,
  Sparkles,
  Sliders,
  Monitor,
  Smartphone,
  Tv,
  Eye,
  Share2,
  Car,
  Watch,
  Building2,
  Palette,
  Film,
  CheckCircle2,
  ShieldCheck,
  Move,
  Maximize2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Tag,
  Maximize,
  Grid,
  Image as ImageIcon,
  ExternalLink,
  Play,
  Pause,
  Video,
  Box,
} from 'lucide-react';

export const Step1CampaignSetup: React.FC = () => {
  const {
    campaign,
    setCampaign,
    activeSurface,
    setActiveSurface,
    selectedCandidate,
    auditReport,
    nextStep,
    websiteVibe,
    activeThemeId,
    setActiveThemeId,
    isMotionAnimated,
    toggleMotionAnimation,
    motionMode,
    setMotionMode,
    reevaluateLayout,
    adMode,
    setAdMode,
    activeVideoAdId,
    setActiveVideoAdId,
  } = useAdaptXStore();

  const [isDragMode, setIsDragMode] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isRealWorldModalOpen, setIsRealWorldModalOpen] = useState(false);
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [isPosterCubeMode, setIsPosterCubeMode] = useState(false);
  const [areCubesPaused, setAreCubesPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'templates' | 'geometry' | 'motion' | 'setup'>('products');
  const [searchQuery, setSearchQuery] = useState('');

  const vibe = VIBE_STYLES[websiteVibe] || VIBE_STYLES.organic_pastel;
  const isClean = false;

  const selectedVideoAd = VIDEO_AD_PRESETS.find(v => v.id === activeVideoAdId) || VIDEO_AD_PRESETS[0];

  const handleSelectSample = (preset: AdSamplePreset) => {
    const updated = applyAdSampleToCampaign(campaign, preset);
    setCampaign(updated);
    reevaluateLayout();
  };

  const maxCanvasW = 680;
  const maxCanvasH = 580;
  const scaleFactor = Math.min(
    1.0,
    Math.min(maxCanvasW / activeSurface.width, maxCanvasH / activeSurface.height)
  );

  return (
    <div className="flex-1 bg-transparent p-4 md:p-6 overflow-y-auto custom-scrollbar select-none flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full space-y-5">
        {/* Canva-Style Hero Banner with 3D Rubik's Cube Animation */}
        <div className={`rounded-3xl p-6 md:p-8 text-center relative overflow-hidden transition-all shadow-md ${
          isClean
            ? 'bg-gradient-to-r from-purple-100 via-indigo-50 to-blue-100 border border-purple-200/80'
            : 'bg-[#FFC72C] border-3 border-black shadow-[6px_6px_0px_#000000] text-black'
        }`}>
          {/* Pause / Play Controls for 3D Rubik's Cubes */}
          <button
            onClick={() => setAreCubesPaused(!areCubesPaused)}
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-black border-2 border-black bg-white hover:bg-amber-100 text-black shadow-[2.5px_2.5px_0px_#000] transition-all cursor-pointer hover:scale-105 active:scale-95"
            title={areCubesPaused ? "Resume 3D Rubik's cubes animation" : "Pause 3D Rubik's cubes animation"}
          >
            {areCubesPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-black text-black stroke-[2.5]" />
                <span>Play 3D Cubes</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 fill-black text-black stroke-[2.5]" />
                <span>Pause 3D Cubes</span>
              </>
            )}
          </button>

          {/* Floating 3D Rubik's Cube Animation (Left Desktop) */}
          <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-0 opacity-90 hover:opacity-100 transition-all hover:scale-110">
            <RubiksCube3D size={32} isPaused={areCubesPaused} />
          </div>

          {/* Floating 3D Rubik's Cube Animation (Right Desktop) */}
          <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-0 opacity-90 hover:opacity-100 transition-all hover:scale-110">
            <RubiksCube3D size={32} isPaused={areCubesPaused} />
          </div>

          <div className="max-w-3xl mx-auto space-y-3 z-10 relative flex flex-col items-center">
            {/* Mobile / Tablet 3D Rubik's Cube display */}
            <div className="lg:hidden mb-1">
              <RubiksCube3D size={28} isPaused={areCubesPaused} />
            </div>
            <h1 className={`text-2xl md:text-3xl tracking-tight uppercase ${isClean ? 'font-extrabold text-purple-950 font-sans' : 'font-black text-black'}`}>
              What will you compose today?
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
              Pick your product, select design templates, set geometry constraints, customize motion poster effects, and configure campaign setup!
            </p>

            {/* Search Input Bar */}
            <div className="max-w-xl mx-auto pt-2">
              <div className={`flex items-center px-4 py-2.5 rounded-full shadow-sm transition-all ${
                isClean
                  ? 'bg-white border border-purple-200 focus-within:ring-2 focus-within:ring-purple-500'
                  : 'bg-white border-2 border-black shadow-[3px_3px_0px_#000000]'
              }`}>
                <Search className={`w-4 h-4 mr-2.5 shrink-0 ${isClean ? 'text-purple-600' : 'text-black stroke-[3]'}`} />
                <input
                  type="text"
                  placeholder="Search products, templates, geometry, motion, setup..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Primary Ad Mode Selector Bar: [ Static Ads ] [ Video Ads ] */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  setAdMode('static');
                  setActiveTab('products');
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase transition-all cursor-pointer shadow-[3px_3px_0px_#000000] border-2 border-black ${
                  adMode === 'static'
                    ? 'bg-[#FF4500] text-white scale-105 ring-2 ring-black'
                    : 'bg-white text-black hover:bg-amber-100'
                }`}
              >
                <ImageIcon className="w-4 h-4 stroke-[3]" />
                <span>Static Ads</span>
              </button>

              <button
                onClick={() => {
                  setAdMode('video');
                  setActiveTab('products');
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase transition-all cursor-pointer shadow-[3px_3px_0px_#000000] border-2 border-black ${
                  adMode === 'video'
                    ? 'bg-[#FF4500] text-white ring-2 ring-black scale-105 font-black'
                    : 'bg-white text-black hover:bg-amber-100'
                }`}
              >
                <Film className="w-4 h-4 stroke-[3]" />
                <span>Video Ads</span>
              </button>
            </div>

            {/* Secondary Sub-Category Shortcuts: Displayed ALWAYS below Primary Toggle */}
            <div className="flex items-center justify-center gap-1.5 pt-3 flex-nowrap overflow-x-auto custom-scrollbar max-w-full pb-1 animate-fade-in">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    activeTab === 'products'
                      ? 'bg-[#FF4500] text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                      : 'bg-white text-black border-2 border-black hover:bg-amber-100'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Products</span>
                </button>

                <button
                  onClick={() => setActiveTab('geometry')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    activeTab === 'geometry'
                      ? 'bg-[#FF4500] text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                      : 'bg-white text-black border-2 border-black hover:bg-amber-100'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Geometry</span>
                </button>

                <button
                  onClick={() => setActiveTab('templates')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    activeTab === 'templates'
                      ? 'bg-[#FF4500] text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                      : 'bg-white text-black border-2 border-black hover:bg-amber-100'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Templates</span>
                </button>

                {adMode !== 'video' && (
                  <button
                    onClick={() => setActiveTab('motion')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                      activeTab === 'motion'
                        ? 'bg-[#FF4500] text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                        : 'bg-white text-black border-2 border-black hover:bg-amber-100'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Motion Mode</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('setup')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    activeTab === 'setup'
                      ? 'bg-[#FF4500] text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                      : 'bg-white text-black border-2 border-black hover:bg-amber-100'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Setup</span>
                </button>
              </div>
          </div>
        </div>

        {/* Multi-Surface Concept Banner */}
        <div className="bg-[#B5A8F7] border-3 border-black p-4 rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-3 text-black">
          <div className="flex items-center gap-3">
            <div className="bg-white border-2 border-black p-2.5 rounded-2xl shadow-[2px_2px_0px_#000] shrink-0">
              <Sparkles className="w-5 h-5 text-black stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase bg-[#FFC72C] border border-black px-2 py-0.5 rounded text-black">
                  Multi-Surface Adaptive Engine
                </span>
              </div>
              <p className="text-xs font-black text-black mt-1 leading-snug">
                One campaign automatically adapted into unique compositions for Mobile, Desktop, Social, TV, Highway Billboard, In-Car, & Wearables!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowConceptModal(true)}
            className="px-4 py-2 bg-[#FFC72C] hover:bg-yellow-400 border-2 border-black rounded-xl text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000] transition-all cursor-pointer shrink-0 hover:scale-105"
          >
            Concept Guide & Matrix
          </button>
        </div>

        {/* Main Step 1 Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Interactive Tab Panels (Products, Geometry, Templates, Motion, Setup) or Video Ads */}
          <div className="lg:col-span-6 space-y-4">
            {activeTab === 'products' && adMode === 'video' && (
              <div className={`${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-3xl p-5 space-y-4 animate-fade-in`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase flex items-center gap-2 font-black text-black tracking-wide">
                    <Film className="w-4 h-4 text-purple-600 stroke-[3]" />
                    <span>Video Commercial Presets</span>
                  </h3>
                  <span className="text-[10px] font-mono font-black bg-[#FFC72C] border-2 border-black px-2.5 py-0.5 rounded-lg text-black shadow-[1.5px_1.5px_0px_#000]">
                    Video Ads
                  </span>
                </div>

                <div className="space-y-3 max-h-[580px] overflow-y-auto custom-scrollbar pr-1">
                  {VIDEO_AD_PRESETS.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase())).map((videoAd) => {
                    const isSelected = activeVideoAdId === videoAd.id;
                    return (
                      <div
                        key={videoAd.id}
                        onClick={() => {
                          setActiveVideoAdId(videoAd.id);
                          const matchingSample = AD_SAMPLE_PRESETS.find(p => p.id === videoAd.id.replace('video-', '')) ||
                            AD_SAMPLE_PRESETS.find(p => videoAd.id.includes(p.id.split('-')[0]));
                          if (matchingSample) {
                            handleSelectSample(matchingSample);
                          }
                        }}
                        className={`p-4 rounded-2xl transition-all cursor-pointer border-3 border-black relative overflow-hidden ${
                          isSelected
                            ? 'bg-[#FFC72C] shadow-[4px_4px_0px_#000000] scale-[1.01]'
                            : 'bg-white hover:bg-amber-50 shadow-[2px_2px_0px_#000000]'
                        }`}
                      >
                        <div className="flex gap-4 items-start">
                          {/* Thumbnail Video Poster */}
                          <div className="w-28 h-24 rounded-xl border-2 border-black overflow-hidden relative shrink-0 bg-slate-900 shadow-sm">
                            <img src={videoAd.productImageUrl} alt={videoAd.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-[#FFC72C] border-2 border-black flex items-center justify-center text-black shadow-sm">
                                <Play className="w-4 h-4 fill-black stroke-[3] ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                              {videoAd.durationSeconds}s
                            </span>
                          </div>

                          {/* Video Info */}
                          <div className="flex-1 space-y-1.5 text-black">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-black uppercase bg-black text-white px-2 py-0.5 rounded">
                                {videoAd.aspectRatio}
                              </span>
                            </div>

                            <h4 className="font-extrabold text-sm uppercase leading-snug">{videoAd.name}</h4>
                            <p className="text-xs font-semibold text-slate-800 line-clamp-2">{videoAd.description}</p>

                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                                {videoAd.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 1. PRODUCTS LIST SECTION (Static Ads) */}
            {activeTab === 'products' && adMode !== 'video' && (
              <div className={`${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-3xl p-5 space-y-3`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs uppercase flex items-center gap-2 tracking-wide ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                    <Tag className="w-4 h-4 text-purple-600" />
                    <span>Select Product Preset</span>
                  </h3>
                  <span className={isClean ? 'text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-lg' : 'text-[10px] font-mono font-black bg-[#B5A8F7] border-2 border-black px-2 py-0.5 rounded-lg text-black'}>
                    {AD_SAMPLE_PRESETS.length} Products
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {AD_SAMPLE_PRESETS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).map((preset) => {
                    const isActive = campaign.id === preset.id || campaign.name.includes(preset.name.split(' ')[0]);
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectSample(preset)}
                        className={`p-3 rounded-2xl text-left transition-all flex flex-col justify-between cursor-pointer ${
                          isClean
                            ? isActive
                              ? 'bg-purple-50/90 border-2 border-purple-600 text-purple-950 shadow-md ring-2 ring-purple-500/20 scale-[1.02]'
                              : 'bg-white border border-slate-200 text-slate-800 hover:border-purple-300 hover:bg-purple-50/30 shadow-2xs'
                            : isActive
                            ? 'bg-[#FFC72C] border-3 border-black text-black ring-2 ring-black shadow-[4px_4px_0px_#000000]'
                            : 'bg-white border-3 border-black text-black hover:bg-[#F5EFFE] shadow-[3px_3px_0px_#000000]'
                        }`}
                      >
                        <div className="relative h-20 w-full rounded-xl overflow-hidden mb-2 border border-slate-200 shadow-2xs">
                          <img src={preset.productImageUrl} alt={preset.name} className="w-full h-full object-cover" />
                          <div className="absolute top-1 left-1 bg-black/80 text-white px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                            {preset.icon}
                          </div>
                          {isActive && (
                            <div className="absolute top-1 right-1 bg-purple-600 text-white p-1 rounded-full shadow-md">
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">{preset.category}</span>
                          <h4 className="font-extrabold text-xs uppercase text-slate-900 truncate mt-0.5">{preset.name.split('—')[0]}</h4>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. GEOMETRY SPATIAL CONSTRAINTS SECTION (2-Boxes Per Row) */}
            {activeTab === 'geometry' && (
              <div className={`${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-3xl p-5 space-y-4`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs uppercase flex items-center gap-2 tracking-wide ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                    <Monitor className="w-4 h-4 text-purple-600" />
                    <span>Display Geometry Constraints</span>
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(SURFACE_PRESETS).map(([key, preset]) => {
                    const isSelected = activeSurface.id === preset.id;
                    return (
                      <div
                        key={key}
                        onClick={() => setActiveSurface(preset)}
                        className={`p-3.5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                          isClean
                            ? isSelected
                              ? 'bg-purple-50/90 border-2 border-purple-600 text-purple-950 shadow-md ring-2 ring-purple-500/20 scale-[1.02]'
                              : 'bg-white border border-slate-200 text-slate-800 hover:border-purple-300 hover:bg-purple-50/30 shadow-2xs'
                            : isSelected
                            ? 'bg-[#48BB78] border-3 border-black text-black ring-2 ring-black shadow-[4px_4px_0px_#000000]'
                            : 'bg-white border-3 border-black text-black hover:bg-[#F5EFFE] shadow-[3px_3px_0px_#000000]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-xl bg-purple-100 text-purple-700">
                              {preset.id === 'vertical_skyscraper' ? (
                                <Building2 className="w-4 h-4 stroke-[2.5]" />
                              ) : preset.id === 'social_square' || preset.category === 'social' ? (
                                <Share2 className="w-4 h-4 stroke-[2.5]" />
                              ) : preset.id === 'in_car_display' || preset.category === 'in_car' ? (
                                <Car className="w-4 h-4 stroke-[2.5]" />
                              ) : preset.id === 'wearable_smartwatch' || preset.category === 'wearable' ? (
                                <Watch className="w-4 h-4 stroke-[2.5]" />
                              ) : preset.category === 'mobile' ? (
                                <Smartphone className="w-4 h-4 stroke-[2.5]" />
                              ) : preset.category === 'tv' ? (
                                <Tv className="w-4 h-4 stroke-[2.5]" />
                              ) : preset.category === 'billboard' ? (
                                <Eye className="w-4 h-4 stroke-[2.5]" />
                              ) : (
                                <Monitor className="w-4 h-4 stroke-[2.5]" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-xs uppercase">{preset.name}</h4>
                              <p className="text-[10px] font-mono text-slate-500">{preset.width} × {preset.height} px</p>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. TEMPLATES SECTION (Matching Canva's Template Gallery) */}
            {activeTab === 'templates' && (
              <div className={`${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-3xl p-5 space-y-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-xs uppercase flex items-center gap-2 tracking-wide ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                      <Palette className="w-4 h-4 text-purple-600" />
                      <span>Inspired By Your Designs — Templates</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Select any poster, presentation, or social media template to instantly load colors, typography & layout!
                    </p>
                  </div>
                  <span className={isClean ? 'text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-lg' : 'text-[10px] font-mono font-black bg-[#FFB000] border-2 border-black px-2 py-0.5 rounded-lg text-black'}>
                    {CANVAS_TEMPLATES.length} Templates
                  </span>
                </div>

                {/* Template Cards Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {CANVAS_TEMPLATES.map((tpl) => {
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => {
                          setActiveThemeId(tpl.themeId);
                          setCampaign({
                            ...campaign,
                            assets: {
                              ...campaign.assets,
                              headline: tpl.headline,
                              description: tpl.subheadline,
                              ctaText: tpl.ctaText,
                              headlineFontFamily: tpl.headlineFontFamily || campaign.assets.headlineFontFamily,
                              headlineFontSize: tpl.headlineFontSize || campaign.assets.headlineFontSize,
                              headlineColor: tpl.headlineColor || campaign.assets.headlineColor,
                              ctaFontFamily: tpl.ctaFontFamily || tpl.headlineFontFamily || campaign.assets.ctaFontFamily,
                              ctaFontSize: tpl.ctaFontSize || campaign.assets.ctaFontSize,
                              ctaTextColor: tpl.ctaTextColor || campaign.assets.ctaTextColor,
                              focalPoint: tpl.focalPoint || campaign.assets.focalPoint,
                              productShapeCut: tpl.productShapeCut || campaign.assets.productShapeCut,
                              brandColors: tpl.brandColors,
                            },
                            constraints: {
                              ...campaign.constraints,
                              ctaStyle: tpl.ctaStyle || campaign.constraints.ctaStyle,
                            }
                          });
                          reevaluateLayout();
                        }}
                        className={`group p-3 rounded-2xl cursor-pointer transition-all flex flex-col justify-between space-y-2 border ${
                          isClean
                            ? 'bg-white border-slate-200 text-slate-800 hover:border-purple-400 hover:shadow-md hover:scale-[1.01]'
                            : 'bg-white border-2 border-black text-black hover:bg-amber-50 shadow-[3px_3px_0px_#000000]'
                        }`}
                      >
                        <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                          <img
                            src={tpl.previewUrl}
                            alt={tpl.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-1.5 right-1.5 bg-purple-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                            {tpl.aspectRatio}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-tight line-clamp-1">{tpl.title}</h4>
                          <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">{tpl.headline}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. MOTION POSTER SECTION */}
            {activeTab === 'motion' && (
              <div className={`${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-3xl p-5 space-y-4`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs uppercase flex items-center gap-2 tracking-wide ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                    <Film className="w-4 h-4 text-purple-600" />
                    <span>Motion Poster Effects</span>
                  </h3>
                  <button
                    onClick={toggleMotionAnimation}
                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      isMotionAnimated ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isMotionAnimated ? 'Motion Enabled' : 'Static Mode'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'static', label: 'Static Poster', desc: 'Clean stationary poster layout' },
                    { id: 'slow_360', label: '360° Slow Orbit', desc: 'Smooth continuous 3D rotation' },
                    { id: 'kinetic_3d', label: '3D Kinetic Float', desc: 'Interactive depth tilt motion' },
                    { id: 'pulse', label: 'Pulse & Glow', desc: 'Dynamic beacon breathing light' },
                    { id: 'shimmer', label: 'Shimmer Glare', desc: 'Glossy ambient light pass' },
                    { id: 'bounce_float', label: 'Bounce & Float', desc: 'Playful spring floating & bobbing' },
                    { id: 'glitch_flicker', label: 'Holographic Glitch', desc: 'High-tech neon Cyberpunk RGB shimmer' },
                    { id: 'zoom_pulse', label: 'Zoom Pulse Depth', desc: 'Rhythmic perspective camera zoom pulse' },
                  ].map((m) => {
                    const isSelected = isMotionAnimated ? motionMode === m.id : m.id === 'static';
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          if (m.id === 'static') {
                            if (isMotionAnimated) toggleMotionAnimation();
                          } else {
                            if (!isMotionAnimated) toggleMotionAnimation();
                            setMotionMode(m.id as MotionMode);
                          }
                        }}
                        className={`p-3.5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between ${
                          isClean
                            ? isSelected
                              ? 'bg-purple-50/90 border-2 border-purple-600 text-purple-950 shadow-md ring-2 ring-purple-500/20 scale-[1.02]'
                              : 'bg-white border border-slate-200 text-slate-800 hover:border-purple-300 hover:bg-purple-50/30 shadow-2xs'
                            : isSelected
                            ? 'bg-[#FFC72C] border-3 border-black text-black ring-2 ring-black shadow-[4px_4px_0px_#000000]'
                            : 'bg-white border-3 border-black text-black hover:bg-amber-100 shadow-[3px_3px_0px_#000000]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-xs uppercase">{m.label}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600 stroke-[3]" />}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 font-medium">{m.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. CAMPAIGN SETUP SECTION */}
            {activeTab === 'setup' && (
              <CampaignEditor />
            )}
          </div>

          {/* Right Column: Prominent Large Live Ad Canvas Preview */}
          <div className={`lg:col-span-6 h-[720px] ${vibe.cardBg} ${vibe.cardBorder} ${vibe.cardShadow} rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden`}>
            {/* Background Grid Accent */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#000000 1.5px, transparent 1.5px)`,
                backgroundSize: '18px 18px',
              }}
            />

            {/* Header / Info bar with Cursor Drag & Fullscreen Buttons */}
            <div className={`flex flex-col items-center justify-center gap-2.5 pb-3 z-10 ${isClean ? 'border-b border-slate-200' : 'border-b-2 border-black'}`}>
              {/* Live Canvas Ad Preview Title & Specs - Centered */}
              <div className="flex items-center justify-center gap-2">
                <div className={isClean ? 'p-1.5 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 shadow-2xs' : 'p-1.5 rounded-lg bg-[#FFB000] border-2 border-black text-black shadow-[2px_2px_0px_#000000]'}>
                  <Monitor className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="text-center">
                  <h3 className={`text-xs uppercase flex items-center justify-center gap-1.5 ${isClean ? 'font-extrabold text-slate-900' : 'font-black text-black'}`}>
                    Live Canvas Ad Preview
                    <span className="w-2 h-2 rounded-full bg-emerald-500 border border-black animate-ping" />
                  </h3>
                  <p className={`text-[10px] font-mono font-bold ${isClean ? 'text-slate-500' : 'text-slate-700'}`}>
                    {activeSurface.name} ({activeSurface.width}×{activeSurface.height}px)
                  </p>
                </div>
              </div>

              {/* Action Buttons: Centered Row, with Fullscreen Icon placed right next to Real Time Preview */}
              <div className="w-full flex items-center justify-center gap-2 flex-wrap">
                {adMode !== 'video' && (
                  <button
                    onClick={() => setIsPosterCubeMode(!isPosterCubeMode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black border-2 border-black flex items-center gap-1.5 uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer whitespace-nowrap shrink-0 ${
                      isPosterCubeMode
                        ? 'bg-[#FF4500] text-white scale-105 ring-2 ring-black'
                        : 'bg-[#FFC72C] hover:bg-yellow-300 text-black'
                    }`}
                    title="Toggle 3D Product Pop-Out Effect inside the poster ad"
                  >
                    <Box className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                    <span className="whitespace-nowrap">{isPosterCubeMode ? '2D Product' : '3D Product Pop-Out'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsDragMode(true);
                    setIsFullscreenOpen(true);
                  }}
                  className={isClean ? 'px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 uppercase transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0' : 'px-3 py-1.5 rounded-xl text-xs font-mono font-black border-2 border-black bg-[#4ADE80] hover:bg-[#22C55E] text-black flex items-center gap-1.5 uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer whitespace-nowrap shrink-0'}
                  title="Open Fullscreen Canvas Editor with mouse cursor drag & resize mode active"
                >
                  <Move className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                  <span className="whitespace-nowrap">Edit using Cursor</span>
                </button>

                <button
                  onClick={() => setIsRealWorldModalOpen(true)}
                  className={isClean ? 'px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 uppercase transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0' : 'px-3 py-1.5 rounded-xl text-xs font-mono font-black border-2 border-black bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center gap-1.5 uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer whitespace-nowrap shrink-0'}
                  title="Preview in real-time device environments (Smartwatch, iPhone, TV, Laptop, Billboard)"
                >
                  <Eye className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                  <span className="whitespace-nowrap">Real Time Preview</span>
                </button>

                {/* Fullscreen Button: Icon-Only, placed right next to Real Time Preview */}
                <button
                  onClick={() => setIsFullscreenOpen(true)}
                  className={isClean ? 'p-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0' : 'p-2 rounded-xl text-xs font-mono font-black border-2 border-black bg-[#FFB000] hover:bg-[#FFC107] text-black flex items-center justify-center transition-all shadow-[2px_2px_0px_#000] cursor-pointer shrink-0'}
                  title="Fullscreen Canvas Mode"
                >
                  <Maximize2 className="w-4 h-4 stroke-[2.5] shrink-0" />
                </button>
              </div>
            </div>

            {/* Center Canvas Display Area */}
            <div
              onClick={() => !isDragMode && setIsFullscreenOpen(true)}
              className={`flex-1 flex items-center justify-center py-4 relative z-10 overflow-hidden group ${
                isDragMode ? 'cursor-default' : 'hover:scale-[1.01] transition-transform cursor-pointer'
              }`}
              title={isDragMode ? 'Drag elements with cursor' : 'Click preview canvas to view Fullscreen'}
            >
              {adMode === 'video' ? (
                <div className="transition-all duration-300 relative">
                  <VideoAdRenderer
                    videoAd={selectedVideoAd}
                    surface={activeSurface}
                    scaleFactor={scaleFactor}
                    interactive={true}
                  />
                </div>
              ) : selectedCandidate ? (
                <div className="transition-all duration-300 relative rounded-2xl overflow-hidden border-3 border-black shadow-[6px_6px_0px_#000000]">
                  <AdaptiveAdRenderer
                    candidate={selectedCandidate}
                    surface={activeSurface}
                    campaign={campaign}
                    showOverlays={true}
                    scaleFactor={scaleFactor}
                    interactive={true}
                    isDragModeEnabled={isDragMode}
                    is3DProductPopout={isPosterCubeMode}
                  />
                  {!isDragMode && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 pointer-events-none">
                      <span className={isClean ? 'bg-purple-900/90 text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase shadow-md flex items-center gap-1.5' : 'bg-black text-white px-3 py-1.5 rounded-xl font-mono text-xs font-black uppercase border-2 border-white shadow-lg flex items-center gap-1.5'}>
                        <Maximize2 className="w-3.5 h-3.5" /> Click for Fullscreen
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`text-xs font-mono flex items-center gap-2 font-bold ${isClean ? 'text-slate-600' : 'text-black'}`}>
                  <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
                  Generating candidate composition...
                </div>
              )}
            </div>

            {/* Bottom Audit Status */}
            <div className={`pt-3 z-10 flex items-center justify-between text-xs font-mono font-bold ${isClean ? 'border-t border-slate-200 text-slate-700' : 'border-t-2 border-black text-black'}`}>
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                WCAG Audit: {auditReport?.contrastRatio && auditReport.contrastRatio >= 4.5 ? 'AAA Passed' : 'AA Compliant'}
              </span>
              <span className={isClean ? 'font-bold flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px] shadow-2xs' : 'font-black flex items-center gap-1 bg-[#FFB000] border-2 border-black px-2 py-0.5 rounded-lg shadow-[1.5px_1.5px_0px_#000000] text-[10px] text-black'}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Real-Time Engine
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal View */}
      <FullscreenAdModal
        isOpen={isFullscreenOpen}
        onClose={() => {
          setIsFullscreenOpen(false);
          setIsDragMode(false);
        }}
        initialDragMode={isDragMode}
      />

      {/* Real-World 3D Device Preview Modal */}
      <DeviceRealWorldModal
        isOpen={isRealWorldModalOpen}
        onClose={() => setIsRealWorldModalOpen(false)}
      />

      {/* Footer Navigation Bar */}
      <div className={`max-w-7xl mx-auto w-full pt-4 flex items-center justify-end mt-4 ${isClean ? 'border-t border-purple-200/80' : 'border-t-3 border-black'}`}>
        <button
          onClick={nextStep}
          className={`flex items-center gap-2 cursor-pointer ${vibe.buttonPrimary} ${isClean ? 'px-6 py-3 font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all' : 'px-5 py-2.5 border-3 border-black shadow-[3px_3px_0px_#000000] transition-all transform hover:-translate-y-0.5 text-xs font-black'}`}
        >
          <span>Continue to Surface & Geometry</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
      {/* Multi-Surface Concept Explainer Modal */}
      <MultiSurfaceConceptModal
        isOpen={showConceptModal}
        onClose={() => setShowConceptModal(false)}
      />
    </div>
  );
};
