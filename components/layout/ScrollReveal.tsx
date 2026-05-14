import { useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useAnimationLimiter } from '@/hooks/useAnimationLimiter';
import { ScrollRevealProps } from '@/types';

const ANIMATION_DURATION = 600;

export function ScrollReveal({ delay = 0, children, className = '' }: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal();
  const reducedMotion = useReducedMotion();
  const scheduleAnimation = useAnimationLimiter();
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    if (!isVisible || reducedMotion || animationReady) return;

    // Wait for stagger delay, then request an animation slot
    const timer = setTimeout(() => {
      scheduleAnimation(ANIMATION_DURATION).then(() => {
        setAnimationReady(true);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, reducedMotion, animationReady, delay, scheduleAnimation]);

  // When reduced motion is active, render children immediately without animation
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: animationReady ? 1 : 0,
        transform: animationReady ? 'translateY(0)' : 'translateY(30px)',
        transition: animationReady ? `all ${ANIMATION_DURATION}ms ease-out` : 'none',
      }}
    >
      {children}
    </div>
  );
}
