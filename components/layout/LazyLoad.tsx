import { useRef, useState, useEffect, type ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  /** Root margin for IntersectionObserver (default: '200px 0px') */
  rootMargin?: string;
  /** Placeholder height while content is deferred (default: '100vh') */
  placeholderHeight?: string;
  className?: string;
}

/**
 * LazyLoad defers rendering of children until the container is within
 * a configurable distance of the viewport (default 200px).
 *
 * Uses IntersectionObserver with rootMargin to detect proximity.
 * Falls back to immediate rendering if IntersectionObserver is unavailable.
 *
 * Validates: Requirements 10.2
 */
export function LazyLoad({
  children,
  rootMargin = '200px 0px',
  placeholderHeight = '100vh',
  className = '',
}: LazyLoadProps) {
  const isSupported =
    typeof window !== 'undefined' &&
    typeof window.IntersectionObserver === 'function';

  const [shouldRender, setShouldRender] = useState(!isSupported);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSupported || shouldRender) return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldRender(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [isSupported, shouldRender, rootMargin]);

  if (shouldRender) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={sentinelRef}
      className={className}
      style={{ minHeight: placeholderHeight }}
      aria-hidden="true"
    />
  );
}
