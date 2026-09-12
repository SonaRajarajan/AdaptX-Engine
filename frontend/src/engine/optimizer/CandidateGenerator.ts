import { Campaign } from '../../models/campaign';
import { SurfaceDefinition } from '../../models/surface';
import { LayoutGenome, ElementGenome, BoxBounding } from '../../models/layout';
import { FocalPointCropper } from '../cropping/FocalPointCropper';
import { SmartTypographyEngine } from '../typography/SmartTypographyEngine';

export interface StrategyDefinition {
  name: string;
  flexDirection: LayoutGenome['flexDirection'];
  buildGenome: (campaign: Campaign, surface: SurfaceDefinition) => LayoutGenome;
}

export class CandidateGenerator {
  /**
   * Generates 5 distinct candidate layout genomes for a given campaign & surface context.
   */
  public static generateCandidates(campaign: Campaign, surface: SurfaceDefinition): LayoutGenome[] {
    const W = surface.width;
    const H = surface.height;
    const isPortrait = surface.orientation === 'portrait' || H > W;
    const isLandscape = W >= H;
    const isWide = W / H >= 2.0; // e.g. Billboard or In-Car display

    const candidates: LayoutGenome[] = [];

    // Strategy 1: Product-First (Hero product image taking majority focal area)
    candidates.push(this.buildProductFirstGenome(campaign, surface, W, H, isPortrait, isWide));

    // Strategy 2: Headline-First (Prominent typography at top/left, product secondary)
    candidates.push(this.buildHeadlineFirstGenome(campaign, surface, W, H, isPortrait, isWide));

    // Strategy 3: Split-Screen / Dual Focus (Split layout into image & content halves)
    candidates.push(this.buildSplitScreenGenome(campaign, surface, W, H, isPortrait, isLandscape));

    // Strategy 4: Centered-Hero (Symmetrical balanced composition)
    candidates.push(this.buildCenteredHeroGenome(campaign, surface, W, H, isPortrait));

    // Strategy 5: CTA-Focused (High-conversion CTA focus with bold accent)
    candidates.push(this.buildCtaFocusedGenome(campaign, surface, W, H, isPortrait));

    return candidates;
  }

