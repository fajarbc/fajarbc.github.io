import React from 'react';
import { ArrowUpRight, ExternalLink, FolderGit2, Cpu, Activity, Smartphone, Gamepad2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Infrastructure': return <Cpu size={20} className="text-cyan-400" />;
      case 'AI': return <FolderGit2 size={20} className="text-purple-400" />;
      case 'IoT': return <Activity size={20} className="text-emerald-400" />;
      case 'Mobile': return <Smartphone size={20} className="text-blue-400" />;
      case 'Gaming': return <Gamepad2 size={20} className="text-orange-400" />;
      default: return <FolderGit2 size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="group relative rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:bg-slate-800/80 transition-all duration-300 overflow-hidden h-full">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
            {getIcon(project.category)}
          </div>
          {project.link && (
            <ArrowUpRight className="text-slate-600 group-hover:text-cyan-400 transition-colors duration-300" size={20} />
          )}
        </div>

        {/* Full title */}
        <h3 className="text-lg font-bold text-slate-100 mb-2 font-mono group-hover:text-cyan-400 transition-colors duration-300">
          {project.title}
        </h3>

        {/* Full description */}
        <p className="text-sm text-slate-400 mb-6 leading-relaxed flex-grow">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View Project button */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-mono hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
            View Project
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
