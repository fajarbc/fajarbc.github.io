import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChapterSection } from './ChapterSection';

describe('ChapterSection', () => {
  it('renders a semantic section element with the given id', () => {
    render(
      <ChapterSection id="hero">
        <p>Hello</p>
      </ChapterSection>
    );

    const section = document.getElementById('hero');
    expect(section).not.toBeNull();
    expect(section!.tagName).toBe('SECTION');
  });

  it('applies min-h-screen class', () => {
    render(
      <ChapterSection id="test-section">
        <p>Content</p>
      </ChapterSection>
    );

    const section = document.getElementById('test-section');
    expect(section!.className).toContain('min-h-screen');
  });

  it('renders as a section element without scroll-snap', () => {
    render(
      <ChapterSection id="snap-section">
        <p>Content</p>
      </ChapterSection>
    );

    const section = document.getElementById('snap-section');
    expect(section!.tagName).toBe('SECTION');
  });

  it('merges additional className', () => {
    render(
      <ChapterSection id="styled-section" className="bg-black text-white">
        <p>Content</p>
      </ChapterSection>
    );

    const section = document.getElementById('styled-section');
    expect(section!.className).toContain('min-h-screen');
    expect(section!.className).toContain('bg-black');
    expect(section!.className).toContain('text-white');
  });

  it('renders children', () => {
    render(
      <ChapterSection id="children-section">
        <h2>Chapter Title</h2>
        <p>Chapter content</p>
      </ChapterSection>
    );

    expect(screen.getByText('Chapter Title')).toBeDefined();
    expect(screen.getByText('Chapter content')).toBeDefined();
  });

  it('works without optional className', () => {
    render(
      <ChapterSection id="no-class">
        <p>Minimal</p>
      </ChapterSection>
    );

    const section = document.getElementById('no-class');
    expect(section!.className).toBe('min-h-screen');
  });
});
