import { describe, it, expect } from 'vitest';
import { ThemeEngine } from '../engine/theme/ThemeEngine';
import { THEME_PRESETS } from '../models/theme';
import { SURFACE_PRESETS } from '../models/surface';

describe('ThemeEngine', () => {
  it('should interpolate theme tokens continuously (Theme Morphing)', () => {
    const minimal = THEME_PRESETS.minimal;
    const pixel = THEME_PRESETS.pixel;

    const mixed = ThemeEngine.mixThemes(minimal, pixel, 0.5);
    expect(mixed).toBeDefined();
    expect(mixed.shape.cornerRadius).toBe(8); // (16 + 0) / 2
    expect(mixed.name).toContain('Minimal');
    expect(mixed.name).toContain('Pixel');
  });

  it('should evaluate surface x theme compatibility score', () => {
    const surface = SURFACE_PRESETS.smart_tv_4k;
    const compat = ThemeEngine.evaluateCompatibility('spatial_3d', surface);

    expect(compat.score).toBeGreaterThanOrEqual(90);
    expect(compat.recommendation).toContain('Excellent fit');
  });
});
