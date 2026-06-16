import React from 'react';

export const FieldLabel: React.FC<{ htmlFor: string; required?: boolean; children: React.ReactNode }> = ({
  htmlFor, required, children
}) => (
  <label htmlFor={htmlFor} className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

export const INPUT_CLS =
  'w-full text-sm px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150';

export const SELECT_CLS =
  'w-full text-sm px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150 cursor-pointer appearance-none';
