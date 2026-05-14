import { useRef, useState, useEffect, useCallback } from 'react';

interface UseScrollRevealResult {
  ref: (node: Element | null) => void;
  isVisible: boolean;
}

/**
 * Observes an element's visibility using IntersectionObserver with a 0.2 (20%) threshold.
 * Once the element becomes visible, it stays visible permanently (triggerOnce behavior).
 *
 * If IntersectionObserver is unavailable, returns `{ isVisible: true }` immediately
 * so content renders in its final state without animation.
 */
export function useScrollReveal(): UseScrollRevealResult {
  // If IntersectionObserver is not supported, show content immediately
  const isSupported =
    typeof window !== 'undefined' &&
    typeof window.IntersectionObserver === 'function';

  const [isVisible, setIsVisible] = useState<boolean>(!isSupported);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<Element | null>(null);

  // Clean up observer
  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Ref callback to attach/detach observer to the element
  const ref = useCallback(
    (node: Element | null) => {
      // If already visible or not supported, no need to observe
      if (!isSupported || isVisible) {
        nodeRef.current = node;
        return;
      }

      // If the node changed, disconnect from the previous one
      if (nodeRef.current !== node) {
        disconnect();
      }

      nodeRef.current = node;

      if (!node) return;

      // Create observer with 0.2 threshold (20% visibility)
      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setIsVisible(true);
              // triggerOnce: disconnect after first intersection
              disconnect();
              break;
            }
          }
        },
        { threshold: 0.2 }
      );

      observerRef.current.observe(node);
    },
    [isSupported, isVisible, disconnect]
  );

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { ref, isVisible };
}
