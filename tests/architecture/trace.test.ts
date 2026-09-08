import { describe, it, expect } from 'vitest';
import { buildTrace, buildJourneyTrace, getActiveIds } from '@/src/lib/architecture/trace';
import { parseArchitectureData, validateReferences } from '@/src/lib/architecture/schema';
import { lessOtpArchitecture, luringTalkArchitecture } from '@/src/data/sample-architecture';
import type { ArchitectureData } from '@/src/types/architecture';

const MINIMAL: ArchitectureData = {
  id: 'test',
  title: 'Test',
  description: 'Test architecture',
  nodes: [
    { id: 'a', label: 'A', category: 'Service', summary: 's', responsibilities: [], technologies: [] },
    { id: 'b', label: 'B', category: 'Service', summary: 's', responsibilities: [], technologies: [] },
    { id: 'c', label: 'C', category: 'Database', summary: 's', responsibilities: [], technologies: [] },
  ],
  edges: [
    { id: 'e1', source: 'a', target: 'b', requestStep: 0 },
    { id: 'e2', source: 'b', target: 'c', requestStep: 1 },
    { id: 'e3', source: 'a', target: 'c' }, // no requestStep
  ],
  journeys: [{ id: 'j1', label: 'Journey 1', edgeIds: ['e1', 'e2'] }],
};

describe('Architecture Schema', () => {
  it('validates the LessOTP architecture fixture', () => {
    expect(() => parseArchitectureData(lessOtpArchitecture)).not.toThrow();
  });

  it('validates the LuringTalk architecture fixture', () => {
    expect(() => parseArchitectureData(luringTalkArchitecture)).not.toThrow();
  });

  it('rejects data missing required fields', () => {
    expect(() => parseArchitectureData({ id: 'x' })).toThrow();
  });

  it('detects unknown edge source references', () => {
    const bad: ArchitectureData = {
      ...MINIMAL,
      edges: [{ id: 'bad', source: 'missing', target: 'a' }],
    };
    const errors = validateReferences(bad);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('missing');
  });

  it('detects unknown journey edge references', () => {
    const bad: ArchitectureData = {
      ...MINIMAL,
      journeys: [{ id: 'j', label: 'J', edgeIds: ['nonexistent'] }],
    };
    const errors = validateReferences(bad);
    expect(errors.some((e) => e.includes('nonexistent'))).toBe(true);
  });
});

describe('Trace', () => {
  it('builds ordered steps from requestStep edges', () => {
    const trace = buildTrace(MINIMAL);
    expect(trace).toHaveLength(2);
    expect(trace[0].step).toBe(0);
    expect(trace[1].step).toBe(1);
    // e3 has no requestStep, should be excluded
    expect(trace.flatMap((s) => s.edges.map((e) => e.id))).not.toContain('e3');
  });

  it('follows requestStep ordering', () => {
    const trace = buildTrace(MINIMAL);
    const steps = trace.map((s) => s.step);
    expect(steps).toEqual([...steps].sort((a, b) => a - b));
  });

  it('builds journey trace from named journey', () => {
    const trace = buildJourneyTrace(MINIMAL, 'j1');
    expect(trace).toHaveLength(2);
    expect(trace[0].edges[0].id).toBe('e1');
    expect(trace[1].edges[0].id).toBe('e2');
  });

  it('returns empty for unknown journey', () => {
    expect(buildJourneyTrace(MINIMAL, 'nope')).toEqual([]);
  });

  it('getActiveIds accumulates up to current step', () => {
    const trace = buildTrace(MINIMAL);
    const { nodeIds, edgeIds } = getActiveIds(trace, 1);
    expect(nodeIds.has('a')).toBe(true);
    expect(nodeIds.has('b')).toBe(true);
    expect(nodeIds.has('c')).toBe(true);
    expect(edgeIds.has('e1')).toBe(true);
    expect(edgeIds.has('e2')).toBe(true);
  });

  it('getActiveIds returns empty sets for step -1', () => {
    const trace = buildTrace(MINIMAL);
    const { nodeIds, edgeIds } = getActiveIds(trace, -1);
    expect(nodeIds.size).toBe(0);
    expect(edgeIds.size).toBe(0);
  });
});

describe('Text fallback data coverage', () => {
  it('LessOTP fixture contains expected nodes', () => {
    const data = parseArchitectureData(lessOtpArchitecture);
    expect(data.nodes.length).toBeGreaterThanOrEqual(6);
    const labels = data.nodes.map((n) => n.label);
    expect(labels).toContain('API Gateway');
    expect(labels).toContain('Auth API');
    expect(labels).toContain('WhatsApp Connector');
  });

  it('LuringTalk fixture contains expected nodes', () => {
    const data = parseArchitectureData(luringTalkArchitecture);
    expect(data.nodes.length).toBeGreaterThanOrEqual(5);
    const labels = data.nodes.map((n) => n.label);
    expect(labels).toContain('Host PWA');
    expect(labels).toContain('QR Signaling');
    expect(labels).toContain('WebRTC Media Session');
  });
});
