import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuctionMart } from '@/app/store';
import { ProductDetail } from '@/modules/products/pages/ProductDetail';

export const ProductDetailRoute: React.FC = () => {
  const {
    auctions,
    selectedProduct,
    favorites,
    toggleFavorite,
    handlePlaceBid,
    setCurrentScreen
  } = useAuctionMart();

  const params = useParams();
  const idParam = params?.id;
  const found = idParam ? auctions.find((a) => a.id === idParam) : undefined;
  const item = found || selectedProduct || auctions[0];

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
