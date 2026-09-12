import React from 'react';
import { useAdaptXStore } from '../../store/useAdaptXStore';
import { Code2, Copy, Check } from 'lucide-react';

export const LayoutGenomeViewer: React.FC = () => {
  const { selectedCandidate } = useAdaptXStore();
  const [copied, setCopied] = React.useState(false);

  if (!selectedCandidate) {
    return <div className="p-8 text-stone-400 text-xs">No active layout genome available.</div>;
  }

  const genomeJson = JSON.stringify(selectedCandidate.genome, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(genomeJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 bg-[#FFA726] p-8 overflow-y-auto custom-scrollbar select-none text-stone-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white border-2 border-blue-500/80 p-6 rounded-3xl shadow-md">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-3">
              <Code2 className="w-6 h-6 text-blue-600" />
              Layout Genome Specification
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Structured genome payload containing coordinates, scales, z-indices, typography rules, and crop rects.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all border-2 border-black"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Genome JSON'}
          </button>
        </div>

        <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-md overflow-x-auto">
          <pre className="font-mono text-xs text-emerald-400 leading-relaxed font-semibold">
            {genomeJson}
          </pre>
        </div>
      </div>
    </div>
  );
};
