import React from 'react';
import { FeedbackCategory } from '../types/feedback.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  'General Feedback',
];

export const FeedbackCategorySelect: React.FC<Props> = ({ value, onChange, error }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
        Category <span className="text-red-500">*</span>
      </label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as FeedbackCategory)}
      >
        <SelectTrigger
          className={`w-full max-w-full h-12 rounded-[14px] ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
          }`}
        >
          <SelectValue placeholder="Select a category..." />
        </SelectTrigger>
        <SelectContent className="w-full max-w-full rounded-[14px]">
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
};
