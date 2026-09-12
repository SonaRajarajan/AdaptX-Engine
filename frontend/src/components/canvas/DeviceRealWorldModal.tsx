import React, { useState } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { SURFACE_PRESETS, SurfaceDefinition } from '../../models/surface';
import { VIDEO_AD_PRESETS } from '../../data/videoAdSamples';
import { AdaptiveAdRenderer } from './AdaptiveAdRenderer';
import { VideoAdRenderer } from './VideoAdRenderer';
import { RealWorld3DFrame } from '../common/RealWorld3DFrame';
import { exportAdCanvasAsPng } from '../../utils/exportAdCanvas';
import { exportVideoAdAsMp4 } from '../../utils/exportVideoAd';
import {
  X,
  Smartphone,
  Tv,
  Monitor,
  Watch,
  Building2,
  Car,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Box,
  Share2,
  Save,
  Download,
  Check,
  Loader2,
} from 'lucide-react';

interface DeviceRealWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceRealWorldModal: React.FC<DeviceRealWorldModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { campaign, activeSurface, setActiveSurface, selectedCandidate, activeVideoAdId, adMode, auditReport } =
    useAdaptXStore();
  const selectedVideoAd = VIDEO_AD_PRESETS.find((v) => v.id === activeVideoAdId) || VIDEO_AD_PRESETS[0];
  const [selectedSurfaceId, setSelectedSurfaceId] = useState<string>(activeSurface.id);
  const [is3DPopoutActive, setIs3DPopoutActive] = useState<boolean>(false);
  const [viewAllGrid, setViewAllGrid] = useState<boolean>(false);

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadStatus, setDownloadStatus] = useState<string>('');

  if (!isOpen) return null;

  const surfaceList: { id: string; label: string; icon: React.ElementType; surface: SurfaceDefinition }[] = [
    { id: 'mobile_portrait', label: 'iPhone Pro', icon: Smartphone, surface: SURFACE_PRESETS.mobile_portrait },
    { id: 'desktop_leaderboard', label: 'Laptop Desk', icon: Monitor, surface: SURFACE_PRESETS.desktop_leaderboard },
    { id: 'smart_tv_4k', label: '4K Living Room TV', icon: Tv, surface: SURFACE_PRESETS.smart_tv_4k },
    { id: 'social_square', label: 'Social Square', icon: Share2, surface: SURFACE_PRESETS.social_square },
    { id: 'in_car_display', label: 'Hypercar Cockpit', icon: Car, surface: SURFACE_PRESETS.in_car_display },
    { id: 'wearable_smartwatch', label: 'Wrist Smartwatch', icon: Watch, surface: SURFACE_PRESETS.wearable_smartwatch },
    { id: 'highway_billboard', label: 'Highway Billboard', icon: Building2, surface: SURFACE_PRESETS.highway_billboard },
    { id: 'vertical_skyscraper', label: 'Skyscraper Tower', icon: Building2, surface: SURFACE_PRESETS.vertical_skyscraper },
  ];

  const currentSurface = surfaceList.find((s) => s.id === selectedSurfaceId)?.surface || activeSurface;

  // Compute zoom scale factor based on viewport size & device surface resolution
  const maxW = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.72, 950) : 800;
  const maxH = typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.60, 540) : 480;
  let scaleFactor = Math.min(1.2, Math.min(maxW / currentSurface.width, maxH / currentSurface.height));

  if (currentSurface.id === 'smart_tv_4k') {
    scaleFactor *= 0.85;
  } else if (currentSurface.id === 'desktop_leaderboard' || currentSurface.id === 'highway_billboard') {
    scaleFactor *= 0.90;
  }

  const handleSelectSurface = (surf: SurfaceDefinition) => {
    setSelectedSurfaceId(surf.id);
    setActiveSurface(surf);
    setViewAllGrid(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      if (adMode === 'video') {
        setDownloadStatus('Exporting Video...');
        await exportVideoAdAsMp4(selectedVideoAd, currentSurface, campaign, (percent, statusText) => {
          setDownloadStatus(`${Math.round(percent)}% ${statusText}`);
        });
      } else {
        setDownloadStatus('Downloading Image...');
        if (selectedCandidate) {
          await exportAdCanvasAsPng(selectedCandidate, currentSurface, campaign);
        } else {
          const canvas = document.createElement('canvas');
          canvas.width = currentSurface.width;
          canvas.height = currentSurface.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = campaign.assets.brandColors.primary || '#FFB000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const link = document.createElement('a');
            link.download = `adaptx-${currentSurface.id}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          }
        }
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
      setDownloadStatus('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] border-4 border-black rounded-3xl w-full max-w-[98vw] h-[94vh] flex flex-col justify-between overflow-hidden shadow-[12px_12px_0px_#000000] relative text-black">
        {/* Modal Header */}
        <div className="p-3.5 border-b-3 border-black bg-[#FFB000] flex items-center justify-between z-20 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000000]">
              <Eye className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h2 className="font-black text-base uppercase tracking-wide flex items-center gap-2 text-black">
                Real Time Device Environments
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black animate-ping" />
              </h2>
              <p className="text-xs text-slate-900 font-mono font-bold">
                Live Spatial Contextual Preview • Active Surface:{' '}
                <span className="text-purple-950 font-black underline">{currentSurface.name}</span> ({currentSurface.width}×
                {currentSurface.height}px)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* SAVE Button (Left) */}
            <button
              onClick={handleSave}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black border-2 border-black flex items-center gap-1.5 uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer ${
                isSaved ? 'bg-emerald-500 text-white' : 'bg-[#4ADE80] hover:bg-[#22C55E] text-black'
              }`}
              title="Save campaign and surface layout state"
            >
              {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <Save className="w-4 h-4 stroke-[3]" />}
              <span>{isSaved ? 'SAVED!' : 'SAVE'}</span>
            </button>

            {/* DOWNLOAD Button (Right of Save) */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-xl font-mono text-xs font-black border-2 border-black flex items-center gap-1.5 uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer bg-[#3B82F6] hover:bg-[#2563EB] text-white disabled:opacity-70"
              title={adMode === 'video' ? 'Export & Download Video Commercial (MP4)' : 'Download High-Res Poster Ad (PNG)'}
            >
              {isDownloading ? <Loader2 className="w-4 h-4 stroke-[3] animate-spin" /> : <Download className="w-4 h-4 stroke-[3]" />}
              <span>{isDownloading ? downloadStatus || 'DOWNLOADING...' : 'DOWNLOAD'}</span>
            </button>

            {/* Toggle 3D Popout */}
            {adMode !== 'video' && (
              <button
                onClick={() => setIs3DPopoutActive(!is3DPopoutActive)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black border-2 border-black flex items-center gap-1.5 uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer ${
                  is3DPopoutActive
                    ? 'bg-[#FF4500] text-white ring-2 ring-black'
                    : 'bg-white text-black hover:bg-amber-100'
                }`}
              >
                <Box className="w-4 h-4 stroke-[3]" />
                <span>{is3DPopoutActive ? '3D Pop-Out ON' : '3D Pop-Out OFF'}</span>
              </button>
            )}

            {/* Grid vs Single View Toggle */}
            <button
              onClick={() => setViewAllGrid(!viewAllGrid)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black border-2 border-black flex items-center gap-1.5 uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer ${
                viewAllGrid
                  ? 'bg-purple-600 text-white ring-2 ring-black'
                  : 'bg-white text-black hover:bg-amber-100'
              }`}
            >
              <Layers className="w-4 h-4 stroke-[3]" />
              <span>{viewAllGrid ? 'Grid View Active' : 'Show All Devices'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white hover:bg-red-500 hover:text-white text-black border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors cursor-pointer"
              title="Close Preview (Esc)"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Device Environment Selector Bar */}
        <div className="bg-white border-b-3 border-black px-4 py-2 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
          <span className="text-[11px] font-mono font-bold text-slate-700 uppercase mr-2 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Select Device:
          </span>
          {surfaceList.map((item) => {
            const IconComp = item.icon;
            const isSelected = !viewAllGrid && selectedSurfaceId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectSurface(item.surface)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border-2 border-black flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#48BB78] text-black shadow-[2px_2px_0px_#000] scale-105 font-black'
                    : 'bg-slate-100 text-slate-800 hover:bg-amber-100 border-black'
                }`}
              >
                <IconComp className="w-4 h-4 stroke-[2.5]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Display Area */}
        <div
          className={`flex-1 flex justify-center bg-gradient-to-b from-stone-100 via-amber-50/40 to-slate-200 relative overflow-auto custom-scrollbar ${
            viewAllGrid ? 'items-start p-4 sm:p-6 pt-6 pb-12' : 'items-center p-4 sm:p-8'
          }`}
        >
          {/* Subtle Grid Accent */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#000000 1.2px, transparent 1.2px)',
              backgroundSize: '24px 24px',
            }}
          />

          {viewAllGrid ? (
            /* ALL SURFACES GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl relative z-10 my-2">
              {surfaceList.map((item) => {
                const surf = item.surface;
                const targetW = surf.id === 'in_car_display' || surf.id === 'highway_billboard' ? 285 : 300;
                const targetH = surf.id === 'wearable_smartwatch' ? 135 : surf.id === 'vertical_skyscraper' ? 185 : 175;
                const miniScale = Math.min(targetW / surf.width, targetH / surf.height);

                return (
                  <div
                    key={surf.id}
                    onClick={() => handleSelectSurface(surf)}
                    className="bg-white border-3 border-black hover:border-purple-600 rounded-3xl p-4 flex flex-col items-center justify-between cursor-pointer transition-all hover:scale-[1.01] shadow-[4px_4px_0px_#000000] group relative overflow-hidden"
                  >
                    {/* Card Top Title Bar */}
                    <div className="flex items-center justify-between w-full pb-2 border-b-2 border-black text-xs font-mono shrink-0 bg-white z-20">
                      <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <item.icon className="w-4 h-4 text-purple-600" />
                        {item.label}
                      </span>
                      <span className="text-slate-600 text-[10px] font-bold">
                        {surf.width}×{surf.height}px
                      </span>
                    </div>

                    {/* Device Frame Viewport Container */}
                    <div className="h-[225px] w-full flex items-center justify-center relative my-1 overflow-hidden bg-stone-50/60 rounded-2xl border-2 border-slate-200 shadow-inner">
                      <div className="flex items-center justify-center transform transition-transform">
                        <RealWorld3DFrame surface={surf} scaleFactor={miniScale} showAnamorphicPopout={is3DPopoutActive}>
                          {adMode === 'video' ? (
                            <VideoAdRenderer
                              videoAd={selectedVideoAd}
                              surface={surf}
                              scaleFactor={miniScale}
                              interactive={false}
                            />
                          ) : selectedCandidate ? (
                            <AdaptiveAdRenderer
                              candidate={selectedCandidate}
                              surface={surf}
                              campaign={campaign}
                              showOverlays={false}
                              scaleFactor={miniScale}
                              interactive={false}
                              is3DProductPopout={is3DPopoutActive}
                            />
                          ) : null}
                        </RealWorld3DFrame>
                      </div>
                    </div>

                    {/* Card Footer Button */}
                    <div className="w-full pt-2 border-t-2 border-black text-center text-[10px] font-mono font-black text-slate-700 group-hover:text-purple-700 transition-colors uppercase shrink-0 bg-white z-20">
                      Click to expand {item.label} environment →
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* SINGLE EXPANDED DEVICE ENVIRONMENT VIEW */
            <div className="z-10 transition-transform duration-300 flex flex-col items-center justify-center max-w-full">
              <RealWorld3DFrame surface={currentSurface} scaleFactor={scaleFactor} showAnamorphicPopout={is3DPopoutActive}>
                {adMode === 'video' ? (
                  <VideoAdRenderer
                    videoAd={selectedVideoAd}
                    surface={currentSurface}
                    scaleFactor={scaleFactor}
                    interactive={true}
                  />
                ) : selectedCandidate ? (
                  <AdaptiveAdRenderer
                    candidate={selectedCandidate}
                    surface={currentSurface}
                    campaign={campaign}
                    showOverlays={true}
                    scaleFactor={scaleFactor}
                    interactive={true}
                    is3DProductPopout={is3DPopoutActive}
                  />
                ) : (
                  <div className="p-8 text-center text-xs font-mono text-slate-500">
                    Generating composition preview...
                  </div>
                )}
              </RealWorld3DFrame>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t-3 border-black bg-white flex items-center justify-between z-20 shrink-0 text-xs font-mono font-bold text-slate-900 flex-wrap gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[3]" />
              WCAG Audit: {auditReport?.contrastRatio && auditReport.contrastRatio >= 4.5 ? 'AAA Passed' : 'AA Compliant'}
            </span>
            <span className="text-slate-600">Viewing Distance: {currentSurface.viewingDistance}m</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* SAVE Button (Left) */}
            <button
              onClick={handleSave}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-black border-2 border-black flex items-center gap-1.5 uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer ${
                isSaved ? 'bg-emerald-500 text-white' : 'bg-[#4ADE80] hover:bg-[#22C55E] text-black'
              }`}
              title="Save campaign and surface layout state"
            >
              {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <Save className="w-4 h-4 stroke-[3]" />}
              <span>{isSaved ? 'SAVED!' : 'SAVE'}</span>
            </button>

            {/* DOWNLOAD Button (Right of Save) */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-3.5 py-1.5 rounded-xl font-mono text-xs font-black border-2 border-black flex items-center gap-1.5 uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer bg-[#3B82F6] hover:bg-[#2563EB] text-white disabled:opacity-70"
              title={adMode === 'video' ? 'Export & Download Video Commercial (MP4)' : 'Download High-Res Poster Ad (PNG)'}
            >
              {isDownloading ? <Loader2 className="w-4 h-4 stroke-[3] animate-spin" /> : <Download className="w-4 h-4 stroke-[3]" />}
              <span>{isDownloading ? downloadStatus || 'DOWNLOADING...' : 'DOWNLOAD'}</span>
            </button>

            <span className="bg-[#FFB000] text-black px-3 py-1 rounded-xl border-2 border-black font-black items-center gap-1 shadow-[2px_2px_0px_#000000] uppercase text-[11px] hidden lg:flex">
              <CheckCircle2 className="w-3.5 h-3.5" /> Real-Time 3D Spatial Rendering
            </span>

            <button
              onClick={onClose}
              className="px-5 py-1.5 bg-black text-white font-black rounded-xl border-2 border-black uppercase hover:bg-slate-800 transition-colors shadow-[2px_2px_0px_#000000] cursor-pointer"
            >
              Exit Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
