import { useRef, useState, useEffect, type CSSProperties, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseParallaxReturn {
  ref: RefObject<HTMLDivElement | null>;
  style: CSSProperties;
}

/**
 * Computes a parallax translateY offset based on scroll position and speed factor.
 *
 * - `speed` controls how fast the layer moves relative to scroll (0.3 = background, 0.6 = midground, 1.0 = foreground).
 * - Offset is computed as `scrollPosition × (1 - speed)`.
 * - When reduced motion is active, offset is always 0.
 * - Uses a passive scroll listener throttled with `requestAnimationFrame`.
 * - Returns `{ ref, style }` where style contains `transform: translateY(...)` and `will-change: transform`.
 */
export function useParallax(speed: number): UseParallaxReturn {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setOffset(0);
      return;
    }

    let rafId: number | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      rafId = requestAnimationFrame(() => {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        setOffset(scrollPosition * (1 - speed));
        ticking = false;
      });
    };

    // Set initial offset
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    setOffset(scrollPosition * (1 - speed));

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [speed, reducedMotion]);

  const style: CSSProperties = {
    transform: `translateY(${reducedMotion ? 0 : offset}px)`,
    willChange: 'transform',
  };

  return { ref, style };
}
