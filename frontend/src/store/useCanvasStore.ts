import { create } from 'zustand';
import { Camera, CanvasObject, SnapLine, ToolType } from '../types/canvas';

export type CanvasTheme = 'obsidian' | 'cyberpunk' | 'slate_light' | 'dark_charcoal' | 'blueprint';

export interface CanvasPage {
  id: string;
  name: string;
  objects: Map<string, CanvasObject>;
  isReadOnly: boolean;
}

interface CanvasState {
  objects: Map<string, CanvasObject>;
  selectedIds: string[];
  camera: Camera;
  activeTool: ToolType;
  canvasTheme: CanvasTheme;

  // Multi-Page & Editing Modes
  pages: CanvasPage[];
  activePageIndex: number;
  isFullScreen: boolean;
  isLiveWallActive: boolean;

  // Style defaults for new objects
  currentFill: string;
  currentStroke: string;
  currentStrokeWidth: number;
  currentOpacity: number;
  currentFontSize: number;
  currentFontFamily: string;

  // Alignment & guides
  snapLines: SnapLine[];
  isGridVisible: boolean;
  isSnapEnabled: boolean;

  // Quadtree visible object IDs filter
  visibleObjectIds: Set<string> | null;

  // Actions
  setObjects: (objects: CanvasObject[] | Map<string, CanvasObject>) => void;
  updateObject: (id: string, patch: Partial<CanvasObject>) => void;
  removeObject: (id: string) => void;
  addObject: (obj: CanvasObject) => void;
  setSelectedIds: (ids: string[]) => void;
  setCamera: (camera: Partial<Camera> | ((prev: Camera) => Camera)) => void;
  setActiveTool: (tool: ToolType) => void;
  setCanvasTheme: (theme: CanvasTheme) => void;

  // Page Navigation & Live Wall Actions
  setActivePage: (index: number) => void;
  addPage: (name?: string) => void;
  toggleFullScreen: () => void;
  toggleLiveWall: (active?: boolean) => void;

  setStyle: (patch: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    fontSize?: number;
    fontFamily?: string;
  }) => void;
  setSnapLines: (lines: SnapLine[]) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  setVisibleObjectIds: (ids: Set<string> | null) => void;
  clearCanvas: () => void;
}

const DEFAULT_PAGES: CanvasPage[] = [
  { id: 'page_1', name: 'Page 1 (Drafting)', objects: new Map(), isReadOnly: false },
  { id: 'page_2', name: 'Page 2 (Wireframing)', objects: new Map(), isReadOnly: false },
  { id: 'page_3', name: 'Page 3 (Architecture)', objects: new Map(), isReadOnly: false },
  { id: 'page_4', name: 'Page 4 (Review)', objects: new Map(), isReadOnly: false },
  { id: 'page_5', name: 'Page 5 (Final Presentation)', objects: new Map(), isReadOnly: true },
];

