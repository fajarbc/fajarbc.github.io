import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import TerminalHero from './components/TerminalHero';
import TechStack from './components/TechStack';
import ProjectCard from './components/ProjectCard';
import ProjectsArchive from './components/ProjectsArchive';
import Footer from './components/Footer';
import { projects } from './data';

// Configuration Config
const IS_AVAILABLE_FOR_HIRE = process.env.IS_AVAILABLE_FOR_HIRE === 'true';

function App() {
  const [showArchive, setShowArchive] = useState(false);

  if (showArchive) {
    return <ProjectsArchive onBack={() => setShowArchive(false)} />;
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10">
        
        {/* Navigation / Header */}
        <header className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
            <div className="font-mono text-xl font-bold tracking-tight text-slate-100">
                Fajar<span className="text-cyan-500">BC</span>
            </div>
            <a href={`mailto:${process.env.CONTACT_EMAIL}`} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500 rounded transition-all duration-300">
                Contact
            </a>
        </header>

        <main className="max-w-6xl mx-auto px-6 pt-10 pb-20">
            
            {/* Hero Section */}
            <section className="mb-24 flex flex-col items-center">
                 {IS_AVAILABLE_FOR_HIRE && (
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 mb-8 animate-fade-in">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                      <span className="text-xs font-medium text-slate-400">Available for hire</span>
                   </div>
                 )}
                 
                 <h1 className="text-4xl md:text-6xl font-bold text-center text-slate-100 mb-6 tracking-tight animate-fade-in [animation-delay:200ms]">
                    Architecting the Future of <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">AI Infrastructure</span>
                 </h1>
                 
                 <p className="text-center text-slate-400 max-w-2xl mb-12 text-lg animate-fade-in [animation-delay:400ms]">
                    Bridging Business Goals with Hardcore Engineering. <br className="hidden md:block" />
                    Specializing in Cloud Native, Computer Vision, and High-Scale Systems.
                 </p>

                 <TerminalHero />
            </section>

            {/* Tech Stack Section */}
            <section className="mb-32">
                <div className="flex items-center gap-4 mb-8">
                     <h2 className="text-2xl font-bold text-slate-100 font-mono">
                        <span className="text-cyan-500 mr-2">01.</span>
                        Technical Arsenal
                     </h2>
                     <div className="h-px bg-slate-800 flex-grow"></div>
                </div>
                <TechStack />
            </section>

            {/* Projects Section */}
            <section className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                     <h2 className="text-2xl font-bold text-slate-100 font-mono">
                        <span className="text-purple-500 mr-2">02.</span>
                        Case Studies
                     </h2>
                     <div className="h-px bg-slate-800 flex-grow"></div>
                     <a 
                        onClick={() => setShowArchive(true)}
                        className="hidden md:flex items-center gap-1 text-sm text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                     >
                        View Archive <ArrowRight size={14} />
                     </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.slice(0, 3).map((project, idx) => (
                        <ProjectCard key={idx} project={project} />
                    ))}
                </div>
            </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;