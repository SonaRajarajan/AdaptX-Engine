import { WebsiteVibe } from '../store/useAdaptXStore';

export interface VibeStyleConfig {
  appBg: string;
  headerBg: string;
  headerText: string;
  headerBorder: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  cardText: string;
  pillActive: string;
  pillInactive: string;
  buttonPrimary: string;
  buttonSecondary: string;
  badgeBg: string;
  accentText: string;
  statBlock1: string;
  statBlock2: string;
  statBlock3: string;
}

export const VIBE_STYLES: Record<WebsiteVibe, VibeStyleConfig> = {
  organic_pastel: {
    // Matching attached colorful patchwork image (Lilac, Coral, Gold, Mint, Sage)
    appBg: 'bg-gradient-to-br from-[#FFFDF5] via-[#F5EFFE] to-[#FFF7ED] text-black',
    headerBg: 'bg-[#B5A8F7]', // Soft Lilac / Purple header
    headerText: 'text-black',
    headerBorder: 'border-b-3 border-black',
    cardBg: 'bg-[#FFFDF5]',
    cardBorder: 'border-3 border-black',
    cardShadow: 'shadow-[5px_5px_0px_#000000]',
    cardText: 'text-black',
    pillActive: 'bg-[#48BB78] text-black border-2 border-black font-black shadow-[2px_2px_0px_#000000]', // Sage Green active pill
    pillInactive: 'bg-white text-black border-2 border-black hover:bg-[#F5EFFE]',
    buttonPrimary: 'bg-[#48BB78] hover:bg-[#38A169] text-black border-3 border-black shadow-[4px_4px_0px_#000000] font-black uppercase', // Vibrant Sage Green
    buttonSecondary: 'bg-[#B5A8F7] hover:bg-[#A594F9] text-black border-3 border-black shadow-[4px_4px_0px_#000000] font-black uppercase', // Soft Lilac
    badgeBg: 'bg-[#FF8A8A] text-black border-2 border-black shadow-[2px_2px_0px_#000000]', // Coral Pink
    accentText: 'text-[#B5A8F7]',
    statBlock1: 'bg-[#B5A8F7] text-black border-2 border-black shadow-[3px_3px_0px_#000000]', // Lilac
    statBlock2: 'bg-[#FF8A8A] text-black border-2 border-black shadow-[3px_3px_0px_#000000]', // Coral
    statBlock3: 'bg-[#FFC72C] text-black border-2 border-black shadow-[3px_3px_0px_#000000]', // Warm Gold
  },
  patchwork_pop: {
    appBg: 'bg-gradient-to-br from-[#FFC72C] via-[#FF8A8A] to-[#B5A8F7] text-black',
    headerBg: 'bg-[#FFC72C]',
    headerText: 'text-black',
    headerBorder: 'border-b-3 border-black',
    cardBg: 'bg-white',
    cardBorder: 'border-3 border-black',
    cardShadow: 'shadow-[6px_6px_0px_#000000]',
    cardText: 'text-black',
    pillActive: 'bg-[#48BB78] text-black border-2 border-black font-black shadow-[3px_3px_0px_#000000]',
    pillInactive: 'bg-white text-black border-2 border-black hover:bg-yellow-100',
    buttonPrimary: 'bg-[#48BB78] hover:bg-[#38A169] text-black border-3 border-black shadow-[4px_4px_0px_#000000] font-black uppercase',
    buttonSecondary: 'bg-[#FF8A8A] hover:bg-[#FF7575] text-black border-3 border-black shadow-[4px_4px_0px_#000000] font-black uppercase',
    badgeBg: 'bg-[#B5A8F7] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
    accentText: 'text-[#B5A8F7]',
    statBlock1: 'bg-[#B5A8F7] text-black border-2 border-black shadow-[3px_3px_0px_#000000]',
    statBlock2: 'bg-[#FF8A8A] text-black border-2 border-black shadow-[3px_3px_0px_#000000]',
    statBlock3: 'bg-[#5CE1E6] text-black border-2 border-black shadow-[3px_3px_0px_#000000]',
  },
  chunky_pop: {
    appBg: 'bg-[#5CE1E6] text-black',
    headerBg: 'bg-[#FFFDF5]',
    headerText: 'text-black',
    headerBorder: 'border-b-3 border-black',
    cardBg: 'bg-[#FFFDF5]',
    cardBorder: 'border-3 border-black',
    cardShadow: 'shadow-[6px_6px_0px_#000000]',
    cardText: 'text-black',
    pillActive: 'bg-[#FF8A8A] text-black border-2 border-black shadow-[3px_3px_0px_#000000]',
    pillInactive: 'bg-white text-black border-2 border-black hover:bg-purple-100',
    buttonPrimary: 'bg-[#FFC72C] hover:bg-[#FFB800] text-black border-3 border-black shadow-[4px_4px_0px_#000000] font-black uppercase',
    buttonSecondary: 'bg-white hover:bg-pink-100 text-black border-2 border-black shadow-[3px_3px_0px_#000000] font-black uppercase',
    badgeBg: 'bg-[#FF8A8A] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
    accentText: 'text-[#FF8A8A]',
    statBlock1: 'bg-[#FF8A8A] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
    statBlock2: 'bg-[#FFC72C] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
    statBlock3: 'bg-[#48BB78] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
  },
  dark_glass: {
    appBg: 'bg-[#0B0F19] text-white',
    headerBg: 'bg-slate-900/80 backdrop-blur-md',
    headerText: 'text-white',
    headerBorder: 'border-b border-white/10',
    cardBg: 'bg-slate-900/70 backdrop-blur-xl',
    cardBorder: 'border border-white/15',
    cardShadow: 'shadow-[0_15px_35px_rgba(0,0,0,0.6)]',
    cardText: 'text-white',
    pillActive: 'bg-[#48BB78] text-black font-extrabold shadow-[0_0_15px_rgba(72,187,120,0.4)]',
    pillInactive: 'bg-slate-800/60 text-slate-300 border border-white/10 hover:bg-slate-800',
    buttonPrimary: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-black shadow-[0_0_20px_rgba(72,187,120,0.4)] uppercase',
    buttonSecondary: 'bg-slate-800/80 text-white border border-white/20 hover:bg-slate-700 font-bold uppercase',
    badgeBg: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
    accentText: 'text-[#48BB78]',
    statBlock1: 'bg-purple-500/30 text-purple-200 border border-purple-500/40',
    statBlock2: 'bg-pink-500/30 text-pink-200 border border-pink-500/40',
    statBlock3: 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/40',
  },
  memphis_blue: {
    appBg: 'bg-[#B5A8F7] text-black',
    headerBg: 'bg-white',
    headerText: 'text-black',
    headerBorder: 'border-b-3 border-black',
    cardBg: 'bg-white',
    cardBorder: 'border-3 border-black',
    cardShadow: 'shadow-[6px_6px_0px_#000000]',
    cardText: 'text-black',
    pillActive: 'bg-[#48BB78] text-black border-2 border-black shadow-[3px_3px_0px_#000000]',
    pillInactive: 'bg-[#FFFDF5] text-black border-2 border-black hover:bg-purple-100',
    buttonPrimary: 'bg-[#48BB78] hover:bg-[#38A169] text-black border-3 border-black shadow-[4px_4px_0px_#000000] font-black uppercase',
    buttonSecondary: 'bg-white hover:bg-pink-100 text-black border-2 border-black shadow-[3px_3px_0px_#000000] font-black uppercase',
    badgeBg: 'bg-[#FF8A8A] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
    accentText: 'text-[#B5A8F7]',
    statBlock1: 'bg-[#B5A8F7] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
    statBlock2: 'bg-[#FF8A8A] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
    statBlock3: 'bg-[#48BB78] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
  },
  retro_poster: {
    appBg: 'bg-[#B5A8F7] text-black',
    headerBg: 'bg-[#FFC72C]',
    headerText: 'text-black',
    headerBorder: 'border-b-3 border-black',
    cardBg: 'bg-[#FFFDF5]',
    cardBorder: 'border-3 border-black',
    cardShadow: 'shadow-[6px_6px_0px_#000000]',
    cardText: 'text-black',
    pillActive: 'bg-[#FF8A8A] text-black border-2 border-black shadow-[3px_3px_0px_#000000]',
    pillInactive: 'bg-[#FFC72C] text-black border-2 border-black hover:bg-amber-200',
    buttonPrimary: 'bg-[#FFC72C] hover:bg-[#FFB800] text-black border-3 border-black shadow-[4px_4px_0px_#000000] font-black uppercase',
    buttonSecondary: 'bg-white hover:bg-rose-100 text-black border-2 border-black shadow-[3px_3px_0px_#000000] font-black uppercase',
    badgeBg: 'bg-[#FF8A8A] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
    accentText: 'text-[#FF8A8A]',
    statBlock1: 'bg-[#FF8A8A] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
    statBlock2: 'bg-[#FFC72C] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
    statBlock3: 'bg-[#B5A8F7] text-black border-2 border-black shadow-[2px_2px_0px_#000000]',
  },
};
