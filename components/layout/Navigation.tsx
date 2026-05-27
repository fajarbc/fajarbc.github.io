import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Menu, X } from 'lucide-react';
import { chapters } from '@/data';
import { useActiveChapter } from '@/hooks/useActiveChapter';

const NAV_HEIGHT = 64; // px - fixed nav height for scroll offset

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const chapterIds = useMemo(() => chapters.map((c) => c.id), []);
  const activeChapterId = useActiveChapter(chapterIds);

  // Track scroll position for navbar background opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const target = document.getElementById(id);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      setIsMobileMenuOpen(false);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>, id: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const target = document.getElementById(id);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
      }
    },
    []
  );

  const toggleMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            className="font-mono text-lg font-bold tracking-tight text-slate-800 hover:text-cyan-600 transition-colors cursor-pointer"
          >
            Fajar<span className="text-cyan-600">BC</span>
          </a>

          {/* Desktop navigation links */}
          <ul className="hidden md:flex items-center gap-1">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  onClick={(e) => handleNavClick(e, chapter.id)}
                  onKeyDown={(e) => handleKeyDown(e, chapter.id)}
                  aria-current={activeChapterId === chapter.id ? 'true' : undefined}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white ${
                    activeChapterId === chapter.id
                      ? 'text-cyan-700 bg-cyan-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {chapter.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center min-h-11 min-w-11 p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md">
          <ul className="px-4 py-3 space-y-1">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  onClick={(e) => handleNavClick(e, chapter.id)}
                  onKeyDown={(e) => handleKeyDown(e, chapter.id)}
                  aria-current={activeChapterId === chapter.id ? 'true' : undefined}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white ${
                    activeChapterId === chapter.id
                      ? 'text-cyan-700 bg-cyan-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {chapter.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
