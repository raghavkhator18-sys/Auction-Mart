import React from 'react';
import { BROWSE_CATEGORIES } from '../constants/categories';

interface CategoryPillsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  setSelectedCategory
}) => {
  return (
    <div className="flex flex-wrap gap-2 py-2">
      {BROWSE_CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            id={`cat-filter-btn-${cat.id}`}
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50'
            }`}
          >
            <Icon size={13} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
