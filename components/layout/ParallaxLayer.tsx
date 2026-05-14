import { useState, useEffect } from 'react';
import { useParallax } from '@/hooks/useParallax';
import type { ParallaxLayerProps } from '@/types';

/**
 * ParallaxLayer wraps children with a parallax translateY effect driven by scroll speed.
 *
 * - speed 0.3 = background layer (moves slowest)
 * - speed 0.6 = midground layer
 * - speed 1.0 = foreground layer (moves with scroll)
 *
 * On mobile (< 768px), the midground layer (speed 0.6) is not rendered
 * to reduce layer count to 2 (background + foreground) for performance.
 */
export function ParallaxLayer({ speed, children, className }: ParallaxLayerProps) {
  const { ref, style } = useParallax(speed);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mql.addEventListener('change', handleChange);
    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, []);

  // On mobile, skip midground layer (speed 0.6)
  if (isMobile && speed === 0.6) {
    return null;
  }

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
