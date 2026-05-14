import { ChapterSection } from '@/components/layout/ChapterSection';
import { ScrollReveal } from '@/components/layout/ScrollReveal';
import { projects } from '@/data';
import ProjectCard from '@/components/ProjectCard';
import { Archive } from 'lucide-react';

interface CaseStudiesProps {
  onShowArchive: () => void;
}

export function CaseStudies({ onShowArchive }: CaseStudiesProps) {
  const featuredProjects = projects.slice(0, 3);

  return (
    <ChapterSection id="case-studies" aria-label="Case Studies" className="flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 font-mono mb-4 text-center">
            Case Studies
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Featured projects showcasing infrastructure, AI, and full-stack engineering work.
          </p>
        </ScrollReveal>

        {/* Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project, index) => {
            return (
              <div key={project.title}>
                <ScrollReveal delay={index * 150} className="h-full">
                  <ProjectCard project={project} />
                </ScrollReveal>
              </div>
            );
          })}
        </div>

        {/* Archive navigation link */}
        <ScrollReveal delay={featuredProjects.length * 150}>
          <div className="mt-12 text-center">
            <button
              onClick={onShowArchive}
              className="inline-flex items-center gap-2 min-h-11 min-w-11 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-slate-800 transition-all duration-300 cursor-pointer font-mono text-sm"
              aria-label="View all projects in archive"
            >
              <Archive size={18} />
              View All Projects
            </button>
          </div>
        </ScrollReveal>
      </div>
    </ChapterSection>
  );
}
