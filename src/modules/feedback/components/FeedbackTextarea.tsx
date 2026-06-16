import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  placeholder?: string;
}

export const FeedbackTextarea: React.FC<Props> = ({ value, onChange, error, placeholder }) => {
  const maxLength = 2000;

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">Message <span className="text-red-500">*</span></label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full bg-white dark:bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-4 py-3 text-xs focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white transition-colors resize-none min-h-[120px]`}
        />
        <div className={`absolute bottom-3 right-4 text-[10px] font-medium ${value.length >= maxLength ? 'text-red-500' : 'text-slate-400'}`}>
          {value.length} / {maxLength}
        </div>
      </div>
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
};
