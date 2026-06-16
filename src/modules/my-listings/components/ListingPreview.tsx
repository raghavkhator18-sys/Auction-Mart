import React from 'react';
import { Eye, Clock, Star, ImageIcon } from 'lucide-react';
import { useAuctionMart } from '@/app/store';

interface ListingPreviewProps {
  previewImage: string | null;
  previewTitle: string;
  previewPrice: string;
  previewDurationLabel: string;
  previewCategory: string;
  previewCondition: string;
  uploadedImagesCount: number;
}

export const ListingPreview: React.FC<ListingPreviewProps> = ({
  previewImage,
  previewTitle,
  previewPrice,
  previewDurationLabel,
  previewCategory,
  previewCondition,
  uploadedImagesCount,
}) => {
  const { currentUser } = useAuctionMart();

  return (
    <div className="xl:w-72 xl:flex-shrink-0 xl:sticky xl:top-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        {/* Preview header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-3.5 flex items-center gap-2">
          <Eye size={14} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Listing Preview
          </span>
        </div>

        {/* Preview image */}
        <div className="aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <ImageIcon size={40} strokeWidth={1} />
              <p className="text-xs font-medium">No image uploaded</p>
            </div>
          )}
        </div>

        {/* Preview details */}
        <div className="p-4 space-y-3">
          <h3 className="font-black text-slate-900 dark:text-white text-sm leading-tight line-clamp-2">
            {previewTitle}
          </h3>

          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Starting Bid</span>
          </div>
          <p className="text-2xl font-black text-blue-600 -mt-2">
            {previewPrice}
          </p>

          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Condition</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{previewCondition}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Category</span>
              <span className="font-bold text-blue-600 truncate max-w-32 text-right">{previewCategory}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Auction Ends</span>
              <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-100">
                <Clock size={10} />
                {previewDurationLabel}
              </span>
            </div>
          </div>

          {/* Seller badge */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
              {currentUser?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Listed by</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {currentUser?.name ?? 'You'}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-0.5 text-amber-500">
              <Star size={10} fill="currentColor" />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">4.9</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload progress hint */}
      {uploadedImagesCount > 0 && (
        <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <div className="text-emerald-600 flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <p className="text-xs font-semibold text-emerald-700">
            {uploadedImagesCount} image{uploadedImagesCount > 1 ? 's' : ''} ready to upload
          </p>
        </div>
      )}
    </div>
  );
};
