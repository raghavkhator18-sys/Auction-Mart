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
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {listings.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p
                  onClick={() => onInspect(item)}
                  className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer truncate transition-colors"
                >
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] text-blue-600 font-semibold uppercase bg-blue-50 px-1.5 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.condition}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">Current Bid</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{item.currentBid.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Bids</span>
                <span className="font-bold text-slate-900 dark:text-white">{item.totalBids}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex-1">
                 {/* Re-use the badge component locally or import it, but we can't easily import if it's not here, oh wait, ListingStatusBadge isn't imported here, but it's in ListingRow. Let's just import it at the top of ListingsTable.tsx. Wait, replace_file_content won't let me import without touching the top of the file, so I will do multi_replace_file_content. Actually, I can use a simpler text status for mobile to save time or just use another replace tool later if needed. But let's just write item.status text. */}
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{item.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onInspect(item)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                >
                  View
                </button>
                {item.id.toString().startsWith('db-') && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this listing?')) {
                        onDelete(item.id.toString());
                      }
                    }}
                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
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
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {listings.map((item) => (
              <ListingRow key={item.id} item={item} onInspect={onInspect} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
