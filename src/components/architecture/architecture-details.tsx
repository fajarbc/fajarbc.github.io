import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getCategoryShape } from '@/src/lib/architecture/layout';
import type { ArchitectureNode } from '@/src/types/architecture';

interface Props {
  node: ArchitectureNode | null;
  onClose: () => void;
}

export function ArchitectureDetails({ node, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!node) return;
    // Focus the panel when it opens
    panelRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [node, onClose]);

  if (!node) return null;

  const shape = getCategoryShape(node.category);

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label={`Details for ${node.label}`}
      tabIndex={-1}
      className="absolute top-4 right-4 z-20 w-80 max-h-[calc(100%-2rem)] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg p-5 focus:outline-none"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-wide text-slate-400">
            {shape} {node.category}
          </span>
          <h3 className="text-lg font-bold font-mono text-slate-900">{node.label}</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close details"
          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <p className="text-sm text-slate-600 mb-4">{node.summary}</p>

      {node.responsibilities.length > 0 && (
        <section className="mb-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-slate-500 mb-1">
            Responsibilities
          </h4>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-0.5">
            {node.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {node.technologies.length > 0 && (
        <section className="mb-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-slate-500 mb-1">
            Technologies
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {node.technologies.map((t) => (
              <span
                key={t}
                className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {node.reliabilityNotes && (
        <section className="mb-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-slate-500 mb-1">
            Reliability
          </h4>
          <p className="text-sm text-slate-600">{node.reliabilityNotes}</p>
        </section>
      )}

      {node.observabilityNotes && (
        <section>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-slate-500 mb-1">
            Observability
          </h4>
          <p className="text-sm text-slate-600">{node.observabilityNotes}</p>
        </section>
      )}
    </div>
  );
}
