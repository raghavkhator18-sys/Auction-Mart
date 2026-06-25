import React, { useState } from 'react';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { AuctionItem } from '@/shared/types';

interface ProductGalleryProps {
  item: AuctionItem;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ item }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Parse multiple images if it's a user-uploaded item (comma-separated string)
  const isUserItem = item.id.toString().startsWith('db-');
  const userImages = item.imageUrls && item.imageUrls.length > 0
    ? item.imageUrls
    : (item.imageUrl ? item.imageUrl.split(',') : []);

  // Fallback highkey gallery images for luxury feel (only for demo items)
  const galleryImages = isUserItem 
    ? userImages 
    : [
        item.imageUrl,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAVm62PPCEnPFUrLYOi6Y3yWhhWU-Eii02QI6Fz6wsPfjtot278GJW3wB6vyEBGhsH2yvHZk1AGvgL4xz9qcm1IVTM-62K6gHRdPN0SmjyOYJYOFE_CWHfbhQ51--yM8nNL37CtLcb819XMpi1R6YzO5O1L_M9wV6gTcRM2lCH2cmTAu4TDEBn1CgtMfevrbyw7bfGhfkSPbkpcV3Jn8lgK5S-b6sDZMV4ANvAWXNFLSCcjJAj4JxSe34cpj7mrujr2q49CMiA8o_Xx',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDIplzXV5kd-sAJbHhtsprbV__Vj7dW-bHYUy4BBgk5N41Ts8Y1P__Ad_3Y1WMwE3MsNLAVT6VohTFwuTmSILM9zMLwT_7MHr9EJJ2toFvOoespHseoICYtUdQALhV03tA9EtHShtK3RiR6LRulPuPJqNe5gqJZpLlP7uMLKrfMUp-1esedgLeSidiwDRchbwJ0J7vNc8F8tR4b1yYyVKO6FjzR2FkD61wIc9M1bwO49UGAuz7uQOYfghlr4htt5Ae4hy96bbVwDwcu',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ-bn8UQgUH2GOYLkafW-qaQsqdDIx_Y4O_13KRHsIHZCWLxDsf61o1OiNPBICpE3BhwznO3wzp3pgun2i4nsRReNvnGiB8VKEiOvByGVGXD6LTwE0a3mUbyU8YKw_SezEThUCEDPNSPYcZgPNG5gl20vcuJsFcm4YSdFz1OJ6QrN-7afvsDIcwuJgwQFZJME-5Tdayp-DeHyZpv_svWkId73X8CdOpQ4hYr6xdU_32U3_7l4z_rTvMG2TwLVBqex4KpF6p_e91s5z'
      ];

  // Safeguard if somehow empty
  if (galleryImages.length === 0) galleryImages.push('https://via.placeholder.com/480');

  return (
    <div className="space-y-4">
      <div className="relative h-[480px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden group shadow-sm">
        <img
          src={galleryImages[activeImageIdx]}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Rare high wealth Badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] uppercase font-mono tracking-widest font-extrabold shadow-sm">
          <Award size={13} /> Rare Timepiece Sealed Box
        </div>

        {/* Slider navigators */}
        {galleryImages.length > 1 && (
          <>
            <button
              id="slider-prev-btn"
              onClick={() => setActiveImageIdx((activeImageIdx - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white dark:bg-slate-900/90 backdrop-blur-xs rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-white dark:bg-slate-900 transition-opacity shadow-sm cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              id="slider-next-btn"
              onClick={() => setActiveImageIdx((activeImageIdx + 1) % galleryImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white dark:bg-slate-900/90 backdrop-blur-xs rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-white dark:bg-slate-900 transition-opacity shadow-sm cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Sub Row thumbnail buttons */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {galleryImages.map((img, idx) => (
            <button
              id={`thumb-btn-${idx}`}
              key={idx}
              onClick={() => setActiveImageIdx(idx)}
              className={`relative h-20 bg-white dark:bg-slate-900 border rounded-xl overflow-hidden transition-all cursor-pointer ${activeImageIdx === idx
                ? 'border-blue-600 ring-2 ring-blue-600/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:border-slate-600'
                }`}
            >
              <img src={img} alt="Detail view" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
