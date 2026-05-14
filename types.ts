import React from 'react';

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  category: 'Infrastructure' | 'AI' | 'IoT' | 'Mobile' | 'Gaming';
}

export interface TechItem {
  name: string;
  icon?: React.ReactNode;
}

export interface TechCategory {
  title: string;
  items: string[];
  color: string;
}

export interface ChapterSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export interface ParallaxLayerProps {
  speed: number; // 0.3 = background, 0.6 = midground, 1.0 = foreground
  children: React.ReactNode;
  className?: string;
}

export interface ScrollRevealProps {
  delay?: number; // stagger delay in ms
  children: React.ReactNode;
  className?: string;
}

export interface NavigationProps {
  chapters: { id: string; label: string }[];
}