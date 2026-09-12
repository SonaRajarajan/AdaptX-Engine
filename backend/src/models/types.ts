export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type CopyMode = 'exact' | 'adaptive';
export type CompressionLevel = 'Original' | 'Compact' | 'Extreme';

export interface CampaignAsset {
  logoUrl: string;
  logoAspect: number;
  productImageUrl: string;
  productImageAspect: number;
  focalPoint: { x: number; y: number };
  headline: string;
  headlineCompact?: string;
  headlineExtreme?: string;
  description: string;
  descriptionCompact?: string;
  descriptionExtreme?: string;
  ctaText: string;
  legalText: string;
  brandColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fontFamily: string;
}

export interface Campaign {
  id: string;
  name: string;
  assets: CampaignAsset;
  priorities: Record<string, PriorityLevel>;
  constraints: Record<string, any>;
  copyMode: CopyMode;
  compressionLevel: CompressionLevel;
}

export interface SurfaceDefinition {
  id: string;
  name: string;
  category: string;
  width: number;
  height: number;
  pixelDensity: number;
  orientation: 'portrait' | 'landscape' | 'square';
  viewingDistance: number;
  safeZone: { top: number; bottom: number; left: number; right: number };
  interactionType: string;
  animationBudget: string;
}

export interface LayoutVersion {
  versionId: string;
  timestamp: string;
  label: string;
  surfaceName: string;
  candidate: any;
  campaignId: string;
}
