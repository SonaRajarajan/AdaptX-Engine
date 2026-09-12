import { SurfaceCategory } from './surface';

export type ThemeId =
  | 'minimal'
  | 'neo_brutalist'
  | 'pixel'
  | 'spatial_3d'
  | 'neon'
  | 'hand_drawn'
  | 'editorial'
  | 'glass'
  | 'custom';

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  style: 'modern' | 'pixel' | 'serif' | 'handwriting' | 'cyber' | 'glass';
  scaleFactor: number;
}

export interface ThemeShape {
  cornerRadius: number; // px e.g. 0 for pixel, 16 for minimal, 24 for glass
  borderWidth: number;  // px
  borderStyle: 'solid' | 'dashed' | 'double' | 'groove' | 'none';
  borderColor?: string;
}

export interface ThemeEffects {
  shadow: 'none' | 'soft' | 'hard' | 'glow' | 'deep-3d';
  glowColor?: string;
  blurPx: number;       // e.g. 0 for none, 12 for glassmorphism
  tiltDeg: number;      // 3D perspective Y-rotation in degrees
}

export interface ThemeDepth {
  zSpacing: number;     // px depth separation between layers
  perspectivePx: number; // e.g. 1000px
}

export interface ThemeTokens {
  id: ThemeId;
  name: string;
  icon: string;
  typography: ThemeTypography;
  shape: ThemeShape;
  effects: ThemeEffects;
  depth: ThemeDepth;
  texture: 'none' | 'pixel_grid' | 'paper' | 'scanline' | 'glass_noise';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

export const THEME_PRESETS: Record<ThemeId, ThemeTokens> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal / Modern',
    icon: '',
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      style: 'modern',
      scaleFactor: 1.0,
    },
    shape: {
      cornerRadius: 16,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    effects: {
      shadow: 'soft',
      blurPx: 0,
      tiltDeg: 0,
    },
    depth: {
      zSpacing: 0,
      perspectivePx: 0,
    },
    texture: 'none',
    colors: {
      primary: '#2563EB',
      secondary: '#1E293B',
      background: '#030712',
      text: '#F8FAFC',
      accent: '#38BDF8',
    },
  },
  neo_brutalist: {
    id: 'neo_brutalist',
    name: 'Neo-Brutalist Cyber Gold',
    icon: '',
    typography: {
      headingFont: '"Arial Black", "Impact", sans-serif',
      bodyFont: 'system-ui, sans-serif',
      style: 'modern',
      scaleFactor: 1.15,
    },
    shape: {
      cornerRadius: 4,
      borderWidth: 3,
      borderStyle: 'solid',
      borderColor: '#000000',
    },
    effects: {
      shadow: 'hard',
      blurPx: 0,
      tiltDeg: 0,
    },
    depth: {
      zSpacing: 0,
      perspectivePx: 0,
    },
    texture: 'none',
    colors: {
      primary: '#FFB000',
      secondary: '#000000',
      background: '#F9F6F0',
      text: '#000000',
      accent: '#FF9800',
    },
  },
  pixel: {
    id: 'pixel',
    name: 'Pixel Art Retro',
    icon: '',
    typography: {
      headingFont: '"Courier New", Courier, monospace',
      bodyFont: '"Courier New", Courier, monospace',
      style: 'pixel',
      scaleFactor: 0.95,
    },
    shape: {
      cornerRadius: 0,
      borderWidth: 4,
      borderStyle: 'solid',
      borderColor: '#38BDF8',
    },
    effects: {
      shadow: 'hard',
      blurPx: 0,
      tiltDeg: 0,
    },
    depth: {
      zSpacing: 0,
      perspectivePx: 0,
    },
    texture: 'pixel_grid',
    colors: {
      primary: '#38BDF8',
      secondary: '#0F172A',
      background: '#020617',
      text: '#F1F5F9',
      accent: '#F43F5E',
    },
  },
  spatial_3d: {
    id: 'spatial_3d',
    name: '3D Spatial Depth',
    icon: '',
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      style: 'modern',
      scaleFactor: 1.1,
    },
    shape: {
      cornerRadius: 20,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(59, 130, 246, 0.4)',
    },
    effects: {
      shadow: 'deep-3d',
      blurPx: 0,
      tiltDeg: 8,
    },
    depth: {
      zSpacing: 25,
      perspectivePx: 1000,
    },
    texture: 'none',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E1B4B',
      background: '#0B0F19',
      text: '#FFFFFF',
      accent: '#818CF8',
    },
  },
  neon: {
    id: 'neon',
    name: 'Neon Cyberpunk',
    icon: '',
    typography: {
      headingFont: 'system-ui, sans-serif',
      bodyFont: 'system-ui, sans-serif',
      style: 'cyber',
      scaleFactor: 1.05,
    },
    shape: {
      cornerRadius: 8,
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: '#38BDF8',
    },
    effects: {
      shadow: 'glow',
      glowColor: '#38BDF8',
      blurPx: 0,
      tiltDeg: 0,
    },
    depth: {
      zSpacing: 0,
      perspectivePx: 0,
    },
    texture: 'scanline',
    colors: {
      primary: '#06B6D4',
      secondary: '#1E1035',
      background: '#030712',
      text: '#F8FAFC',
      accent: '#F43F5E',
    },
  },
  hand_drawn: {
    id: 'hand_drawn',
    name: 'Hand-Drawn Sketch',
    icon: '',
    typography: {
      headingFont: 'Comic Sans MS, cursive, sans-serif',
      bodyFont: 'Comic Sans MS, cursive, sans-serif',
      style: 'handwriting',
      scaleFactor: 1.0,
    },
    shape: {
      cornerRadius: 12,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: '#94A3B8',
    },
    effects: {
      shadow: 'none',
      blurPx: 0,
      tiltDeg: -1.5,
    },
    depth: {
      zSpacing: 0,
      perspectivePx: 0,
    },
    texture: 'paper',
    colors: {
      primary: '#2563EB',
      secondary: '#1E293B',
      background: '#0F172A',
      text: '#F8FAFC',
      accent: '#F59E0B',
    },
  },
  editorial: {
    id: 'editorial',
    name: 'Editorial Magazine',
    icon: '',
    typography: {
      headingFont: 'Georgia, serif',
      bodyFont: 'Georgia, serif',
      style: 'serif',
      scaleFactor: 1.15,
    },
    shape: {
      cornerRadius: 4,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#334155',
    },
    effects: {
      shadow: 'soft',
      blurPx: 0,
      tiltDeg: 0,
    },
    depth: {
      zSpacing: 0,
      perspectivePx: 0,
    },
    texture: 'none',
    colors: {
      primary: '#1D4ED8',
      secondary: '#0F172A',
      background: '#0A0F1D',
      text: '#F8FAFC',
      accent: '#E11D48',
    },
  },
  glass: {
    id: 'glass',
    name: 'Glassmorphism',
    icon: '',
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      style: 'glass',
      scaleFactor: 1.0,
    },
    shape: {
      cornerRadius: 24,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    effects: {
      shadow: 'soft',
      blurPx: 16,
      tiltDeg: 0,
    },
    depth: {
      zSpacing: 10,
      perspectivePx: 0,
    },
    texture: 'glass_noise',
    colors: {
      primary: '#3B82F6',
      secondary: 'rgba(30, 41, 59, 0.6)',
      background: '#030712',
      text: '#FFFFFF',
      accent: '#60A5FA',
    },
  },
  custom: {
    id: 'custom',
    name: 'Custom Theme',
    icon: '',
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      style: 'modern',
      scaleFactor: 1.0,
    },
    shape: {
      cornerRadius: 16,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    effects: {
      shadow: 'soft',
      blurPx: 0,
      tiltDeg: 0,
    },
    depth: {
      zSpacing: 0,
      perspectivePx: 0,
    },
    texture: 'none',
    colors: {
      primary: '#2563EB',
      secondary: '#1E293B',
      background: '#030712',
      text: '#F8FAFC',
      accent: '#38BDF8',
    },
  },
};

