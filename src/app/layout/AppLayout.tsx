import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/shared/components/layout/Navbar';
import { AppRoutes } from '@/app/routes/AppRoutes';
import { AppFooter } from './AppFooter';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/auth') || location.pathname.startsWith('/forgot-password');

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-between transition-colors duration-300">
      {!hideNavbar && <Navbar />}
      <main id="main-content-layout" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AppRoutes />
      </main>
      <AppFooter />
    </div>
  );
};
