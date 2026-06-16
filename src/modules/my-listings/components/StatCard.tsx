import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  subLabel: string;
  color: string;
  bg: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, subLabel, color, bg }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className={`${bg} p-3 rounded-xl flex-shrink-0`}>
      <div className={color}>{icon}</div>
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{subLabel}</p>
    </div>
  </div>
);
