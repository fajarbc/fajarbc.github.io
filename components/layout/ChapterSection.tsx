import type { ChapterSectionProps } from '@/types';

export function ChapterSection({ id, children, className = '', 'aria-label': ariaLabel }: ChapterSectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`min-h-screen ${className}`.trim()}
    >
      {children}
    </section>
  );
}
