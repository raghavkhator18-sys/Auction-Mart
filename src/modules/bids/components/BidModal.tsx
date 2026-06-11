// import React, { useState } from 'react';
// import { X, Gavel, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
// import type { AuctionItem } from '@/shared/types';

// interface BidModalProps {
//     item: AuctionItem;
//     isOpen: boolean;
//     onClose: () => void;
//     onPlaceBid: (amount: number, maxBid?: number) => void;
// }

// export const BidModal: React.FC<BidModalProps> = ({
//     item,
//     isOpen,
//     onClose,
//     onPlaceBid
// }) => {
//     const [bidAmount, setBidAmount] = useState<number>(item.currentBid + Math.ceil(item.currentBid * 0.05));
//     const [autoMaxBid, setAutoMaxBid] = useState<string>('');
//     const [useAutoBidding, setUseAutoBidding] = useState(false);
//     const [success, setSuccess] = useState(false);
//     const [errorMsg, setErrorMsg] = useState('');

//     if (!isOpen) return null;

//     const minBid = item.currentBid + 1;

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         setErrorMsg('');

//         if (bidAmount <= item.currentBid) {
//             setErrorMsg(`Your bid must be greater than the current bid of $${item.currentBid.toLocaleString()}`);
//             return;
//         }

//         if (useAutoBidding && autoMaxBid) {
//             const maxBidNum = parseFloat(autoMaxBid);
//             if (maxBidNum <= bidAmount) {
//                 setErrorMsg('Maximum proxy bid must be higher than your starting bid amount.');
//                 return;
//             }
//             onPlaceBid(bidAmount, maxBidNum);
//         } else {
//             onPlaceBid(bidAmount);
//         }

//         setSuccess(true);
//         setTimeout(() => {
//             setSuccess(false);
//             onClose();
//         }, 1800);
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
//             <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-200">

//                 {/* Header */}
//                 <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
//                     <div className="flex items-center gap-2">
//                         <Gavel size={18} className="text-amber-500" />
//                         <span className="text-sm font-bold text-neutral-950">Place Bid</span>
//                     </div>
//                     <button id="close-bid-modal-btn" onClick={onClose} className="p-1 text-gray-400 hover:text-neutral-950 rounded-lg">
//                         <X size={18} />
//                     </button>
//                 </div>

//                 {success ? (
//                     <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
//                         <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
//                             <CheckCircle2 size={32} />
//                         </div>
//                         <h3 className="text-lg font-bold text-neutral-950">Bid Processed!</h3>
//                         <p className="text-xs text-neutral-500 max-w-xs">
//                             Your bid of <strong className="text-neutral-950">${bidAmount.toLocaleString()}</strong> is registered as the leading offer on the ledger.
//                         </p>
//                     </div>
//                 ) : (
//                     <form onSubmit={handleSubmit} className="p-6 space-y-4">

//                         {/* Short item preview */}
//                         <div className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
//                             <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-gray-200" referrerPolicy="no-referrer" />
//                             <div>
//                                 <p className="text-xs font-bold text-neutral-900 line-clamp-1">{item.title}</p>
//                                 <div className="flex gap-4 mt-0.5">
//                                     <span className="text-[10px] text-gray-500">Current: <strong className="text-neutral-900">${item.currentBid.toLocaleString()}</strong></span>
//                                     <span className="text-[10px] text-gray-500">Bids: <strong className="text-neutral-900">{item.totalBids}</strong></span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Bid Input */}
//                         <div className="space-y-1.5">
//                             <label htmlFor="bid-amount-input" className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">Your Bid Amount (USD)</label>
//                             <div className="relative">
//                                 <span className="absolute left-3.5 top-2.5 text-gray-400 text-sm font-semibold">$</span>
//                                 <input
//                                     id="bid-amount-input"
//                                     type="number"
//                                     required
//                                     min={minBid}
//                                     value={bidAmount}
//                                     onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
//                                     className="w-full text-sm font-semibold pl-8 pr-16 py-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-neutral-950"
//                                 />
//                                 <span className="absolute right-3.5 top-3 text-[10px] text-gray-400 font-bold uppercase">USD</span>
//                             </div>
//                             <p className="text-[10px] text-gray-400">Minimum required bid is ${minBid.toLocaleString()}</p>
//                         </div>

//                         {/* Interactive Proxy Auto Bidding Toggle */}
//                         <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100 space-y-2.5">
//                             <label className="flex items-center gap-2 cursor-pointer select-none">
//                                 <input
//                                     id="auto-bid-checkbox"
//                                     type="checkbox"
//                                     checked={useAutoBidding}
//                                     onChange={(e) => setUseAutoBidding(e.target.checked)}
//                                     className="w-4 h-4 text-emerald-500 border-gray-200 rounded focus:ring-emerald-400"
//                                 />
//                                 <span className="text-xs font-semibold text-amber-900">Enable Proxy Auto-Bidding</span>
//                             </label>

//                             {useAutoBidding && (
//                                 <div className="space-y-1 animate-in fade-in duration-200">
//                                     <p className="text-[10px] text-amber-600 leading-relaxed mb-1">
//                                         Enter maximum limit. Our secure agent will automatically increase your bid on your behalf whenever outbid by others up to this line.
//                                     </p>
//                                     <div className="relative">
//                                         <span className="absolute left-3 top-2 text-[11px] text-gray-400 font-bold">$</span>
//                                         <input
//                                             id="auto-max-bid-input"
//                                             type="number"
//                                             placeholder="e.g. 40000"
//                                             value={autoMaxBid}
//                                             onChange={(e) => setAutoMaxBid(e.target.value)}
//                                             className="w-full pl-6 pr-4 py-1.5 border border-amber-200 rounded-lg text-xs font-medium focus:outline-hidden bg-white"
//                                         />
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {errorMsg && (
//                             <div className="p-2.5 rounded-lg bg-red-50 border border-red-100 flex items-start gap-1.5 text-red-750 text-xs text-left leading-normal">
//                                 <AlertCircle size={14} className="shrink-0 mt-0.5" />
//                                 <span>{errorMsg}</span>
//                             </div>
//                         )}

//                         {/* Security Assurance Footer badge */}
//                         <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[10px] py-1 border-t border-gray-50">
//                             <ShieldCheck size={14} className="text-emerald-500" />
//                             <span>Policed by certified Audit Officers</span>
//                         </div>

//                         {/* CTA buttons */}
//                         <div className="flex gap-2.5 pt-1">
//                             <button
//                                 id="cancel-bid-btn"
//                                 type="button"
//                                 onClick={onClose}
//                                 className="flex-1 py-2 text-xs font-bold text-gray-650 bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded-xl transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 id="confirm-place-bid-btn"
//                                 type="submit"
//                                 className="flex-1 py-2 text-xs font-bold text-white bg-neutral-1000 bg-neutral-900 hover:bg-neutral-850 rounded-xl transition-colors shadow-xs"
//                             >
//                                 Place Bid
//                             </button>
//                         </div>

//                     </form>
//                 )}

//             </div>
//         </div>
//     );
// };
