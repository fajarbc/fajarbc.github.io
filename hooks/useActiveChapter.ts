import { useState, useEffect, useRef } from 'react';

/**
 * Observes which chapter section is currently most visible in the viewport.
 * Uses IntersectionObserver with a threshold array for granular visibility tracking.
 *
 * @param chapterIds - Array of chapter element IDs to observe
 * @returns The `id` of the currently most visible chapter (defaults to first chapter)
 */
export function useActiveChapter(chapterIds: string[]): string {
  const [activeId, setActiveId] = useState<string>(chapterIds[0] ?? '');
  const ratiosRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined' ||
      chapterIds.length === 0
    ) {
      return;
    }

    const thresholds = [0, 0.25, 0.5, 0.75, 1];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratiosRef.current.set(entry.target.id, entry.intersectionRatio);
        }

        // Find the chapter with the highest intersection ratio
        let maxRatio = -1;
        let maxId = chapterIds[0];

        for (const id of chapterIds) {
          const ratio = ratiosRef.current.get(id) ?? 0;
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxId = id;
          }
        }

        setActiveId(maxId);
      },
      { threshold: thresholds }
    );

    // Observe each chapter element by ID
    const elements: Element[] = [];
    for (const id of chapterIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      for (const el of elements) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, [chapterIds]);

  return activeId;
}
