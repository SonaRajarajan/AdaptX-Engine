import { CampaignAsset, CopyMode, CompressionLevel } from '../../models/campaign';
import { SurfaceDefinition } from '../../models/surface';

export interface TypographyResult {
  headlineText: string;
  headlineFontSize: number;
  headlineLines: number;
  descriptionText: string;
  descriptionFontSize: number;
  descriptionLines: number;
  descriptionVisible: boolean;
  legalText: string;
  legalFontSize: number;
  legalVisible: boolean;
  readabilityScore: number;
}

export class SmartTypographyEngine {
  /**
   * Adapts headline, description, and legal text based on surface size, viewing distance, and copy mode.
   */
  public static adaptTypography(
    assets: CampaignAsset,
    surface: SurfaceDefinition,
    availableWidth: number,
    availableHeight: number,
    copyMode: CopyMode,
    compressionLevel: CompressionLevel
  ): TypographyResult {
    // 1. Determine active copy based on mode
    let headlineText = assets.headline;
    let descriptionText = assets.description;

    if (copyMode === 'adaptive') {
      if (compressionLevel === 'Compact') {
        headlineText = assets.headlineCompact || assets.headline;
        descriptionText = assets.descriptionCompact || assets.description;
      } else if (compressionLevel === 'Extreme') {
        headlineText = assets.headlineExtreme || assets.headlineCompact || assets.headline;
        descriptionText = assets.descriptionExtreme || assets.descriptionCompact || assets.description;
      }
    }

    // 2. Compute minimum viewing-distance font size scaling factor
    // Rule: Text must subtend a minimum visual angle.
    // 1m distance requires ~ 2.5x base size compared to 0.35m mobile reading distance.
    const distanceFactor = Math.max(1.0, surface.viewingDistance / 0.35);

    // 3. Base font size derived from container width and surface viewing distance
    let baseHeadlineSize = Math.min(Math.max(18, availableWidth * 0.055), 64) * Math.sqrt(distanceFactor);
    let baseDescSize = Math.min(Math.max(12, availableWidth * 0.032), 32) * Math.sqrt(distanceFactor);
    let baseLegalSize = Math.max(9, Math.min(13, availableWidth * 0.018));

    // Clamp for compact surfaces (e.g. smartwatch / tiny cards)
    if (availableWidth < 300) {
      baseHeadlineSize = Math.min(baseHeadlineSize, 22);
      baseDescSize = Math.min(baseDescSize, 13);
    }

    // 4. Calculate estimated lines & heights
    const approxCharWidthHeadline = baseHeadlineSize * 0.55;
    const charsPerLineHeadline = Math.max(10, Math.floor(availableWidth / approxCharWidthHeadline));
    const headlineLines = Math.ceil(headlineText.length / charsPerLineHeadline);

    const approxCharWidthDesc = baseDescSize * 0.55;
    const charsPerLineDesc = Math.max(12, Math.floor(availableWidth / approxCharWidthDesc));
    const descriptionLines = Math.ceil(descriptionText.length / charsPerLineDesc);

    // 5. Check height fit and degrade gracefully if constrained
    let descriptionVisible = true;
    let legalVisible = true;

    const estimatedHeadlineHeight = headlineLines * baseHeadlineSize * 1.2;
    const estimatedDescHeight = descriptionLines * baseDescSize * 1.35;

    if (estimatedHeadlineHeight + estimatedDescHeight > availableHeight * 0.7) {
      // Space constrained: shrink description or hide it
      if (estimatedHeadlineHeight + baseDescSize * 2 > availableHeight * 0.8) {
        descriptionVisible = false;
      } else {
        baseDescSize = Math.max(11, baseDescSize * 0.85);
      }
    }

    if (availableHeight < 200 || availableWidth < 260) {
      legalVisible = false;
      if (availableHeight < 160) descriptionVisible = false;
    }

    // 6. Calculate distance readability score (0..100)
    // Checks if font size meets recommended angular height for viewing distance
    const minRecommendedHeadlineSize = 14 * distanceFactor;
    const readabilityScore = Math.min(
      100,
      Math.max(40, Math.round((baseHeadlineSize / minRecommendedHeadlineSize) * 85))
    );

    return {
      headlineText,
      headlineFontSize: Math.round(baseHeadlineSize),
      headlineLines,
      descriptionText,
      descriptionFontSize: Math.round(baseDescSize),
      descriptionLines,
      descriptionVisible,
      legalText: assets.legalText,
      legalFontSize: Math.round(baseLegalSize),
      legalVisible,
      readabilityScore,
    };
  }
}
