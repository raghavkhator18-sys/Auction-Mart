import React from 'react';
import { ScreenId } from '@/shared/types';

interface DashboardEmptyStateProps {
  setCurrentScreen: (screen: ScreenId) => void;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({ setCurrentScreen }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-10 shadow-sm text-center">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl mx-auto flex items-center justify-center mb-4">
        <span className="text-2xl">✨</span>
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Activity Yet</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
        Start by browsing auctions or creating your first listing.
      </p>
      <button 
        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        onClick={() => setCurrentScreen('browse')}
      >
        Explore Auctions
      </button>
    </div>
  );
};
