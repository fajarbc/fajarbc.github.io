import { lazy, Suspense, Component, type ReactNode, useState, useCallback } from 'react';
import { parseArchitectureData, validateReferences } from '@/src/lib/architecture/schema';
import { ArchitectureFallback } from './architecture-fallback';
import type { ArchitectureData, ArchitectureNode } from '@/src/types/architecture';

// Lazy-load the heavy xyflow canvas — keeps it off unrelated routes
const ArchitectureCanvas = lazy(() =>
  import('./architecture-canvas').then((m) => ({ default: m.ArchitectureCanvas })),
);

// --- Error Boundary ---
interface EBProps { children: ReactNode; fallback: ReactNode }
interface EBState { error: Error | null }

class ArchitectureErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) return this.props.fallback;
    return this.props.children;
  }
}

// --- Main Explorer ---
interface Props {
  /** Raw architecture data — validated at runtime via zod. */
  data: unknown;
}

export function ArchitectureExplorer({ data: raw }: Props) {
  const [selectedFallbackNode, setSelectedFallbackNode] = useState<ArchitectureNode | null>(null);

  // Validate once
  let parsed: ArchitectureData;
  try {
    parsed = parseArchitectureData(raw);
  } catch (err) {
    return (
      <div role="alert" className="p-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-mono">
        <strong>Invalid architecture data:</strong> {String(err)}
      </div>
    );
  }

  // Dev-time referential integrity check
  if (import.meta.env.DEV) {
    const refErrors = validateReferences(parsed);
    if (refErrors.length > 0) {
      console.error('[ArchitectureExplorer] Reference errors:', refErrors);
    }
  }

  const handleFallbackSelect = useCallback((node: ArchitectureNode) => {
    setSelectedFallbackNode(node);
  }, []);

  return (
    <section aria-label={parsed.title} className="my-12">
      <header className="mb-6">
        <h2 className="text-2xl font-bold font-mono text-slate-900">{parsed.title}</h2>
        <p className="text-sm text-slate-500 mt-1">{parsed.description}</p>
      </header>

      {/* Interactive diagram — lazy loaded, error-bounded */}
      <ArchitectureErrorBoundary
        fallback={
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 font-mono">
            The interactive diagram could not load. Use the text representation below.
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="w-full h-[400px] bg-slate-100 rounded-xl flex items-center justify-center text-sm text-slate-400 font-mono animate-pulse">
              Loading architecture diagram…
            </div>
          }
        >
          <ArchitectureCanvas data={parsed} />
        </Suspense>
      </ArchitectureErrorBoundary>

      {/* Always-visible text fallback */}
      <ArchitectureFallback data={parsed} onSelectNode={handleFallbackSelect} />

      {/* Inline detail from fallback table click */}
      {selectedFallbackNode && (
        <div
          role="region"
          aria-label={`Details for ${selectedFallbackNode.label}`}
          className="mt-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm"
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold font-mono text-slate-900">{selectedFallbackNode.label}</h4>
            <button
              onClick={() => setSelectedFallbackNode(null)}
              className="text-xs font-mono text-slate-400 hover:text-slate-700"
            >
              Close
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-3">{selectedFallbackNode.summary}</p>
          {selectedFallbackNode.responsibilities.length > 0 && (
            <ul className="list-disc list-inside text-sm text-slate-600 mb-3">
              {selectedFallbackNode.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          )}
          {selectedFallbackNode.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedFallbackNode.technologies.map((t) => (
                <span key={t} className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
