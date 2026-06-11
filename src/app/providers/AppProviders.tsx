import React from 'react';
import { AuctionMartProvider } from '@/app/store';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuctionMartProvider>{children}</AuctionMartProvider>;
};