  private static buildProductFirstGenome(
    campaign: Campaign,
    surface: SurfaceDefinition,
    W: number,
    H: number,
    isPortrait: boolean,
    isWide: boolean
  ): LayoutGenome {
    const topo = SmartTypographyEngine.adaptTypography(
      campaign.assets,
      surface,
      isPortrait ? W - 32 : W * 0.45,
      isPortrait ? H * 0.35 : H - 40,
      campaign.copyMode,
      campaign.compressionLevel
    );

    const crop = FocalPointCropper.computeCrop(
      campaign.assets.productImageAspect,
      isPortrait ? W / (H * 0.52) : (W * 0.5) / H,
      campaign.assets.focalPoint
    );

    const elements: Record<string, ElementGenome> = {};

    if (isPortrait) {
      // Top Logo
      elements.logo = {
        type: 'logo',
        visible: true,
        box: { x: 20, y: 16, width: Math.min(130, W * 0.35), height: 36 },
        scale: 1,
        zIndex: 2,
      };
      // Center Product Image
      elements.product = {
        type: 'product',
        visible: true,
        box: { x: 0, y: 60, width: W, height: Math.round(H * 0.48) },
        scale: 1,
        zIndex: 1,
        cropRect: crop,
      };
      // Headline below product
      elements.headline = {
        type: 'headline',
        visible: true,
        box: { x: 20, y: Math.round(H * 0.56), width: W - 40, height: topo.headlineLines * topo.headlineFontSize * 1.2 },
        scale: 1,
        zIndex: 2,
        fontSize: topo.headlineFontSize,
        lines: topo.headlineLines,
        textCopy: topo.headlineText,
        alignment: 'center',
      };
      // Description
      elements.description = {
        type: 'description',
        visible: topo.descriptionVisible,
        box: { x: 24, y: Math.round(H * 0.70), width: W - 48, height: topo.descriptionLines * topo.descriptionFontSize * 1.3 },
        scale: 1,
        zIndex: 2,
        fontSize: topo.descriptionFontSize,
        lines: topo.descriptionLines,
        textCopy: topo.descriptionText,
        alignment: 'center',
      };
      // CTA Button
      elements.cta = {
        type: 'cta',
        visible: true,
        box: { x: Math.round((W - 180) / 2), y: Math.round(H * 0.83), width: 180, height: 48 },
        scale: 1,
        zIndex: 3,
        textCopy: campaign.assets.ctaText,
      };
      // Legal Text
      elements.legalText = {
        type: 'legalText',
        visible: topo.legalVisible,
        box: { x: 16, y: H - 24, width: W - 32, height: 16 },
        scale: 1,
        zIndex: 2,
        fontSize: topo.legalFontSize,
        textCopy: topo.legalText,
        alignment: 'center',
      };
      // Decorative Accent
      elements.decorative = {
        type: 'decorative',
        visible: true,
        box: { x: W - 60, y: 20, width: 40, height: 40 },
        scale: 1,
        zIndex: 1,
      };
    } else {
      // Landscape layout
      const leftW = Math.round(W * 0.52);
      const rightW = W - leftW;

      elements.product = {
        type: 'product',
        visible: true,
        box: { x: 0, y: 0, width: leftW, height: H },
        scale: 1,
        zIndex: 1,
        cropRect: crop,
      };
      elements.logo = {
        type: 'logo',
        visible: true,
        box: { x: leftW + 24, y: 24, width: Math.min(150, rightW * 0.4), height: 40 },
        scale: 1,
        zIndex: 2,
      };
      const contentPadding = 40;
      const contentX = leftW + contentPadding;
      const contentW = Math.max(160, rightW - contentPadding * 2);
      const headlineHeight = Math.max(32, Math.round(topo.headlineLines * topo.headlineFontSize * 1.25));
      const descHeight = topo.descriptionVisible ? Math.max(24, Math.round(topo.descriptionLines * topo.descriptionFontSize * 1.3)) : 0;
      const startY = Math.max(16, Math.round((H - (headlineHeight + (descHeight > 0 ? descHeight + 12 : 0) + 48 + 20)) / 2));

      elements.headline = {
        type: 'headline',
        visible: true,
        box: { x: contentX, y: startY, width: contentW, height: headlineHeight },
        scale: 1,
        zIndex: 2,
        fontSize: topo.headlineFontSize,
        lines: topo.headlineLines,
        textCopy: topo.headlineText,
        alignment: 'left',
      };
      elements.description = {
        type: 'description',
        visible: topo.descriptionVisible && descHeight > 0,
        box: {
          x: contentX,
          y: startY + headlineHeight + 10,
          width: contentW,
          height: descHeight,
        },
        scale: 1,
        zIndex: 2,
        fontSize: topo.descriptionFontSize,
        lines: topo.descriptionLines,
        textCopy: topo.descriptionText,
        alignment: 'left',
      };
      elements.cta = {
        type: 'cta',
        visible: true,
        box: {
          x: contentX,
          y: startY + headlineHeight + (descHeight > 0 ? descHeight + 16 : 14),
          width: Math.min(180, contentW),
          height: 44,
        },
        scale: 1,
        zIndex: 3,
        textCopy: campaign.assets.ctaText,
      };
      elements.legalText = {
        type: 'legalText',
        visible: topo.legalVisible && H > 300,
        box: { x: leftW + 24, y: H - 28, width: rightW - 48, height: 16 },
        scale: 1,
        zIndex: 2,
        fontSize: topo.legalFontSize,
        textCopy: topo.legalText,
        alignment: 'left',
      };
      elements.decorative = {
        type: 'decorative',
        visible: rightW > 350,
        box: { x: W - 70, y: 24, width: 44, height: 44 },
        scale: 1,
        zIndex: 1,
      };
    }

    return {
      id: 'candidate-product-first',
      strategyName: 'Product-First Hero',
      elements: elements as any,
      padding: 16,
      gap: 12,
      flexDirection: isPortrait ? 'column' : 'split-horizontal',
    };
  }

