export type InteractionType = 'touch' | 'remote' | 'pointer' | 'none';
export type SurfaceCategory = 'mobile' | 'desktop' | 'tv' | 'billboard' | 'social' | 'in_car' | 'wearable';

export interface SafeZoneInset {
  top: number;    // % inset e.g. 5 = 5%
  bottom: number; // % inset e.g. 5 = 5%
  left: number;   // % inset e.g. 4 = 4%
  right: number;  // % inset e.g. 4 = 4%
}

export interface SurfaceDefinition {
  id: string;
  name: string;
  category: SurfaceCategory;
  width: number;           // pixels
  height: number;          // pixels
  pixelDensity: number;    // dpr e.g. 1, 2, 3
  orientation: 'portrait' | 'landscape' | 'square';
  viewingDistance: number; // in meters (e.g., 0.35m mobile, 3.5m TV, 25m billboard)
  safeZone: SafeZoneInset; // insets in %
  interactionType: InteractionType;
  animationBudget: 'high' | 'medium' | 'low';
}

export const SURFACE_PRESETS: Record<string, SurfaceDefinition> = {
  mobile_portrait: {
    id: 'mobile_portrait',
    name: 'Mobile Story / Portrait',
    category: 'mobile',
    width: 390,
    height: 844,
    pixelDensity: 3,
    orientation: 'portrait',
    viewingDistance: 0.35, // 35 cm
    safeZone: { top: 6, bottom: 5, left: 4, right: 4 }, // % notch & home bar safe zone
    interactionType: 'touch',
    animationBudget: 'high',
  },
  desktop_leaderboard: {
    id: 'desktop_leaderboard',
    name: 'Desktop Landscape Banner',
    category: 'desktop',
    width: 1280,
    height: 720,
    pixelDensity: 2,
    orientation: 'landscape',
    viewingDistance: 0.6, // 60 cm
    safeZone: { top: 3, bottom: 3, left: 3, right: 3 }, // 3% safe zone
    interactionType: 'pointer',
    animationBudget: 'high',
  },
  smart_tv_4k: {
    id: 'smart_tv_4k',
    name: 'Smart TV (1080p Viewport)',
    category: 'tv',
    width: 1920,
    height: 1080,
    pixelDensity: 2,
    orientation: 'landscape',
    viewingDistance: 3.5, // 3.5 meters
    safeZone: { top: 5, bottom: 5, left: 5, right: 5 }, // 5% TV overscan safe zone
    interactionType: 'remote',
    animationBudget: 'medium',
  },
  social_square: {
    id: 'social_square',
    name: 'Social Feed (1:1 Square)',
    category: 'social',
    width: 600,
    height: 600,
    pixelDensity: 2,
    orientation: 'square',
    viewingDistance: 0.4,
    safeZone: { top: 3, bottom: 3, left: 3, right: 3 },
    interactionType: 'touch',
    animationBudget: 'high',
  },
  in_car_display: {
    id: 'in_car_display',
    name: 'In-Car Center Console',
    category: 'in_car',
    width: 1280,
    height: 480,
    pixelDensity: 2,
    orientation: 'landscape',
    viewingDistance: 0.8,
    safeZone: { top: 3, bottom: 3, left: 3, right: 3 },
    interactionType: 'touch',
    animationBudget: 'medium',
  },
  wearable_smartwatch: {
    id: 'wearable_smartwatch',
    name: 'Smartwatch Display',
    category: 'wearable',
    width: 240,
    height: 280,
    pixelDensity: 2,
    orientation: 'portrait',
    viewingDistance: 0.25,
    safeZone: { top: 4, bottom: 4, left: 4, right: 4 },
    interactionType: 'touch',
    animationBudget: 'low',
  },
  highway_billboard: {
    id: 'highway_billboard',
    name: 'Highway Billboard',
    category: 'billboard',
    width: 1920,
    height: 540,
    pixelDensity: 1,
    orientation: 'landscape',
    viewingDistance: 25.0,
    safeZone: { top: 4, bottom: 4, left: 4, right: 4 },
    interactionType: 'none',
    animationBudget: 'low',
  },
  vertical_skyscraper: {
    id: 'vertical_skyscraper',
    name: 'Vertical Skyscraper Banner',
    category: 'desktop',
    width: 300,
    height: 1050,
    pixelDensity: 2,
    orientation: 'portrait',
    viewingDistance: 0.6,
    safeZone: { top: 3, bottom: 3, left: 3, right: 3 },
    interactionType: 'pointer',
    animationBudget: 'high',
  },
};
