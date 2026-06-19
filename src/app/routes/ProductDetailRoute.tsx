import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuctionMart } from '@/app/store';
import { ProductDetail } from '@/modules/products/pages/ProductDetail';
import { AlertTriangle } from 'lucide-react';

export const ProductDetailRoute: React.FC = () => {
  const {
    auctions,
    favorites,
    toggleFavorite,
    handlePlaceBid,
    setCurrentScreen
  } = useAuctionMart();

  const navigate = useNavigate();
  const params = useParams();
  const idParam = params?.id;

  // Strictly resolve from URL parameter — no fallbacks
  const item = idParam ? auctions.find((a) => a.id === idParam) : undefined;

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-350">
        <div className="w-14 h-14 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-100 dark:border-amber-500/20">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs text-center">
          The auction lot you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => navigate('/browse-auctions')}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          Browse Auctions
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-350">
      <ProductDetail
        item={item}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        onPlaceBid={handlePlaceBid}
        setCurrentScreen={setCurrentScreen}
      />
    </div>
  );
};

