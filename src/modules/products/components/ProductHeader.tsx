import React from 'react';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
import { ScreenId } from '@/shared/types';

interface ProductHeaderProps {
  itemId: string;
  isFav: boolean;
  toggleFavorite: (id: string) => void;
  setCurrentScreen: (screen: ScreenId) => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  itemId,
  isFav,
  toggleFavorite,
  setCurrentScreen
}) => {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xs">
      <button
        id="detail-back-to-browse-btn"
        onClick={() => setCurrentScreen('browse')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} className="text-blue-600" /> Back to Browse Catalogue
      </button>

      <div className="flex items-center gap-2">
        <button id="share-btn" className="p-1.5 hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:border-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:text-white cursor-pointer" title="Copy lot share link" onClick={() => alert("Copied secure bid-room share link!")}>
          <Share2 size={16} />
        </button>
        <button id="favorite-btn" className="p-1.5 hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:border-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:text-white cursor-pointer" title="Save lot" onClick={() => toggleFavorite(itemId)}>
          <Heart size={16} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
        </button>
      </div>
    </div>
  );
};
