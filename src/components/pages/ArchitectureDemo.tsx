import { Link, useRoute } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { ArchitectureExplorer } from '@/src/components/architecture/architecture-explorer';
import { lessOtpArchitecture, luringTalkArchitecture } from '@/src/data/sample-architecture';

const architectures = {
  lessotp: lessOtpArchitecture,
  luringtalk: luringTalkArchitecture,
} as const;

export function ArchitectureDemo() {
  const [, params] = useRoute('/architecture/:slug');
  const architecture = params?.slug
    ? architectures[params.slug as keyof typeof architectures]
    : undefined;

  if (!architecture) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-slate-700">
        <div className="text-center font-mono">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Architecture Not Found</h1>
          <Link href="/work" className="text-cyan-700 underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-sm text-slate-500 hover:text-cyan-700 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <ArchitectureExplorer data={architecture} />
      </div>
    </div>
  );
}
