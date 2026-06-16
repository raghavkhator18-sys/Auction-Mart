import React from 'react';
import { Gavel, TrendingUp } from 'lucide-react';

export const MyBidsHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gavel size={22} className="text-blue-600" /> Active Bidding Room
        </h1>
        <p className="text-xs text-slate-505 text-slate-500 dark:text-slate-400 mt-1">
          Increase your stakes instantly to secure ownership of premium rare properties.
        </p>
      </div>
    </div>
  );
};
