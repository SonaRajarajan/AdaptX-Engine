import React, { useState } from 'react';
import { useAdaptXStore, WebsiteVibe } from '../../store/useAdaptXStore';
import { useCanvasStore } from '../../store/useCanvasStore';
import { MultiSurfaceConceptModal } from '../Explainer/MultiSurfaceConceptModal';
import { DeviceRealWorldModal } from '../canvas/DeviceRealWorldModal';
import { VIBE_STYLES } from '../../utils/vibeStyles';
import {
  Zap,
  ChevronRight,
  Sliders,
  Monitor,
  Sparkles,
  Layers,
  Grid,
  Palette,
  Maximize2,
  Minimize2,
  HelpCircle,
  Home,
  Eye,
} from 'lucide-react';

export const WizardStepperNavbar: React.FC = () => {
  const { currentStep, goToStep, websiteVibe, setWebsiteVibe, isMotionAnimated, toggleMotionAnimation, motionMode, setMotionMode } = useAdaptXStore();
  const { isFullScreen, toggleFullScreen } = useCanvasStore();
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [showRealWorldModal, setShowRealWorldModal] = useState(false);
  const vibe = VIBE_STYLES[websiteVibe] || VIBE_STYLES.organic_pastel;

  const steps = [
    { number: 1, label: 'Home', icon: Home },
    { number: 4, label: 'Inspector', icon: Layers },
    { number: 5, label: 'Live Wall', icon: Grid },
  ];

  const vibes: { id: WebsiteVibe; label: string; icon: string }[] = [
    { id: 'organic_pastel', label: 'Organic Pastel', icon: '' },
    { id: 'patchwork_pop', label: 'Patchwork Pop', icon: '' },
    { id: 'chunky_pop', label: 'Pop Brutalist', icon: '' },
    { id: 'dark_glass', label: 'Dark Glass', icon: '' },
    { id: 'memphis_blue', label: 'Memphis Blue', icon: '' },
    { id: 'retro_poster', label: 'Retro Poster', icon: '' },
  ];

  return (
    <header className={`h-16 px-4 sm:px-6 flex items-center justify-between shadow-md select-none z-30 shrink-0 transition-colors duration-300 gap-3 ${vibe.headerBg} ${vibe.headerBorder} ${vibe.headerText}`}>
      {/* Left: Brand Logo & Navigation Stepper */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0 min-w-0">
        <button
          onClick={() => goToStep(1)}
          className="flex items-center gap-2 shrink-0 cursor-pointer focus:outline-none"
          title="Return to Main Campaign Composer"
        >
          <div className="bg-[#FFC72C] border-2 border-black p-1.5 rounded-xl shadow-[2px_2px_0px_#000000] text-black">
            <Zap className="w-4 h-4 text-black stroke-[3]" />
          </div>
          <h1 className="font-black tracking-tight text-lg uppercase whitespace-nowrap">
            ADAPT<span className="bg-black text-white px-1 py-0.5 rounded text-xs ml-1">-X</span>
          </h1>
        </button>

        {/* Multi-Step Stepper */}
        <nav className="flex items-center gap-1.5 bg-white/70 p-1 rounded-2xl border-2 border-black shrink-0">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <React.Fragment key={step.number}>
                <button
                  onClick={() => goToStep(step.number)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 uppercase tracking-wide border-2 border-black cursor-pointer ${
                    isActive
                      ? vibe.pillActive
                      : isCompleted
                      ? 'bg-white text-black hover:bg-amber-100'
                      : 'bg-white/80 text-slate-800 hover:bg-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{step.label}</span>
                </button>

                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-black shrink-0 stroke-[3]" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Motion Mode Dropdown */}
        <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000000] shrink-0">
          <Sparkles className={`w-3.5 h-3.5 stroke-[3] text-black shrink-0 ${isMotionAnimated ? 'animate-spin' : ''}`} />
          <select
            value={isMotionAnimated ? motionMode : 'static'}
            onChange={(e) => {
              const val = e.target.value as any;
              if (val === 'static') {
                if (isMotionAnimated) toggleMotionAnimation();
              } else {
                if (!isMotionAnimated) toggleMotionAnimation();
                setMotionMode(val);
              }
            }}
            className="bg-transparent text-xs font-mono font-black uppercase text-black cursor-pointer focus:outline-none pr-1"
          >
            <option value="static">Static Poster</option>
            <option value="slow_360">360° Orbit</option>
            <option value="kinetic_3d">3D Kinetic</option>
            <option value="pulse">Pulse Glow</option>
            <option value="shimmer">Shimmer</option>
            <option value="bounce_float">Bounce Float</option>
            <option value="glitch_flicker">Holo Glitch</option>
            <option value="zoom_pulse">Zoom Pulse</option>
          </select>
        </div>

        {/* Real Time Preview Button (Primary Action) */}
        <button
          onClick={() => setShowRealWorldModal(true)}
          title="Preview in Real-Time 3D Device Environments"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] border-2 border-black shadow-[2px_2px_0px_#000000] text-xs font-black uppercase text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Eye className="w-4 h-4 stroke-[3] text-white animate-pulse shrink-0" />
          <span className="whitespace-nowrap">Real Time Preview</span>
        </button>

        {/* Full Screen Mode Button */}
        <button
          onClick={toggleFullScreen}
          title={isFullScreen ? 'Exit Full Screen Mode' : 'Enter Full Screen Mode'}
          className="p-1.5 rounded-2xl bg-white/90 border-2 border-black shadow-[2px_2px_0px_#000000] text-black hover:bg-amber-100 transition-all cursor-pointer shrink-0"
        >
          {isFullScreen ? (
            <Minimize2 className="w-4 h-4 stroke-[3] text-black" />
          ) : (
            <Maximize2 className="w-4 h-4 stroke-[3] text-black" />
          )}
        </button>

        {/* Multi-Surface Concept Explainer Button */}
        <button
          onClick={() => setShowConceptModal(true)}
          title="Multi-Surface Concept Guide"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-[#FFC72C] hover:bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_#000000] text-xs font-black uppercase text-black transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <HelpCircle className="w-4 h-4 stroke-[3] text-black shrink-0" />
          <span className="hidden xl:inline">Concept</span>
        </button>

        {/* Website Vibe Switcher Dropdown */}
        <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000000] shrink-0">
          <Palette className="w-4 h-4 stroke-[3] text-black shrink-0" />
          <select
            value={websiteVibe}
            onChange={(e) => setWebsiteVibe(e.target.value as WebsiteVibe)}
            className="bg-transparent text-xs font-black uppercase text-black cursor-pointer focus:outline-none pr-1"
          >
            {vibes.map((v) => (
              <option key={v.id} value={v.id} className="bg-white text-black font-bold uppercase">
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <MultiSurfaceConceptModal
        isOpen={showConceptModal}
        onClose={() => setShowConceptModal(false)}
      />

      <DeviceRealWorldModal
        isOpen={showRealWorldModal}
        onClose={() => setShowRealWorldModal(false)}
      />
    </header>
  );
};
