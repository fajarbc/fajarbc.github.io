import React from 'react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { Callout } from './Callout';
import { CodeBlock } from './CodeBlock';

interface PortableTextRendererProps {
  value: unknown;
}

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-slate-900 mt-10 mb-4 font-mono">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3 font-mono">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-2 font-mono">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-base text-slate-700 leading-7 mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4">{children}</blockquote>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = (value as { href?: string } | undefined)?.href ?? '#';
      const isExternal = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-cyan-700 underline underline-offset-2 hover:text-cyan-900 transition-colors"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="font-mono text-sm bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),
  },
  types: {
    code: ({ value }) => {
      const v = value as { code?: string; language?: string } | undefined;
      return <CodeBlock code={v?.code ?? ''} language={v?.language} />;
    },
    callout: ({ value }) => {
      const v = value as { tone?: 'info' | 'warning' | 'tip'; title?: string; body?: string } | undefined;
      return (
        <Callout tone={v?.tone} title={v?.title}>
          {v?.body ?? ''}
        </Callout>
      );
    },
  },
};

export const PortableTextRenderer: React.FC<PortableTextRendererProps> = ({ value }) => (
  <div className="mx-auto max-w-prose px-4">
    <PortableText value={value as never} components={components} />
  </div>
);
