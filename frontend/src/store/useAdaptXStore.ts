import { create } from 'zustand';
import { Campaign, DEFAULT_CAMPAIGN, PriorityLevel, CopyMode, CompressionLevel } from '../models/campaign';
import { SurfaceDefinition, SURFACE_PRESETS } from '../models/surface';
import { EvaluationResult, LayoutCandidate, LayoutVersion } from '../models/layout';
import { DEFAULT_SCORE_WEIGHTS, ScoreWeights } from '../engine/scoring/LayoutScoringEngine';
import { CandidateGenerator } from '../engine/optimizer/CandidateGenerator';
import { ConstraintSolver } from '../engine/constraints/ConstraintSolver';
import { LayoutScoringEngine } from '../engine/scoring/LayoutScoringEngine';
import { DecisionExplainer } from '../engine/explainer/DecisionExplainer';
import { BrandAndA11yValidator, AuditReport } from '../engine/validation/BrandAndA11yValidator';
import { ThemeId, ThemeTokens, THEME_PRESETS } from '../models/theme';
import { ThemeEngine } from '../engine/theme/ThemeEngine';

export type AppViewMode =
  | 'inspector'
  | 'preview_wall'
  | 'ab_compare'
  | 'stress_lab'
  | 'genome_editor'
  | 'theme_explorer';

export interface PerformanceTelemetry {
  fps: number;
  frameTimeMs: number;
  layoutTimeMs: number;
  paintTimeMs: number;
  memoryMb: number;
  workerTimeMs: number;
  candidatesGenerated: number;
}

export type WebsiteVibe = 'organic_pastel' | 'patchwork_pop' | 'chunky_pop' | 'dark_glass' | 'memphis_blue' | 'retro_poster';

export type MotionMode = 'static' | 'slow_360' | 'kinetic_3d' | 'pulse' | 'shimmer' | 'bounce_float' | 'glitch_flicker' | 'zoom_pulse';

interface AdaptXState {
  // Website Vibe Theme (Matching uploaded designs)
  websiteVibe: WebsiteVibe;
  setWebsiteVibe: (vibe: WebsiteVibe) => void;

  // Wizard Step Navigation State (Step 1 -> 2 -> 3 -> 4 -> 5)
  currentStep: number; // 1: Geometry, 2: Themes, 3: Setup, 4: Inspector, 5: Suite

  // Campaign & Settings State
  campaign: Campaign;
  activeSurface: SurfaceDefinition;
  viewMode: AppViewMode;
  scoreWeights: ScoreWeights;
  enableEvolution: boolean;
  accessibilityFirstMode: boolean;
  isMotionAnimated: boolean;
  motionMode: MotionMode;
  toggleMotionAnimation: () => void;
  setMotionMode: (mode: MotionMode) => void;

  // Primary Ad Mode (Static Ads vs Video Ads)
  adMode: 'static' | 'video';
  setAdMode: (mode: 'static' | 'video') => void;
  activeVideoAdId: string;
  setActiveVideoAdId: (id: string) => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (playing: boolean) => void;

  // Theme Adaptation State (Sections 60 - 83)
  activeThemeId: ThemeId;
  morphTargetThemeId: ThemeId;
  morphRatio: number; // 0.0 .. 1.0
  brandLockEnabled: boolean;
  activeThemeTokens: ThemeTokens;

  // Layout Engine Results
  evaluationResult: EvaluationResult | null;
  selectedCandidate: LayoutCandidate | null;
  auditReport: AuditReport | null;
  versions: LayoutVersion[];
  visualDiffComparePair: [LayoutCandidate, LayoutCandidate] | null;
  isDiffModalOpen: boolean;

  // Performance Telemetry
  telemetry: PerformanceTelemetry;

  // Wizard Step Actions
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // User Cursor Drag & Resize Custom Overrides
  userElementOverrides: Record<string, { box: { x: number; y: number; width: number; height: number }; fontSize?: number }>;
  resetUserElementOverrides: () => void;

  // Campaign Actions
  setCampaign: (campaign: Campaign) => void;
  updateAsset: (key: string, value: any) => void;
  updateConstraint: (key: string, value: any) => void;
  updatePriority: (key: string, priority: PriorityLevel) => void;
  setCopyMode: (mode: CopyMode, level?: CompressionLevel) => void;
  setActiveSurface: (surface: SurfaceDefinition) => void;
  setCustomSurfaceDimensions: (width: number, height: number) => void;
  setViewMode: (mode: AppViewMode) => void;
  setScoreWeights: (weights: ScoreWeights) => void;
  setAccessibilityFirstMode: (active: boolean) => void;
  setSelectedCandidate: (candidate: LayoutCandidate) => void;

