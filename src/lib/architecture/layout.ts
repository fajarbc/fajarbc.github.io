import type { ArchitectureData } from '@/src/types/architecture';
import type { Node, Edge } from '@xyflow/react';

const NODE_WIDTH = 240;
const NODE_HEIGHT = 80;
const GAP_X = 300;
const GAP_Y = 160;

/** Category → shape/icon cue (not color-only — accessibility). */
const CATEGORY_SHAPES: Record<string, string> = {
  client: '◇',
  gateway: '⬡',
  service: '▢',
  database: '⬢',
  queue: '⏚',
  cache: '⧫',
  monitoring: '◎',
  storage: '▤',
  network: '↔',
};

export function getCategoryShape(category: string): string {
  return CATEGORY_SHAPES[category.toLowerCase()] ?? '▢';
}

/**
 * Simple tier-based layout: group nodes by category, lay out left-to-right
 * with vertical stacking within each tier.
 *
 * ponytail: dagre/elkjs auto-layout. Swap in when diagrams exceed ~20 nodes.
 */
export function layoutNodes(data: ArchitectureData): Node[] {
  // Group by category, preserve insertion order
  const groups = new Map<string, typeof data.nodes>();
  for (const node of data.nodes) {
    const cat = node.category.toLowerCase();
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(node);
  }

  const result: Node[] = [];
  let colIndex = 0;

  for (const [, nodes] of groups) {
    for (let rowIndex = 0; rowIndex < nodes.length; rowIndex++) {
      const n = nodes[rowIndex];
      result.push({
        id: n.id,
        type: 'infrastructure',
        position: { x: colIndex * GAP_X, y: rowIndex * GAP_Y },
        data: { ...n },
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      });
    }
    colIndex++;
  }

  return result;
}

export function layoutEdges(data: ArchitectureData): Edge[] {
  return data.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label ?? '',
    type: 'default',
    animated: false,
    data: { protocol: e.protocol, requestStep: e.requestStep },
  }));
}