  private static buildHeadlineFirstGenome(
    campaign: Campaign,
    surface: SurfaceDefinition,
    W: number,
    H: number,
    isPortrait: boolean,
    isWide: boolean
  ): LayoutGenome {
    const topo = SmartTypographyEngine.adaptTypography(
      campaign.assets,
      surface,
      W - 40,
      H * 0.4,
      campaign.copyMode,
      campaign.compressionLevel
    );

    const crop = FocalPointCropper.computeCrop(
      campaign.assets.productImageAspect,
      isPortrait ? W / (H * 0.38) : (W * 0.4) / H,
      campaign.assets.focalPoint
    );

    const elements: Record<string, ElementGenome> = {};

    // Headline first at top
    elements.logo = {
      type: 'logo',
      visible: true,
      box: { x: 24, y: 20, width: Math.min(140, W * 0.3), height: 38 },
      scale: 1,
      zIndex: 2,
    };
    elements.headline = {
      type: 'headline',
      visible: true,
      box: { x: 24, y: 68, width: W - 48, height: topo.headlineLines * topo.headlineFontSize * 1.2 },
      scale: 1.1,
      zIndex: 2,
      fontSize: Math.round(topo.headlineFontSize * 1.1),
      lines: topo.headlineLines,
      textCopy: topo.headlineText,
      alignment: isPortrait ? 'center' : 'left',
    };
    elements.product = {
      type: 'product',
      visible: true,
      box: isPortrait
        ? { x: 20, y: 150, width: W - 40, height: Math.round(H * 0.4) }
        : { x: Math.round(W * 0.55), y: 40, width: Math.round(W * 0.4), height: H - 80 },
      scale: 1,
      zIndex: 1,
      cropRect: crop,
    };
    elements.description = {
      type: 'description',
      visible: topo.descriptionVisible && H > 350,
      box: {
        x: 24,
        y: isPortrait ? Math.round(H * 0.62) : 160,
        width: isPortrait ? W - 48 : Math.round(W * 0.48),
        height: topo.descriptionLines * topo.descriptionFontSize * 1.3,
      },
      scale: 1,
      zIndex: 2,
      fontSize: topo.descriptionFontSize,
      lines: topo.descriptionLines,
      textCopy: topo.descriptionText,
      alignment: 'left',
    };
    elements.cta = {
      type: 'cta',
      visible: true,
      box: {
        x: isPortrait ? Math.round((W - 190) / 2) : 24,
        y: isPortrait ? Math.round(H * 0.78) : Math.round(H - 90),
        width: 190,
        height: 48,
      },
      scale: 1,
      zIndex: 3,
      textCopy: campaign.assets.ctaText,
    };
    elements.legalText = {
      type: 'legalText',
      visible: topo.legalVisible,
      box: { x: 16, y: H - 24, width: W - 32, height: 16 },
      scale: 1,
      zIndex: 2,
      fontSize: topo.legalFontSize,
      textCopy: topo.legalText,
      alignment: isPortrait ? 'center' : 'left',
    };
    elements.decorative = {
      type: 'decorative',
      visible: true,
      box: { x: 24, y: H - 60, width: 36, height: 36 },
      scale: 1,
      zIndex: 1,
    };

    return {
      id: 'candidate-headline-first',
      strategyName: 'Headline-First Focus',
      elements: elements as any,
      padding: 20,
      gap: 14,
      flexDirection: isPortrait ? 'column' : 'split-horizontal',
    };
  }

