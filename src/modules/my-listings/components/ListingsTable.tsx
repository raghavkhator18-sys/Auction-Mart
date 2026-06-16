import React from 'react';
import { AuctionItem } from '@/shared/types';
import { ListingRow } from './ListingRow';

interface ListingsTableProps {
  listings: AuctionItem[];
  onInspect: (item: AuctionItem) => void;
  onDelete: (itemId: string) => void;
}

export const ListingsTable: React.FC<ListingsTableProps> = ({ listings, onInspect, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-3xl text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700">
            <th className="py-3.5 px-6">Product</th>
            <th className="py-3.5 px-4">Condition</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Current Bid</th>
            <th className="py-3.5 px-4 text-center">Total Bids</th>
            <th className="py-3.5 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {listings.map((item) => (
            <ListingRow key={item.id} item={item} onInspect={onInspect} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
