import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { projects } from '../data';

interface ProjectsArchiveProps {
  onBack: () => void;
}

const ProjectsArchive: React.FC<ProjectsArchiveProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [showAllTags, setShowAllTags] = useState(false);

  // Extract all unique tags from projects
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
  };

  const filteredProjects = projects.filter((project) => {
    // Search filter
    const matchesSearch =
      searchTerm === '' ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Tag filter — project must have ALL selected tags
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => project.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-6 py-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 min-h-11 min-w-11 px-3 py-2 rounded-md text-slate-400 hover:text-cyan-400 transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <h1 className="text-3xl font-bold text-slate-100 mb-6">Projects Archive</h1>

          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Technology Filter Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(showAllTags ? allTags : allTags.slice(0, 6)).map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-xs font-mono rounded-full border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
            {allTags.length > 6 && (
              <button
                onClick={() => setShowAllTags((prev) => !prev)}
                className="px-3 py-1 text-xs font-mono rounded-full border border-dashed border-slate-600 text-slate-500 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors cursor-pointer"
              >
                {showAllTags ? 'Show less' : `+${allTags.length - 6} more filters`}
              </button>
            )}
          </div>

          {/* Active filters indicator */}
          {(selectedTags.length > 0 || searchTerm) && (
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              </span>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <X size={14} />
                Clear filters
              </button>
            </div>
          )}
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={idx} project={project} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center text-slate-500 mt-12">
              No projects found matching your filters.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectsArchive;
