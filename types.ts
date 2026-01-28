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