import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { fetchPostBySlug } from '@/src/lib/sanity/client';
import { type Post } from '@/src/sanity/schemas/post';
import { PortableTextRenderer } from '@/src/components/content/PortableTextRenderer';

export const ArticleDetail: React.FC = () => {
  const [, params] = useRoute('/writing/:slug');
  const slug = params?.slug;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPostBySlug(slug)
      .then((res) => setPost(res))
      .catch((err) => console.warn('Failed to fetch article:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-700 py-16 px-4">
        <div className="max-w-prose mx-auto">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-8" />
          <div className="h-10 w-3/4 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="h-64 w-full bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-700 py-20 px-4 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold font-mono text-slate-900 mb-4">Article Not Found</h1>
          <p className="text-slate-500 mb-6">The article you are looking for does not exist or has been removed.</p>
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-sm hover:bg-cyan-100 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Writing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-slate-50 text-slate-700 py-12 px-4">
      <header className="max-w-prose mx-auto mb-10">
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 font-mono text-sm text-slate-500 hover:text-cyan-700 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Writing
        </Link>
        <span className="block text-xs font-mono text-slate-400 mb-2">
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
        <h1 className="text-4xl font-bold font-mono text-slate-900 mb-4">{post.title}</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <PortableTextRenderer value={post.body} />
    </article>
  );
};
