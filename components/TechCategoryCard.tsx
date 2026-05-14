import type React from 'react';
import { Cloud, Brain, Server, Monitor, Activity } from 'lucide-react';
import { TechCategory } from '@/types';

interface TechCategoryCardProps {
  category: TechCategory;
  /** Optional override for items (used for sorted state) */
  items?: string[];
  /** Optional ref forwarded to the pills container */
  pillsRef?: React.Ref<HTMLDivElement>;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Cloud Native & DevOps': Cloud,
  'AI & Data Engineering': Brain,
  'Core Backend': Server,
  'Frontend & Mobile': Monitor,
  'Monitoring & Observability': Activity,
};

const colorClasses: Record<string, { border: string; icon: string; pillBg: string; pillBorder: string; pillText: string }> = {
  cyan: {
    border: 'border-cyan-700/50',
    icon: 'text-cyan-400',
    pillBg: 'bg-cyan-950/30',
    pillBorder: 'border-cyan-800/60',
    pillText: 'text-cyan-200',
  },
  purple: {
    border: 'border-purple-700/50',
    icon: 'text-purple-400',
    pillBg: 'bg-purple-950/30',
    pillBorder: 'border-purple-800/60',
    pillText: 'text-purple-200',
  },
  emerald: {
    border: 'border-emerald-700/50',
    icon: 'text-emerald-400',
    pillBg: 'bg-emerald-950/30',
    pillBorder: 'border-emerald-800/60',
    pillText: 'text-emerald-200',
  },
  blue: {
    border: 'border-blue-700/50',
    icon: 'text-blue-400',
    pillBg: 'bg-blue-950/30',
    pillBorder: 'border-blue-800/60',
    pillText: 'text-blue-200',
  },
  orange: {
    border: 'border-orange-700/50',
    icon: 'text-orange-400',
    pillBg: 'bg-orange-950/30',
    pillBorder: 'border-orange-800/60',
    pillText: 'text-orange-200',
  },
};

export function TechCategoryCard({ category, items, pillsRef }: TechCategoryCardProps) {
  const Icon = iconMap[category.title] || Cloud;
  const colors = colorClasses[category.color] || colorClasses.cyan;
  const displayItems = items || category.items;

  return (
    <div
      className={`rounded-xl border ${colors.border} bg-slate-900/40 p-5 transition-colors duration-300 hover:bg-slate-900/60`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={20} className={colors.icon} />
        <h3 className="text-base font-semibold text-slate-100">{category.title}</h3>
      </div>
      <div className="flex flex-wrap gap-2" ref={pillsRef} data-pills>
        {displayItems.map((item) => (
          <span
            key={item}
            className={`rounded-full px-3 py-1 text-sm border ${colors.pillBg} ${colors.pillBorder} ${colors.pillText} transition-all duration-300`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
