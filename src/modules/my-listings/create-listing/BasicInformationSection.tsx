import React from 'react';
import { Tag, ChevronRight } from 'lucide-react';
import { FormSection } from './FormSection';
import { FieldLabel, INPUT_CLS, SELECT_CLS } from './FieldLabel';
import { CATEGORIES, CONDITIONS } from '../constants/listingConstants';

interface BasicInformationSectionProps {
  newTitle: string;
  setNewTitle: (val: string) => void;
  newCategory: string;
  setNewCategory: (val: string) => void;
  newCondition: string;
  setNewCondition: (val: string) => void;
}

export const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  newTitle,
  setNewTitle,
  newCategory,
  setNewCategory,
  newCondition,
  setNewCondition,
}) => (
  <FormSection
    icon={<Tag size={16} />}
    title="Basic Information"
    subtitle="Tell buyers what you're selling"
  >
    <div className="space-y-4">
      {/* Product Name */}
      <div>
        <FieldLabel htmlFor="new-title-input" required>Product Name</FieldLabel>
        <input
          id="new-title-input"
          type="text"
          required
          placeholder="e.g. Vintage Omega Speedmaster Professional"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          className={INPUT_CLS}
        />
      </div>

      {/* Category + Condition row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <FieldLabel htmlFor="new-cat-select" required>Category</FieldLabel>
          <select
            id="new-cat-select"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className={SELECT_CLS}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronRight size={14} className="absolute right-3 top-9 text-slate-400 rotate-90 pointer-events-none" />
        </div>

        <div className="relative">
          <FieldLabel htmlFor="new-condition-select" required>Condition</FieldLabel>
          <select
            id="new-condition-select"
            value={newCondition}
            onChange={e => setNewCondition(e.target.value)}
            className={SELECT_CLS}
          >
            {CONDITIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronRight size={14} className="absolute right-3 top-9 text-slate-400 rotate-90 pointer-events-none" />
        </div>
      </div>
    </div>
  </FormSection>
);
