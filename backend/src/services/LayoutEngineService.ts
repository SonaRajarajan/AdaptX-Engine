import { Campaign, SurfaceDefinition } from '../models/types';

export class LayoutEngineService {
  /**
   * Compresses input headline & description copy semantically into preset length levels.
   */
  public static compressText(headline: string, description: string) {
    const headlineWords = headline.split(' ');
    const descWords = description.split(' ');

    const headlineCompact = headlineWords.slice(0, Math.ceil(headlineWords.length * 0.65)).join(' ');
    const headlineExtreme = headlineWords.slice(0, Math.min(4, headlineWords.length)).join(' ');

    const descriptionCompact = descWords.slice(0, Math.ceil(descWords.length * 0.5)).join(' ');
    const descriptionExtreme = descWords.slice(0, Math.min(5, descWords.length)).join(' ');

    return {
      original: { headline, description },
      compact: { headline: headlineCompact, description: descriptionCompact },
      extreme: { headline: headlineExtreme, description: descriptionExtreme },
    };
  }

  /**
   * Analyzes surface parameters and generates recommended safe zone insets.
   */
  public static calculateRecommendedSafeZone(surface: SurfaceDefinition) {
    if (surface.category === 'tv') {
      return { top: 5, bottom: 5, left: 8, right: 8 }; // 5-8% overscan safe zone
    } else if (surface.category === 'mobile') {
      return { top: 6, bottom: 5, left: 4, right: 4 }; // notch + gesture bar
    } else if (surface.category === 'billboard') {
      return { top: 4, bottom: 4, left: 6, right: 6 };
    }
    return { top: 3, bottom: 3, left: 3, right: 3 };
  }
}
