/** Architecture explorer data types. Content-driven — add nodes/edges to define a diagram. */

export interface ArchitectureNode {
  id: string;
  label: string;
  category: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  reliabilityNotes?: string;
  observabilityNotes?: string;
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  protocol?: string;
  /** Order in a request trace journey. Edges sharing the same requestStep animate together. */
  requestStep?: number;
}

export interface ArchitectureJourney {
  id: string;
  label: string;
  /** Ordered edge IDs that form this journey */
  edgeIds: string[];
}

export interface ArchitectureData {
  id: string;
  title: string;
  description: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  journeys?: ArchitectureJourney[];
}
