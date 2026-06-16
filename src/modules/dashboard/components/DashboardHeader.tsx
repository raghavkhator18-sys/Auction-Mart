import React from 'react';


interface DashboardHeaderProps {
  currentUser: { name: string; email: string } | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentUser }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Welcome back, {currentUser?.name || 'Guest'} <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Here's an overview of your auction activity and bidding performance.
        </p>
      </div>
    </div>
  );
};
