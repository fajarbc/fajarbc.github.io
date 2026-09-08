import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize, List } from 'lucide-react';

interface Props {
  onOpenNodeList: () => void;
}

export function ArchitectureControls({ onOpenNodeList }: Props) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div
      role="toolbar"
      aria-label="Diagram controls"
      className="absolute top-4 left-4 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur border border-slate-200 rounded-xl shadow-sm p-1"
    >
      <button
        onClick={() => zoomIn()}
        aria-label="Zoom in"
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ZoomIn size={16} />
      </button>
      <button
        onClick={() => zoomOut()}
        aria-label="Zoom out"
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ZoomOut size={16} />
      </button>
      <button
        onClick={() => fitView({ padding: 0.2, duration: 200 })}
        aria-label="Fit to view"
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <Maximize size={16} />
      </button>
      <div className="h-px bg-slate-200 mx-1" />
      <button
        onClick={onOpenNodeList}
        aria-label="Open node list for keyboard navigation"
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <List size={16} />
      </button>
    </div>
  );
}
