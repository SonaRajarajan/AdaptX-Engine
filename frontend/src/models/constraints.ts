import { PriorityLevel } from './campaign';
import { ElementType } from './layout';

export interface ElementConstraint {
  type: ElementType;
  priority: PriorityLevel;
  minWidth: number;
  maxWidth?: number;
  minHeight: number;
  maxLines?: number;
  minFontSize?: number;
  mustRemainVisible: boolean;
  requiresSafeZone: boolean;
  minTouchTargetSize?: number; // e.g. 44px
}

export const BASE_ELEMENT_CONSTRAINTS: Record<ElementType, ElementConstraint> = {
  logo: {
    type: 'logo',
    priority: 'HIGH',
    minWidth: 70,
    maxWidth: 220,
    minHeight: 28,
    mustRemainVisible: true,
    requiresSafeZone: true,
  },
  headline: {
    type: 'headline',
    priority: 'HIGH',
    minWidth: 140,
    minHeight: 30,
    maxLines: 3,
    minFontSize: 16,
    mustRemainVisible: true,
    requiresSafeZone: true,
  },
  product: {
    type: 'product',
    priority: 'HIGH',
    minWidth: 120,
    minHeight: 100,
    mustRemainVisible: true,
    requiresSafeZone: false,
  },
  cta: {
    type: 'cta',
    priority: 'HIGH',
    minWidth: 110,
    minHeight: 40,
    mustRemainVisible: true,
    requiresSafeZone: true,
    minTouchTargetSize: 44,
  },
  description: {
    type: 'description',
    priority: 'MEDIUM',
    minWidth: 120,
    minHeight: 20,
    maxLines: 4,
    minFontSize: 12,
    mustRemainVisible: false,
    requiresSafeZone: false,
  },
  legalText: {
    type: 'legalText',
    priority: 'LOW',
    minWidth: 100,
    minHeight: 12,
    minFontSize: 9,
    mustRemainVisible: false,
    requiresSafeZone: false,
  },
  decorative: {
    type: 'decorative',
    priority: 'LOW',
    minWidth: 40,
    minHeight: 40,
    mustRemainVisible: false,
    requiresSafeZone: false,
  },
};
