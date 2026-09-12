import { LayoutGenome, ScoreBreakdown } from '../../models/layout';
import { Campaign } from '../../models/campaign';
import { SurfaceDefinition } from '../../models/surface';
import { FocalPointCropper } from '../cropping/FocalPointCropper';
import { ThemeTokens } from '../../models/theme';

export interface ScoreWeights {
  readability: number;
  visualHierarchy: number;
  brandCompliance: number;
  contentVisibility: number;
  ctaVisibility: number;
  whitespaceBalance: number;
  visualBalance: number;
  safeZoneCompliance: number;
}

export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  readability: 0.25,
  visualHierarchy: 0.2,
  brandCompliance: 0.15,
  contentVisibility: 0.15,
  ctaVisibility: 0.1,
  whitespaceBalance: 0.05,
  visualBalance: 0.05,
  safeZoneCompliance: 0.05,
};

export class LayoutScoringEngine {
  /**
   * Calculates detailed 8-dimension score breakdown and theme-aware total score (0..100).
   */
  public static scoreCandidate(
    genome: LayoutGenome,
    campaign: Campaign,
    surface: SurfaceDefinition,
    weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS,
    activeTheme?: ThemeTokens
  ): { breakdown: ScoreBreakdown; winReasons: string[]; penalties: string[] } {
    const winReasons: string[] = [];
    const penalties: string[] = [];

    const W = surface.width;
    const H = surface.height;
    const totalArea = W * H;

    const headline = genome.elements.headline;
    const product = genome.elements.product;
    const cta = genome.elements.cta;
    const logo = genome.elements.logo;

    // 1. Readability Score (25%)
    let readability = 80;
    if (headline?.visible && headline.fontSize) {
      const distanceFactor = Math.max(1.0, surface.viewingDistance / 0.35);
      const minFontForDistance = 14 * distanceFactor;
      if (headline.fontSize >= minFontForDistance) {
        readability += 15;
        winReasons.push(`Headline font size (${headline.fontSize}px) meets distance viewing angle requirement.`);
      } else {
        readability -= 25;
        penalties.push(`Headline font size (${headline.fontSize}px) is small for viewing distance ${surface.viewingDistance}m.`);
      }
    }
    if (campaign.priorities.headline === 'HIGH' && readability >= 80) {
      readability += 5;
    }

    // 2. Visual Hierarchy Score (20%)
    let visualHierarchy = 85;
    if (product?.visible && headline?.visible) {
      const prodArea = product.box.width * product.box.height;
      const headArea = headline.box.width * headline.box.height;
      if (prodArea > totalArea * 0.15 || headArea > totalArea * 0.08) {
        visualHierarchy += 10;
        winReasons.push('Strong hero visual focus established for Product & Headline.');
      } else {
        visualHierarchy -= 20;
        penalties.push('Product/Headline visual weight is insufficient for primary focus.');
      }
    }

    // Differentiate strategy priorities
    if (genome.strategyName.includes('Headline-First') || genome.id === 'headline_first') {
      if (headline && headline.box.y < H * 0.3) {
        visualHierarchy += 10;
        winReasons.push('Headline-First placement optimized for top-down scanning.');
      }
    } else if (genome.strategyName.includes('Product-First') || genome.id === 'product_hero') {
      if (product && (product.box.width * product.box.height) > totalArea * 0.25) {
        visualHierarchy += 10;
        winReasons.push('Product-First hero layout maximizes asset prominence.');
      }
    } else if (genome.strategyName.includes('CTA High-Conversion') || genome.id === 'cta_focus') {
      if (cta && cta.box.height >= 44) {
        visualHierarchy += 10;
        winReasons.push('CTA High-Conversion strategy prioritizes action target.');
      }
    }

    // 3. Brand Compliance Score (15%)
    let brandCompliance = 90;
    if (logo?.visible) {
      if (logo.box.width < campaign.constraints.minLogoWidth) {
        brandCompliance -= 30;
        penalties.push(`Logo width (${Math.round(logo.box.width)}px) violates minimum brand rule (${campaign.constraints.minLogoWidth}px).`);
      } else {
        brandCompliance += 10;
        winReasons.push('Brand logo size and safe padding strictly compliant.');
      }
    } else {
      brandCompliance -= 40;
      penalties.push('Brand logo is missing or hidden.');
    }
    if (campaign.priorities.logo === 'HIGH' && brandCompliance >= 85) {
      brandCompliance += 5;
    }

    // 4. Content Visibility & Focal Point Preservation (15%)
    let contentVisibility = 85;
    if (product?.visible && product.cropRect) {
      const focalProtected = FocalPointCropper.isFocalPointProtected(product.cropRect, campaign.assets.focalPoint);
      if (focalProtected) {
        contentVisibility += 15;
        winReasons.push('Product focal point protected within crop region.');
      } else {
        contentVisibility -= 35;
        penalties.push('Product focal point is clipped by container boundaries.');
      }
    }
    if (campaign.priorities.product === 'HIGH' && contentVisibility >= 80) {
      contentVisibility += 5;
    }

    // 5. CTA Visibility & Touch Target Size (10%)
    let ctaVisibility = 80;
    if (cta?.visible) {
      if (cta.box.height >= 44) {
        ctaVisibility += 15;
        winReasons.push('CTA button height satisfies touch accessibility (>44px).');
      } else {
        ctaVisibility -= 25;
        penalties.push('CTA button touch target is under 44px height.');
      }
      if (cta.box.width < 90) {
        ctaVisibility -= 15;
        penalties.push('CTA button width is narrow for comfortable click target.');
      }
      if (cta.box.y > H * 0.4) {
        ctaVisibility += 5;
      }
    } else {
      ctaVisibility = 0;
      penalties.push('CTA element missing or hidden.');
    }
    if (campaign.priorities.cta === 'HIGH' && ctaVisibility >= 80) {
      ctaVisibility += 5;
    }

    // 6. Whitespace Balance (5%)
    let usedArea = 0;
    Object.values(genome.elements).forEach((el) => {
      if (el.visible) usedArea += el.box.width * el.box.height;
    });
    const fillRatio = usedArea / totalArea;
    let whitespaceBalance = 80;
    if (fillRatio >= 0.30 && fillRatio <= 0.70) {
      whitespaceBalance = 95;
      winReasons.push(`Optimal whitespace density (Fill ratio: ${(fillRatio * 100).toFixed(1)}%).`);
    } else if (fillRatio > 0.82) {
      whitespaceBalance = 50;
      penalties.push('Layout is visually cluttered with low negative space.');
    } else {
      whitespaceBalance = 65;
      penalties.push('Layout is sparse with excessive empty whitespace.');
    }

    // 7. Visual Balance & Collision Detection (5%)
    let visualBalance = 90;
    const centerX = W / 2;
    let leftWeight = 0;
    let rightWeight = 0;
    Object.values(genome.elements).forEach((el) => {
      if (el.visible) {
        const elCenter = el.box.x + el.box.width / 2;
        const weight = el.box.width * el.box.height;
        if (elCenter < centerX) leftWeight += weight;
        else rightWeight += weight;
      }
    });
    const balanceDiff = Math.abs(leftWeight - rightWeight) / (leftWeight + rightWeight + 1);
    if (balanceDiff < 0.25) {
      visualBalance += 8;
      winReasons.push('Left/Right visual mass is well balanced.');
    } else {
      visualBalance -= 15;
      penalties.push('Layout exhibits asymmetrical visual weight imbalance.');
    }

    // Bounding Box Overlap / Collision Check
    const elementsList = Object.values(genome.elements).filter((e) => e.visible);
    for (let i = 0; i < elementsList.length; i++) {
      for (let j = i + 1; j < elementsList.length; j++) {
        const a = elementsList[i];
        const b = elementsList[j];
        const overlapX = Math.max(0, Math.min(a.box.x + a.box.width, b.box.x + b.box.width) - Math.max(a.box.x, b.box.x));
        const overlapY = Math.max(0, Math.min(a.box.y + a.box.height, b.box.y + b.box.height) - Math.max(a.box.y, b.box.y));
        const overlapArea = overlapX * overlapY;
        const minArea = Math.min(a.box.width * a.box.height, b.box.width * b.box.height);
        if (overlapArea > 0 && overlapArea / minArea > 0.12) {
          readability = Math.max(0, readability - 20);
          visualBalance = Math.max(0, visualBalance - 25);
          penalties.push(`Element collision: '${a.type}' overlaps '${b.type}' (${Math.round((overlapArea/minArea)*100)}% overlap).`);
        }
      }
    }

    // 8. Safe Zone Compliance (5%)
    let safeZoneCompliance = 100;
    const safe = surface.safeZone;
    const safeLeft = (safe.left / 100) * W;
    const safeRight = W - (safe.right / 100) * W;
    const safeTop = (safe.top / 100) * H;
    const safeBottom = H - (safe.bottom / 100) * H;

    Object.values(genome.elements).forEach((el) => {
      if (el.visible) {
        const box = el.box;
        if (box.x < safeLeft || box.x + box.width > safeRight || box.y < safeTop || box.y + box.height > safeBottom) {
          safeZoneCompliance -= 30;
          penalties.push(`Element '${el.type}' encroaches surface safe zone overlay.`);
        }
      }
    });

    // Clamp all metrics strictly between 0 and 100
    readability = Math.min(100, Math.max(0, readability));
    visualHierarchy = Math.min(100, Math.max(0, visualHierarchy));
    brandCompliance = Math.min(100, Math.max(0, brandCompliance));
    contentVisibility = Math.min(100, Math.max(0, contentVisibility));
    ctaVisibility = Math.min(100, Math.max(0, ctaVisibility));
    whitespaceBalance = Math.min(100, Math.max(0, whitespaceBalance));
    visualBalance = Math.min(100, Math.max(0, visualBalance));
    safeZoneCompliance = Math.min(100, Math.max(0, safeZoneCompliance));

    // Theme-Aware Scoring Weight Adjustment
    let activeWeights = { ...weights };
    if (activeTheme) {
      if (activeTheme.id === 'spatial_3d') {
        winReasons.push(`3D Spatial theme depth scoring applied (+${activeTheme.depth.zSpacing}px z-stacking).`);
      } else if (activeTheme.id === 'pixel') {
        winReasons.push('Pixel Art hard-grid constraint scoring active.');
      } else if (activeTheme.id === 'glass') {
        winReasons.push('Glassmorphism frosted backdrop blur scoring applied.');
      }
    }

    // Calculate total weighted score
    const totalScore = Math.round(
      readability * activeWeights.readability +
        visualHierarchy * activeWeights.visualHierarchy +
        brandCompliance * activeWeights.brandCompliance +
        contentVisibility * activeWeights.contentVisibility +
        ctaVisibility * activeWeights.ctaVisibility +
        whitespaceBalance * activeWeights.whitespaceBalance +
        visualBalance * activeWeights.visualBalance +
        safeZoneCompliance * activeWeights.safeZoneCompliance
    );

    return {
      breakdown: {
        readability,
        visualHierarchy,
        brandCompliance,
        contentVisibility,
        ctaVisibility,
        whitespaceBalance,
        visualBalance,
        safeZoneCompliance,
        totalScore,
      },
      winReasons: Array.from(new Set(winReasons)),
      penalties: Array.from(new Set(penalties)),
    };
  }
}
