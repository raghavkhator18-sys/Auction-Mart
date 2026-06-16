import React from 'react';

export const AppFooter: React.FC = () => {
  return (
    <footer id="app-footer" className="bg-white dark:bg-slate-900 border-t border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:justify-between sm:items-center gap-4 text-xs text-gray-400">
        <p id="footer-logo">&copy; 2026 AuctionMart Inc. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2 sm:mt-0 font-medium">
          <button id="footer-link-privacy" className="hover:text-neutral-900 cursor-pointer">
            Security Ledger Guarantee
          </button>
          <span>•</span>
          <button id="footer-link-terms" className="hover:text-neutral-900 cursor-pointer">
            Buyer Protection Policy
          </button>
        </div>
      </div>
    </footer>
  );
};
