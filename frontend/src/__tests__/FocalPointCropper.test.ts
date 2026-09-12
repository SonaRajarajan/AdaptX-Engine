import { describe, it, expect } from 'vitest';
import { FocalPointCropper } from '../engine/cropping/FocalPointCropper';

describe('FocalPointCropper Engine', () => {
  it('should compute valid crop bounds keeping focal point protected', () => {
    const focalPoint = { x: 0.52, y: 0.48 };
    const sourceAspect = 1.5; // 3:2 landscape image
    const targetAspect = 0.56; // 9:16 portrait container

    const crop = FocalPointCropper.computeCrop(sourceAspect, targetAspect, focalPoint);

    expect(crop.width).toBeLessThanOrEqual(1.0);
    expect(crop.height).toBeLessThanOrEqual(1.0);
    expect(crop.x).toBeGreaterThanOrEqual(0);
    expect(crop.y).toBeGreaterThanOrEqual(0);

    const isProtected = FocalPointCropper.isFocalPointProtected(crop, focalPoint);
    expect(isProtected).toBe(true);
  });
});
