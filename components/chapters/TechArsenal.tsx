import { useState, useRef, useCallback, useMemo } from 'react';
import { ChapterSection } from '@/components/layout/ChapterSection';
import { ScrollReveal } from '@/components/layout/ScrollReveal';
import { TechCategoryCard } from '@/components/TechCategoryCard';
import { PhysicsEasterEgg } from '@/components/PhysicsEasterEgg';
import { techCategories } from '@/data';
import { TechCategory } from '@/types';

const careerStartDate = process.env.CAREER_START_DATE || '2019-01-01';

function getYearsOfExperience(): number {
  const start = new Date(careerStartDate);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

/**
 * Animates pill items inside a card like bouncing balls sorting into place.
 * Each pill jumps up, then lands in its new sorted position.
 */
function animatePillsSort(card: HTMLElement) {
  const pillsContainer = card.querySelector('[data-pills]');
  if (!pillsContainer) return;

  const pills = pillsContainer.querySelectorAll<HTMLElement>('span');
  if (pills.length === 0) return;

  // Record current positions (FIRST)
  const firstRects = new Map<string, DOMRect>();
  pills.forEach((pill) => {
    firstRects.set(pill.textContent || '', pill.getBoundingClientRect());
  });

  // Sort the DOM elements by text content
  const sorted = Array.from(pills).sort((a, b) =>
    (a.textContent || '').localeCompare(b.textContent || '')
  );

  // Re-append in sorted order
  sorted.forEach((pill) => pillsContainer.appendChild(pill));

  // FLIP: Animate from old position to new
  const newPills = pillsContainer.querySelectorAll<HTMLElement>('span');
  newPills.forEach((pill, i) => {
    const text = pill.textContent || '';
    const firstRect = firstRects.get(text);
    if (!firstRect) return;

    const lastRect = pill.getBoundingClientRect();
    const deltaX = firstRect.left - lastRect.left;
    const deltaY = firstRect.top - lastRect.top;

    // Skip if no movement
    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

    // Invert: place at old position
    pill.style.transition = 'none';
    pill.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    pill.style.zIndex = '5';

    // Play: bounce to new position with staggered delay
    requestAnimationFrame(() => {
      // Bouncing ball easing: overshoot then settle
      pill.style.transition = `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 40}ms`;
      pill.style.transform = '';
    });
  });

  // Cleanup
  setTimeout(() => {
    newPills.forEach((pill) => {
      pill.style.transition = '';
      pill.style.transform = '';
      pill.style.zIndex = '';
    });
  }, 500 + newPills.length * 40 + 100);
}

/**
 * Restores pill items to their original (unsorted) order with a bounce animation.
 */
function animatePillsRestore(card: HTMLElement, originalItems: string[]) {
  const pillsContainer = card.querySelector('[data-pills]');
  if (!pillsContainer) return;

  const pills = pillsContainer.querySelectorAll<HTMLElement>('span');
  if (pills.length === 0) return;

  // Record current positions
  const firstRects = new Map<string, DOMRect>();
  pills.forEach((pill) => {
    firstRects.set(pill.textContent || '', pill.getBoundingClientRect());
  });

  // Re-order DOM to match original
  const pillMap = new Map<string, HTMLElement>();
  pills.forEach((pill) => pillMap.set(pill.textContent || '', pill));

  originalItems.forEach((item) => {
    const pill = pillMap.get(item);
    if (pill) pillsContainer.appendChild(pill);
  });

  // FLIP animate
  const newPills = pillsContainer.querySelectorAll<HTMLElement>('span');
  newPills.forEach((pill, i) => {
    const text = pill.textContent || '';
    const firstRect = firstRects.get(text);
    if (!firstRect) return;

    const lastRect = pill.getBoundingClientRect();
    const deltaX = firstRect.left - lastRect.left;
    const deltaY = firstRect.top - lastRect.top;

    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

    pill.style.transition = 'none';
    pill.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    pill.style.zIndex = '5';

    requestAnimationFrame(() => {
      pill.style.transition = `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 40}ms`;
      pill.style.transform = '';
    });
  });

  setTimeout(() => {
    newPills.forEach((pill) => {
      pill.style.transition = '';
      pill.style.transform = '';
      pill.style.zIndex = '';
    });
  }, 500 + newPills.length * 40 + 100);
}

export function TechArsenal() {
  const cloudRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isSorted, setIsSorted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sortedCategories, setSortedCategories] = useState<TechCategory[]>(techCategories);

  const { triggerBlackHole, isActive: isPhysicsActive } = PhysicsEasterEgg({
    containerRef: cloudRef,
  });

  const handleSort = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const grid = gridRef.current;
    if (!grid) {
      setIsAnimating(false);
      return;
    }

    // FLIP animation for cards
    const cards = grid.querySelectorAll<HTMLElement>('[data-card]');

    // FIRST: Record current card positions
    const firstPositions = new Map<string, DOMRect>();
    cards.forEach((card) => {
      const title = card.getAttribute('data-card') || '';
      firstPositions.set(title, card.getBoundingClientRect());
    });

    // Compute new order
    let newCategories: TechCategory[];
    if (isSorted) {
      newCategories = techCategories;
    } else {
      newCategories = [...techCategories]
        .sort((a, b) => a.title.localeCompare(b.title));
    }

    // Apply new card order (triggers re-render — items stay unsorted for now)
    setSortedCategories(newCategories);
    setIsSorted((prev) => !prev);

    // LAST + INVERT + PLAY for cards
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const newCards = grid.querySelectorAll<HTMLElement>('[data-card]');

        newCards.forEach((card) => {
          const title = card.getAttribute('data-card') || '';
          const firstRect = firstPositions.get(title);
          if (!firstRect) return;

          const lastRect = card.getBoundingClientRect();
          const deltaX = firstRect.left - lastRect.left;
          const deltaY = firstRect.top - lastRect.top;

          if (deltaX === 0 && deltaY === 0) return;

          card.style.transition = 'none';
          card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          card.style.zIndex = '10';

          requestAnimationFrame(() => {
            card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = '';
          });
        });

        // After cards settle, animate pills inside each card
        setTimeout(() => {
          newCards.forEach((card) => {
            card.style.transition = '';
            card.style.transform = '';
            card.style.zIndex = '';
          });

          // Phase 2: Bounce-sort pills inside each card
          newCards.forEach((card) => {
            const title = card.getAttribute('data-card') || '';
            const originalCategory = techCategories.find((c) => c.title === title);

            if (!isSorted && originalCategory) {
              // We just sorted → animate pills to sorted order
              animatePillsSort(card);
            } else if (isSorted && originalCategory) {
              // We just unsorted → restore original pill order
              animatePillsRestore(card, originalCategory.items);
            }
          });

          // Final cleanup
          setTimeout(() => {
            setIsAnimating(false);
          }, 600);
        }, 650);
      });
    });
  }, [isSorted, isAnimating]);

  const yearsExp = useMemo(() => getYearsOfExperience(), []);

  return (
    <ChapterSection id="tech-arsenal" aria-label="Technical Arsenal" className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 text-center mb-12">
            Technical Arsenal
          </h2>
        </ScrollReveal>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedCategories.map((category, index) => {
            const isCloud = category.title === 'Cloud Native & DevOps';

            return (
              <div key={category.title} data-card={category.title}>
                <ScrollReveal delay={Math.min(index * 100, 1000)} className="h-full">
                  <TechCategoryCard
                    category={category}
                    pillsRef={isCloud ? cloudRef : undefined}
                  />
                </ScrollReveal>
              </div>
            );
          })}
        </div>

        {/* Stats & Easter Egg Buttons */}
        <ScrollReveal delay={600}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-center">
            <div className="text-slate-300">
              <span className="text-2xl font-bold text-indigo-400">{yearsExp}+</span>
              <span className="ml-2 text-sm text-slate-400">Years of Experience</span>
            </div>

            <div className="h-8 w-px bg-slate-700" aria-hidden="true" />

            {/* Physics Easter Egg Button */}
            <div className="relative group">
              <button
                onClick={triggerBlackHole}
                disabled={isPhysicsActive}
                className="relative cursor-pointer px-4 py-2 rounded-lg border border-slate-600/50 bg-slate-800/50 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-[length:400%_100%] animate-shimmer hover:border-purple-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                PHYSICS BACKGROUND
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded bg-slate-700 text-xs text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap tooltip-arrow">
                Warning: Unstable Gravity
              </div>
            </div>

            {/* Sort Easter Egg Button */}
            <div className="relative group">
              <button
                onClick={handleSort}
                disabled={isAnimating}
                className="relative cursor-pointer px-4 py-2 rounded-lg border border-slate-600/50 bg-slate-800/50 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-[length:400%_100%] animate-shimmer hover:border-cyan-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                TECH LEAD
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded bg-slate-700 text-xs text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap tooltip-arrow">
                {isSorted ? 'Restore the chaos!' : 'Line up the chaos!'}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </ChapterSection>
  );
}
