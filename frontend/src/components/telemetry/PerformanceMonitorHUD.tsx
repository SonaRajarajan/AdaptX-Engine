import React, { useEffect, useState } from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { Zap, Activity, HardDrive, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export const PerformanceMonitorHUD: React.FC = () => {
  const { telemetry, evaluationResult, updateTelemetry } = useAdaptXStore();
  const [fps, setFps] = useState(60);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const tick = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        updateTelemetry({ fps: frameCount });
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="fixed bottom-12 right-4 z-50 select-none">
      {isExpanded ? (
        <div className="bg-white border-3 border-black text-black p-3 rounded-2xl shadow-[4px_4px_0px_#000000] font-mono text-xs flex flex-col gap-2.5 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <span className="font-black text-xs uppercase flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#FFB000] fill-black stroke-[3]" />
              Engineering Telemetry HUD
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-slate-100 rounded-lg text-black"
            >
              <ChevronDown className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-xl border-2 border-black">
              <Activity className="w-3.5 h-3.5" />
              <span className="font-bold">FPS:</span>
              <span className="font-black">{fps}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-xl border-2 border-black">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-bold">Frame:</span>
              <span className="font-black">{(1000 / Math.max(1, fps)).toFixed(1)}ms</span>
            </div>

            {evaluationResult && (
              <div className="flex items-center gap-1.5 bg-[#FFB000] p-1.5 rounded-xl border-2 border-black col-span-2">
                <Zap className="w-3.5 h-3.5" />
                <span className="font-bold">Engine Calc:</span>
                <span className="font-black">{evaluationResult.calculationTimeMs}ms</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-xl border-2 border-black">
              <HardDrive className="w-3.5 h-3.5" />
              <span className="font-bold">RAM:</span>
              <span className="font-black">{telemetry.memoryMb}MB</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-xl border-2 border-black">
              <span className="font-bold">Candidates:</span>
              <span className="font-black">{telemetry.candidatesGenerated}</span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 bg-[#FFB000] hover:bg-[#FFC107] text-black border-2 border-black px-3 py-1.5 rounded-2xl font-mono text-xs font-black shadow-[3px_3px_0px_#000000] uppercase transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Zap className="w-3.5 h-3.5 stroke-[3]" />
          <span>FPS: {fps}</span>
          <span className="text-[10px] bg-black text-white px-1.5 py-0.2 rounded-md">
            {evaluationResult ? `${evaluationResult.calculationTimeMs}ms` : '60fps'}
          </span>
          <ChevronUp className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      )}
    </div>
  );
};
