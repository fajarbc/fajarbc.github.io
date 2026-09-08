import type { ArchitectureData, ArchitectureEdge } from '@/src/types/architecture';

export interface TraceStep {
  step: number;
  edges: ArchitectureEdge[];
  /** All node IDs touched in this step (sources + targets) */
  nodeIds: string[];
}

/**
 * Build ordered trace steps from edges that have a requestStep value.
 * Edges sharing the same requestStep animate together as one stage.
 */
export function buildTrace(data: ArchitectureData): TraceStep[] {
  const steppedEdges = data.edges.filter(
    (e): e is ArchitectureEdge & { requestStep: number } =>
      e.requestStep != null,
  );

  const grouped = new Map<number, ArchitectureEdge[]>();
  for (const edge of steppedEdges) {
    if (!grouped.has(edge.requestStep)) grouped.set(edge.requestStep, []);
    grouped.get(edge.requestStep)!.push(edge);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a - b)
    .map(([step, edges]) => ({
      step,
      edges,
      nodeIds: [...new Set(edges.flatMap((e) => [e.source, e.target]))],
    }));
}

/**
 * Build trace from a named journey instead of all requestStep edges.
 */
export function buildJourneyTrace(
  data: ArchitectureData,
  journeyId: string,
): TraceStep[] {
  const journey = data.journeys?.find((j) => j.id === journeyId);
  if (!journey) return [];

  const edgeMap = new Map(data.edges.map((e) => [e.id, e]));
  const edges = journey.edgeIds
    .map((id) => edgeMap.get(id))
    .filter((e): e is ArchitectureEdge => e != null);

  // Each journey edge becomes its own sequential step
  return edges.map((edge, i) => ({
    step: i,
    edges: [edge],
    nodeIds: [edge.source, edge.target],
  }));
}

/** Get all active node/edge IDs for a given step index in a trace. */
export function getActiveIds(
  trace: TraceStep[],
  currentStep: number,
): { nodeIds: Set<string>; edgeIds: Set<string> } {
  // Highlight everything up to and including currentStep
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();
  for (const step of trace) {
    if (step.step > currentStep) break;
    for (const nid of step.nodeIds) nodeIds.add(nid);
    for (const e of step.edges) edgeIds.add(e.id);
  }
  return { nodeIds, edgeIds };
}