  // Theme Engine Actions
  setActiveThemeId: (themeId: ThemeId) => void;
  setMorphTargetThemeId: (themeId: ThemeId) => void;
  setMorphRatio: (ratio: number) => void;
  setBrandLockEnabled: (enabled: boolean) => void;

  // Engine Execution
  reevaluateLayout: () => void;
  saveCurrentVersion: (label: string) => void;
  setDiffComparePair: (c1: LayoutCandidate, c2: LayoutCandidate) => void;
  closeDiffModal: () => void;
  updateTelemetry: (metrics: Partial<PerformanceTelemetry>) => void;
}

export const useAdaptXStore = create<AdaptXState>((set, get) => ({
  websiteVibe: 'organic_pastel',
  setWebsiteVibe: (websiteVibe) => set({ websiteVibe }),

  currentStep: 1, // Start at Step 1: Campaign Setup

  campaign: DEFAULT_CAMPAIGN,
  activeSurface: SURFACE_PRESETS.mobile_portrait,
  viewMode: 'inspector',
  scoreWeights: DEFAULT_SCORE_WEIGHTS,
  enableEvolution: false,
  accessibilityFirstMode: false,
  isMotionAnimated: false,
  motionMode: 'slow_360',
  toggleMotionAnimation: () => set((state) => ({ isMotionAnimated: !state.isMotionAnimated })),
  setMotionMode: (mode) => set({ motionMode: mode, isMotionAnimated: mode !== 'static' }),

  adMode: 'static',
  setAdMode: (adMode) => set({ adMode }),
  activeVideoAdId: 'video-cyberpunk-kinetic',
  setActiveVideoAdId: (activeVideoAdId) => set({ activeVideoAdId }),
  isVideoPlaying: true,
  setIsVideoPlaying: (isVideoPlaying) => set({ isVideoPlaying }),

  // Theme Engine Defaults
  activeThemeId: 'neo_brutalist',
  morphTargetThemeId: 'minimal',
  morphRatio: 0,
  brandLockEnabled: false,
  activeThemeTokens: THEME_PRESETS.neo_brutalist,

  evaluationResult: null,
  selectedCandidate: null,
  auditReport: null,
  versions: [],
  visualDiffComparePair: null,
  isDiffModalOpen: false,

  telemetry: {
    fps: 60,
    frameTimeMs: 16.4,
    layoutTimeMs: 2.1,
    paintTimeMs: 4.2,
    memoryMb: 82,
    workerTimeMs: 1.8,
    candidatesGenerated: 5,
  },

  goToStep: (currentStep) => {
    const targetStep = Math.max(1, Math.min(5, currentStep));
    set({
      currentStep: targetStep,
      ...(targetStep === 5 ? { viewMode: 'preview_wall' } : {}),
    });
    get().reevaluateLayout();
  },

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 5) {
      const next = currentStep + 1;
      set({
        currentStep: next,
        ...(next === 5 ? { viewMode: 'preview_wall' } : {}),
      });
      get().reevaluateLayout();
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
      get().reevaluateLayout();
    }
  },

  setCampaign: (campaign) => {
    set({ campaign });
    get().reevaluateLayout();
  },

  updateAsset: (key, value) => {
    const campaign = get().campaign;
    const updated = {
      ...campaign,
      assets: {
        ...campaign.assets,
        [key]: value,
      },
    };
    set({ campaign: updated });
    get().reevaluateLayout();
  },

  updateConstraint: (key, value) => {
    const campaign = get().campaign;
    const updated = {
      ...campaign,
      constraints: {
        ...campaign.constraints,
        [key]: value,
      },
    };
    set({ campaign: updated });
    get().reevaluateLayout();
  },

  updatePriority: (key, priority) => {
    const campaign = get().campaign;
    const updated = {
      ...campaign,
      priorities: {
        ...campaign.priorities,
        [key]: priority,
      },
    };
    set({ campaign: updated });
    get().reevaluateLayout();
  },

  setCopyMode: (copyMode, compressionLevel) => {
    const campaign = get().campaign;
    const updated = {
      ...campaign,
      copyMode,
      compressionLevel: compressionLevel || campaign.compressionLevel,
    };
    set({ campaign: updated });
    get().reevaluateLayout();
  },

  setActiveSurface: (surface) => {
    set({ activeSurface: surface });
    get().reevaluateLayout();
  },

  setCustomSurfaceDimensions: (width, height) => {
    const current = get().activeSurface;
    const updated: SurfaceDefinition = {
      ...current,
      id: 'custom_surface',
      name: `Custom (${width} × ${height})`,
      width,
      height,
      orientation: width >= height ? 'landscape' : 'portrait',
    };
    set({ activeSurface: updated });
    get().reevaluateLayout();
  },

  setViewMode: (viewMode) => set({ viewMode }),

  setScoreWeights: (scoreWeights) => {
    set({ scoreWeights });
    get().reevaluateLayout();
  },

  setAccessibilityFirstMode: (accessibilityFirstMode) => {
    set({ accessibilityFirstMode });
    get().reevaluateLayout();
  },

  userElementOverrides: {},
  resetUserElementOverrides: () => {
    set({ userElementOverrides: {} });
    get().reevaluateLayout();
  },

  setSelectedCandidate: (candidate) => {
    const { campaign, activeSurface, scoreWeights, accessibilityFirstMode, activeThemeId, evaluationResult, userElementOverrides } = get();
    const activeThemeTokens = THEME_PRESETS[activeThemeId] || THEME_PRESETS.neo_brutalist;

    // Record user cursor drag & resize overrides into persistent store
    const updatedOverrides = { ...userElementOverrides };
    Object.entries(candidate.genome.elements).forEach(([elKey, el]) => {
      if (el && el.box) {
        updatedOverrides[elKey] = {
          box: { ...el.box },
          fontSize: el.fontSize,
        };
      }
    });

    const activeWeights = accessibilityFirstMode
      ? { ...scoreWeights, readability: 0.35, safeZoneCompliance: 0.25, brandCompliance: 0.15 }
      : scoreWeights;

    const scoring = LayoutScoringEngine.scoreCandidate(
      candidate.genome,
      campaign,
      activeSurface,
      activeWeights,
      activeThemeTokens
    );

    const rescoredCandidate: LayoutCandidate = {
      ...candidate,
      score: scoring.breakdown,
      winReasons: scoring.winReasons,
      penalties: scoring.penalties,
    };

    let updatedEval = evaluationResult;
    if (evaluationResult) {
      const updatedCandidates = evaluationResult.candidates.map((c) =>
        c.id === candidate.id ? rescoredCandidate : c
      );
      updatedEval = {
        ...evaluationResult,
        candidates: updatedCandidates,
      };
    }

    const auditReport = BrandAndA11yValidator.auditLayout(rescoredCandidate.genome, campaign, activeSurface);
    set({ userElementOverrides: updatedOverrides, selectedCandidate: rescoredCandidate, evaluationResult: updatedEval, auditReport });
  },

  setActiveThemeId: (themeId) => {
    set({ activeThemeId: themeId, morphRatio: 0 });
    get().reevaluateLayout();
  },

  setMorphTargetThemeId: (themeId) => {
    set({ morphTargetThemeId: themeId });
    get().reevaluateLayout();
  },

  setMorphRatio: (morphRatio) => {
    set({ morphRatio });
    get().reevaluateLayout();
  },

  setBrandLockEnabled: (brandLockEnabled) => {
    set({ brandLockEnabled });
    get().reevaluateLayout();
  },

  reevaluateLayout: () => {
    const {
      campaign,
      activeSurface,
      scoreWeights,
      accessibilityFirstMode,
      activeThemeId,
      morphTargetThemeId,
      morphRatio,
      brandLockEnabled,
    } = get();

    const startTime = performance.now();

    const baseTheme = THEME_PRESETS[activeThemeId] || THEME_PRESETS.minimal;
    const targetTheme = THEME_PRESETS[morphTargetThemeId] || THEME_PRESETS.spatial_3d;

    let themeTokens = morphRatio > 0 ? ThemeEngine.mixThemes(baseTheme, targetTheme, morphRatio) : baseTheme;
    themeTokens = ThemeEngine.enforceBrandLock(themeTokens, campaign.assets, brandLockEnabled);

    const rawGenomes = CandidateGenerator.generateCandidates(campaign, activeSurface);

    const activeWeights = accessibilityFirstMode
      ? { ...scoreWeights, readability: 0.35, safeZoneCompliance: 0.25, brandCompliance: 0.15 }
      : scoreWeights;

    const candidates: LayoutCandidate[] = rawGenomes.map((genome) => {
      const constraintCheck = ConstraintSolver.solveAndValidate(genome, activeSurface, campaign.priorities);

      // Apply custom font sizes & logo sizes from campaign assets if specified
      if (campaign.assets.headlineFontSize && constraintCheck.genome.elements.headline) {
        constraintCheck.genome.elements.headline.fontSize = campaign.assets.headlineFontSize;
      }
      if (campaign.assets.ctaFontSize && constraintCheck.genome.elements.cta) {
        constraintCheck.genome.elements.cta.fontSize = campaign.assets.ctaFontSize;
      }
      if (campaign.assets.descriptionFontSize && constraintCheck.genome.elements.description) {
        constraintCheck.genome.elements.description.fontSize = campaign.assets.descriptionFontSize;
      }
      if (campaign.assets.legalFontSize && constraintCheck.genome.elements.legalText) {
        constraintCheck.genome.elements.legalText.fontSize = campaign.assets.legalFontSize;
      }
      if (campaign.assets.logoWidth && constraintCheck.genome.elements.logo) {
        constraintCheck.genome.elements.logo.box.width = campaign.assets.logoWidth;
      }

      // Apply persistent user cursor drag & resize overrides
      const userElementOverrides = get().userElementOverrides || {};
      Object.entries(userElementOverrides).forEach(([elKey, override]) => {
        const targetEl = constraintCheck.genome.elements[elKey as keyof typeof constraintCheck.genome.elements];
        if (targetEl && override && override.box) {
          targetEl.box = { ...override.box };
          if (override.fontSize) targetEl.fontSize = override.fontSize;
        }
      });

      const scoring = LayoutScoringEngine.scoreCandidate(
        constraintCheck.genome,
        campaign,
        activeSurface,
        activeWeights,
        themeTokens
      );

      return {
        id: genome.id,
        strategyName: genome.strategyName,
        genome: constraintCheck.genome,
        score: scoring.breakdown,
        winReasons: scoring.winReasons,
        penalties: scoring.penalties,
      };
    });

    candidates.sort((a, b) => b.score.totalScore - a.score.totalScore);
    const winningCandidate = { ...candidates[0], isWinner: true };

    const conflictReport = DecisionExplainer.analyzeConflicts(candidates, activeSurface);
    const explanationText = DecisionExplainer.generateExplanation(
      winningCandidate,
      candidates,
      activeSurface,
      conflictReport
    );

    const calcTime = parseFloat((performance.now() - startTime).toFixed(2));

    const result: EvaluationResult = {
      surfaceId: activeSurface.id,
      surfaceDimensions: { width: activeSurface.width, height: activeSurface.height },
      candidates,
      winningCandidate,
      conflictReport,
      explanationText,
      evaluatedAt: new Date().toISOString(),
      calculationTimeMs: calcTime,
    };

    const auditReport = BrandAndA11yValidator.auditLayout(winningCandidate.genome, campaign, activeSurface);

    set({
      activeThemeTokens: themeTokens,
      evaluationResult: result,
      selectedCandidate: winningCandidate,
      auditReport,
      telemetry: {
        ...get().telemetry,
        layoutTimeMs: calcTime,
        candidatesGenerated: candidates.length,
      },
    });
  },

  saveCurrentVersion: (label) => {
    const { selectedCandidate, activeSurface, campaign, versions } = get();
    if (!selectedCandidate) return;

    const newVersion: LayoutVersion = {
      versionId: `v-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      label: label || `Snapshot ${versions.length + 1}`,
      surfaceName: activeSurface.name,
      candidate: selectedCandidate,
      campaignId: campaign.id,
    };

    set({ versions: [newVersion, ...versions] });
  },

  setDiffComparePair: (c1, c2) => set({ visualDiffComparePair: [c1, c2], isDiffModalOpen: true }),
  closeDiffModal: () => set({ isDiffModalOpen: false, visualDiffComparePair: null }),
  updateTelemetry: (metrics) => set({ telemetry: { ...get().telemetry, ...metrics } }),
}));
