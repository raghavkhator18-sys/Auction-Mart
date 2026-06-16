import React from 'react';
import { AuctionMartProvider } from '@/app/store';
import { ThemeProvider } from '@/shared/theme';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuctionMartProvider>
        {children}
      </AuctionMartProvider>
    </ThemeProvider>
  );
};
