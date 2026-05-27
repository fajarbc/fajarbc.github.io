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
    border: 'border-cyan-200',
    icon: 'text-cyan-600',
    pillBg: 'bg-cyan-50',
    pillBorder: 'border-cyan-200',
    pillText: 'text-cyan-700',
  },
  purple: {
    border: 'border-purple-200',
    icon: 'text-purple-600',
    pillBg: 'bg-purple-50',
    pillBorder: 'border-purple-200',
    pillText: 'text-purple-700',
  },
  emerald: {
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
    pillBg: 'bg-emerald-50',
    pillBorder: 'border-emerald-200',
    pillText: 'text-emerald-700',
  },
  blue: {
    border: 'border-blue-200',
    icon: 'text-blue-600',
    pillBg: 'bg-blue-50',
    pillBorder: 'border-blue-200',
    pillText: 'text-blue-700',
  },
  orange: {
    border: 'border-orange-200',
    icon: 'text-orange-600',
    pillBg: 'bg-orange-50',
    pillBorder: 'border-orange-200',
    pillText: 'text-orange-700',
  },
};

export function TechCategoryCard({ category, items, pillsRef }: TechCategoryCardProps) {
  const Icon = iconMap[category.title] || Cloud;
  const colors = colorClasses[category.color] || colorClasses.cyan;
  const displayItems = items || category.items;

  return (
    <div
      className={`rounded-xl border ${colors.border} bg-white p-5 transition-colors duration-300 hover:bg-slate-50 shadow-sm`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={20} className={colors.icon} />
        <h3 className="text-base font-semibold text-slate-800">{category.title}</h3>
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
