import React from 'react';
import { AuctionItem, ScreenId } from '@/shared/types';

import { ProductHeader } from '../components/ProductHeader';
import { ProductGallery } from '../components/ProductGallery';
import { ProductInfo } from '../components/ProductInfo';
import { BidForm } from '../components/BidForm';
import { SellerInfo } from '../components/SellerInfo';
import { ProductTabs } from '../components/ProductTabs';

interface ProductDetailProps {
  item: AuctionItem;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onPlaceBid: (itemId: string, bidAmount: number, maxBid?: number) => void;
  setCurrentScreen: (screen: ScreenId) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  item,
  favorites,
  toggleFavorite,
  onPlaceBid,
  setCurrentScreen
}) => {
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [item?.id]);

  const isFav = favorites.includes(item.id);

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Back Arrow navigation bar */}
      <ProductHeader
        itemId={item.id}
        isFav={isFav}
        toggleFavorite={toggleFavorite}
        setCurrentScreen={setCurrentScreen}
      />

      {/* 2. Primary layout: Image Slider (Left) + High Bidding controls (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Aspect: Image Showcase Slider */}
        <ProductGallery item={item} />

        {/* Right Aspect: High bidding transaction board */}
        <div className="space-y-6">
          <ProductInfo item={item} />
          
          <BidForm item={item} onPlaceBid={onPlaceBid} />

          <SellerInfo item={item} />
        </div>
      </div>

      {/* 3. Specifications and information Tabs details switcher */}
      <ProductTabs item={item} />

    </div>
  );
};
