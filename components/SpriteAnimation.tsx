import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SpriteAnimationProps {
  /** Path to the sprite sheet image */
  src: string;
  /** Width of a single frame in px */
  frameWidth: number;
  /** Height of a single frame in px */
  frameHeight: number;
  /** Number of columns in the sprite sheet */
  columns: number;
  /** Number of rows in the sprite sheet */
  rows: number;
  /** Display size (CSS width, default: 200px) */
  size?: number;
  className?: string;
}

/**
 * 9-tile sprite that follows the cursor direction.
 *
 * Sprite sheet layout (3×3):
 *   0: up-left    | 1: up    | 2: up-right
 *   3: left       | 4: front | 5: right
 *   6: down-left  | 7: down  | 8: down-right
 *
 * Picks frame based on angle from sprite center to cursor.
 * Also shifts position slightly toward cursor for a lively feel.
 */
export function SpriteAnimation({
  src,
  frameWidth,
  frameHeight,
  columns,
  rows,
  size = 200,
  className = '',
}: SpriteAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });
  const [frame, setFrame] = useState(4); // idle/front
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  const getDirectionFrame = useCallback((dx: number, dy: number, distance: number): number => {
    // If cursor is very close, show front/idle
    if (distance < 40) return 4;

    // atan2 gives angle: 0=right, PI/2=down, PI=left, -PI/2=up
    const angle = Math.atan2(dy, dx);
    const deg = ((angle * 180) / Math.PI + 360) % 360;

    // Map to 8 directions matching the sprite layout
    //   up = cursor above sprite → dy negative → angle ~270°
    //   down = cursor below → dy positive → angle ~90°
    //   right = cursor right → dx positive → angle ~0°
    //   left = cursor left → dx negative → angle ~180°
    if (deg >= 337.5 || deg < 22.5) return 5;        // right
    if (deg >= 22.5 && deg < 67.5) return 8;         // down-right
    if (deg >= 67.5 && deg < 112.5) return 7;        // down
    if (deg >= 112.5 && deg < 157.5) return 6;       // down-left
    if (deg >= 157.5 && deg < 202.5) return 3;       // left
    if (deg >= 202.5 && deg < 247.5) return 0;       // up-left
    if (deg >= 247.5 && deg < 292.5) return 1;       // up
    if (deg >= 292.5 && deg < 337.5) return 2;       // up-right

    return 4;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (reducedMotion || !containerRef.current) return;

      // Store last known cursor position
      mouseRef.current = { x: e.clientX, y: e.clientY };

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      setFrame(getDirectionFrame(dx, dy, distance));

      // Gentle lean toward cursor (max 10px)
      const maxOffset = 10;
      const factor = Math.min(distance / 400, 1);
      setOffset({
        x: (dx / (distance || 1)) * maxOffset * factor,
        y: (dy / (distance || 1)) * maxOffset * factor,
      });
    },
    [reducedMotion, getDirectionFrame]
  );

  // Recalculate direction on scroll (sprite moves but cursor stays)
  const handleScroll = useCallback(() => {
    if (reducedMotion || !containerRef.current) return;
    const { x, y } = mouseRef.current;
    if (x === -1) return; // no cursor tracked yet

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    setFrame(getDirectionFrame(dx, dy, distance));

    const maxOffset = 10;
    const factor = Math.min(distance / 400, 1);
    setOffset({
      x: (dx / (distance || 1)) * maxOffset * factor,
      y: (dy / (distance || 1)) * maxOffset * factor,
    });
  }, [reducedMotion, getDirectionFrame]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1, y: -1 };
    setFrame(4);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, handleScroll, reducedMotion]);

  const col = frame % columns;
  const row = Math.floor(frame / columns);

  const scale = size / frameWidth;
  const sheetWidth = columns * frameWidth;
  const sheetHeight = rows * frameHeight;

  return (
    <div
      ref={containerRef}
      className={`inline-block transition-transform duration-150 ease-out ${className}`}
      style={{
        width: `${size}px`,
        height: `${size * (frameHeight / frameWidth)}px`,
        backgroundImage: `url(${src})`,
        backgroundSize: `${sheetWidth * scale}px ${sheetHeight * scale}px`,
        backgroundPosition: `-${col * frameWidth * scale}px -${row * frameHeight * scale}px`,
        backgroundRepeat: 'no-repeat',
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
      aria-hidden="true"
    />
  );
}
