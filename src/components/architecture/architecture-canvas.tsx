import { useState, useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  type OnSelectionChangeParams,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import InfrastructureNode from './infrastructure-node';
import { ArchitectureDetails } from './architecture-details';
import { ArchitectureControls } from './architecture-controls';
import { RequestTrace } from './request-trace';
import { layoutNodes, layoutEdges } from '@/src/lib/architecture/layout';
import type { ArchitectureData, ArchitectureNode } from '@/src/types/architecture';

const nodeTypes = { infrastructure: InfrastructureNode };

interface Props {
  data: ArchitectureData;
}

function CanvasInner({ data }: Props) {
  const initialNodes = useMemo(() => layoutNodes(data), [data]);
  const initialEdges = useMemo(() => layoutEdges(data), [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [traceMode, setTraceMode] = useState(false);
  const [showNodeList, setShowNodeList] = useState(false);
  const lastSelectedRef = useRef<string | null>(null);

  const handleSelectionChange = useCallback(
    ({ nodes: sel }: OnSelectionChangeParams) => {
      if (sel.length > 0) {
        const nodeData = sel[0].data as unknown as ArchitectureNode;
        setSelectedNode(nodeData);
        lastSelectedRef.current = sel[0].id;
      }
    },
    [],
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedNode(null);
    // Restore focus to the originating node on the canvas
    if (lastSelectedRef.current) {
      const el = document.querySelector(
        `[data-id="${lastSelectedRef.current}"]`,
      ) as HTMLElement | null;
      el?.focus();
    }
  }, []);

  const handleTraceActive = useCallback(
    (activeNodeIds: Set<string>, activeEdgeIds: Set<string>) => {
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          style: {
            ...n.style,
            opacity: activeNodeIds.size === 0 || activeNodeIds.has(n.id) ? 1 : 0.25,
            transition: 'opacity 0.3s',
          },
        })),
      );
      setEdges((prev) =>
        prev.map((e) => ({
          ...e,
          animated: activeEdgeIds.has(e.id),
          style: {
            ...e.style,
            opacity: activeEdgeIds.size === 0 || activeEdgeIds.has(e.id) ? 1 : 0.15,
            transition: 'opacity 0.3s',
          },
        })),
      );
    },
    [setNodes, setEdges],
  );

  const selectNodeById = useCallback(
    (nodeId: string) => {
      const node = data.nodes.find((n) => n.id === nodeId);
      if (node) {
        setSelectedNode(node);
        lastSelectedRef.current = nodeId;
        setShowNodeList(false);
      }
    },
    [data.nodes],
  );

  const hasTrace = data.edges.some((e) => e.requestStep != null);

  return (
    <div className="relative w-full h-[min(70vh,560px)] md:h-[600px] border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onSelectionChange={handleSelectionChange}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesReconnectable={false}
        deleteKeyCode={null}
        multiSelectionKeyCode={null}
        selectionOnDrag={false}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        aria-label={`${data.title} architecture diagram`}
      >
        <Background gap={20} size={1} color="#e2e8f0" />
      </ReactFlow>

      <ArchitectureControls onOpenNodeList={() => setShowNodeList((s) => !s)} />
      <ArchitectureDetails node={selectedNode} onClose={handleCloseDetails} />

      {traceMode && (
        <RequestTrace
          data={data}
          onActiveChange={handleTraceActive}
          onExit={() => {
            setTraceMode(false);
            handleTraceActive(new Set(), new Set());
          }}
        />
      )}

      {/* Trace mode toggle */}
      {hasTrace && !traceMode && (
        <button
          onClick={() => setTraceMode(true)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-cyan-600 text-white text-xs font-mono px-4 py-2 rounded-lg shadow hover:bg-cyan-700 transition-colors"
        >
          ▶ Trace Request Flow
        </button>
      )}

      {/* Keyboard-accessible node list overlay */}
      {showNodeList && (
        <div
          role="listbox"
          aria-label="Select a component"
          className="absolute top-14 left-4 z-30 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto w-56 p-2"
        >
          {data.nodes.map((n) => (
            <button
              key={n.id}
              role="option"
              aria-selected={selectedNode?.id === n.id}
              onClick={() => selectNodeById(n.id)}
              className="w-full text-left px-3 py-2 text-sm font-mono rounded-lg hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-cyan-600 text-slate-700"
            >
              {n.label}
              <span className="block text-xs text-slate-400">{n.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ArchitectureCanvas(props: Props) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
