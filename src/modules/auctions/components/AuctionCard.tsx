import React from 'react';
import { Heart, Clock } from 'lucide-react';
import { AuctionItem } from '@/shared/types';
import { useAuctionTimer } from '../hooks/useAuctionTimer';

interface AuctionCardProps {
  item: AuctionItem;
  isFav: boolean;
  toggleFavorite: (id: string) => void;
  onClick: (item: AuctionItem) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({
  item,
  isFav,
  toggleFavorite,
  onClick
}) => {
  const { formatTimer } = useAuctionTimer();
  const remaining = formatTimer(item.timerSeconds);

  return (
    <div
      id={`browse-item-card-${item.id}`}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
    >
      {/* Visual */}
      <div className="relative h-52 overflow-hidden bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 shrink-0">
        <img
          src={item.imageUrl}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
        
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
          {item.category}
        </span>

        <button
          id={`browse-item-fav-${item.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          className="absolute top-3 right-3 p-1.5 bg-white dark:bg-slate-900/95 backdrop-blur-xs rounded-full text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors shadow-xs cursor-pointer"
        >
          <Heart size={13} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
        </button>

        {/* Timer ribbon */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg text-white">
          <span className="flex items-center gap-1 text-[9px] font-bold text-slate-300">
            <Clock size={10} className="text-blue-400" /> TIME REMAINING
          </span>
          <span className="text-[11px] font-mono font-bold text-blue-400">{remaining}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-medium">
              LOT #{item.lot_number || item.id.split('-')[1]?.toUpperCase() || 'AM-0001'}
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-1.5 py-0.5 rounded">
              {item.condition}
            </span>
          </div>
          <h3
            onClick={() => onClick(item)}
            className="text-xs sm:text-sm font-black text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer line-clamp-1"
          >
            {item.title}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer state row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-[9px] text-slate-400 font-medium">CURRENT BID</p>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">₹{item.currentBid.toLocaleString()}</p>
          </div>
          <button
            id={`browse-item-detail-${item.id}`}
            onClick={() => onClick(item)}
            className="bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Grab now!
          </button>
        </div>
      </div>
    </div>
  );
};
