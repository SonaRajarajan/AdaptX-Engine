import { Campaign } from '../models/campaign';
import { SurfaceDefinition } from '../models/surface';
import { LayoutCandidate } from '../models/layout';

export async function exportAdCanvasAsPng(
  candidate: LayoutCandidate,
  surface: SurfaceDefinition,
  campaign: Campaign
): Promise<void> {
  const width = surface.width;
  const height = surface.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Draw Background
  const primaryColor = campaign.assets.brandColors.primary || '#FFB000';
  const bgColor = campaign.assets.brandColors.background || '#FAF7F2';
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const genome = candidate.genome;
  const elements = genome.elements;

  // 2. Draw Product Image
  const productEl = elements.product;
  if (productEl && productEl.visible && campaign.assets.productImageUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = campaign.assets.productImageUrl;
      });

      const { x, y, width: pW, height: pH } = productEl.box;

      ctx.save();
      ctx.beginPath();

      const shapeCut = campaign.assets.productShapeCut || 'none';
      if (shapeCut === 'circle') {
        ctx.ellipse(x + pW / 2, y + pH / 2, pW / 2, pH / 2, 0, 0, Math.PI * 2);
        ctx.clip();
      } else if (shapeCut === 'arch') {
        ctx.roundRect(x, y, pW, pH, [pW / 2, pW / 2, 12, 12]);
        ctx.clip();
      } else if (shapeCut === 'diamond') {
        ctx.moveTo(x + pW / 2, y);
        ctx.lineTo(x + pW, y + pH / 2);
        ctx.lineTo(x + pW / 2, y + pH);
        ctx.lineTo(x, y + pH / 2);
        ctx.closePath();
        ctx.clip();
      } else if (shapeCut === 'hexagon') {
        ctx.moveTo(x + pW * 0.25, y);
        ctx.lineTo(x + pW * 0.75, y);
        ctx.lineTo(x + pW, y + pH * 0.5);
        ctx.lineTo(x + pW * 0.75, y + pH);
        ctx.lineTo(x + pW * 0.25, y + pH);
        ctx.lineTo(x, y + pH * 0.5);
        ctx.closePath();
        ctx.clip();
      } else if (shapeCut === 'card') {
        ctx.roundRect(x, y, pW, pH, 20);
        ctx.clip();
      }

      ctx.drawImage(img, x, y, pW, pH);
      ctx.restore();

      // Border around product box
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, pW, pH);
    } catch {
      // Fallback if cross-origin image fails
      ctx.fillStyle = primaryColor;
      ctx.fillRect(productEl.box.x, productEl.box.y, productEl.box.width, productEl.box.height);
    }
  }

  // 3. Draw Logo Image
  const logoEl = elements.logo;
  if (logoEl && logoEl.visible && campaign.assets.logoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = campaign.assets.logoUrl;
      });
      ctx.drawImage(img, logoEl.box.x, logoEl.box.y, logoEl.box.width, logoEl.box.height);
    } catch {
      // Ignore
    }
  }

  // 4. Draw Headline
  const headlineEl = elements.headline;
  if (headlineEl && headlineEl.visible) {
    const text = campaign.assets.headline;
    const fontSize = campaign.assets.headlineFontSize || headlineEl.fontSize || 24;
    const fontColor = campaign.assets.headlineColor || '#000000';
    const fontFam = campaign.assets.headlineFontFamily || campaign.assets.fontFamily || 'sans-serif';

    ctx.fillStyle = fontColor;
    ctx.font = `900 ${fontSize}px ${fontFam}`;
    ctx.textBaseline = 'top';

    // Basic multi-line word wrapping
    const words = text.split(' ');
    let line = '';
    let currY = headlineEl.box.y;
    const maxWidth = headlineEl.box.width;
    const lineHeight = fontSize * 1.25;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), headlineEl.box.x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), headlineEl.box.x, currY);
  }

  // 5. Draw Description
  const descEl = elements.description;
  if (descEl && descEl.visible) {
    const text = campaign.assets.description;
    const fontSize = campaign.assets.descriptionFontSize || descEl.fontSize || 14;
    const fontColor = campaign.assets.descriptionColor || '#1E293B';

    ctx.fillStyle = fontColor;
    ctx.font = `600 ${fontSize}px sans-serif`;
    ctx.textBaseline = 'top';
    ctx.fillText(text, descEl.box.x, descEl.box.y, descEl.box.width);
  }

  // 6. Draw CTA Button
  const ctaEl = elements.cta;
  if (ctaEl && ctaEl.visible) {
    const { x, y, width: cW, height: cH } = ctaEl.box;
    const ctaStyle = campaign.constraints.ctaStyle || 'solid';

    ctx.fillStyle = primaryColor;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;

    ctx.beginPath();
    if (ctaStyle === 'pill') {
      ctx.roundRect(x, y, cW, cH, cH / 2);
    } else {
      ctx.roundRect(x, y, cW, cH, 8);
    }
    ctx.fill();
    ctx.stroke();

    // CTA Text
    const ctaText = campaign.assets.ctaText;
    const fontSize = campaign.assets.ctaFontSize || ctaEl.fontSize || 14;
    const fontColor = campaign.assets.ctaTextColor || '#000000';
    const fontFam = campaign.assets.ctaFontFamily || campaign.assets.fontFamily || 'sans-serif';

    ctx.fillStyle = fontColor;
    ctx.font = `900 ${fontSize}px ${fontFam}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ctaText, x + cW / 2, y + cH / 2);
  }

  // 7. Draw Legal Text
  const legalEl = elements.legalText;
  if (legalEl && legalEl.visible) {
    const text = campaign.assets.legalText;
    const fontSize = campaign.assets.legalFontSize || legalEl.fontSize || 9;
    const fontColor = campaign.assets.legalColor || '#64748B';

    ctx.fillStyle = fontColor;
    ctx.font = `500 ${fontSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, width / 2, height - 10);
  }

  // 8. Custom Elements (Text Box & Image Box)
  if (campaign.assets.customElements) {
    for (const elem of campaign.assets.customElements) {
      if (elem.type === 'text') {
        const fontSize = elem.fontSize || 16;
        ctx.fillStyle = elem.color || '#000000';
        ctx.font = `900 ${fontSize}px ${elem.fontFamily || 'sans-serif'}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(elem.content, elem.x, elem.y);
      } else if (elem.type === 'image' && elem.content) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = elem.content;
          });
          ctx.drawImage(img, elem.x, elem.y, elem.width || 100, elem.height || 100);
        } catch {
          // Ignore
        }
      }
    }
  }

  // Convert to Data URL and Trigger Download
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  const fileName = `${(campaign.name || 'ad_campaign').toLowerCase().replace(/[^a-z0-9]/g, '_')}_ad.png`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
