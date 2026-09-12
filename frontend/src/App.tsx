import React, { useEffect } from 'react';
import { useAdaptXStore } from './store/useAdaptXStore';
import { WizardStepperNavbar } from './components/Header/WizardStepperNavbar';
import { AdSamplePicker } from './components/Campaign/AdSamplePicker';
import { OrganicBlobBackground } from './components/common/OrganicBlobBackground';
import { Step1CampaignSetup } from './components/Wizard/Step1CampaignSetup';
import { Step2SurfaceSelection } from './components/Wizard/Step2SurfaceSelection';
import { Step3ThemeSelection } from './components/Wizard/Step3ThemeSelection';
import { Step4LayoutInspector } from './components/Wizard/Step4LayoutInspector';
import { Step5MultiSurfaceWall } from './components/Wizard/Step5MultiSurfaceWall';
import { VisualDiffModal } from './components/Comparison/VisualDiffModal';
import { PerformanceMonitorHUD } from './components/telemetry/PerformanceMonitorHUD';
import { VIBE_STYLES } from './utils/vibeStyles';

export const App: React.FC = () => {
  const { currentStep, websiteVibe, reevaluateLayout } = useAdaptXStore();
  const vibe = VIBE_STYLES[websiteVibe] || VIBE_STYLES.organic_pastel;

  useEffect(() => {
    reevaluateLayout();
  }, []);

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden font-sans antialiased transition-colors duration-300 relative ${vibe.appBg}`}>
      {/* Colorful Organic Patchwork Wavy Backdrop */}
      <OrganicBlobBackground />

      {/* Top Stepper Header Navigation */}
      <WizardStepperNavbar />


      {/* Main Step Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {currentStep === 1 && <Step1CampaignSetup />}
        {currentStep === 2 && <Step2SurfaceSelection />}
        {currentStep === 3 && <Step3ThemeSelection />}
        {currentStep === 4 && <Step4LayoutInspector />}
        {currentStep === 5 && <Step5MultiSurfaceWall />}
      </div>

      {/* Visual Diff Modal Overlay */}
      <VisualDiffModal />

      {/* Bottom Engineering Telemetry HUD */}
      <PerformanceMonitorHUD />
    </div>
  );
};

export default App;
