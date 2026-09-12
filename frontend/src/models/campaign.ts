export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type CopyMode = 'exact' | 'adaptive';
export type CompressionLevel = 'Original' | 'Compact' | 'Extreme';

export interface CampaignAsset {
  logoUrl: string;
  logoAspect: number; // width / height ratio
  productImageUrl: string;
  productImageAspect: number;
  focalPoint: { x: number; y: number }; // normalized 0..1 coordinates
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
  optionalVideoUrl?: string;
  headlineFontSize?: number;
  ctaFontSize?: number;
  descriptionFontSize?: number;
  legalFontSize?: number;
  headlineColor?: string;
  ctaTextColor?: string;
  descriptionColor?: string;
  legalColor?: string;
  headlineFontFamily?: string;
  ctaFontFamily?: string;
  descriptionFontFamily?: string;
  legalFontFamily?: string;
  logoWidth?: number;
  containerPadding?: number;
  productShapeCut?: 'none' | 'circle' | 'arch' | 'diamond' | 'hexagon' | 'badge' | 'card';
  customElements?: Array<{
    id: string;
    type: 'text' | 'image';
    content: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    fontSize?: number;
    color?: string;
    fontFamily?: string;
  }>;
}

export interface CampaignPriorities {
  headline: PriorityLevel;
  product: PriorityLevel;
  logo: PriorityLevel;
  cta: PriorityLevel;
  description: PriorityLevel;
  legalText: PriorityLevel;
  decorative: PriorityLevel;
}

export interface BrandConstraints {
  minLogoWidth: number; // px
  maxLogoWidth: number; // px
  allowedBrandColors: string[];
  fontFamily: string;
  ctaStyle: 'solid' | 'gradient' | 'pill' | 'outline';
  safeMargins: number; // px inset
  maxTextScale: number; // factor e.g. 2.0
}

export interface Campaign {
  id: string;
  name: string;
  assets: CampaignAsset;
  priorities: CampaignPriorities;
  constraints: BrandConstraints;
  copyMode: CopyMode;
  compressionLevel: CompressionLevel;
}

export const DEFAULT_CAMPAIGN: Campaign = {
  id: 'aura-mobility-2026',
  name: 'AURA — Premium Urban Mobility',
  assets: {
    logoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40"><rect width="120" height="40" rx="6" fill="%23EAB308" stroke="%23000000" stroke-width="3"/><text x="14" y="26" font-family="sans-serif" font-weight="900" font-size="18" fill="%23000000">AURA</text></svg>',
    logoAspect: 2.5,
    productImageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    productImageAspect: 1.4,
    focalPoint: { x: 0.50, y: 0.50 },
    headline: 'ELEGANT TRANSIT. EVERY TIME.',
    headlineCompact: 'YOUR RIDE IS A TAP AWAY',
    headlineExtreme: 'AURA TRANSIT',
    description: 'Experience quiet luxury, on-demand transfers, and seamless urban transit. RIDE. RELAX. REPEAT.',
    descriptionCompact: 'Book a quiet luxury ride anytime with ease.',
    descriptionExtreme: 'Ride. Relax. Repeat.',
    ctaText: 'RESERVE RIDE ➔',
    legalText: '© 2026 AURA Transit Network. Safe & Reliable Rides Everywhere.',
    brandColors: {
      primary: '#EAB308',
      secondary: '#1E293B',
      background: '#F9F6F0',
      text: '#000000',
      accent: '#CA8A04',
    },
    fontFamily: '"Arial Black", "Impact", sans-serif',
  },
  priorities: {
    headline: 'HIGH',
    product: 'HIGH',
    logo: 'HIGH',
    cta: 'HIGH',
    description: 'MEDIUM',
    legalText: 'LOW',
    decorative: 'LOW',
  },
  constraints: {
    minLogoWidth: 80,
    maxLogoWidth: 180,
    allowedBrandColors: ['#FFB000', '#000000', '#F9F6F0', '#FF9800'],
    fontFamily: '"Arial Black", "Impact", sans-serif',
    ctaStyle: 'solid',
    safeMargins: 16,
    maxTextScale: 2.0,
  },
  copyMode: 'exact',
  compressionLevel: 'Original',
};
