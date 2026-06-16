import React from 'react';
import { PlusCircle } from 'lucide-react';
import { useAuctionMart } from '@/app/store';

interface MyListingsHeaderProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
}

export const MyListingsHeader: React.FC<MyListingsHeaderProps> = ({ isFormOpen, setIsFormOpen }) => {
  const { currentUser } = useAuctionMart();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          My Listings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Create, manage, and track your auction listings from one place.
        </p>
      </div>

      <button
        id="trigger-add-listing-form-btn"
        onClick={() => setIsFormOpen(!isFormOpen)}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer ${isFormOpen
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
          }`}
      >
        <PlusCircle size={16} />
        {isFormOpen ? 'Close Form' : 'Create New Listing'}
      </button>
    </div>
  );
};
