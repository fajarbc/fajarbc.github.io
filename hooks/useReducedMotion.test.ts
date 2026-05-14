import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  let listeners: Map<string, (event: MediaQueryListEvent) => void>;
  let matchesValue: boolean;

  beforeEach(() => {
    listeners = new Map();
    matchesValue = false;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: matchesValue,
        media: query,
        addEventListener: (event: string, handler: (event: MediaQueryListEvent) => void) => {
          listeners.set(event, handler);
        },
        removeEventListener: (event: string) => {
          listeners.delete(event);
        },
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false when reduced motion is not active', () => {
    matchesValue = false;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when reduced motion is active', () => {
    matchesValue = true;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('updates when media query changes', () => {
    matchesValue = false;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    // Simulate the user enabling reduced motion
    act(() => {
      const handler = listeners.get('change');
      if (handler) {
        handler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });

  it('cleans up listener on unmount', () => {
    matchesValue = false;
    const { unmount } = renderHook(() => useReducedMotion());

    expect(listeners.has('change')).toBe(true);

    unmount();

    expect(listeners.has('change')).toBe(false);
  });

  it('defaults to false when matchMedia is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
