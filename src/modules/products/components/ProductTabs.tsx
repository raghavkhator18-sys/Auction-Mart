import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, FileCheck, PlayCircle, TrendingUp } from 'lucide-react';
import { AuctionItem } from '@/shared/types';
import { useAuctionMart } from '@/app/store';
import api from '@/lib/axios';

interface ProductTabsProps {
  item: AuctionItem;
}

/** Convert seconds into a human-readable duration duration string */
const formatDuration = (seconds: number): string => {
  if (seconds <= 0) return 'Ended';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  if (d > 0) return `${d} Day${d > 1 ? 's' : ''}${h > 0 ? ` ${h}h` : ''}`;
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} Hour${h > 1 ? 's' : ''}${m > 0 ? ` ${m}m` : ''}`;
  return `${m} Minute${m > 1 ? 's' : ''}`;
};

export const ProductTabs: React.FC<ProductTabsProps> = ({ item }) => {
  const { currentUser } = useAuctionMart();
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'history'>('details');
  const [bids, setBids] = useState<any[]>([]);

  const isUserCreated = item.id.startsWith('db-');

  useEffect(() => {
    if (activeTab === 'history' && isUserCreated) {
      api.get(`/bids/auction/${item.id}`)
        .then(res => setBids(res.data))
        .catch(err => console.error("Failed to fetch bids", err));
    }
  }, [activeTab, isUserCreated, item.id]);

  // ── Timeline data for demo products ──
  const timelineEvents = [
    {
      icon: FileCheck,
      label: 'Listing Published',
      time: '2 days ago',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      icon: PlayCircle,
      label: 'Auction Started',
      time: '12 hours ago',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Highest Bid Updated',
      time: '3 hours ago',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4 shadow-sm">
      {/* Tab triggers */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        {[
          { id: 'details', name: 'Custody details' },
          { id: 'specs', name: 'Technical specifications' },
          { id: 'history', name: 'Ledger Audit History' }
        ].map((tab) => (
          <button
            id={`tab-trigger-${tab.id}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-px transition-all cursor-pointer ${activeTab === tab.id
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-800 dark:text-slate-100'
              }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          CUSTODY DETAILS TAB
          ═══════════════════════════════════════════════════════ */}
      {activeTab === 'details' && (
        <div className="space-y-3 pt-2 text-xs leading-relaxed text-left text-slate-600 dark:text-slate-300">
          {!isUserCreated ? (
            <>
              <p className="text-[13px] font-bold text-slate-800 dark:text-white tracking-tight">
                Listing Verification
              </p>
              <p>
                This auction listing has been reviewed and published through AuctionMart. Buyers are encouraged to review all images, descriptions, seller information, and auction details before placing bids.
              </p>
              <div className="space-y-2 mt-3">
                {[
                  'Seller information verified',
                  'Listing approved for auction',
                  'Available for public bidding',
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20 text-xs font-medium"
                  >
                    <CheckCircle size={14} className="shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-4 text-center text-slate-400 font-medium italic">No custody information provided.</div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TECHNICAL SPECIFICATIONS TAB
          ═══════════════════════════════════════════════════════ */}
      {activeTab === 'specs' && (
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50 pt-2 text-xs text-slate-700 dark:text-slate-200">
          {!isUserCreated ? (
            <>
              {[
                { label: 'Category', value: item.category },
                { label: 'Condition', value: item.condition },
                { label: 'Current Bid', value: `₹${item.currentBid.toLocaleString()}` },
                { label: 'Total Bids', value: `${item.totalBids}` },
                {
                  label: 'Auction Status',
                  value: item.status.charAt(0).toUpperCase() + item.status.slice(1),
                  highlight: item.status === 'active',
                },
                { label: 'Auction Duration', value: formatDuration(item.timerSeconds) },
                { label: 'Listing ID', value: item.sku || item.id.toUpperCase() },
              ].map((row) => (
                <div className="grid grid-cols-2 py-2.5" key={row.label}>
                  <span className="font-semibold text-slate-400 uppercase tracking-wide">{row.label}</span>
                  <span
                    className={`text-right font-bold ${
                      (row as any).highlight
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <>
              {item.condition ? (
                <div className="grid grid-cols-2 py-2">
                  <span className="font-semibold text-slate-400 uppercase tracking-wide">Condition rating</span>
                  <span className="text-right font-black text-slate-900 dark:text-white">{item.condition}</span>
                </div>
              ) : (
                <div className="py-4 text-center text-slate-400 font-medium italic">No technical specifications available.</div>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          LEDGER AUDIT HISTORY TAB
          ═══════════════════════════════════════════════════════ */}
      {activeTab === 'history' && (
        <div className="space-y-0 pt-2 text-xs text-slate-600 dark:text-slate-300">
          {!isUserCreated ? (
            /* ── Demo: Activity timeline ── */
            <div className="relative pl-6">
              {/* Vertical timeline line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />

              {timelineEvents.map((evt, idx) => {
                const Icon = evt.icon;
                return (
                  <div key={idx} className="relative flex items-start gap-3 pb-5 last:pb-0">
                    {/* Dot / Icon */}
                    <div
                      className={`absolute -left-6 flex items-center justify-center w-[22px] h-[22px] rounded-full ${evt.bg} ring-2 ring-white dark:ring-slate-900`}
                    >
                      <Icon size={12} className={evt.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 ml-1">
                      <p className="font-bold text-slate-900 dark:text-white text-[11px]">{evt.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{evt.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── User-created: Real bids from DB ── */
            <div className="space-y-3.5">
              {bids.length > 0 ? (
                bids.map(b => (
                  <div key={b.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white text-[11px]">
                      <span>{b.user_name || b.user_email}</span>
                      <span>₹{b.bid_amount.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{new Date(b.created_at).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-slate-400 font-medium italic space-y-1">
                  <p>No bid activity yet.</p>
                  <p className="text-[10px]">This auction has not received any bids.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
