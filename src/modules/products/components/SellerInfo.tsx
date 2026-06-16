import React, { useState } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { AuctionItem } from '@/shared/types';

interface SellerInfoProps {
  item: AuctionItem;
}

export const SellerInfo: React.FC<SellerInfoProps> = ({ item }) => {
  const [isFollowed, setIsFollowed] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={item.sellerAvatar}
          alt={item.sellerName}
          referrerPolicy="no-referrer"
          className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
        />
        <div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-slate-900 dark:text-white">{item.sellerName}</span>
            <CheckCircle2 size={13} className="text-emerald-500 fill-emerald-100" />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-0.5">
              <Star size={11} className="fill-blue-500 text-blue-600" /> {item.sellerRating} / 5.0
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.sellerSales} transactions</span>
          </div>
        </div>
      </div>

      <button
        id="follow-seller-btn"
        onClick={() => setIsFollowed(!isFollowed)}
        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isFollowed
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          : 'bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 border border-slate-250 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800'
          }`}
      >
        {isFollowed ? 'Following ✓' : 'Follow Seller'}
      </button>
    </div>
  );
};
