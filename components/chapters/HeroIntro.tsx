import { useState, useEffect, useCallback } from 'react';
import { ChapterSection } from '@/components/layout/ChapterSection';
import { ParallaxLayer } from '@/components/layout/ParallaxLayer';
import { ParticleField } from '@/components/ParticleField';
import { TerminalWidget } from '@/components/TerminalWidget';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ChevronDown } from 'lucide-react';

const fullName = process.env.FULL_NAME || 'Fajar Budi Cahyanto';
const jobTitle = process.env.JOB_TITLE || 'AI Infrastructure & Cloud Architect';
const isAvailableForHire = process.env.IS_AVAILABLE_FOR_HIRE === 'true';

/**
 * Computes hero content opacity based on scroll position within the hero section.
 * Opacity fades linearly from 1 (top) to 0 (fully scrolled past).
 */
function computeHeroOpacity(scrollY: number, heroHeight: number): number {
  if (heroHeight <= 0) return 1;
  return Math.max(0, 1 - scrollY / heroHeight);
}

export function HeroIntro() {
  const reducedMotion = useReducedMotion();
  const [opacity, setOpacity] = useState(1);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Trigger entrance animation after mount
  useEffect(() => {
    if (reducedMotion) {
      setHasAnimated(true);
      return;
    }
    // Small delay to ensure the initial state renders first
    const timer = requestAnimationFrame(() => {
      setHasAnimated(true);
    });
    return () => cancelAnimationFrame(timer);
  }, [reducedMotion]);

  // Scroll-driven opacity fade
  const handleScroll = useCallback(() => {
    if (reducedMotion) return;
    const heroHeight = window.innerHeight;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    setOpacity(computeHeroOpacity(scrollY, heroHeight));
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setOpacity(1);
      return;
    }

    let rafId: number | null = null;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Set initial opacity
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [handleScroll, reducedMotion]);

  // Entrance animation styles
  const entranceStyle = reducedMotion
    ? {}
    : {
        opacity: hasAnimated ? 1 : 0,
        transform: hasAnimated ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 800ms ease-out, transform 800ms ease-out',
      };

  return (
    <ChapterSection id="hero" aria-label="Introduction" className="relative overflow-hidden">
      {/* Background layer - animated gradient */}
      <ParallaxLayer speed={0.3} className="absolute inset-0 z-0">
        <div
          className="h-full w-full"
          style={{
            background:
              'linear-gradient(135deg, #020617 0%, #0c1929 30%, #0f2a3d 50%, #061520 70%, #020617 100%)',
            backgroundSize: '200% 200%',
            animation: reducedMotion ? 'none' : 'gradientShift 12s ease infinite',
          }}
          aria-hidden="true"
        />
      </ParallaxLayer>

      {/* Midground layer - reactive particles */}
      <ParallaxLayer speed={0.6} className="absolute inset-0 z-10">
        <ParticleField />
      </ParallaxLayer>

      {/* Foreground layer - main content */}
      <ParallaxLayer speed={1.0} className="absolute inset-0 z-20">
        <div
          className="h-full w-full flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: reducedMotion ? 1 : opacity }}
        >
          <div className="w-full" style={entranceStyle}>
            {/* Available for hire badge */}
            {isAvailableForHire && (
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                  Available for hire
                </span>
              </div>
            )}

            {/* Developer name */}
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              {fullName}
            </h1>

            {/* Role title */}
            <p className="mt-4 text-xl md:text-2xl text-slate-300">
              {jobTitle}
            </p>

            {/* Terminal Easter Egg */}
            <TerminalWidget />
          </div>

          {/* Scroll-down affordance */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            style={entranceStyle}
          >
            <ChevronDown
              className="text-slate-400"
              size={32}
              style={{
                animation: reducedMotion ? 'none' : 'bounce 2s ease-in-out infinite',
              }}
              aria-hidden="true"
            />
            <span className="sr-only">Scroll down</span>
          </div>
        </div>
      </ParallaxLayer>
    </ChapterSection>
  );
}

// Export the computation function for testing
export { computeHeroOpacity };
