import React from 'react';
import { FileText } from 'lucide-react';
import { FormSection } from './FormSection';
import { FieldLabel, INPUT_CLS } from './FieldLabel';
import { MAX_DESC_CHARS } from '../constants/listingConstants';

interface DescriptionSectionProps {
  newDescription: string;
  setNewDescription: (val: string) => void;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  newDescription,
  setNewDescription,
}) => (
  <FormSection
    icon={<FileText size={16} />}
    title="Product Description"
    subtitle="A detailed description increases buyer confidence"
  >
    <div>
      <FieldLabel htmlFor="new-desc-textarea">Description</FieldLabel>
      <textarea
        id="new-desc-textarea"
        rows={6}
        placeholder="Describe the item's condition, features, included accessories, defects, warranty information, and any other important details buyers should know before placing a bid..."
        value={newDescription}
        onChange={e => {
          if (e.target.value.length <= MAX_DESC_CHARS) {
            setNewDescription(e.target.value);
          }
        }}
        className={`${INPUT_CLS} resize-none leading-relaxed`}
      />
      <div className="flex items-center justify-between mt-1.5">
        <p className="text-[10px] text-slate-400">
          Tip: Include model numbers, serial numbers, and provenance for higher bids.
        </p>
        <span className={`text-[10px] font-semibold tabular-nums ${newDescription.length > MAX_DESC_CHARS * 0.9 ? 'text-amber-500' : 'text-slate-400'
          }`}>
          {newDescription.length} / {MAX_DESC_CHARS}
        </span>
      </div>
    </div>
  </FormSection>
);
