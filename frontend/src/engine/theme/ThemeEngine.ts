import { ThemeTokens, ThemeId, THEME_PRESETS, THEME_SURFACE_COMPATIBILITY } from '../../models/theme';
import { SurfaceDefinition } from '../../models/surface';
import { CampaignAsset } from '../../models/campaign';

export class ThemeEngine {
  /**
   * Continuous Theme Morphing & Theme Mixer (Section 68 & 69).
   * Interpolates two theme design systems continuously based on ratio (0.0 .. 1.0).
   */
  public static mixThemes(themeA: ThemeTokens, themeB: ThemeTokens, ratio: number): ThemeTokens {
    const r = Math.max(0, Math.min(1, ratio));

    return {
      id: 'custom',
      name: `${themeA.name} + ${themeB.name} (${Math.round((1 - r) * 100)}% / ${Math.round(r * 100)}%)`,
      icon: '',
      typography: {
        headingFont: r > 0.5 ? themeB.typography.headingFont : themeA.typography.headingFont,
        bodyFont: r > 0.5 ? themeB.typography.bodyFont : themeA.typography.bodyFont,
        style: r > 0.5 ? themeB.typography.style : themeA.typography.style,
        scaleFactor: parseFloat((themeA.typography.scaleFactor * (1 - r) + themeB.typography.scaleFactor * r).toFixed(2)),
      },
      shape: {
        cornerRadius: Math.round(themeA.shape.cornerRadius * (1 - r) + themeB.shape.cornerRadius * r),
        borderWidth: Math.round(themeA.shape.borderWidth * (1 - r) + themeB.shape.borderWidth * r),
        borderStyle: r > 0.5 ? themeB.shape.borderStyle : themeA.shape.borderStyle,
        borderColor: r > 0.5 ? themeB.shape.borderColor : themeA.shape.borderColor,
      },
      effects: {
        shadow: r > 0.5 ? themeB.effects.shadow : themeA.effects.shadow,
        blurPx: Math.round(themeA.effects.blurPx * (1 - r) + themeB.effects.blurPx * r),
        tiltDeg: parseFloat((themeA.effects.tiltDeg * (1 - r) + themeB.effects.tiltDeg * r).toFixed(1)),
        glowColor: r > 0.5 ? themeB.effects.glowColor : themeA.effects.glowColor,
      },
      depth: {
        zSpacing: Math.round(themeA.depth.zSpacing * (1 - r) + themeB.depth.zSpacing * r),
        perspectivePx: Math.round(themeA.depth.perspectivePx * (1 - r) + themeB.depth.perspectivePx * r),
      },
      texture: r > 0.5 ? themeB.texture : themeA.texture,
      colors: {
        primary: this.interpolateColor(themeA.colors.primary, themeB.colors.primary, r),
        secondary: this.interpolateColor(themeA.colors.secondary, themeB.colors.secondary, r),
        background: this.interpolateColor(themeA.colors.background, themeB.colors.background, r),
        text: this.interpolateColor(themeA.colors.text, themeB.colors.text, r),
        accent: this.interpolateColor(themeA.colors.accent, themeB.colors.accent, r),
      },
    };
  }

  /**
   * Calculates surface x theme compatibility score (0..100) and recommendation string.
   */
  public static evaluateCompatibility(themeId: ThemeId, surface: SurfaceDefinition): { score: number; recommendation: string } {
    const scores = THEME_SURFACE_COMPATIBILITY[themeId] || THEME_SURFACE_COMPATIBILITY.minimal;
    const score = scores[surface.category] || 90;

    let recommendation = `Theme '${THEME_PRESETS[themeId]?.name || themeId}' has ${score}% compatibility with ${surface.name}.`;
    if (score >= 95) {
      recommendation = `Excellent fit! '${THEME_PRESETS[themeId]?.name}' is highly optimized for ${surface.category} displays.`;
    } else if (score < 80) {
      recommendation = `Lower compatibility. Consider switching to '3D' or 'Minimal' for better readability on ${surface.name}.`;
    }

    return { score, recommendation };
  }

  /**
   * Locks brand colors & typography identity (Section 74) while permitting theme effect mutations.
   */
  public static enforceBrandLock(theme: ThemeTokens, assets: CampaignAsset, brandLockEnabled: boolean): ThemeTokens {
    if (!brandLockEnabled) return theme;

    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary: assets.brandColors.primary,
        background: assets.brandColors.background,
        text: assets.brandColors.text,
      },
    };
  }

  private static interpolateColor(color1: string, color2: string, ratio: number): string {
    if (color1.startsWith('rgba') || color2.startsWith('rgba')) return color1;

    try {
      const c1 = color1.replace('#', '');
      const c2 = color2.replace('#', '');

      const r1 = parseInt(c1.substring(0, 2), 16);
      const g1 = parseInt(c1.substring(2, 4), 16);
      const b1 = parseInt(c1.substring(4, 6), 16);

      const r2 = parseInt(c2.substring(0, 2), 16);
      const g2 = parseInt(c2.substring(2, 4), 16);
      const b2 = parseInt(c2.substring(4, 6), 16);

      const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
      const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
      const b = Math.round(b1 * (1 - ratio) + b2 * ratio);

      const toHex = (n: number) => n.toString(16).padStart(2, '0');
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    } catch {
      return color1;
    }
  }
}
