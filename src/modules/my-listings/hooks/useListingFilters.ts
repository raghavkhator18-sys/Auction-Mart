import { useState } from 'react';
import { AuctionItem } from '@/shared/types';

export const useListingFilters = (auctions: AuctionItem[]) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // myListings is already filtered to the current user's listings from backend
  const myRealListings = auctions;

  const filteredMyListings = myRealListings.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return {
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    myRealListings,
    filteredMyListings,
  };
};
