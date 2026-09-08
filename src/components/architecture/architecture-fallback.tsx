import { getCategoryShape } from '@/src/lib/architecture/layout';
import type { ArchitectureData, ArchitectureNode } from '@/src/types/architecture';

interface Props {
  data: ArchitectureData;
  onSelectNode?: (node: ArchitectureNode) => void;
}

/**
 * Fully accessible text representation of the architecture.
 * Always rendered below the interactive diagram so screen readers
 * and mobile users have a usable fallback.
 */
export function ArchitectureFallback({ data, onSelectNode }: Props) {
  return (
    <section aria-label={`${data.title} — text representation`} className="mt-8">
      <h3 className="text-lg font-bold font-mono text-slate-900 mb-4">
        Architecture Components
      </h3>

      {/* Nodes table */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm text-left border-collapse min-w-[480px]">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-2 pr-4 font-mono text-xs uppercase tracking-wide text-slate-500">Component</th>
              <th className="py-2 pr-4 font-mono text-xs uppercase tracking-wide text-slate-500">Category</th>
              <th className="py-2 pr-4 font-mono text-xs uppercase tracking-wide text-slate-500">Summary</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide text-slate-500">Technologies</th>
            </tr>
          </thead>
          <tbody>
            {data.nodes.map((node) => (
              <tr
                key={node.id}
                tabIndex={onSelectNode ? 0 : undefined}
                role={onSelectNode ? 'button' : undefined}
                onClick={() => onSelectNode?.(node)}
                onKeyDown={(e) => {
                  if (onSelectNode && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelectNode(node);
                  }
                }}
                className={[
                  'border-b border-slate-100',
                  onSelectNode ? 'cursor-pointer hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-cyan-600 focus-visible:outline-offset-[-2px]' : '',
                ].join(' ')}
              >
                <td className="py-2 pr-4 font-mono font-semibold text-slate-800">
                  <span aria-hidden="true" className="mr-1.5">{getCategoryShape(node.category)}</span>
                  {node.label}
                </td>
                <td className="py-2 pr-4 text-slate-500">{node.category}</td>
                <td className="py-2 pr-4 text-slate-600 max-w-xs">{node.summary}</td>
                <td className="py-2 text-slate-500">{node.technologies.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Connections list */}
      {data.edges.length > 0 && (
        <details className="mt-6">
          <summary className="text-sm font-mono font-bold text-slate-700 cursor-pointer hover:text-cyan-700">
            Connections ({data.edges.length})
          </summary>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {data.edges.map((edge) => {
              const src = data.nodes.find((n) => n.id === edge.source)?.label ?? edge.source;
              const tgt = data.nodes.find((n) => n.id === edge.target)?.label ?? edge.target;
              return (
                <li key={edge.id} className="font-mono">
                  {src} → {tgt}
                  {edge.label && <span className="text-slate-400 ml-2">({edge.label})</span>}
                  {edge.protocol && <span className="text-slate-400 ml-1">[{edge.protocol}]</span>}
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </section>
  );
}
