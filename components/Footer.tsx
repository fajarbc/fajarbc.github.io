import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'email@example.com';
  const URL_GITHUB = process.env.URL_GITHUB || '#';
  const LINKEDIN_URL = process.env.LINKEDIN_URL || '#';
  const FULL_NAME = process.env.FULL_NAME || 'Fajar Budi Cahyanto';
  const JOB_TITLE = process.env.JOB_TITLE || 'AI Infrastructure & Cloud Architect';

  return (
    <footer className="border-t border-slate-800 mt-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold text-slate-200 font-mono">{FULL_NAME}</h2>
          <p className="text-slate-500 text-sm mt-1">{JOB_TITLE}</p>
        </div>
        
        <div className="flex gap-6">
          <a href={URL_GITHUB} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors">
            <Github size={20} />
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-purple-400 transition-colors">
            <Linkedin size={20} />
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-500 hover:text-emerald-400 transition-colors">
            <Mail size={20} />
          </a>
        </div>

        <div className="text-slate-600 text-xs font-mono">
          © {new Date().getFullYear()} All systems normal.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