  private static buildSplitScreenGenome(
    campaign: Campaign,
    surface: SurfaceDefinition,
    W: number,
    H: number,
    isPortrait: boolean,
    isLandscape: boolean
  ): LayoutGenome {
    const topo = SmartTypographyEngine.adaptTypography(
      campaign.assets,
      surface,
      isPortrait ? W - 36 : W * 0.44,
      H * 0.45,
      campaign.copyMode,
      campaign.compressionLevel
    );

    const crop = FocalPointCropper.computeCrop(
      campaign.assets.productImageAspect,
      isPortrait ? W / (H * 0.5) : (W * 0.5) / H,
      campaign.assets.focalPoint
    );

    const elements: Record<string, ElementGenome> = {};

    if (isPortrait) {
      const topHalf = Math.round(H * 0.48);
      elements.product = {
        type: 'product',
        visible: true,
        box: { x: 0, y: 0, width: W, height: topHalf },
        scale: 1,
        zIndex: 1,
        cropRect: crop,
      };
      elements.logo = {
        type: 'logo',
        visible: true,
        box: { x: 20, y: 20, width: 120, height: 34 },
        scale: 1,
        zIndex: 3,
      };
      elements.headline = {
        type: 'headline',
        visible: true,
        box: { x: 20, y: topHalf + 20, width: W - 40, height: topo.headlineLines * topo.headlineFontSize * 1.2 },
        scale: 1,
        zIndex: 2,
        fontSize: topo.headlineFontSize,
        lines: topo.headlineLines,
        textCopy: topo.headlineText,
        alignment: 'left',
      };
      elements.description = {
        type: 'description',
        visible: topo.descriptionVisible,
        box: { x: 20, y: topHalf + 80, width: W - 40, height: topo.descriptionLines * topo.descriptionFontSize * 1.3 },
        scale: 1,
        zIndex: 2,
        fontSize: topo.descriptionFontSize,
        lines: topo.descriptionLines,
        textCopy: topo.descriptionText,
        alignment: 'left',
      };
      elements.cta = {
        type: 'cta',
        visible: true,
        box: { x: 20, y: H - 85, width: 170, height: 46 },
        scale: 1,
        zIndex: 3,
        textCopy: campaign.assets.ctaText,
      };
      elements.legalText = {
        type: 'legalText',
        visible: topo.legalVisible,
        box: { x: 20, y: H - 25, width: W - 40, height: 16 },
        scale: 1,
        zIndex: 2,
        fontSize: topo.legalFontSize,
        textCopy: topo.legalText,
        alignment: 'left',
      };
      elements.decorative = {
        type: 'decorative',
        visible: false,
        box: { x: 0, y: 0, width: 0, height: 0 },
        scale: 1,
        zIndex: 0,
      };
    } else {
      const halfW = Math.round(W * 0.5);
      elements.product = {
        type: 'product',
        visible: true,
        box: { x: 0, y: 0, width: halfW, height: H },
        scale: 1,
        zIndex: 1,
        cropRect: crop,
      };
      elements.logo = {
        type: 'logo',
        visible: true,
        box: { x: halfW + 30, y: 30, width: 140, height: 38 },
        scale: 1,
        zIndex: 2,
      };
      elements.headline = {
        type: 'headline',
        visible: true,
        box: { x: halfW + 30, y: 85, width: halfW - 60, height: topo.headlineLines * topo.headlineFontSize * 1.2 },
        scale: 1,
        zIndex: 2,
        fontSize: topo.headlineFontSize,
        lines: topo.headlineLines,
        textCopy: topo.headlineText,
        alignment: 'left',
      };
      elements.description = {
        type: 'description',
        visible: topo.descriptionVisible,
        box: { x: halfW + 30, y: 160, width: halfW - 60, height: topo.descriptionLines * topo.descriptionFontSize * 1.3 },
        scale: 1,
        zIndex: 2,
        fontSize: topo.descriptionFontSize,
        lines: topo.descriptionLines,
        textCopy: topo.descriptionText,
        alignment: 'left',
      };
      elements.cta = {
        type: 'cta',
        visible: true,
        box: { x: halfW + 30, y: H - 90, width: 180, height: 48 },
        scale: 1,
        zIndex: 3,
        textCopy: campaign.assets.ctaText,
      };
      elements.legalText = {
        type: 'legalText',
        visible: topo.legalVisible,
        box: { x: halfW + 30, y: H - 28, width: halfW - 60, height: 16 },
        scale: 1,
        zIndex: 2,
        fontSize: topo.legalFontSize,
        textCopy: topo.legalText,
        alignment: 'left',
      };
      elements.decorative = {
        type: 'decorative',
        visible: true,
        box: { x: W - 60, y: 30, width: 40, height: 40 },
        scale: 1,
        zIndex: 1,
      };
    }

    return {
      id: 'candidate-split-screen',
      strategyName: 'Split-Screen Balance',
      elements: elements as any,
      padding: 16,
      gap: 16,
      flexDirection: isPortrait ? 'split-vertical' : 'split-horizontal',
    };
  }

