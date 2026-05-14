import { renderHook, act } from '@testing-library/react';
import { useScrollProgress } from './useScrollProgress';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRef } from 'react';

describe('useScrollProgress', () => {
  let rafCallback: FrameRequestCallback | null = null;

  beforeEach(() => {
    rafCallback = null;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 0 initially when page is not scrollable', () => {
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 800, configurable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true });

    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);
  });

  it('returns 0 when scrollHeight <= clientHeight', () => {
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 500, configurable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true });

    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);
  });

  it('computes progress correctly on scroll', () => {
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 1000, configurable: true });

    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);

    // Simulate scroll to midpoint
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 500, configurable: true });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // Flush rAF
    act(() => {
      if (rafCallback) rafCallback(performance.now());
    });

    expect(result.current).toBe(0.5);
  });

  it('clamps progress to 1 at maximum scroll', () => {
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 1000, configurable: true });

    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(1);
  });

  it('uses passive scroll listener', () => {
    const addEventSpy = vi.spyOn(window, 'addEventListener');

    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 1000, configurable: true });

    renderHook(() => useScrollProgress());

    const scrollCall = addEventSpy.mock.calls.find(
      (call) => call[0] === 'scroll'
    );
    expect(scrollCall).toBeDefined();
    expect(scrollCall![2]).toEqual({ passive: true });
  });

  it('cleans up listener on unmount', () => {
    const removeEventSpy = vi.spyOn(window, 'removeEventListener');

    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 1000, configurable: true });

    const { unmount } = renderHook(() => useScrollProgress());
    unmount();

    const scrollRemoveCall = removeEventSpy.mock.calls.find(
      (call) => call[0] === 'scroll'
    );
    expect(scrollRemoveCall).toBeDefined();
  });

  it('throttles with requestAnimationFrame', () => {
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 1000, configurable: true });

    renderHook(() => useScrollProgress());

    // Dispatch multiple scroll events without flushing rAF
    act(() => {
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
    });

    // rAF should only be called once (throttled)
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });
});
