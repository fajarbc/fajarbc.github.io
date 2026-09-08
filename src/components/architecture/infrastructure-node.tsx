import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { getCategoryShape } from '@/src/lib/architecture/layout';
import type { ArchitectureNode } from '@/src/types/architecture';

/** Color ring per category — always paired with a shape glyph for a11y. */
const CATEGORY_RING: Record<string, string> = {
  client: 'ring-blue-400',
  gateway: 'ring-cyan-500',
  service: 'ring-emerald-500',
  database: 'ring-purple-500',
  queue: 'ring-amber-500',
  cache: 'ring-orange-500',
  monitoring: 'ring-rose-500',
  storage: 'ring-teal-500',
  network: 'ring-indigo-500',
};

function InfrastructureNode({ data, selected }: NodeProps) {
  const node = data as unknown as ArchitectureNode;
  const cat = node.category.toLowerCase();
  const ring = CATEGORY_RING[cat] ?? 'ring-slate-400';
  const shape = getCategoryShape(cat);

  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-slate-400 !w-2 !h-2" />
      <div
        role="button"
        tabIndex={0}
        aria-label={`${node.label} — ${node.category}`}
        className={[
          'px-4 py-3 rounded-lg bg-white border border-slate-200 shadow-sm',
          'ring-2 ring-offset-2 transition-shadow duration-150',
          ring,
          selected
            ? 'ring-offset-cyan-100 shadow-md outline outline-2 outline-cyan-600'
            : 'ring-offset-white ring-opacity-50',
          'cursor-pointer hover:shadow-md focus-visible:outline-2 focus-visible:outline-cyan-600',
        ].join(' ')}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm select-none" aria-hidden="true">{shape}</span>
          <span className="font-mono text-sm font-semibold text-slate-800 truncate">
            {node.label}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{node.summary}</p>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-slate-400 !w-2 !h-2" />
    </>
  );
}

export default memo(InfrastructureNode);