export const useCanvasStore = create<CanvasState>((set, get) => ({
  objects: new Map<string, CanvasObject>(),
  selectedIds: [],
  camera: { x: 0, y: 0, zoom: 1.0 },
  activeTool: 'select',
  canvasTheme: 'obsidian',

  pages: DEFAULT_PAGES,
  activePageIndex: 0,
  isFullScreen: false,
  isLiveWallActive: false,

  currentFill: '#3b82f6',
  currentStroke: '#1e40af',
  currentStrokeWidth: 2,
  currentOpacity: 1.0,
  currentFontSize: 18,
  currentFontFamily: 'Plus Jakarta Sans',

  snapLines: [],
  isGridVisible: true,
  isSnapEnabled: true,
  visibleObjectIds: null,

  setObjects: (objs) =>
    set((state) => {
      const map = Array.isArray(objs)
        ? new Map(objs.map((o) => [o.id, o]))
        : new Map(objs);

      // Save into active page memory
      const updatedPages = [...state.pages];
      if (updatedPages[state.activePageIndex]) {
        updatedPages[state.activePageIndex] = {
          ...updatedPages[state.activePageIndex],
          objects: new Map(map),
        };
      }
      return { objects: map, pages: updatedPages };
    }),

  updateObject: (id, patch) =>
    set((state) => {
      if (state.pages[state.activePageIndex]?.isReadOnly) return state; // Block editing on last page
      const existing = state.objects.get(id);
      if (!existing) return state;
      const updated = new Map(state.objects);
      updated.set(id, { ...existing, ...patch, updatedAt: Date.now() });

      const updatedPages = [...state.pages];
      if (updatedPages[state.activePageIndex]) {
        updatedPages[state.activePageIndex] = {
          ...updatedPages[state.activePageIndex],
          objects: new Map(updated),
        };
      }
      return { objects: updated, pages: updatedPages };
    }),

  removeObject: (id) =>
    set((state) => {
      if (state.pages[state.activePageIndex]?.isReadOnly) return state; // Block editing on last page
      const updated = new Map(state.objects);
      updated.delete(id);

      const updatedPages = [...state.pages];
      if (updatedPages[state.activePageIndex]) {
        updatedPages[state.activePageIndex] = {
          ...updatedPages[state.activePageIndex],
          objects: new Map(updated),
        };
      }
      return {
        objects: updated,
        selectedIds: state.selectedIds.filter((sid) => sid !== id),
        pages: updatedPages,
      };
    }),

  addObject: (obj) =>
    set((state) => {
      if (state.pages[state.activePageIndex]?.isReadOnly) return state; // Block editing on last page
      const updated = new Map(state.objects);
      updated.set(obj.id, obj);

      const updatedPages = [...state.pages];
      if (updatedPages[state.activePageIndex]) {
        updatedPages[state.activePageIndex] = {
          ...updatedPages[state.activePageIndex],
          objects: new Map(updated),
        };
      }
      return { objects: updated, pages: updatedPages };
    }),

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  setCamera: (cameraOrUpdater) =>
    set((state) => ({
      camera: typeof cameraOrUpdater === 'function' ? cameraOrUpdater(state.camera) : { ...state.camera, ...cameraOrUpdater },
    })),

  setActiveTool: (tool) => set({ activeTool: tool }),

  setCanvasTheme: (theme) => set({ canvasTheme: theme }),

  // Page Navigation
  setActivePage: (index) =>
    set((state) => {
      const validIndex = Math.max(0, Math.min(index, state.pages.length - 1));
      const targetPage = state.pages[validIndex];
      return {
        activePageIndex: validIndex,
        objects: new Map(targetPage.objects),
        selectedIds: [],
      };
    }),

  addPage: (name) =>
    set((state) => {
      const pageNum = state.pages.length + 1;
      // Mark the new page as last page, update previous last page readOnly state
      const newPageName = name || `Page ${pageNum} (Draft)`;
      const updatedPages = state.pages.map((p, idx) => ({
        ...p,
        isReadOnly: false, // earlier pages editable
      }));

      const newPage: CanvasPage = {
        id: `page_${Date.now()}`,
        name: `${newPageName} (Final Presentation)`,
        objects: new Map(),
        isReadOnly: true, // last page read-only
      };

      updatedPages.push(newPage);
      return { pages: updatedPages };
    }),

  toggleFullScreen: () => {
    const isFS = !get().isFullScreen;
    if (isFS) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    set({ isFullScreen: isFS });
  },

  toggleLiveWall: (active) => {
    const nextState = active !== undefined ? active : !get().isLiveWallActive;
    set({ isLiveWallActive: nextState });
  },

  setStyle: (patch) =>
    set((state) => {
      if (state.pages[state.activePageIndex]?.isReadOnly) return state;

      const updates: any = {};
      if (patch.fill !== undefined) updates.currentFill = patch.fill;
      if (patch.stroke !== undefined) updates.currentStroke = patch.stroke;
      if (patch.strokeWidth !== undefined) updates.currentStrokeWidth = patch.strokeWidth;
      if (patch.opacity !== undefined) updates.currentOpacity = patch.opacity;
      if (patch.fontSize !== undefined) updates.currentFontSize = patch.fontSize;
      if (patch.fontFamily !== undefined) updates.currentFontFamily = patch.fontFamily;

      if (state.selectedIds.length > 0) {
        const updatedObjects = new Map(state.objects);
        state.selectedIds.forEach((id) => {
          const obj = updatedObjects.get(id);
          if (obj) {
            updatedObjects.set(id, {
              ...obj,
              ...(patch.fill !== undefined ? { fill: patch.fill } : {}),
              ...(patch.stroke !== undefined ? { stroke: patch.stroke } : {}),
              ...(patch.strokeWidth !== undefined ? { strokeWidth: patch.strokeWidth } : {}),
              ...(patch.opacity !== undefined ? { opacity: patch.opacity } : {}),
              ...(patch.fontSize !== undefined ? { fontSize: patch.fontSize } : {}),
              ...(patch.fontFamily !== undefined ? { fontFamily: patch.fontFamily } : {}),
              updatedAt: Date.now(),
            });
          }
        });
        return { ...updates, objects: updatedObjects };
      }

      return updates;
    }),

  setSnapLines: (lines) => set({ snapLines: lines }),
  toggleGrid: () => set((state) => ({ isGridVisible: !state.isGridVisible })),
  toggleSnap: () => set((state) => ({ isSnapEnabled: !state.isSnapEnabled })),
  setVisibleObjectIds: (ids) => set({ visibleObjectIds: ids }),
  clearCanvas: () => set({ objects: new Map(), selectedIds: [] }),
}));
