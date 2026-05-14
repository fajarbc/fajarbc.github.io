import { useCallback, useState } from 'react';

interface PhysicsEasterEggProps {
  /** Ref to the container element whose child pill tags will be animated */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Callback to trigger when animation completes (tags reappear) */
  onComplete?: () => void;
}

/**
 * Hook that provides a black hole gravity animation for tech category pills.
 * Phases: rumble → black hole appears → pills sucked in → black hole shrinks → BIG BANG explosion → settle.
 */
export function PhysicsEasterEgg({ containerRef, onComplete }: PhysicsEasterEggProps) {
  const [isActive, setIsActive] = useState(false);

  const triggerBlackHole = useCallback(() => {
    if (isActive || !containerRef.current) return;
    setIsActive(true);

    const container = containerRef.current;
    const pills = container.querySelectorAll<HTMLElement>('span');
    if (pills.length === 0) {
      setIsActive(false);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    // Phase 1: Rumble all pills
    pills.forEach((pill) => {
      pill.classList.add('animate-rumble');
    });

    // Phase 2: Show black hole and suck in tags
    setTimeout(() => {
      // Create black hole element
      const blackHole = document.createElement('div');
      blackHole.className = 'absolute rounded-full bg-black shadow-[0_0_60px_20px_rgba(0,0,0,0.8)] animate-grow z-50';
      blackHole.style.width = '80px';
      blackHole.style.height = '80px';
      blackHole.style.left = `${centerX - 40}px`;
      blackHole.style.top = `${centerY - 40}px`;
      blackHole.style.pointerEvents = 'none';
      container.style.position = 'relative';
      container.appendChild(blackHole);

      // Phase 3: Suck in pills one by one
      const suckDelay = 500;
      pills.forEach((pill, index) => {
        setTimeout(() => {
          pill.classList.remove('animate-rumble');
          pill.style.transition = 'all 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
          pill.style.transform = `translate(${centerX - pill.offsetLeft - pill.offsetWidth / 2}px, ${centerY - pill.offsetTop - pill.offsetHeight / 2}px) scale(0)`;
          pill.style.opacity = '0';
        }, suckDelay + index * 150);
      });

      // Phase 4: Shrink black hole → Big Bang explosion
      const totalSuckTime = suckDelay + pills.length * 150 + 500;
      setTimeout(() => {
        blackHole.classList.remove('animate-grow');
        blackHole.classList.add('animate-shrink-out');

        setTimeout(() => {
          // Remove black hole
          blackHole.remove();

          // BIG BANG: Explode pills outward from center, then settle back
          pills.forEach((pill, index) => {
            // Random explosion direction
            const angle = (Math.PI * 2 * index) / pills.length + (Math.random() - 0.5) * 0.5;
            const distance = 150 + Math.random() * 200;
            const explodeX = Math.cos(angle) * distance;
            const explodeY = Math.sin(angle) * distance;
            const rotation = (Math.random() - 0.5) * 720;

            // First: show pill at center, then explode outward
            pill.style.transition = 'none';
            pill.style.transform = `translate(${centerX - pill.offsetLeft - pill.offsetWidth / 2}px, ${centerY - pill.offsetTop - pill.offsetHeight / 2}px) scale(0.3)`;
            pill.style.opacity = '0.8';

            // Explode outward
            requestAnimationFrame(() => {
              pill.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              pill.style.transform = `translate(${explodeX}px, ${explodeY}px) rotate(${rotation}deg) scale(1.2)`;
              pill.style.opacity = '1';
            });

            // Settle back to original position
            setTimeout(() => {
              pill.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
              pill.style.transform = '';
              pill.style.opacity = '';
            }, 700 + index * 30);
          });

          // Done
          setTimeout(() => {
            pills.forEach((pill) => {
              pill.style.transition = '';
              pill.style.transform = '';
              pill.style.opacity = '';
            });
            setIsActive(false);
            onComplete?.();
          }, 700 + pills.length * 30 + 900);
        }, 1000);
      }, totalSuckTime);
    }, 1000);
  }, [isActive, containerRef, onComplete]);

  return { triggerBlackHole, isActive };
}
