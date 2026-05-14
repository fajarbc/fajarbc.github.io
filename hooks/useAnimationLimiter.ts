import { useRef, useCallback } from 'react';

/**
 * Global animation slot tracker.
 * Limits concurrent animations to a maximum of MAX_CONCURRENT elements
 * across the entire viewport.
 *
 * Validates: Requirements 10.4
 */
const MAX_CONCURRENT = 3;

let activeCount = 0;
const queue: Array<() => void> = [];

function requestSlot(): Promise<void> {
  if (activeCount < MAX_CONCURRENT) {
    activeCount++;
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    queue.push(() => {
      activeCount++;
      resolve();
    });
  });
}

function releaseSlot(): void {
  activeCount--;
  if (queue.length > 0 && activeCount < MAX_CONCURRENT) {
    const next = queue.shift();
    next?.();
  }
}

/**
 * Returns a function that wraps an animation callback with concurrency limiting.
 * The animation will only start when a slot is available (max 3 concurrent).
 * The slot is released after the specified duration.
 *
 * Usage:
 *   const scheduleAnimation = useAnimationLimiter();
 *   scheduleAnimation(600); // returns Promise that resolves when slot is acquired
 */
export function useAnimationLimiter() {
  const slotHeld = useRef(false);

  const scheduleAnimation = useCallback(
    async (durationMs: number): Promise<boolean> => {
      if (slotHeld.current) return true; // already animating

      await requestSlot();
      slotHeld.current = true;

      // Release slot after animation completes
      setTimeout(() => {
        slotHeld.current = false;
        releaseSlot();
      }, durationMs);

      return true;
    },
    []
  );

  return scheduleAnimation;
}

// Export for testing
export { requestSlot, releaseSlot, MAX_CONCURRENT };

/**
 * Reset internal state (for testing only)
 */
export function _resetAnimationLimiter(): void {
  activeCount = 0;
  queue.length = 0;
}
