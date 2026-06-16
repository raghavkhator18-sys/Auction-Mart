import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface FormActionsProps {
  setIsFormOpen: (val: boolean) => void;
}

export const FormActions: React.FC<FormActionsProps> = ({ setIsFormOpen }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
    {/* Ghost: Save Draft */}
    <button
      id="cancel-add-listing-btn"
      type="button"
      onClick={() => setIsFormOpen(false)}
      className="px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 transition-all cursor-pointer"
    >
      Save Draft
    </button>

    <div className="flex items-center gap-3">
      {/* Secondary: Preview */}
      <button
        type="button"
        className="px-4 py-2.5 text-sm font-bold text-blue-600 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer"
      >
        Preview Listing
      </button>

      {/* Primary: Publish */}
      <button
        id="submit-add-listing-btn"
        type="submit"
        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 transition-all cursor-pointer"
      >
        <CheckCircle2 size={15} />
        Publish Auction
      </button>
    </div>
  </div>
);
