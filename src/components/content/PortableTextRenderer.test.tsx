import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CodeBlock } from './CodeBlock';
import { Callout } from './Callout';
import { PortableTextRenderer } from './PortableTextRenderer';

describe('Content Components', () => {
  describe('CodeBlock', () => {
    it('renders code snippet and language label', () => {
      render(<CodeBlock code="console.log('hello');" language="typescript" />);
      expect(screen.getByText('typescript')).toBeDefined();
      expect(screen.getByText("console.log('hello');")).toBeDefined();
    });

    it('handles clipboard copy button click', () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText },
      });

      render(<CodeBlock code="const x = 42;" language="js" />);
      const copyBtn = screen.getByRole('button', { name: /copy code/i });
      fireEvent.click(copyBtn);
      expect(writeText).toHaveBeenCalledWith('const x = 42;');
    });
  });

  describe('Callout', () => {
    it('renders with custom title and tone styling', () => {
      render(
        <Callout tone="warning" title="Watch Out">
          Critical notice
        </Callout>
      );
      expect(screen.getByText('Watch Out')).toBeDefined();
      expect(screen.getByText('Critical notice')).toBeDefined();
    });
  });

  describe('PortableTextRenderer', () => {
    it('renders text blocks safely', () => {
      const blocks = [
        {
          _type: 'block',
          _key: 'b1',
          style: 'normal',
          children: [{ _type: 'span', _key: 's1', text: 'Sample article body' }],
          markDefs: [],
        },
      ];
      render(<PortableTextRenderer value={blocks} />);
      expect(screen.getByText('Sample article body')).toBeDefined();
    });
  });
});
