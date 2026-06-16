import React from 'react';
import { AuctionItem } from '@/shared/types';
import { WatchlistCard } from './WatchlistCard';

interface WatchlistSectionProps {
  items: AuctionItem[];
}

export const WatchlistSection: React.FC<WatchlistSectionProps> = ({ items }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Watchlist</h2>
          <p className="text-[10px] text-slate-400">Items you are monitoring</p>
        </div>
        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
          View All
        </button>
      </div>

      {items.length > 0 ? (
        <div className="space-y-1">
          {items.map((item) => (
            <WatchlistCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-slate-500 dark:text-slate-400 text-xs">
          Your watchlist is empty.
        </div>
      )}
    </div>
  );
};
