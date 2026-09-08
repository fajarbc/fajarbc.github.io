import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, ExternalLink, Network } from 'lucide-react';
import { fetchProjectBySlug } from '@/src/lib/sanity/client';
import { type Project } from '@/src/sanity/schemas/project';
import { PortableTextRenderer } from '@/src/components/content/PortableTextRenderer';

export const ProjectDetail: React.FC = () => {
  const [, params] = useRoute('/work/:slug');
  const slug = params?.slug;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProjectBySlug(slug)
      .then((res) => setProject(res))
      .catch((err) => console.warn('Failed to fetch project:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-700 py-16 px-4">
        <div className="max-w-prose mx-auto">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-8" />
          <div className="h-10 w-3/4 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="h-24 w-full bg-slate-200 rounded animate-pulse mb-8" />
          <div className="h-64 w-full bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-700 py-20 px-4 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold font-mono text-slate-900 mb-4">Project Not Found</h1>
          <p className="text-slate-500 mb-6">The project you are looking for does not exist or has been removed.</p>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-sm hover:bg-cyan-100 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 py-12 px-4">
      <header className="max-w-prose mx-auto mb-10">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-sm text-slate-500 hover:text-cyan-700 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <span className="block text-xs font-mono uppercase tracking-wide text-cyan-700 font-bold mb-2">
          {project.category}
        </span>
        <h1 className="text-4xl font-bold font-mono text-slate-900 mb-4">{project.title}</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">{project.summary}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {tag}
            </span>
          ))}
        </div>
        {(project.link || project.architecturePath) && (
          <div className="flex flex-wrap gap-2">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-sm hover:bg-cyan-100 transition-colors"
              >
                <ExternalLink size={16} /> Live Project
              </a>
            )}
            {project.architecturePath && (
              <Link
                href={project.architecturePath}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-mono text-sm hover:bg-purple-100 transition-colors"
              >
                <Network size={16} /> Architecture
              </Link>
            )}
          </div>
        )}
      </header>

      {project.body && <PortableTextRenderer value={project.body} />}
    </div>
  );
};
