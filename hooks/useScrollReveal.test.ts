import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useScrollReveal } from './useScrollReveal';

describe('useScrollReveal', () => {
  let observeMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();

    vi.stubGlobal(
      'IntersectionObserver',
      class MockIntersectionObserver {
        constructor(callback: IntersectionObserverCallback) {
          observerCallback = callback;
        }
        observe = observeMock;
        disconnect = disconnectMock;
        unobserve = vi.fn();
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return isVisible as false initially', () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current.isVisible).toBe(false);
  });

  it('should return a ref callback function', () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(typeof result.current.ref).toBe('function');
  });

  it('should observe the element when ref is called with a node', () => {
    const { result } = renderHook(() => useScrollReveal());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(observeMock).toHaveBeenCalledWith(element);
  });

  it('should set isVisible to true when element intersects', () => {
    const { result } = renderHook(() => useScrollReveal());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      observerCallback(
        [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(result.current.isVisible).toBe(true);
  });

  it('should disconnect observer after first intersection (triggerOnce)', () => {
    const { result } = renderHook(() => useScrollReveal());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      observerCallback(
        [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(disconnectMock).toHaveBeenCalled();
  });

  it('should stay visible permanently once triggered', () => {
    const { result } = renderHook(() => useScrollReveal());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    // Trigger visibility
    act(() => {
      observerCallback(
        [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(result.current.isVisible).toBe(true);

    // isVisible should remain true — observer is disconnected so no further events
    expect(result.current.isVisible).toBe(true);
  });

  it('should not trigger on non-intersecting entries', () => {
    const { result } = renderHook(() => useScrollReveal());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      observerCallback(
        [{ isIntersecting: false, target: element } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(result.current.isVisible).toBe(false);
  });

  it('should disconnect observer on unmount', () => {
    const { result, unmount } = renderHook(() => useScrollReveal());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  it('should return isVisible true immediately when IntersectionObserver is unavailable', () => {
    // Remove IntersectionObserver from the global scope
    vi.stubGlobal('IntersectionObserver', undefined);

    const { result } = renderHook(() => useScrollReveal());
    expect(result.current.isVisible).toBe(true);
  });
});
