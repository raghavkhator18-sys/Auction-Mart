import React from 'react';
import { FeedbackCategory } from '../types/feedback.types';

interface Props {
  value: FeedbackCategory | '';
  onChange: (val: FeedbackCategory) => void;
  error?: string;
}

const CATEGORIES: FeedbackCategory[] = [
  'Feature Request',
  'Bug Report',
  'UI/UX Improvement',
  'Account Issue',
  'Auction Issue',
  'General Feedback'
];

export const FeedbackCategorySelect: React.FC<Props> = ({ value, onChange, error }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">Category <span className="text-red-500">*</span></label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FeedbackCategory)}
        className={`w-full bg-white dark:bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white transition-colors`}
      >
        <option value="" disabled>Select a category...</option>
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
};
