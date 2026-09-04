import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      console.warn('Clipboard API unavailable in this context.');
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  return (
    <div className="my-6 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 border-b border-slate-200">
        <span className="font-mono text-xs text-slate-500">{language ?? 'code'}</span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-cyan-700 transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono text-slate-800 leading-relaxed whitespace-pre min-w-max">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
