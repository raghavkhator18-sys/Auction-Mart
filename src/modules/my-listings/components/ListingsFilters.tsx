import React from 'react';
import { Search } from 'lucide-react';

interface ListingsFiltersProps {
  filterStatus: 'all' | 'active' | 'draft' | 'flagged';
  setFilterStatus: (status: 'all' | 'active' | 'draft' | 'flagged') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ListingsFilters: React.FC<ListingsFiltersProps> = ({
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
      <div className="flex flex-wrap gap-1.5">
        {[
          { id: 'all', name: 'All Listings' },
          { id: 'active', name: 'Active' },
          { id: 'draft', name: 'Drafts' },
          { id: 'flagged', name: 'Suspended' },
        ].map(btn => (
          <button
            id={`status-filter-my-listings-${btn.id}`}
            key={btn.id}
            onClick={() => setFilterStatus(btn.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${filterStatus === btn.id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 hover:text-slate-900 dark:text-white'
              }`}
          >
            {btn.name}
          </button>
        ))}
      </div>

      <div className="relative w-full md:w-64">
        <input
          id="listings-search-input"
          type="text"
          placeholder="Search by title or SKU..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400"
        />
        <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
      </div>
    </div>
  );
};
