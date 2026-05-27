import React from 'react';
import { ArrowUpRight, ExternalLink, FolderGit2, Cpu, Activity, Smartphone, Gamepad2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Infrastructure': return <Cpu size={20} className="text-cyan-600" />;
      case 'AI': return <FolderGit2 size={20} className="text-purple-600" />;
      case 'IoT': return <Activity size={20} className="text-emerald-600" />;
      case 'Mobile': return <Smartphone size={20} className="text-blue-600" />;
      case 'Gaming': return <Gamepad2 size={20} className="text-orange-600" />;
      default: return <FolderGit2 size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="group relative rounded-xl border border-slate-200 bg-white p-6 hover:bg-slate-50 transition-all duration-300 overflow-hidden h-full shadow-sm">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            {getIcon(project.category)}
          </div>
          {project.link && (
            <ArrowUpRight className="text-slate-300 group-hover:text-cyan-600 transition-colors duration-300" size={20} />
          )}
        </div>

        {/* Full title */}
        <h3 className="text-lg font-bold text-slate-800 mb-2 font-mono group-hover:text-cyan-700 transition-colors duration-300">
          {project.title}
        </h3>

        {/* Full description */}
        <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-grow">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
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
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-700 text-sm font-mono hover:bg-cyan-100 hover:border-cyan-300 transition-all duration-200 cursor-pointer w-fit"
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