  private static buildCenteredHeroGenome(
    campaign: Campaign,
    surface: SurfaceDefinition,
    W: number,
    H: number,
    isPortrait: boolean
  ): LayoutGenome {
    const topo = SmartTypographyEngine.adaptTypography(
      campaign.assets,
      surface,
      W - 60,
      H * 0.35,
      campaign.copyMode,
      campaign.compressionLevel
    );

    const crop = FocalPointCropper.computeCrop(
      campaign.assets.productImageAspect,
      W / (H * 0.4),
      campaign.assets.focalPoint
    );

    const elements: Record<string, ElementGenome> = {};

    elements.logo = {
      type: 'logo',
      visible: true,
      box: { x: Math.round((W - 140) / 2), y: 20, width: 140, height: 38 },
      scale: 1,
      zIndex: 2,
    };
    elements.headline = {
      type: 'headline',
      visible: true,
      box: { x: 30, y: 70, width: W - 60, height: topo.headlineLines * topo.headlineFontSize * 1.2 },
      scale: 1,
      zIndex: 2,
      fontSize: topo.headlineFontSize,
      lines: topo.headlineLines,
      textCopy: topo.headlineText,
      alignment: 'center',
    };
    elements.product = {
      type: 'product',
      visible: true,
      box: { x: Math.round(W * 0.1), y: 140, width: Math.round(W * 0.8), height: Math.round(H * 0.38) },
      scale: 1,
      zIndex: 1,
      cropRect: crop,
    };
    elements.description = {
      type: 'description',
      visible: topo.descriptionVisible && H > 450,
      box: { x: 40, y: Math.round(H * 0.65), width: W - 80, height: topo.descriptionLines * topo.descriptionFontSize * 1.3 },
      scale: 1,
      zIndex: 2,
      fontSize: topo.descriptionFontSize,
      lines: topo.descriptionLines,
      textCopy: topo.descriptionText,
      alignment: 'center',
    };
    elements.cta = {
      type: 'cta',
      visible: true,
      box: { x: Math.round((W - 200) / 2), y: Math.round(H * 0.82), width: 200, height: 50 },
      scale: 1.05,
      zIndex: 3,
      textCopy: campaign.assets.ctaText,
    };
    elements.legalText = {
      type: 'legalText',
      visible: topo.legalVisible,
      box: { x: 20, y: H - 24, width: W - 40, height: 16 },
      scale: 1,
      zIndex: 2,
      fontSize: topo.legalFontSize,
      textCopy: topo.legalText,
      alignment: 'center',
    };
    elements.decorative = {
      type: 'decorative',
      visible: true,
      box: { x: Math.round((W - 40) / 2), y: H - 65, width: 40, height: 30 },
      scale: 1,
      zIndex: 1,
    };

    return {
      id: 'candidate-centered-hero',
      strategyName: 'Centered Hero Symmetrical',
      elements: elements as any,
      padding: 24,
      gap: 16,
      flexDirection: 'hero-overlay',
    };
  }

  private static buildCtaFocusedGenome(
    campaign: Campaign,
    surface: SurfaceDefinition,
    W: number,
    H: number,
    isPortrait: boolean
  ): LayoutGenome {
    const topo = SmartTypographyEngine.adaptTypography(
      campaign.assets,
      surface,
      W - 40,
      H * 0.3,
      campaign.copyMode,
      campaign.compressionLevel
    );

    const crop = FocalPointCropper.computeCrop(
      campaign.assets.productImageAspect,
      (W * 0.9) / (H * 0.35),
      campaign.assets.focalPoint
    );

    const elements: Record<string, ElementGenome> = {};

    elements.logo = {
      type: 'logo',
      visible: true,
      box: { x: 20, y: 16, width: 130, height: 36 },
      scale: 1,
      zIndex: 2,
    };
    elements.product = {
      type: 'product',
      visible: true,
      box: { x: Math.round(W * 0.05), y: 60, width: Math.round(W * 0.9), height: Math.round(H * 0.35) },
      scale: 1,
      zIndex: 1,
      cropRect: crop,
    };
    elements.headline = {
      type: 'headline',
      visible: true,
      box: { x: 20, y: Math.round(H * 0.44), width: W - 40, height: topo.headlineLines * topo.headlineFontSize * 1.2 },
      scale: 1,
      zIndex: 2,
      fontSize: topo.headlineFontSize,
      lines: topo.headlineLines,
      textCopy: topo.headlineText,
      alignment: 'center',
    };
    elements.description = {
      type: 'description',
      visible: topo.descriptionVisible,
      box: { x: 24, y: Math.round(H * 0.58), width: W - 48, height: topo.descriptionLines * topo.descriptionFontSize * 1.3 },
      scale: 1,
      zIndex: 2,
      fontSize: topo.descriptionFontSize,
      lines: topo.descriptionLines,
      textCopy: topo.descriptionText,
      alignment: 'center',
    };

    // Extra prominent CTA button
    const ctaW = Math.min(240, W - 60);
    elements.cta = {
      type: 'cta',
      visible: true,
      box: { x: Math.round((W - ctaW) / 2), y: Math.round(H * 0.76), width: ctaW, height: 56 },
      scale: 1.15,
      zIndex: 4,
      textCopy: campaign.assets.ctaText,
    };
    elements.legalText = {
      type: 'legalText',
      visible: topo.legalVisible,
      box: { x: 16, y: H - 24, width: W - 32, height: 16 },
      scale: 1,
      zIndex: 2,
      fontSize: topo.legalFontSize,
      textCopy: topo.legalText,
      alignment: 'center',
    };
    elements.decorative = {
      type: 'decorative',
      visible: true,
      box: { x: 20, y: H - 80, width: 44, height: 44 },
      scale: 1,
      zIndex: 1,
    };

    return {
      id: 'candidate-cta-focused',
      strategyName: 'CTA High-Conversion Focus',
      elements: elements as any,
      padding: 20,
      gap: 14,
      flexDirection: 'column',
    };
  }
}
