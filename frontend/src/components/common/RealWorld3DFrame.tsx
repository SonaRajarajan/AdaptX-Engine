import React from 'react';
import { SurfaceDefinition } from '../../models/surface';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Wifi,
  Battery,
  Signal,
  Volume2,
  Triangle,
  Home,
  Radio,
  Mic,
  Square,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Check,
  Shuffle,
  Repeat,
  Rss,
} from 'lucide-react';

interface RealWorld3DFrameProps {
  surface: SurfaceDefinition;
  children: React.ReactNode;
  scaleFactor?: number;
  showAnamorphicPopout?: boolean;
}

export const RealWorld3DFrame: React.FC<RealWorld3DFrameProps> = ({
  surface,
  children,
  scaleFactor = 1.0,
  showAnamorphicPopout = false,
}) => {
  const { campaign } = useAdaptXStore();
  const pImage = campaign.assets.productImageUrl;

  const w = surface.width * scaleFactor;
  const h = surface.height * scaleFactor;

  // 1. HIGHWAY BILLBOARD (Matching Reference Image media_1789198669853.jpg)
  if (surface.id === 'highway_billboard') {
    return (
      <div className="relative p-6 bg-gradient-to-b from-sky-400 via-sky-300 to-cyan-100 rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000] overflow-hidden select-none flex flex-col items-center justify-between min-h-[300px]">
        {/* Soft Cloud Radial Accents */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.9) 0%, transparent 70%)',
          }}
        />

        {/* Left Highway Lamppost Light Pole Accent */}
        <div className="absolute left-6 top-10 flex flex-col items-center z-0 opacity-80">
          <div className="w-6 h-1 bg-slate-700 rounded-full -rotate-12 transform origin-right -ml-4" />
          <div className="w-1.5 h-20 bg-gradient-to-b from-slate-600 to-slate-800 border-x border-slate-900" />
        </div>

        {/* Top Billboard Structure Container */}
        <div className="relative z-10 flex flex-col items-center w-full my-auto">
          {/* Main Rectangular Billboard Display Screen */}
          <div
            className="relative border-4 border-slate-900 rounded-md bg-white shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden"
            style={{ width: w, height: h, perspective: '1200px' }}
          >
            {/* Inner Ad Canvas Content */}
            <div className="w-full h-full overflow-hidden relative bg-black">{children}</div>

            {/* 3D ANAMORPHIC POP-OUT STEPPING OUT OVER THE HIGHWAY */}
            {showAnamorphicPopout && pImage && (
              <div
                className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img
                  src={pImage}
                  alt="3D Anamorphic Billboard Popout"
                  className="w-[75%] h-[80%] object-contain drop-shadow-[0_35px_50px_rgba(0,0,0,0.9)] filter brightness-110 contrast-125"
                  style={{
                    transform: 'perspective(1000px) translateZ(90px) rotateY(12deg) translateY(10px) scale(1.28)',
                  }}
                />
              </div>
            )}
          </div>

          {/* Underneath Steel Truss Catwalk Walkway & Safety Railings (Matching Reference Image) */}
          <div className="w-[104%] h-5 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 border-black rounded-b-md shadow-xl flex flex-col justify-between p-0.5 -mt-0.5 relative z-20">
            {/* Metal Lattice Cross-Beams Pattern */}
            <div
              className="w-full h-full opacity-50"
              style={{
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
                backgroundSize: '10px 100%, 100% 4px',
              }}
            />
            {/* Catwalk Safety Railing Posts */}
            <div className="absolute top-0 left-0 right-0 h-2.5 border-t border-slate-400 flex justify-between px-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-0.5 h-full bg-slate-400" />
              ))}
            </div>
          </div>

          {/* Steel Monopole Support Column Mounting Head */}
          <div className="w-12 h-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 border-x-2 border-b-2 border-black shadow-lg flex items-center justify-center relative z-10">
            <div className="w-full h-1 bg-slate-950 opacity-60" />
          </div>
        </div>

        {/* Highway Road & Median Platform at Bottom (Matching Reference Image Asphalt Road Perspective) */}
        <div className="w-[110%] h-14 bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 border-t-2 border-slate-900 shadow-2xl relative overflow-hidden flex flex-col justify-end mt-2 z-0">
          {/* Highway Lane Marker Lines */}
          <div className="w-full h-full relative">
            {/* Left Guardrail */}
            <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-stone-400 to-slate-600 border-r border-slate-900" />
            {/* Yellow Center Dashed Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1.5 border-r-2 border-dashed border-amber-400" />
            {/* Asphalt Grain Texture */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1.5px)',
                backgroundSize: '4px 4px',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. MOBILE PHONE WITH INSTAGRAM APP FEED POP-OUT (Matching Reference Image 3)
  if (surface.id === 'mobile_portrait') {
    return (
      <div className="relative p-5 bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center select-none">
        {/* Smartphone Hardware Casing */}
        <div
          className="relative border-[8px] border-slate-950 rounded-[42px] bg-black shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-1 overflow-visible"
          style={{ width: w + 16, height: h + 70, perspective: '1000px' }}
        >
          {/* Dynamic Island Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-22 h-4 bg-black rounded-full z-50 border border-slate-800 flex items-center justify-between px-3">
            <span className="text-[8px] font-mono font-bold text-white">9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="w-2.5 h-2.5 text-white" />
              <Wifi className="w-2.5 h-2.5 text-white" />
              <Battery className="w-3 h-2 text-white" />
            </div>
          </div>

          {/* Inner Display Screen */}
          <div className="w-full h-full rounded-[34px] bg-white text-black overflow-hidden flex flex-col justify-between relative border border-slate-200">
            {/* Instagram Header Bar */}
            <div className="pt-8 px-3 pb-1.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-20">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[9px] font-black">
                    🛍️
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-900 leading-tight">brand_official</div>
                  <div className="text-[8px] font-mono text-slate-500">Sponsored</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">Follow</span>
                <MoreHorizontal className="w-3.5 h-3.5 text-slate-600" />
              </div>
            </div>

            {/* Main Image Feed Display Canvas */}
            <div className="flex-1 w-full relative overflow-hidden bg-black">{children}</div>

            {/* Instagram Action Buttons Footer */}
            <div className="p-2 border-t border-slate-100 bg-white flex items-center justify-between shrink-0 z-20">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <MessageCircle className="w-4 h-4 text-slate-800" />
                <Send className="w-4 h-4 text-slate-800" />
              </div>
              <Bookmark className="w-4 h-4 text-slate-800" />
            </div>
          </div>

          {/* 3D POP-OUT PRODUCT BREAKING OUT OF INSTAGRAM POST (Image 3 Style) */}
          {showAnamorphicPopout && pImage && (
            <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
              <img
                src={pImage}
                alt="3D Instagram Popout"
                className="w-[85%] h-[65%] object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.9)] filter brightness-110"
                style={{
                  transform: 'perspective(900px) translateZ(80px) translateY(25px) rotateY(12deg) scale(1.28)',
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. SMART TV 4K LIVING ROOM DISPLAY (With Wall Ambient Lighting & Media Console Cabinet)
  if (surface.id === 'smart_tv_4k') {
    return (
      <div className="relative p-6 bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center select-none overflow-hidden">
        {/* Living Room Wall Ambient Lighting Accent */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 50% 35%, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
          }}
        />

        {/* OLED TV Ultra-Thin Screen Frame */}
        <div
          className="relative border-[3px] border-zinc-700 rounded-lg bg-black shadow-[0_30px_80px_rgba(0,0,0,0.95)] p-0.5 z-10"
          style={{ width: w + 8, height: h + 8, perspective: '1200px' }}
        >
          {/* TV Display Screen */}
          <div className="w-full h-full rounded-md overflow-hidden relative bg-black">{children}</div>

          {/* OLED TV Bottom Metal Bezel Bar & Power LED Dot */}
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 flex items-center justify-center">
            <div className="w-1.5 h-1 rounded-full bg-red-500 shadow-[0_0_6px_#EF4444]" />
          </div>

          {/* 3D POP-OUT PRODUCT STEPPING OFF TV SCREEN ONTO LIVING ROOM FLOOR */}
          {showAnamorphicPopout && pImage && (
            <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
              <img
                src={pImage}
                alt="3D TV Popout"
                className="w-[68%] h-[78%] object-contain drop-shadow-[0_35px_50px_rgba(0,0,0,0.9)] filter brightness-110"
                style={{
                  transform: 'perspective(1000px) translateZ(80px) rotateY(-10deg) scale(1.24)',
                }}
              />
            </div>
          )}
        </div>

        {/* Living Room Wooden Media Console Stand & Soundbar */}
        <div className="w-[108%] flex flex-col items-center z-10 -mt-0.5">
          {/* Soundbar Speaker Bar */}
          <div className="w-[70%] h-3 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 border-x border-t border-zinc-600 rounded-t-sm shadow-md flex items-center justify-center">
            <div className="w-12 h-0.5 bg-zinc-900" />
          </div>
          {/* Floating Wooden Media Console Cabinet */}
          <div className="w-full h-4 bg-gradient-to-r from-amber-950 via-stone-800 to-amber-950 border-2 border-black rounded-b-xl shadow-2xl flex items-center justify-between px-6">
            <div className="w-6 h-1 bg-amber-900/60 rounded" />
            <div className="w-6 h-1 bg-amber-900/60 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // 4. IN-CAR DASHBOARD DISPLAY (Matching Reference Image: Honda/Acura CarPlay Infotainment System)
  if (surface.id === 'in_car_display') {
    return (
      <div className="relative p-1 max-w-full flex flex-col items-center justify-center select-none overflow-hidden">
        {/* Leather Dashboard Frame Surround */}
        <div
          className="relative bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-slate-800 rounded-2xl shadow-xl p-2 flex flex-col items-center max-w-full overflow-hidden"
          style={{ width: Math.min(w + 16, 330) }}
        >
          {/* Main Floating Infotainment Display Unit */}
          <div className="flex items-center w-full relative bg-zinc-950 border-2 border-zinc-700 rounded-xl p-1 shadow-lg overflow-hidden">
            {/* Left Hardware Bezel: HOME, CONNECT, VOL/AUDIO Knob */}
            <div className="w-12 flex flex-col items-center justify-between py-1.5 shrink-0 pr-1 border-r border-zinc-800 text-[8px] font-mono text-zinc-400 gap-2 select-none">
              <div className="flex flex-col items-center cursor-pointer hover:text-white">
                <Home className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="text-[7px] font-bold mt-0.5">HOME</span>
              </div>

              <div className="flex flex-col items-center cursor-pointer hover:text-white">
                <Radio className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="text-[7px] font-bold mt-0.5">CONNECT</span>
              </div>

              <div className="flex flex-col items-center cursor-pointer hover:text-white">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-zinc-700 via-zinc-400 to-zinc-800 border border-zinc-300 shadow-md flex items-center justify-center relative my-0.5">
                  <div className="w-1 h-1 rounded-full bg-zinc-900" />
                </div>
                <span className="text-[7px] font-bold">VOL AUDIO</span>
              </div>
            </div>

            {/* Infotainment Screen Display */}
            <div
              className="relative border border-zinc-800 rounded-lg bg-[#090A0C] text-white overflow-hidden flex-1 flex"
              style={{ width: Math.min(w, 270), height: Math.min(h, 115), perspective: '1000px' }}
            >
              {/* Left Vertical CarPlay Dock Bar */}
              <div className="w-8 bg-[#121316] border-r border-zinc-800/80 flex flex-col items-center justify-between py-1.5 shrink-0 z-30">
                <div className="flex flex-col items-center gap-1.5">
                  <Mic className="w-3 h-3 text-amber-500" />
                  <span className="text-[6px] font-bold text-zinc-400">5G</span>
                  <div className="w-3.5 h-3.5 rounded-md bg-emerald-600 flex items-center justify-center text-[7px]">🗺️</div>
                  <div className="w-3.5 h-3.5 rounded-md bg-green-500 flex items-center justify-center text-[7px]">📞</div>
                </div>
                <Square className="w-3 h-3 text-zinc-400 stroke-[2.5]" />
              </div>

              {/* Center Infotainment Main Area */}
              <div className="flex-1 flex flex-col justify-between p-1.5 relative z-20 overflow-hidden">
                {/* Top Status Bar: Queue & Jam */}
                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-400 pb-0.5">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold text-[7px]">● CarPlay Active</span>
                  <span className="bg-zinc-800/90 text-zinc-200 px-2 py-0.5 rounded-full text-[7px] font-bold border border-zinc-700">
                    Queue & Jam
                  </span>
                </div>

                {/* Media Audio UI & Ad Display split */}
                <div className="flex-1 flex items-center gap-1.5 overflow-hidden">
                  {/* Left Side Audio Player Track Info */}
                  <div className="w-2/5 flex flex-col justify-between h-full py-0.5 text-left select-none pr-0.5">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-white tracking-wider leading-tight">REDRED</h4>
                      <p className="text-[8px] font-medium text-zinc-400">CORTIS</p>
                      <p className="text-[7px] font-mono text-zinc-500">REDRED</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 my-0.5">
                      <SkipBack className="w-3 h-3 text-zinc-300 fill-zinc-300 cursor-pointer" />
                      <Pause className="w-3.5 h-3.5 text-white fill-white cursor-pointer" />
                      <SkipForward className="w-3 h-3 text-zinc-300 fill-zinc-300 cursor-pointer" />
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="w-full h-1 bg-zinc-800 rounded-full relative overflow-hidden my-0.5">
                        <div className="w-1/3 h-full bg-white rounded-full" />
                      </div>
                      <div className="flex items-center justify-between text-[6px] font-mono text-zinc-400">
                        <span>0:25</span>
                        <span>-2:18</span>
                      </div>
                    </div>

                    {/* Audio Sub-Actions */}
                    <div className="flex items-center justify-around pt-0.5 text-zinc-400 text-[7px]">
                      <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                      <Shuffle className="w-2.5 h-2.5" />
                      <Repeat className="w-2.5 h-2.5" />
                      <Rss className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  {/* Right Side Main Ad Canvas Display */}
                  <div className="flex-1 h-full rounded-md overflow-hidden relative border border-zinc-800 bg-black">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Air Vent Honeycomb Grille & Red Triangle Hazard Light Button (Exact Reference Match) */}
          <div className="w-full h-9 bg-zinc-950 border-t-2 border-zinc-800 rounded-xl mt-2 flex items-center justify-center relative overflow-hidden shadow-inner px-4">
            {/* Continuous Honeycomb Mesh Pattern */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1.5px)',
                backgroundSize: '7px 7px',
              }}
            />
            {/* Center Red Triangle Emergency Hazard Light Button */}
            <div className="relative z-10 px-3 py-1 rounded-md bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center shadow-lg cursor-pointer hover:bg-zinc-800">
              <Triangle className="w-3.5 h-3.5 text-red-500 fill-red-500 stroke-[2.5]" />
            </div>
          </div>

          {/* Bottom Climate Control Bar (Reference Image: Temperature Dials & Buttons) */}
          <div className="w-full bg-zinc-950 border-t border-zinc-900 rounded-b-2xl mt-1 py-1.5 px-4 flex items-center justify-between text-zinc-400 font-mono text-[9px] select-none">
            {/* Left Temp Dial */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-[7px] font-bold text-white shadow-inner">
                AUTO
              </div>
              <span className="text-white font-black text-xs">68°</span>
            </div>

            {/* Center A/C Status */}
            <div className="flex items-center gap-3 text-[8px] font-bold">
              <span className="text-emerald-400">A/C ON</span>
              <span className="text-zinc-500">FRONT</span>
              <span className="text-zinc-500">REAR</span>
            </div>

            {/* Right Fan Speed Dial */}
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] text-zinc-400 font-bold">FAN</span>
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-[7px] font-bold text-white shadow-inner">
                OFF
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. WEARABLE SMARTWATCH ON WRIST
  if (surface.id === 'wearable_smartwatch') {
    return (
      <div className="relative p-6 bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center select-none overflow-hidden">
        {/* Watch Wrist Strap Top */}
        <div className="w-24 h-10 bg-gradient-to-b from-zinc-800 to-zinc-900 border-x-2 border-t-2 border-black rounded-t-xl shadow-inner -mb-2 z-0 relative flex items-center justify-center">
          <div className="w-16 h-1 bg-zinc-700 rounded-full" />
        </div>

        {/* Watch Case Frame */}
        <div
          className="relative border-[8px] border-slate-700 rounded-[44px] bg-black shadow-[0_25px_50px_rgba(0,0,0,0.9)] p-2 z-10"
          style={{ width: w + 20, height: h + 20, perspective: '900px' }}
        >
          {/* Side Digital Crown Dial */}
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3.5 h-10 bg-gradient-to-r from-amber-600 to-amber-700 border-2 border-black rounded-r-md shadow-md z-20" />
          <div className="absolute -right-2 top-1/3 w-2.5 h-5 bg-slate-800 border border-black rounded-r-sm shadow-md z-20" />

          {/* Inner Display Screen */}
          <div className="w-full h-full rounded-[34px] overflow-hidden relative border border-slate-800">
            {children}
          </div>

          {/* 3D POP-OUT PRODUCT BREAKING OUT OF WATCH FACE */}
          {showAnamorphicPopout && pImage && (
            <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
              <img
                src={pImage}
                alt="3D Watch Popout"
                className="w-[88%] h-[88%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] filter brightness-110"
                style={{
                  transform: 'perspective(800px) translateZ(60px) rotateY(14deg) scale(1.28)',
                }}
              />
            </div>
          )}
        </div>

        {/* Watch Wrist Strap Bottom */}
        <div className="w-24 h-10 bg-gradient-to-t from-zinc-800 to-zinc-900 border-x-2 border-b-2 border-black rounded-b-xl shadow-inner -mt-2 z-0 relative flex items-center justify-center">
          <div className="w-16 h-1 bg-zinc-700 rounded-full" />
        </div>
      </div>
    );
  }

  // 6. VERTICAL SKYSCRAPER TOWER (Matching Reference Image 2: One Times Square Skyscraper)
  if (surface.id === 'vertical_skyscraper') {
    return (
      <div className="relative p-6 bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center select-none overflow-hidden">
        {/* City Skyscraper Facade Backdrop Accent */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Top Skyscraper Building Crown & Header Screen (Image 2 Style) */}
        <div className="w-32 h-6 bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 rounded-t-lg shadow-md z-10 flex items-center justify-center text-[9px] font-mono font-black text-amber-400 tracking-wider">
          ★ TIMES SQUARE LED ★
        </div>

        {/* Vertical Skyscraper LED Tower Container */}
        <div
          className="relative border-4 border-slate-800 rounded-lg bg-black shadow-[0_30px_70px_rgba(0,0,0,0.95)] p-0.5 z-10"
          style={{ width: w + 8, height: h + 8, perspective: '1100px' }}
        >
          {/* Inner Display Screen */}
          <div className="w-full h-full rounded-md overflow-hidden relative border border-slate-800">
            {children}
          </div>

          {/* 3D POP-OUT PRODUCT STEPPING OFF SKYSCRAPER DISPLAY (Image 2 Style) */}
          {showAnamorphicPopout && pImage && (
            <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
              <img
                src={pImage}
                alt="3D Skyscraper Popout"
                className="w-[85%] h-[75%] object-contain drop-shadow-[0_35px_50px_rgba(0,0,0,0.9)] filter brightness-110 contrast-125"
                style={{
                  transform: 'perspective(1000px) translateZ(85px) rotateY(12deg) scale(1.25)',
                }}
              />
            </div>
          )}
        </div>

        {/* Lower Building Base Accent */}
        <div className="w-40 h-3 bg-slate-900 border-x-2 border-b-2 border-slate-700 rounded-b-md shadow-md mt-0.5 z-10" />
      </div>
    );
  }

  // 7. SLEEK HIGH-PRECISION LAPTOP WORKSTATION ON OAK DESK
  if (surface.id === 'desktop_leaderboard' || surface.id.includes('desktop')) {
    return (
      <div className="relative p-6 bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center select-none overflow-hidden">
        {/* Soft Workstation Desk Ambient Accent */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
          }}
        />

        {/* Laptop Display Lid Structure */}
        <div
          className="relative border-[5px] border-slate-700 rounded-t-2xl bg-black shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-1 pb-0 z-10"
          style={{ width: w + 24, height: h + 24, perspective: '1100px' }}
        >
          {/* Top Bezel WebCam */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center z-30">
            <div className="w-0.5 h-0.5 rounded-full bg-blue-400" />
          </div>

          {/* Browser / OS Window Frame Header */}
          <div className="bg-slate-900 px-3 py-1 rounded-t-xl border-b border-slate-800 flex items-center justify-between gap-2 text-[10px] text-slate-400 font-mono z-20 relative">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600" />
            </div>
            {/* SSL Lock & Address Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-md px-3 py-0.5 text-[9px] text-slate-300 mx-auto w-3/5 truncate text-center flex items-center justify-center gap-1.5 shadow-inner">
              <span className="text-emerald-400 font-bold">🔒</span>
              <span>https://brand.com/campaign-leaderboard</span>
            </div>
          </div>

          {/* Inner Display Screen Canvas */}
          <div className="w-full h-[calc(100%-24px)] rounded-b-lg overflow-hidden relative bg-black border border-slate-800">
            {children}
          </div>

          {/* 3D POP-OUT PRODUCT STEPPING OFF LAPTOP DISPLAY */}
          {showAnamorphicPopout && pImage && (
            <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
              <img
                src={pImage}
                alt="3D Laptop Popout"
                className="w-[72%] h-[78%] object-contain drop-shadow-[0_35px_50px_rgba(0,0,0,0.9)] filter brightness-110"
                style={{
                  transform: 'perspective(1000px) translateZ(80px) rotateY(-10deg) scale(1.24)',
                }}
              />
            </div>
          )}
        </div>

        {/* 3D Hinged Metallic Keyboard Base Chassis */}
        <div className="w-[104%] h-9 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-x-2 border-b-2 border-black rounded-b-2xl shadow-2xl flex flex-col items-center justify-between p-1.5 z-10 -mt-0.5">
          {/* Keycaps Grid Rows Texture */}
          <div className="w-4/5 h-3 bg-slate-950 border border-slate-700 rounded-md flex items-center justify-around px-3 shadow-inner">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-2.5 h-1.5 bg-slate-800 rounded-[1px] border border-slate-700" />
            ))}
          </div>

          {/* Centered Metallic Trackpad Plate */}
          <div className="w-28 h-2.5 bg-slate-800 border border-slate-600 rounded-t-md shadow-inner" />
        </div>

        {/* Wooden Desk Platform Surface Base */}
        <div className="w-[110%] h-3 bg-gradient-to-r from-amber-950 via-stone-800 to-amber-950 border-t border-black rounded-b-md shadow-lg mt-0.5 z-0 opacity-90" />
      </div>
    );
  }

  // 8. SOCIAL FEED (1:1 SQUARE) DISPLAY
  if (surface.id === 'social_square') {
    return (
      <div className="relative p-5 bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center select-none">
        {/* Square Frame */}
        <div
          className="relative border-4 border-slate-900 rounded-2xl bg-black shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-1 overflow-hidden"
          style={{ width: w + 8, height: h + 8, perspective: '1000px' }}
        >
          <div className="w-full h-full rounded-xl overflow-hidden relative">{children}</div>

          {/* 3D POP-OUT PRODUCT BREAKING OUT OF SQUARE */}
          {showAnamorphicPopout && pImage && (
            <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
              <img
                src={pImage}
                alt="3D Social Square Popout"
                className="w-[78%] h-[78%] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.9)] filter brightness-110"
                style={{
                  transform: 'perspective(900px) translateZ(70px) rotateY(10deg) scale(1.2)',
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // DEFAULT / OTHER SURFACES (SOCIAL SQUARE, SKYSCRAPER, LEADERBOARD)
  return (
    <div className="relative p-5 bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center select-none">
      {/* Standard Device Frame */}
      <div
        className="relative border-4 border-slate-800 rounded-2xl bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-1"
        style={{ width: w + 8, height: h + 8, perspective: '1000px' }}
      >
        <div className="w-full h-full rounded-xl overflow-hidden relative">{children}</div>

        {/* 3D POP-OUT PRODUCT BREAKING OUT OF FRAME */}
        {showAnamorphicPopout && pImage && (
          <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
            <img
              src={pImage}
              alt="3D Surface Popout"
              className="w-[75%] h-[75%] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)]"
              style={{
                transform: 'perspective(900px) translateZ(65px) rotateY(12deg) scale(1.18)',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
