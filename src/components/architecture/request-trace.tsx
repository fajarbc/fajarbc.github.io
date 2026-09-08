import { useReducedMotion } from '@/hooks/useReducedMotion';
import { buildTrace, buildJourneyTrace, getActiveIds, type TraceStep } from '@/src/lib/architecture/trace';
import type { ArchitectureData } from '@/src/types/architecture';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

interface Props {
  data: ArchitectureData;
  journeyId?: string;
  onActiveChange: (nodeIds: Set<string>, edgeIds: Set<string>) => void;
  onExit: () => void;
}

export function RequestTrace({ data, journeyId, onActiveChange, onExit }: Props) {
  const reducedMotion = useReducedMotion();
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const t = journeyId
      ? buildJourneyTrace(data, journeyId)
      : buildTrace(data);
    setTrace(t);
    setCurrentStep(-1);
    setPlaying(false);
  }, [data, journeyId]);

  const updateActive = useCallback(
    (step: number) => {
      if (step < 0) {
        onActiveChange(new Set(), new Set());
      } else {
        const { nodeIds, edgeIds } = getActiveIds(trace, step);
        onActiveChange(nodeIds, edgeIds);
      }
    },
    [trace, onActiveChange],
  );

  useEffect(() => {
    updateActive(currentStep);
  }, [currentStep, updateActive]);

  // Auto-play timer
  useEffect(() => {
    if (!playing || reducedMotion) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= trace.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(timerRef.current);
  }, [playing, trace.length, reducedMotion]);

  if (trace.length === 0) return null;

  const stepLabel =
    currentStep < 0
      ? 'Ready'
      : `Step ${currentStep + 1} of ${trace.length}`;

  return (
    <div
      role="toolbar"
      aria-label="Request trace controls"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur border border-slate-200 rounded-xl shadow-lg px-4 py-2 flex items-center gap-3"
    >
      <span className="text-xs font-mono text-slate-500 min-w-[5rem]">{stepLabel}</span>

      <button
        onClick={() => { setCurrentStep(-1); setPlaying(false); }}
        aria-label="Reset trace"
        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700"
      >
        <RotateCcw size={16} />
      </button>
      <button
        onClick={() => setCurrentStep((s) => Math.max(-1, s - 1))}
        disabled={currentStep <= -1}
        aria-label="Previous step"
        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 disabled:opacity-30"
      >
        <SkipBack size={16} />
      </button>
      {reducedMotion ? (
        <button
          onClick={() => setCurrentStep((s) => Math.min(trace.length - 1, s + 1))}
          disabled={currentStep >= trace.length - 1}
          aria-label="Next step"
          className="p-1.5 rounded hover:bg-cyan-50 text-cyan-700 disabled:opacity-30"
        >
          <SkipForward size={16} />
        </button>
      ) : (
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause trace' : 'Play trace'}
          className="p-1.5 rounded hover:bg-cyan-50 text-cyan-700"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
      )}
      <button
        onClick={() => setCurrentStep((s) => Math.min(trace.length - 1, s + 1))}
        disabled={currentStep >= trace.length - 1}
        aria-label="Next step"
        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 disabled:opacity-30"
      >
        <SkipForward size={16} />
      </button>

      <div className="h-5 w-px bg-slate-200" />

      <button
        onClick={onExit}
        className="text-xs font-mono text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100"
      >
        Exit Trace
      </button>
    </div>
  );
}
