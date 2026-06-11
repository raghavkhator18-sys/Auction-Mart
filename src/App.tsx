import React from 'react';
import { AppProviders } from '@/app/providers/AppProviders';
import { AppLayout } from '@/app/layout/AppLayout';

export default function App() {
  return (
    <AppProviders>
      <AppLayout />
    </AppProviders>
  );
}


