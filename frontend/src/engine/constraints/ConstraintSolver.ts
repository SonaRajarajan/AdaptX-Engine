import { ElementGenome, LayoutGenome, ElementType, BoxBounding } from '../../models/layout';
import { SurfaceDefinition } from '../../models/surface';
import { CampaignPriorities } from '../../models/campaign';
import { BASE_ELEMENT_CONSTRAINTS } from '../../models/constraints';

export interface DegradationStep {
  stepIndex: number;
  description: string;
  actionTaken: string;
  elementsModified: ElementType[];
}

export interface ConstraintValidationResult {
  isValid: boolean;
  violations: string[];
  degradationLog: DegradationStep[];
  genome: LayoutGenome;
}

export class ConstraintSolver {
  /**
   * Solves spatial constraints and applies 4-tier graceful degradation to a LayoutGenome
   * ensuring all HIGH priority elements (Logo, Headline, Product, CTA) remain visible and un-clipped.
   */
  public static solveAndValidate(
    genome: LayoutGenome,
    surface: SurfaceDefinition,
    priorities: CampaignPriorities
  ): ConstraintValidationResult {
    const violations: string[] = [];
    const degradationLog: DegradationStep[] = [];
    const modifiedGenome: LayoutGenome = JSON.parse(JSON.stringify(genome));

    const W = surface.width;
    const H = surface.height;
    const safe = surface.safeZone;

    // Calculate actual pixel safe zone bounds
    const safeLeft = (safe.left / 100) * W;
    const safeRight = W - (safe.right / 100) * W;
    const safeTop = (safe.top / 100) * H;
    const safeBottom = H - (safe.bottom / 100) * H;

    // 1. Tier 1 Degradation: If container area < 150,000 px^2 or width < 320, remove decorative elements
    if ((W * H < 150000 || W < 320) && modifiedGenome.elements.decorative?.visible) {
      modifiedGenome.elements.decorative.visible = false;
      degradationLog.push({
        stepIndex: 1,
        description: 'Constrained available surface area',
        actionTaken: 'Removed Tier 4 decorative elements to preserve core messaging space.',
        elementsModified: ['decorative'],
      });
    }

    // 2. Tier 2 Degradation: If space is tight, reduce or hide description
    if (W * H < 120000 || H < 300) {
      if (modifiedGenome.elements.description?.visible) {
        modifiedGenome.elements.description.visible = false;
        degradationLog.push({
          stepIndex: 2,
          description: 'Vertical height or surface area restricted',
          actionTaken: 'Hidden Tier 3 description copy to prevent overflow.',
          elementsModified: ['description'],
        });
      }
    }

    // 3. Tier 3 Degradation: If legal text is LOW priority and height < 250, hide legal text
    if (H < 250 && modifiedGenome.elements.legalText?.visible) {
      modifiedGenome.elements.legalText.visible = false;
      degradationLog.push({
        stepIndex: 3,
        description: 'Extreme spatial constraints',
        actionTaken: 'Hidden LOW priority legal disclaimer text.',
        elementsModified: ['legalText'],
      });
    }

    // 4. Validate Spatial Overlaps & Safe-Zone Bounds for all active elements
    const activeElements = Object.values(modifiedGenome.elements).filter((el) => el.visible);

    for (const el of activeElements) {
      const constraint = BASE_ELEMENT_CONSTRAINTS[el.type];
      const box = el.box;

      // Check min width/height constraints
      if (box.width < constraint.minWidth) {
        if (constraint.priority === 'HIGH') {
          violations.push(
            `Element '${el.type}' width (${Math.round(box.width)}px) is below absolute minimum (${constraint.minWidth}px).`
          );
        }
      }

      // Check Safe Zone compliance for elements that require safe zones
      if (constraint.requiresSafeZone) {
        if (box.x < safeLeft || box.x + box.width > safeRight || box.y < safeTop || box.y + box.height > safeBottom) {
          violations.push(
            `Element '${el.type}' violates surface safe zone insets (Bounds: ${Math.round(box.x)}, ${Math.round(
              box.y
            )}).`
          );
        }
      }

      // Check touch target constraint for interactive CTA buttons on touch surfaces
      if (surface.interactionType === 'touch' && el.type === 'cta') {
        if (box.height < 44 || box.width < 80) {
          violations.push(
            `CTA touch target size (${Math.round(box.width)}x${Math.round(
              box.height
            )}px) is smaller than WCAG recommended 44x44px.`
          );
        }
      }
    }

    // Check collisions between HIGH priority elements
    for (let i = 0; i < activeElements.length; i++) {
      for (let j = i + 1; j < activeElements.length; j++) {
        const a = activeElements[i];
        const b = activeElements[j];
        if (a.zIndex === b.zIndex && this.boxesIntersect(a.box, b.box)) {
          violations.push(`Spatial collision detected between '${a.type}' and '${b.type}'.`);
        }
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
      degradationLog,
      genome: modifiedGenome,
    };
  }

  private static boxesIntersect(a: BoxBounding, b: BoxBounding): boolean {
    const margin = 2; // 2px tolerance
    return !(
      a.x + a.width - margin <= b.x ||
      b.x + b.width - margin <= a.x ||
      a.y + a.height - margin <= b.y ||
      b.y + b.height - margin <= a.y
    );
  }
}
