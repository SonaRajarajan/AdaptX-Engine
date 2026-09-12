export type ElementType = 'logo' | 'headline' | 'product' | 'cta' | 'description' | 'legalText' | 'decorative';

export interface BoxBounding {
  x: number;      // px from top-left
  y: number;      // px from top-left
  width: number;  // px
  height: number; // px
}

export interface ElementGenome {
  type: ElementType;
  visible: boolean;
  box: BoxBounding;
  scale: number;
  zIndex: number;
  fontSize?: number;
  lines?: number;
  textCopy?: string;
  alignment?: 'left' | 'center' | 'right';
  cropRect?: { x: number; y: number; width: number; height: number }; // 0..1 relative crop bounds inside source image
}

export interface LayoutGenome {
  id: string;
  strategyName: string;
  elements: Record<ElementType, ElementGenome>;
  padding: number;
  gap: number;
  flexDirection: 'column' | 'row' | 'split-vertical' | 'split-horizontal' | 'hero-overlay';
}

export interface ScoreBreakdown {
  readability: number;        // 25% weight
  visualHierarchy: number;    // 20% weight
  brandCompliance: number;    // 15% weight
  contentVisibility: number;  // 15% weight
  ctaVisibility: number;      // 10% weight
  whitespaceBalance: number;  // 5% weight
  visualBalance: number;      // 5% weight
  safeZoneCompliance: number; // 5% weight
  totalScore: number;         // 0..100
}

export interface LayoutCandidate {
  id: string;
  strategyName: string; // e.g. 'Product-First', 'Headline-First', 'Split-Hero', 'Minimal-CTA'
  genome: LayoutGenome;
  score: ScoreBreakdown;
  winReasons: string[];
  penalties: string[];
  isWinner?: boolean;
}

export interface ConflictReport {
  hasConflict: boolean;
  messages: string[];
  suggestedActions: string[];
}

export interface EvaluationResult {
  surfaceId: string;
  surfaceDimensions: { width: number; height: number };
  candidates: LayoutCandidate[];
  winningCandidate: LayoutCandidate;
  conflictReport: ConflictReport;
  explanationText: string;
  evaluatedAt: string;
  calculationTimeMs: number;
}

export interface LayoutVersion {
  versionId: string;
  timestamp: string;
  label: string;
  surfaceName: string;
  candidate: LayoutCandidate;
  campaignId: string;
}
