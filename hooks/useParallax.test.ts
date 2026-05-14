import { renderHook, act } from '@testing-library/react';
import { useParallax } from './useParallax';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock useReducedMotion
vi.mock('./useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

import { useReducedMotion } from './useReducedMotion';

const mockedUseReducedMotion = vi.mocked(useReducedMotion);

describe('useParallax', () => {
  let rafCallback: FrameRequestCallback | null = null;

  beforeEach(() => {
    rafCallback = null;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    mockedUseReducedMotion.mockReturnValue(false);

    // Default scroll position
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns offset 0 when speed is 1.0', () => {
    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true, writable: true });

    const { result } = renderHook(() => useParallax(1.0));

    // offset = 500 * (1 - 1.0) = 0
    expect(result.current.style.transform).toBe('translateY(0px)');
    expect(result.current.style.willChange).toBe('transform');
  });

  it('returns correct offset for speed 0.3', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true, writable: true });

    const { result } = renderHook(() => useParallax(0.3));

    // offset = 100 * (1 - 0.3) = 70
    expect(result.current.style.transform).toBe('translateY(70px)');
  });

  it('returns correct offset for speed 0.6', () => {
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true, writable: true });

    const { result } = renderHook(() => useParallax(0.6));

    // offset = 200 * (1 - 0.6) = 80
    expect(result.current.style.transform).toBe('translateY(80px)');
  });

  it('updates offset on scroll', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });

    const { result } = renderHook(() => useParallax(0.3));

    expect(result.current.style.transform).toBe('translateY(0px)');

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 300, configurable: true, writable: true });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    act(() => {
      if (rafCallback) rafCallback(performance.now());
    });

    // offset = 300 * (1 - 0.3) = 210
    expect(result.current.style.transform).toBe('translateY(210px)');
  });

  it('returns offset 0 when reduced motion is active', () => {
    mockedUseReducedMotion.mockReturnValue(true);
    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true, writable: true });

    const { result } = renderHook(() => useParallax(0.3));

    // Even though scroll is 500 and speed is 0.3, reduced motion forces 0
    expect(result.current.style.transform).toBe('translateY(0px)');
  });

  it('uses passive scroll listener', () => {
    const addEventSpy = vi.spyOn(window, 'addEventListener');

    renderHook(() => useParallax(0.5));

    const scrollCall = addEventSpy.mock.calls.find(
      (call) => call[0] === 'scroll'
    );
    expect(scrollCall).toBeDefined();
    expect(scrollCall![2]).toEqual({ passive: true });
  });

  it('cleans up on unmount', () => {
    const removeEventSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useParallax(0.5));
    unmount();

    const scrollRemoveCall = removeEventSpy.mock.calls.find(
      (call) => call[0] === 'scroll'
    );
    expect(scrollRemoveCall).toBeDefined();
  });

  it('returns a ref object', () => {
    const { result } = renderHook(() => useParallax(0.5));

    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
  });

  it('includes willChange transform in style', () => {
    const { result } = renderHook(() => useParallax(0.5));

    expect(result.current.style.willChange).toBe('transform');
  });

  it('does not register scroll listener when reduced motion is active', () => {
    mockedUseReducedMotion.mockReturnValue(true);
    const addEventSpy = vi.spyOn(window, 'addEventListener');

    renderHook(() => useParallax(0.5));

    const scrollCall = addEventSpy.mock.calls.find(
      (call) => call[0] === 'scroll'
    );
    expect(scrollCall).toBeUndefined();
  });
});
