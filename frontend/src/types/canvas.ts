export type ObjectType = 
  | 'rectangle' 
  | 'circle' 
  | 'ellipse' 
  | 'star' 
  | 'line' 
  | 'arrow' 
  | 'path' 
  | 'text' 
  | 'sticky' 
  | 'image' 
  | 'frame';

export type StrokeStyle = 'solid' | 'dashed' | 'dotted';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  opacity: number;
  borderRadius?: number;
  points?: Point[];
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  imageUrl?: string;
  zIndex: number;
  groupId?: string;
  createdBy: string;
  updatedAt: number;
  version: number;
  lockedBy?: string; // Soft lock
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export type ToolType = 
  | 'select' 
  | 'pan' 
  | 'rectangle' 
  | 'circle' 
  | 'ellipse' 
  | 'star' 
  | 'line' 
  | 'arrow' 
  | 'pencil' 
  | 'text' 
  | 'sticky' 
  | 'image' 
  | 'comment' 
  | 'eraser';

export type OpType = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'MOVE' 
  | 'RESIZE' 
  | 'ROTATE' 
  | 'STYLE' 
  | 'GROUP' 
  | 'UNGROUP' 
  | 'COMMENT_ADD' 
  | 'COMMENT_RESOLVE';

export interface CanvasOp {
  opId: string;
  type: OpType;
  objectId: string;
  data?: Partial<CanvasObject> | any;
  clientId: string;
  timestamp: number;
  clock: number;
  semanticGroupId?: string;
}

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  avatar: string;
  cursor: Point;
  selectedObjectIds: string[];
  activeTool: ToolType;
  status: 'connected' | 'reconnecting' | 'offline';
  activity: 'drawing' | 'selecting' | 'moving' | 'idle';
  lastSeen: number;
}

export interface CommentReply {
  id: string;
  author: string;
  authorColor: string;
  text: string;
  createdAt: number;
}

export interface CommentPin {
  id: string;
  x: number;
  y: number;
  author: string;
  authorColor: string;
  text: string;
  createdAt: number;
  resolved: boolean;
  replies: CommentReply[];
}

export type LodLevel = 0 | 1 | 2; // 0 = low detail (<20%), 1 = medium (20-70%), 2 = full (>70%)
export type QualityMode = 'ultra' | 'medium' | 'performance';

export interface TelemetryMetrics {
  fps: number;
  frameTime: number;
  totalObjects: number;
  visibleObjects: number;
  quadtreeQueryTime: number;
  memoryMB: number;
  throughputKBps: number;
  latencyMs: number;
  pendingOpsCount: number;
  droppedFrames: number;
  lodLevel: LodLevel;
  qualityMode: QualityMode;
}

export type NetworkPreset = 'excellent' | 'normal' | 'slow' | 'poor' | 'jitter' | 'offline';

export interface SnapLine {
  type: 'x' | 'y';
  position: number;
}
