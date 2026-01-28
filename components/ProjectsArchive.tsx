import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { projects } from '../data';

interface ProjectsArchiveProps {
  onBack: () => void;
}

const ProjectsArchive: React.FC<ProjectsArchiveProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-6 py-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          
          <h1 className="text-3xl font-bold text-slate-100 mb-6">Projects Archive</h1>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={idx} project={project} />
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center text-slate-500 mt-12">
              No projects found matching your search.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectsArchive;