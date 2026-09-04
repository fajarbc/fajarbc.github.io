import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { fetchPosts } from '@/src/lib/sanity/client';
import { type Post } from '@/src/sanity/schemas/post';

export const WritingArchive: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then((res) => setPosts(res))
      .catch((err) => console.warn('Failed to fetch posts:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 py-12 px-6">
      <header className="max-w-4xl mx-auto mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-sm text-slate-500 hover:text-cyan-700 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold font-mono text-slate-900 mb-3">Technical Writing</h1>
        <p className="text-slate-500 max-w-xl">
          Deep-dives on AI infrastructure, cloud architecture, latency optimization, and distributed systems.
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        {loading ? (
          <div className="space-y-4">
            <div className="h-24 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-24 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
            <p className="font-mono text-slate-500">No articles published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="block p-6 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 hover:shadow-sm transition-all group"
              >
                <span className="block text-xs font-mono text-slate-400 mb-1">
                  {new Date(post.publishedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <h2 className="text-xl font-bold font-mono text-slate-900 group-hover:text-cyan-700 transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
