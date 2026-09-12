import { create } from 'zustand';
import { NetworkPreset, TelemetryMetrics } from '../types/canvas';

interface TelemetryState {
  metrics: TelemetryMetrics;
  networkPreset: NetworkPreset;
  hasCrashRecoverySnapshot: boolean;
  isTelemetryHUDVisible: boolean;
  isLatencyHUDVisible: boolean;
  isTimeTravelVisible: boolean;
  commentsVisible: boolean;

  setMetrics: (patch: Partial<TelemetryMetrics>) => void;
  setNetworkPreset: (preset: NetworkPreset) => void;
  setHasCrashRecoverySnapshot: (has: boolean) => void;
  toggleTelemetryHUD: () => void;
  toggleLatencyHUD: () => void;
  toggleTimeTravel: () => void;
  toggleComments: () => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  metrics: {
    fps: 60,
    frameTime: 16.6,
    totalObjects: 0,
    visibleObjects: 0,
    quadtreeQueryTime: 0.2,
    memoryMB: 48,
    throughputKBps: 1.2,
    latencyMs: 20,
    pendingOpsCount: 0,
    droppedFrames: 0,
    lodLevel: 2,
    qualityMode: 'ultra',
  },
  networkPreset: 'excellent',
  hasCrashRecoverySnapshot: false,
  isTelemetryHUDVisible: true,
  isLatencyHUDVisible: false,
  isTimeTravelVisible: false,
  commentsVisible: false,

  setMetrics: (patch) =>
    set((state) => ({
      metrics: { ...state.metrics, ...patch },
    })),

  setNetworkPreset: (preset) => set({ networkPreset: preset }),
  setHasCrashRecoverySnapshot: (has) => set({ hasCrashRecoverySnapshot: has }),
  toggleTelemetryHUD: () => set((s) => ({ isTelemetryHUDVisible: !s.isTelemetryHUDVisible })),
  toggleLatencyHUD: () => set((s) => ({ isLatencyHUDVisible: !s.isLatencyHUDVisible })),
  toggleTimeTravel: () => set((s) => ({ isTimeTravelVisible: !s.isTimeTravelVisible })),
  toggleComments: () => set((s) => ({ commentsVisible: !s.commentsVisible })),
}));
