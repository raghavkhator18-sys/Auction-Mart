import React from 'react';
import { Gavel, Trophy, Wallet, Heart } from 'lucide-react';
import { DashboardStatData } from '../types/dashboard.types';

export const DashboardStatCard: React.FC<DashboardStatData> = ({
  title,
  value,
  description,
  trend,
  trendType,
  iconName
}) => {
  // Determine color scheme based on icon name / title
  let colorClass = '';
  let bgClass = '';
  let IconComponent = null;

  switch (iconName) {
    case 'Gavel':
      colorClass = 'text-blue-600';
      bgClass = 'bg-blue-50';
      IconComponent = Gavel;
      break;
    case 'Trophy':
      colorClass = 'text-amber-500';
      bgClass = 'bg-amber-50';
      IconComponent = Trophy;
      break;
    case 'Wallet':
      colorClass = 'text-emerald-600';
      bgClass = 'bg-emerald-50';
      IconComponent = Wallet;
      break;
    case 'Heart':
      colorClass = 'text-rose-500';
      bgClass = 'bg-rose-50';
      IconComponent = Heart;
      break;
    default:
      colorClass = 'text-slate-600 dark:text-slate-300';
      bgClass = 'bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50';
      break;
  }

  // Determine trend badge colors
  let trendClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200';
  if (trendType === 'positive') trendClass = 'bg-emerald-50 text-emerald-700';
  if (trendType === 'negative') trendClass = 'bg-rose-50 text-rose-700';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`${bgClass} p-3 rounded-xl flex-shrink-0`}>
        {IconComponent && <IconComponent className={`w-5 h-5 ${colorClass}`} />}
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1.5">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description || trend}</p>
      </div>
    </div>
  );
};
