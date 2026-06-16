import React from 'react';
import { RecentActivity } from '@/shared/types';
import { formatCurrency } from '../utils/dashboardHelpers';

interface BidActivityRowProps {
  activity: RecentActivity;
}

export const BidActivityRow: React.FC<BidActivityRowProps> = ({ activity }) => {
  return (
    <div className="flex items-center gap-4 py-3 px-2 hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 rounded-xl transition-colors group">
      <img
        src={activity.thumbnail}
        alt={activity.title}
        className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shadow-sm"
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
          {activity.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{activity.timeAgo}</span>
          <span className="text-[10px] text-slate-300">•</span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{activity.type.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(activity.amount)}</div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 ${
          activity.statusType === 'leading' || activity.statusType === 'won' || activity.statusType === 'paid'
            ? 'bg-emerald-100 text-emerald-700'
            : activity.statusType === 'outbid'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-rose-100 text-rose-700'
        }`}>
          {activity.statusText}
        </span>
      </div>
    </div>
  );
};
