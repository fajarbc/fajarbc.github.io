import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'email@example.com';
  const URL_GITHUB = process.env.URL_GITHUB || '#';
  const LINKEDIN_URL = process.env.LINKEDIN_URL || '#';
  const FULL_NAME = process.env.FULL_NAME || 'Fajar Budi Cahyanto';
  const JOB_TITLE = process.env.JOB_TITLE || 'AI Infrastructure & Cloud Architect';

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold text-slate-800 font-mono">{FULL_NAME}</h2>
          <p className="text-slate-500 text-sm mt-1">{JOB_TITLE}</p>
        </div>
        
        <div className="flex gap-4">
          <a href={URL_GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-full text-slate-400 hover:text-cyan-600 transition-colors">
            <Github size={20} />
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-full text-slate-400 hover:text-purple-600 transition-colors">
            <Linkedin size={20} />
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email" className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-full text-slate-400 hover:text-emerald-600 transition-colors">
            <Mail size={20} />
          </a>
        </div>

        <div className="text-slate-400 text-xs font-mono">
          © {new Date().getFullYear()} All systems normal.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
