import React from 'react';
import { Eye } from 'lucide-react';
import { AuctionItem } from '@/shared/types';
import { ListingStatusBadge } from './ListingStatusBadge';

interface ListingRowProps {
  item: AuctionItem;
  onInspect: (item: AuctionItem) => void;
  onDelete: (itemId: string) => void;
}

export const ListingRow: React.FC<ListingRowProps> = ({ item, onInspect, onDelete }) => {
  return (
    <tr className="hover:bg-blue-50/30 transition-colors text-xs text-slate-700 dark:text-slate-200">
      {/* Thumbnail & title */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3.5">
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0"
          />
          <div className="min-w-0">
            <p
              onClick={() => onInspect(item)}
              className="font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer max-w-xs truncate transition-colors"
            >
              {item.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-blue-600 font-semibold uppercase">
                {item.category}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Condition */}
      <td className="py-4 px-4 font-semibold text-slate-500 dark:text-slate-400">
        {item.condition}
      </td>

      {/* Status badge */}
      <td className="py-4 px-4">
        <ListingStatusBadge status={item.status} flagReason={(item as any).flagReason} />
      </td>

      {/* Current Bid */}
      <td className="py-4 px-4 text-right font-black text-slate-900 dark:text-white">
        ₹{item.currentBid.toLocaleString()}
      </td>

      {/* Total Bids */}
      <td className="py-4 px-4 text-center font-mono font-bold text-slate-400">
        {item.totalBids}
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            id={`inspect-lot-btn-${item.id}`}
            onClick={() => onInspect(item)}
            title="View listing details"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:border-blue-600 hover:text-white rounded-lg text-[11px] text-slate-700 dark:text-slate-200 font-bold transition-all duration-150 cursor-pointer shadow-sm"
          >
            <Eye size={11} />
            View
          </button>
          
          {item.id.toString().startsWith('db-') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this listing?')) {
                  onDelete(item.id.toString());
                }
              }}
              title="Delete listing"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-red-200 hover:bg-red-600 hover:border-red-600 hover:text-white rounded-lg text-[11px] text-red-600 font-bold transition-all duration-150 cursor-pointer shadow-sm"
            >
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
