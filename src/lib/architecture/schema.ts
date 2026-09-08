import { z } from 'zod';

const ArchitectureNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  category: z.string(),
  summary: z.string(),
  responsibilities: z.array(z.string()),
  technologies: z.array(z.string()),
  reliabilityNotes: z.string().optional(),
  observabilityNotes: z.string().optional(),
});

const ArchitectureEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  protocol: z.string().optional(),
  requestStep: z.number().int().nonnegative().optional(),
});

const ArchitectureJourneySchema = z.object({
  id: z.string(),
  label: z.string(),
  edgeIds: z.array(z.string()),
});

export const ArchitectureDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  nodes: z.array(ArchitectureNodeSchema),
  edges: z.array(ArchitectureEdgeSchema),
  journeys: z.array(ArchitectureJourneySchema).optional(),
});

/** Validate + return typed data, or throw with details. */
export function parseArchitectureData(raw: unknown) {
  return ArchitectureDataSchema.parse(raw);
}

/**
 * Check that every edge.source and edge.target references a real node.
 * Returns array of error messages (empty = valid).
 */
export function validateReferences(
  data: z.infer<typeof ArchitectureDataSchema>,
): string[] {
  const nodeIds = new Set(data.nodes.map((n) => n.id));
  const edgeIds = new Set(data.edges.map((e) => e.id));
  const errors: string[] = [];

  for (const edge of data.edges) {
    if (!nodeIds.has(edge.source))
      errors.push(`Edge "${edge.id}" references unknown source "${edge.source}"`);
    if (!nodeIds.has(edge.target))
      errors.push(`Edge "${edge.id}" references unknown target "${edge.target}"`);
  }

  for (const journey of data.journeys ?? []) {
    for (const eid of journey.edgeIds) {
      if (!edgeIds.has(eid))
        errors.push(`Journey "${journey.id}" references unknown edge "${eid}"`);
    }
  }

  return errors;
}
