export interface FocalPoint {
  x: number; // 0..1
  y: number; // 0..1
}

export interface CropRect {
  x: number;      // 0..1 normalized left origin
  y: number;      // 0..1 normalized top origin
  width: number;  // 0..1 normalized crop width
  height: number; // 0..1 normalized crop height
}

export class FocalPointCropper {
  /**
   * Computes normalized crop rectangle (0..1) inside a source image to fit container aspect ratio,
   * keeping the focal point centered and protected within the crop window.
   */
  public static computeCrop(
    sourceAspect: number,
    targetAspect: number,
    focalPoint: FocalPoint
  ): CropRect {
    const fx = Math.max(0.05, Math.min(0.95, focalPoint.x));
    const fy = Math.max(0.05, Math.min(0.95, focalPoint.y));

    let cropW = 1.0;
    let cropH = 1.0;

    if (targetAspect > sourceAspect) {
      // Container is wider than source image: crop vertically
      cropH = sourceAspect / targetAspect;
      cropW = 1.0;
    } else {
      // Container is taller than source image: crop horizontally
      cropW = targetAspect / sourceAspect;
      cropH = 1.0;
    }

    // Center crop window around focal point
    let cropX = fx - cropW / 2;
    let cropY = fy - cropH / 2;

    // Clamp crop rect to stay strictly within [0..1] source bounds
    if (cropX < 0) cropX = 0;
    if (cropX + cropW > 1.0) cropX = 1.0 - cropW;

    if (cropY < 0) cropY = 0;
    if (cropY + cropH > 1.0) cropY = 1.0 - cropH;

    return {
      x: cropX,
      y: cropY,
      width: cropW,
      height: cropH,
    };
  }

  /**
   * Validates if a proposed crop box preserves the focal subject region with at least a 10% safe buffer.
   */
  public static isFocalPointProtected(crop: CropRect, focalPoint: FocalPoint): boolean {
    const buffer = 0.05;
    return (
      focalPoint.x >= crop.x + buffer &&
      focalPoint.x <= crop.x + crop.width - buffer &&
      focalPoint.y >= crop.y + buffer &&
      focalPoint.y <= crop.y + crop.height - buffer
    );
  }
}