/**
 * Surface x Theme Compatibility Matrix (Section 65)
 * Calculates suitability % (0..100) for a given surface category and theme.
 */
export const THEME_SURFACE_COMPATIBILITY: Record<ThemeId, Record<SurfaceCategory, number>> = {
  minimal: { mobile: 98, desktop: 98, tv: 95, billboard: 98, social: 96, in_car: 96, wearable: 94 },
  neo_brutalist: { mobile: 98, desktop: 98, tv: 95, billboard: 98, social: 98, in_car: 96, wearable: 92 },
  pixel: { mobile: 94, desktop: 91, tv: 89, billboard: 73, social: 96, in_car: 82, wearable: 92 },
  spatial_3d: { mobile: 82, desktop: 96, tv: 98, billboard: 91, social: 88, in_car: 90, wearable: 70 },
  neon: { mobile: 92, desktop: 94, tv: 96, billboard: 78, social: 95, in_car: 85, wearable: 84 },
  hand_drawn: { mobile: 90, desktop: 88, tv: 84, billboard: 70, social: 94, in_car: 76, wearable: 82 },
  editorial: { mobile: 92, desktop: 98, tv: 80, billboard: 75, social: 90, in_car: 84, wearable: 72 },
  glass: { mobile: 96, desktop: 96, tv: 94, billboard: 82, social: 96, in_car: 92, wearable: 88 },
  custom: { mobile: 90, desktop: 90, tv: 90, billboard: 90, social: 90, in_car: 90, wearable: 90 },
};
