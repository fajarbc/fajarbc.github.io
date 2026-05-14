import { useState, useEffect, type RefObject } from 'react';

/**
 * Computes the scroll progress of a scrollable element as a value in [0, 1].
 *
 * - Accepts an optional ref to a scrollable element; defaults to `document.documentElement`.
 * - Uses a passive scroll listener throttled with `requestAnimationFrame` to avoid jank.
 * - Returns 0 when the element is not scrollable (scrollHeight <= clientHeight).
 * - Cleans up the listener on unmount.
 */
export function useScrollProgress(
  elementRef?: RefObject<HTMLElement | null>
): number {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const getElement = (): HTMLElement | null => {
      if (elementRef) {
        return elementRef.current;
      }
      return document.documentElement;
    };

    const calculateProgress = (): number => {
      const el = getElement();
      if (!el) return 0;

      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) return 0;

      const raw = scrollTop / maxScroll;
      return Math.min(1, Math.max(0, raw));
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      rafId = requestAnimationFrame(() => {
        setProgress(calculateProgress());
        ticking = false;
      });
    };

    // Set initial progress
    setProgress(calculateProgress());

    // Determine the scroll target for the event listener
    const scrollTarget = elementRef?.current ?? window;

    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [elementRef]);

  return progress;
}
