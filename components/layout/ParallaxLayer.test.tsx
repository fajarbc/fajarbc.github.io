import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ParallaxLayer } from './ParallaxLayer';

// Mock useParallax hook
vi.mock('@/hooks/useParallax', () => ({
  useParallax: (speed: number) => ({
    ref: { current: null },
    style: {
      transform: `translateY(0px)`,
      willChange: 'transform',
    },
  }),
}));

describe('ParallaxLayer', () => {
  let matchMediaListeners: Array<(e: MediaQueryListEvent) => void>;
  let matchMediaMatches: boolean;

  beforeEach(() => {
    matchMediaListeners = [];
    matchMediaMatches = false;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: matchMediaMatches,
        media: query,
        addEventListener: (_event: string, handler: (e: MediaQueryListEvent) => void) => {
          matchMediaListeners.push(handler);
        },
        removeEventListener: (_event: string, handler: (e: MediaQueryListEvent) => void) => {
          matchMediaListeners = matchMediaListeners.filter((h) => h !== handler);
        },
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children on desktop for all speed values', () => {
    matchMediaMatches = false;

    const { rerender } = render(
      <ParallaxLayer speed={0.3}>
        <p>Background</p>
      </ParallaxLayer>
    );
    expect(screen.getByText('Background')).toBeDefined();

    rerender(
      <ParallaxLayer speed={0.6}>
        <p>Midground</p>
      </ParallaxLayer>
    );
    expect(screen.getByText('Midground')).toBeDefined();

    rerender(
      <ParallaxLayer speed={1.0}>
        <p>Foreground</p>
      </ParallaxLayer>
    );
    expect(screen.getByText('Foreground')).toBeDefined();
  });

  it('does not render midground layer (speed 0.6) on mobile', () => {
    matchMediaMatches = true;

    const { container } = render(
      <ParallaxLayer speed={0.6}>
        <p>Midground</p>
      </ParallaxLayer>
    );

    expect(container.innerHTML).toBe('');
  });

  it('renders background layer (speed 0.3) on mobile', () => {
    matchMediaMatches = true;

    render(
      <ParallaxLayer speed={0.3}>
        <p>Background</p>
      </ParallaxLayer>
    );

    expect(screen.getByText('Background')).toBeDefined();
  });

  it('renders foreground layer (speed 1.0) on mobile', () => {
    matchMediaMatches = true;

    render(
      <ParallaxLayer speed={1.0}>
        <p>Foreground</p>
      </ParallaxLayer>
    );

    expect(screen.getByText('Foreground')).toBeDefined();
  });

  it('applies will-change: transform style', () => {
    matchMediaMatches = false;

    const { container } = render(
      <ParallaxLayer speed={0.3}>
        <p>Content</p>
      </ParallaxLayer>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.willChange).toBe('transform');
  });

  it('applies transform style from useParallax', () => {
    matchMediaMatches = false;

    const { container } = render(
      <ParallaxLayer speed={0.3}>
        <p>Content</p>
      </ParallaxLayer>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.transform).toBe('translateY(0px)');
  });

  it('merges className prop with wrapper div', () => {
    matchMediaMatches = false;

    const { container } = render(
      <ParallaxLayer speed={0.3} className="absolute inset-0">
        <p>Content</p>
      </ParallaxLayer>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('absolute');
    expect(wrapper.className).toContain('inset-0');
  });

  it('responds to matchMedia change events', () => {
    matchMediaMatches = false;

    const { container } = render(
      <ParallaxLayer speed={0.6}>
        <p>Midground</p>
      </ParallaxLayer>
    );

    // Initially on desktop, midground renders
    expect(screen.getByText('Midground')).toBeDefined();

    // Simulate viewport change to mobile
    act(() => {
      matchMediaListeners.forEach((listener) =>
        listener({ matches: true } as MediaQueryListEvent)
      );
    });

    // After switching to mobile, midground should not render
    expect(container.innerHTML).toBe('');
  });

  it('works without optional className', () => {
    matchMediaMatches = false;

    const { container } = render(
      <ParallaxLayer speed={1.0}>
        <p>No class</p>
      </ParallaxLayer>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe('');
  });
});
