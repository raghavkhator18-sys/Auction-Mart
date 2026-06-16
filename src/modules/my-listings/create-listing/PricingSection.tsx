import React from 'react';
import { IndianRupee, ChevronRight } from 'lucide-react';
import { FormSection } from './FormSection';
import { FieldLabel, INPUT_CLS, SELECT_CLS } from './FieldLabel';
import { DURATION_OPTIONS } from '../constants/listingConstants';

interface PricingSectionProps {
  newPrice: string;
  setNewPrice: (val: string) => void;
  newReservePrice: string;
  setNewReservePrice: (val: string) => void;
  newDuration: number;
  setNewDuration: (val: number) => void;
  newSku: string;
  setNewSku: (val: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  newPrice,
  setNewPrice,
  newReservePrice,
  setNewReservePrice,
  newDuration,
  setNewDuration,
  newSku,
  setNewSku,
}) => (
  <FormSection
    icon={<IndianRupee size={16} />}
    title="Pricing & Auction Settings"
    subtitle="Set your starting price and auction timeline"
  >
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Starting Bid */}
      <div>
        <FieldLabel htmlFor="new-price-input" required>Starting Bid (₹)</FieldLabel>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold select-none">₹</span>
          <input
            id="new-price-input"
            type="number"
            required
            min="1"
            placeholder="5,000"
            value={newPrice}
            onChange={e => setNewPrice(e.target.value)}
            className={`${INPUT_CLS} pl-7`}
          />
        </div>
      </div>

      {/* Reserve Price */}
      <div>
        <FieldLabel htmlFor="reserve-price-input">Reserve Price (₹)</FieldLabel>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold select-none">₹</span>
          <input
            id="reserve-price-input"
            type="number"
            min="1"
            placeholder="Optional"
            value={newReservePrice}
            onChange={e => setNewReservePrice(e.target.value)}
            className={`${INPUT_CLS} pl-7`}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Minimum price you'll accept
        </p>
      </div>

      {/* Auction Duration */}
      <div className="relative">
        <FieldLabel htmlFor="auction-duration-select" required>Auction Duration</FieldLabel>
        <select
          id="auction-duration-select"
          value={newDuration}
          onChange={e => setNewDuration(Number(e.target.value))}
          className={SELECT_CLS}
        >
          {DURATION_OPTIONS.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
        <ChevronRight size={14} className="absolute right-3 top-9 text-slate-400 rotate-90 pointer-events-none" />
      </div>
    </div>

    {/* Internal SKU — retained for backend compat, visually subtle */}
    <div className="mt-4">
      <FieldLabel htmlFor="new-sku-input">Reference Code</FieldLabel>
      <input
        id="new-sku-input"
        type="text"
        value={newSku}
        readOnly
        className={`${INPUT_CLS} bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed`}
      />
      <p className="text-[10px] text-slate-400 mt-1">
        Randomly generated for your own inventory tracking (not shown to buyers)
      </p>
    </div>
  </FormSection>
);
