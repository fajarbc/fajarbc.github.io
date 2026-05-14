import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LazyLoad } from './LazyLoad';

describe('LazyLoad', () => {
  let observerCallback: IntersectionObserverCallback;
  let observerOptions: IntersectionObserverInit | undefined;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockObserve: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockDisconnect = vi.fn();
    mockObserve = vi.fn();

    vi.stubGlobal(
      'IntersectionObserver',
      class MockIntersectionObserver {
        constructor(cb: IntersectionObserverCallback, opts?: IntersectionObserverInit) {
          observerCallback = cb;
          observerOptions = opts;
        }
        observe = mockObserve;
        disconnect = mockDisconnect;
        unobserve = vi.fn();
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders placeholder initially and does not render children', () => {
    render(
      <LazyLoad>
        <p>Lazy content</p>
      </LazyLoad>
    );

    expect(screen.queryByText('Lazy content')).toBeNull();
  });

  it('renders children when intersection is triggered', () => {
    render(
      <LazyLoad>
        <p>Lazy content</p>
      </LazyLoad>
    );

    // Simulate intersection
    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(screen.getByText('Lazy content')).toBeInTheDocument();
  });

  it('uses rootMargin of 200px 0px by default', () => {
    render(
      <LazyLoad>
        <p>Content</p>
      </LazyLoad>
    );

    expect(observerOptions?.rootMargin).toBe('200px 0px');
  });

  it('disconnects observer after intersection', () => {
    render(
      <LazyLoad>
        <p>Content</p>
      </LazyLoad>
    );

    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('renders children immediately if IntersectionObserver is not supported', () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    render(
      <LazyLoad>
        <p>Fallback content</p>
      </LazyLoad>
    );

    expect(screen.getByText('Fallback content')).toBeInTheDocument();
  });

  it('applies custom rootMargin', () => {
    render(
      <LazyLoad rootMargin="400px 0px">
        <p>Content</p>
      </LazyLoad>
    );

    expect(observerOptions?.rootMargin).toBe('400px 0px');
  });
});
