import React from 'react';
import { AuctionItem } from '@/shared/types';

interface FlaggedListingsProps {
  flaggedLots: AuctionItem[];
  onClearFlag: (id: string) => void;
}

export const FlaggedListings: React.FC<FlaggedListingsProps> = ({ flaggedLots, onClearFlag }) => {
  return (
    <div className="lg:col-span-1 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">Flagged Listings</h3>
        <a className="text-xs text-blue-600 cursor-pointer hover:underline">View All</a>
      </div>

      {flaggedLots.slice(0,3).map(item => (
        <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl flex items-start gap-3">
          <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-md object-cover border" referrerPolicy="no-referrer" />
          <div className="flex-1">
            <p className="font-bold text-sm">{item.title}</p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">{item.flagReason || 'Suspected issue'}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => onClearFlag(item.id)} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded cursor-pointer">Clear</button>
              <button onClick={() => alert('Remove action')} className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded cursor-pointer">Remove</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
