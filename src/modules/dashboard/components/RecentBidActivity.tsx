import React from 'react';
import { RecentActivity } from '@/shared/types';
import { BidActivityRow } from './BidActivityRow';

interface RecentBidActivityProps {
  activities: RecentActivity[];
}

export const RecentBidActivity: React.FC<RecentBidActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h2>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
      </div>
      
      {activities.length > 0 ? (
        <div className="divide-y divide-slate-100 flex flex-col gap-1">
          {activities.map((activity) => (
            <BidActivityRow key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          No recent activity to display.
        </div>
      )}
    </div>
  );
};
