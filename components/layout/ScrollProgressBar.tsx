import { useScrollProgress } from '@/hooks/useScrollProgress';

/**
 * A fixed-position horizontal progress bar at the top of the viewport
 * that fills from 0% to 100% based on the user's scroll position.
 *
 * Self-contained — no props needed. Uses the useScrollProgress hook
 * to drive the bar width.
 */
export function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-50 h-[3px] bg-gradient-to-r from-cyan-400 to-blue-500"
      style={{ width: `${progress * 100}%` }}
    />
  );
}
