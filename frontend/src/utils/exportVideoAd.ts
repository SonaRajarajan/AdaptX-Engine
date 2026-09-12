import { VideoAdPreset } from '../data/videoAdSamples';
import { SurfaceDefinition } from '../models/surface';
import { Campaign } from '../models/campaign';

export async function exportVideoAdAsMp4(
  videoAd: VideoAdPreset,
  surface: SurfaceDefinition,
  campaign: Campaign,
  onProgress?: (percent: number, statusText: string) => void
): Promise<void> {
  const width = surface.width;
  const height = surface.height;
  const durationSeconds = videoAd.durationSeconds || 15;
  const fps = 30;
  const totalFrames = durationSeconds * fps;
  const frameIntervalMs = 1000 / fps;

  // Create Offscreen Canvas for Video Rendering
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Preload Product Image
  const pImageUrl = campaign.assets.productImageUrl || videoAd.productImageUrl;
  let img: HTMLImageElement | null = null;

  if (pImageUrl) {
    onProgress?.(5, 'Preloading Product Video Assets...');
    try {
      img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        if (!img) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // continue gracefully if cross-origin blocked
        img.src = pImageUrl;
      });
    } catch {
      img = null;
    }
  }

  // Set up MediaRecorder on Canvas Capture Stream
  const stream = canvas.captureStream(fps);
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      mimeType = 'video/webm;codecs=vp8';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4';
    } else {
      mimeType = '';
    }
  }

  const recordedChunks: Blob[] = [];
  const recorderOptions = mimeType ? { mimeType } : undefined;
  const mediaRecorder = new MediaRecorder(stream, recorderOptions);

  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  const recordingPromise = new Promise<Blob>((resolve) => {
    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(recordedChunks, { type: mimeType || 'video/webm' });
      resolve(videoBlob);
    };
  });

  mediaRecorder.start();

  // Typography & Colors
  const headlineText = campaign.assets.headline || videoAd.headline;
  const descriptionText = campaign.assets.description || videoAd.bodyDescription;
  const ctaText = campaign.assets.ctaText || videoAd.ctaText;
  const headlineColor = campaign.assets.headlineColor || '#ffffff';
  const headlineFontFamily = campaign.assets.headlineFontFamily || campaign.assets.fontFamily || 'sans-serif';
  const ctaBgColor = campaign.assets.brandColors.primary || videoAd.brandColors.primary;
  const ctaTextColor = campaign.assets.ctaTextColor || videoAd.brandColors.text;

  // Frame Rendering Loop
  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
    const t = (frameIndex / fps);
    const progressPercent = Math.round(10 + (frameIndex / totalFrames) * 85);
    onProgress?.(progressPercent, `Rendering Frame ${frameIndex + 1}/${totalFrames} (${Math.round(t)}s / ${durationSeconds}s)...`);

    // 1. Clear Canvas & Dark Background
    ctx.save();
    ctx.fillStyle = '#090D16';
    ctx.fillRect(0, 0, width, height);

    // 2. Motion Transform Matrix Calculation
    let scale = 1.0;
    let translateX = 0;
    let translateY = 0;
    let rotationDeg = 0;

    switch (videoAd.motionStyle) {
      case '360° Slow Orbit':
        scale = 1.05 + Math.sin(t * 1.5) * 0.05;
        translateX = Math.sin(t * 1.2) * 12;
        translateY = Math.cos(t * 1.2) * 8;
        rotationDeg = Math.sin(t * 0.8) * 3;
        break;
      case 'Bounce & Float':
        translateY = -Math.abs(Math.sin(t * 3.5)) * 22;
        scale = 1.0 + Math.sin(t * 3.5) * 0.04;
        break;
      case 'Zoom Pulse':
        scale = 1.0 + Math.sin(t * 0.8) * 0.12;
        translateX = Math.sin(t * 0.5) * 10;
        translateY = Math.cos(t * 0.5) * 8;
        break;
      case 'Holographic Glitch':
        scale = 1.04 + Math.sin(t * 4) * 0.03;
        translateX = Math.sin(t * 8) * 4;
        translateY = Math.cos(t * 8) * 3;
        break;
      case 'Shimmer Glare':
      default:
        scale = 1.06 + Math.cos(t * 2) * 0.04;
        rotationDeg = Math.sin(t * 1.5) * 2;
        break;
    }

    // Render Product Image
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.translate(width / 2 + translateX, height / 2 + translateY);
      ctx.rotate((rotationDeg * Math.PI) / 180);
      ctx.scale(scale, scale);

      // Aspect cover math
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = width / height;
      let drawW = width;
      let drawH = height;

      if (imgRatio > canvasRatio) {
        drawW = height * imgRatio;
      } else {
        drawH = width / imgRatio;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    } else {
      // Fallback Image Placeholder Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#1E1B4B');
      grad.addColorStop(1, '#312E81');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 3. Cyber Dark Vignette Gradient
    const vignette = ctx.createLinearGradient(0, 0, 0, height);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
    vignette.addColorStop(0.4, 'rgba(0, 0, 0, 0.15)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // 4. Equalizer Audio Frequency Bars
    const eqX = 24;
    const eqY = 48;
    const barHeights = [
      12 + Math.abs(Math.sin(t * 10)) * 18,
      16 + Math.abs(Math.cos(t * 12)) * 24,
      10 + Math.abs(Math.sin(t * 14)) * 16,
      14 + Math.abs(Math.cos(t * 9)) * 20,
    ];
    const barColors = ['#FBBF24', '#22D3EE', '#F43F5E', '#34D399'];

    for (let b = 0; b < 4; b++) {
      ctx.fillStyle = barColors[b];
      const hB = barHeights[b];
      ctx.beginPath();
      ctx.roundRect(eqX + b * 10, eqY - hB, 6, hB, 3);
      ctx.fill();
    }

    // 5. Video Badge Tag
    const badgeText = `${videoAd.category.toUpperCase()} • ${durationSeconds}S VIDEO`;
    ctx.fillStyle = '#FFC72C';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.font = '900 11px monospace';
    ctx.textBaseline = 'top';

    const bMetrics = ctx.measureText(badgeText);
    const bW = bMetrics.width + 16;
    const bH = 22;
    const bX = width - bW - 20;
    const bY = 24;

    ctx.beginPath();
    ctx.roundRect(bX, bY, bW, bH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.fillText(badgeText, bX + 8, bY + 5);

    // 6. Center Kinetic Headline
    const headlineFontSize = campaign.assets.headlineFontSize || Math.max(20, Math.min(36, width * 0.06));
    ctx.fillStyle = headlineColor;
    ctx.font = `900 ${headlineFontSize}px ${headlineFontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const hY = height * 0.52;
    // Word wrapping for headline
    const words = headlineText.split(' ');
    let line = '';
    const lines: string[] = [];
    const maxHWidth = width * 0.85;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxHWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    const startY = hY - ((lines.length - 1) * headlineFontSize * 1.2) / 2;
    lines.forEach((l, idx) => {
      // Text Shadow for readability
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillText(l, width / 2 + 2, startY + idx * headlineFontSize * 1.25 + 2);
      ctx.fillStyle = headlineColor;
      ctx.fillText(l, width / 2, startY + idx * headlineFontSize * 1.25);
    });

    // 7. Description Copy
    const descY = startY + lines.length * headlineFontSize * 1.25 + 16;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '600 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(descriptionText, width / 2, descY, width * 0.85);

    // 8. Bottom CTA Button
    const cW = Math.min(width * 0.85, 320);
    const cH = 44;
    const cX = (width - cW) / 2;
    const cY = height - cH - 28;

    // Button background with neobrutalist shadow
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(cX + 3, cY + 3, cW, cH, 12);
    ctx.fill();

    ctx.fillStyle = ctaBgColor;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(cX, cY, cW, cH, 12);
    ctx.fill();
    ctx.stroke();

    // CTA Text
    ctx.fillStyle = ctaTextColor;
    ctx.font = `900 14px ${headlineFontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ctaText.toUpperCase(), width / 2, cY + cH / 2);

    ctx.restore();

    // Wait for next frame timing
    await new Promise((r) => setTimeout(r, frameIntervalMs));
  }

  // Stop MediaRecorder and trigger download
  onProgress?.(98, 'Compiling Commercial MP4 Video...');
  mediaRecorder.stop();

  const videoBlob = await recordingPromise;
  const url = URL.createObjectURL(videoBlob);

  const safeName = (campaign.name || videoAd.name || 'commercial').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
  const fileName = `${safeName}_commercial_${durationSeconds}s.${ext}`;

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 5000);
  onProgress?.(100, 'Video Export Complete!');
}
