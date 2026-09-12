import { Campaign } from '../../models/campaign';
import { SurfaceDefinition } from '../../models/surface';
import { LayoutGenome } from '../../models/layout';

export interface AuditReport {
  brandComplianceScore: number; // 0..100
  accessibilityScore: number;   // 0..100
  contrastRatio: number;        // e.g. 7.2 (:1)
  touchTargetIssues: string[];
  brandIssues: string[];
  a11yIssues: string[];
}

export class BrandAndA11yValidator {
  /**
   * Performs Brand Compliance and WCAG Accessibility audit on a candidate layout genome.
   */
  public static auditLayout(
    genome: LayoutGenome,
    campaign: Campaign,
    surface: SurfaceDefinition
  ): AuditReport {
    const brandIssues: string[] = [];
    const a11yIssues: string[] = [];
    const touchTargetIssues: string[] = [];

    // 1. Audit Brand Rules
    let brandScore = 100;
    const logo = genome.elements.logo;
    if (logo?.visible) {
      if (logo.box.width < campaign.constraints.minLogoWidth) {
        brandScore -= 20;
        brandIssues.push(`Logo width (${Math.round(logo.box.width)}px) is less than min brand constraint ${campaign.constraints.minLogoWidth}px.`);
      }
      if (campaign.constraints.maxLogoWidth && logo.box.width > campaign.constraints.maxLogoWidth) {
        brandScore -= 10;
        brandIssues.push(`Logo width exceeds max brand threshold.`);
      }
    } else {
      brandScore -= 35;
      brandIssues.push('Brand logo element is missing.');
    }

    if (campaign.assets.fontFamily !== campaign.constraints.fontFamily) {
      brandScore -= 10;
      brandIssues.push('Font family deviates from registered brand guidelines.');
    }

    // 2. Audit Accessibility & Contrast
    let a11yScore = 100;
    const contrastRatio = this.calculateContrastRatio(
      campaign.assets.brandColors.text,
      campaign.assets.brandColors.background
    );

    if (contrastRatio < 4.5) {
      a11yScore -= 30;
      a11yIssues.push(`Contrast ratio (${contrastRatio.toFixed(2)}:1) fails WCAG AA requirement (minimum 4.5:1).`);
    } else if (contrastRatio < 7.0) {
      a11yIssues.push(`Contrast ratio (${contrastRatio.toFixed(2)}:1) passes WCAG AA but not AAA.`);
    }

    // Audit Touch Target Sizes for Touch Surfaces
    if (surface.interactionType === 'touch') {
      const cta = genome.elements.cta;
      if (cta?.visible) {
        if (cta.box.height < 44 || cta.box.width < 44) {
          a11yScore -= 25;
          const msg = `CTA touch target size (${Math.round(cta.box.width)}x${Math.round(cta.box.height)}px) fails minimum 44x44px accessibility standard.`;
          touchTargetIssues.push(msg);
          a11yIssues.push(msg);
        }
      }
    }

    // Audit Minimum Font Size
    const headline = genome.elements.headline;
    if (headline?.visible && headline.fontSize && headline.fontSize < 14) {
      a11yScore -= 15;
      a11yIssues.push(`Headline font size (${headline.fontSize}px) is below minimum readable font threshold (14px).`);
    }

    return {
      brandComplianceScore: Math.max(0, brandScore),
      accessibilityScore: Math.max(0, a11yScore),
      contrastRatio: parseFloat(contrastRatio.toFixed(2)),
      touchTargetIssues,
      brandIssues,
      a11yIssues,
    };
  }

  /**
   * Computes WCAG 2.1 relative luminance contrast ratio between two hex color codes.
   */
  public static calculateContrastRatio(hex1: string, hex2: string): number {
    const lum1 = this.getRelativeLuminance(hex1);
    const lum2 = this.getRelativeLuminance(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  private static getRelativeLuminance(hex: string): number {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;

    const transform = (val: number) => (val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4));

    const R = transform(r);
    const G = transform(g);
    const B = transform(b);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
}
