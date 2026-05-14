import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Navigation } from './Navigation';

// Mock useActiveChapter
vi.mock('@/hooks/useActiveChapter', () => ({
  useActiveChapter: vi.fn(() => 'hero'),
}));

import { useActiveChapter } from '@/hooks/useActiveChapter';
const mockUseActiveChapter = vi.mocked(useActiveChapter);

describe('Navigation', () => {
  beforeEach(() => {
    mockUseActiveChapter.mockReturnValue('hero');
  });

  it('renders a nav element with aria-label', () => {
    render(<Navigation />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
  });

  it('renders all 4 chapter links in desktop view', () => {
    render(<Navigation />);
    // Desktop links are always rendered (hidden via CSS on mobile)
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('has fixed positioning via CSS class', () => {
    render(<Navigation />);
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('fixed');
  });

  it('highlights the active chapter link with aria-current', () => {
    mockUseActiveChapter.mockReturnValue('tech-arsenal');
    render(<Navigation />);

    const activeLinks = screen.getAllByText('Skills');
    // Desktop link should have aria-current
    const desktopLink = activeLinks[0];
    expect(desktopLink).toHaveAttribute('aria-current', 'true');
  });

  it('applies distinct style to active chapter link', () => {
    mockUseActiveChapter.mockReturnValue('hero');
    render(<Navigation />);

    const homeLinks = screen.getAllByText('Home');
    const desktopLink = homeLinks[0];
    expect(desktopLink.className).toContain('text-cyan-400');
  });

  it('does not set aria-current on inactive links', () => {
    mockUseActiveChapter.mockReturnValue('hero');
    render(<Navigation />);

    const skillsLinks = screen.getAllByText('Skills');
    const desktopLink = skillsLinks[0];
    expect(desktopLink).not.toHaveAttribute('aria-current');
  });

  describe('mobile hamburger menu', () => {
    it('renders a hamburger button with aria-expanded=false initially', () => {
      render(<Navigation />);
      const button = screen.getByRole('button', { name: /open navigation menu/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles mobile menu open on click', () => {
      render(<Navigation />);
      const button = screen.getByRole('button', { name: /open navigation menu/i });
      fireEvent.click(button);

      // After opening, button should have aria-expanded=true
      const closeButton = screen.getByRole('button', { name: /close navigation menu/i });
      expect(closeButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes mobile menu when a link is clicked', () => {
      render(<Navigation />);
      // Open menu
      const openButton = screen.getByRole('button', { name: /open navigation menu/i });
      fireEvent.click(openButton);

      // Click a mobile link (duplicates exist when menu is open)
      const mobileLinks = screen.getAllByText('Skills');
      fireEvent.click(mobileLinks[mobileLinks.length - 1]);

      // Menu should be closed - button should show "Open"
      const button = screen.getByRole('button', { name: /open navigation menu/i });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('keyboard accessibility', () => {
    it('links are focusable and have focus ring styles', () => {
      render(<Navigation />);
      const homeLinks = screen.getAllByText('Home');
      const desktopLink = homeLinks[0];
      expect(desktopLink.className).toContain('focus:ring-2');
    });

    it('hamburger button is keyboard accessible', () => {
      render(<Navigation />);
      const button = screen.getByRole('button', { name: /open navigation menu/i });
      expect(button.className).toContain('focus:ring-2');
    });
  });

  describe('smooth scroll on click', () => {
    it('calls scrollTo with smooth behavior when a link is clicked', () => {
      // Create a target element
      const targetEl = document.createElement('div');
      targetEl.id = 'hero';
      document.body.appendChild(targetEl);

      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      render(<Navigation />);
      const homeLinks = screen.getAllByText('Home');
      fireEvent.click(homeLinks[0]);

      expect(scrollToSpy).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: 'smooth' })
      );

      scrollToSpy.mockRestore();
      document.body.removeChild(targetEl);
    });
  });
});
