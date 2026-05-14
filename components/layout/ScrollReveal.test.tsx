import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ScrollReveal } from './ScrollReveal';

// Mock useReducedMotion
const mockUseReducedMotion = vi.fn(() => false);
vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

// Mock useScrollReveal
const mockUseScrollReveal = vi.fn(() => ({
  ref: vi.fn(),
  isVisible: false,
}));
vi.mock('@/hooks/useScrollReveal', () => ({
  useScrollReveal: () => mockUseScrollReveal(),
}));

// Mock useAnimationLimiter — resolves immediately
const mockScheduleAnimation = vi.fn(() => Promise.resolve(true));
vi.mock('@/hooks/useAnimationLimiter', () => ({
  useAnimationLimiter: () => mockScheduleAnimation,
}));

describe('ScrollReveal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockUseReducedMotion.mockReturnValue(false);
    mockUseScrollReveal.mockReturnValue({ ref: vi.fn(), isVisible: false });
    mockScheduleAnimation.mockReturnValue(Promise.resolve(true));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders children', () => {
    render(
      <ScrollReveal>
        <p>Hello World</p>
      </ScrollReveal>
    );

    expect(screen.getByText('Hello World')).toBeDefined();
  });

  it('applies opacity 0 and translateY(30px) when not visible', () => {
    mockUseScrollReveal.mockReturnValue({ ref: vi.fn(), isVisible: false });

    const { container } = render(
      <ScrollReveal>
        <p>Content</p>
      </ScrollReveal>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe('0');
    expect(wrapper.style.transform).toBe('translateY(30px)');
  });

  it('applies opacity 1 and translateY(0) when animation is ready', async () => {
    mockUseScrollReveal.mockReturnValue({ ref: vi.fn(), isVisible: true });

    const { container } = render(
      <ScrollReveal>
        <p>Content</p>
      </ScrollReveal>
    );

    // Advance timers to trigger the delay timeout (default 0ms)
    await act(async () => {
      vi.advanceTimersByTime(0);
      await Promise.resolve(); // flush microtasks for scheduleAnimation
    });

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe('1');
    expect(wrapper.style.transform).toBe('translateY(0)');
  });

  it('applies 600ms ease-out transition when animation is ready', async () => {
    mockUseScrollReveal.mockReturnValue({ ref: vi.fn(), isVisible: true });

    const { container } = render(
      <ScrollReveal>
        <p>Content</p>
      </ScrollReveal>
    );

    await act(async () => {
      vi.advanceTimersByTime(0);
      await Promise.resolve();
    });

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.transition).toBe('all 600ms ease-out');
  });

  it('respects delay prop before requesting animation slot', async () => {
    mockUseScrollReveal.mockReturnValue({ ref: vi.fn(), isVisible: true });

    const { container } = render(
      <ScrollReveal delay={300}>
        <p>Content</p>
      </ScrollReveal>
    );

    // Before delay elapses, should still be hidden
    await act(async () => {
      vi.advanceTimersByTime(100);
      await Promise.resolve();
    });

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe('0');

    // After delay elapses, animation should be ready
    await act(async () => {
      vi.advanceTimersByTime(200);
      await Promise.resolve();
    });

    expect(wrapper.style.opacity).toBe('1');
  });

  it('merges className prop', () => {
    const { container } = render(
      <ScrollReveal className="mt-4 text-white">
        <p>Content</p>
      </ScrollReveal>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('mt-4');
    expect(wrapper.className).toContain('text-white');
  });

  it('renders children immediately without animation when reduced motion is active', () => {
    mockUseReducedMotion.mockReturnValue(true);

    const { container } = render(
      <ScrollReveal>
        <p>Accessible Content</p>
      </ScrollReveal>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    // Should not have animation styles
    expect(wrapper.style.opacity).toBe('');
    expect(wrapper.style.transform).toBe('');
    expect(wrapper.style.transition).toBe('');
    expect(screen.getByText('Accessible Content')).toBeDefined();
  });

  it('preserves className when reduced motion is active', () => {
    mockUseReducedMotion.mockReturnValue(true);

    const { container } = render(
      <ScrollReveal className="custom-class">
        <p>Content</p>
      </ScrollReveal>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('custom-class');
  });

  it('calls scheduleAnimation when element becomes visible', async () => {
    mockUseScrollReveal.mockReturnValue({ ref: vi.fn(), isVisible: true });

    render(
      <ScrollReveal>
        <p>Content</p>
      </ScrollReveal>
    );

    await act(async () => {
      vi.advanceTimersByTime(0);
      await Promise.resolve();
    });

    expect(mockScheduleAnimation).toHaveBeenCalledWith(600);
  });
});
