import React from 'react';

interface CalloutProps {
  tone?: 'info' | 'warning' | 'tip';
  title?: string;
  children: React.ReactNode;
}

const TONE_STYLES: Record<NonNullable<CalloutProps['tone']>, string> = {
  info: 'border-cyan-500 bg-cyan-50 text-cyan-900',
  warning: 'border-amber-500 bg-amber-50 text-amber-900',
  tip: 'border-emerald-500 bg-emerald-50 text-emerald-900',
};

export const Callout: React.FC<CalloutProps> = ({ tone = 'info', title, children }) => (
  <aside className={`my-6 border-l-4 rounded-r-md p-4 ${TONE_STYLES[tone]}`} role="note">
    {title && <p className="font-bold font-mono mb-2 text-sm uppercase tracking-wide">{title}</p>}
    <div className="text-sm leading-relaxed">{children}</div>
  </aside>
);
