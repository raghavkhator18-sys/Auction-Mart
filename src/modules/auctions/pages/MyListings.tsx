import React, { useState } from 'react';
import { PlusCircle, Search, Trash2, Edit2, ExternalLink, Tag, Briefcase, Eye, BarChart4 } from 'lucide-react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { useAuctionMart } from '@/app/store';

interface MyListingsProps {
  auctions: AuctionItem[];
  onCreateListing: (newItem: AuctionItem) => void;
  setCurrentScreen: (screen: ScreenId) => void;
  setSelectedProduct: (item: AuctionItem) => void;
}

export const MyListings: React.FC<MyListingsProps> = ({
  auctions,
  onCreateListing,
  setCurrentScreen,
  setSelectedProduct
}) => {
  const { currentUser } = useAuctionMart();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // States for new listing simulation form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Luxury Watches');
  const [newSku, setNewSku] = useState('WA-NEW-99');
  const [newPrice, setNewPrice] = useState('');
  const [newCondition, setNewCondition] = useState<'New' | 'Used'>('New');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuAEi87bMnKhFHqJ3-zB0UuV6jek8iK5RePOJRXV62pmn0yIcl4v8EvDYcm-Ly55EYUuEciZN5oWWuibLFf4Sip57Ik2O_0b75GPA3RWubAg0gKLKgrgn2zTb8dlt_zamBRtVL2N9HW1AlE_8BEJw_IWbh_hbEwUmic1hFqKY3IXbqkjTDm7iz5bbUxyfDgqThvUCty4I2ey0N8HC-ijylmRVLpJGcJHnU7QISv1-lhrS4lBidJGqCXYBqgEpkJcLyZajyJ7svbRlwr2');

  // Sarah Hudson's mock list assets (We simulate that items sold by 'Timepiece Legends' belong to Sarah!)
  const myRealListings = auctions.filter((item) => item.sellerName === 'Timepiece Legends');

  const filteredMyListings = myRealListings.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const parsedPrice = parseFloat(newPrice) || 100;

    const newlyCreatedItem: AuctionItem = {
      id: `new-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      sku: newSku,
      currentBid: parsedPrice,
      totalBids: 0,
      imageUrl: newImageUrl,
      timerSeconds: 86400, // 24 hours
      status: 'active',
      condition: newCondition,
      description: newDescription || 'Premium verified vintage collectible watch or accessory listed directly on elite ledger network.',
      sellerName: 'Timepiece Legends',
      sellerRating: 4.9,
      sellerSales: 1241,
      sellerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJMliNAX9iwfBs5w9IqD-A5JVNLkceWMpZoXHttDLkZEn9GsuALDInSRPSVqEUs5GGYq5hJYwIMcA_AEsIR1pYOZAPxg1w-vtbzAHQcf7Xd-KYn_4reIVsYn08Nby_mysL-pYseyUnxPuL1-2-zzQyhbrw04Sh2jQ6v-ljtHCyKHj_dYb8UR3pIPlo_bG9h3PKpf9ujxJ6NbQ1Srun08ibBUmXs7jnMImhAnexk1IjdciFq59YeCsye27wK9nsIfcg4_WF-qg4uy0v'
    };

    onCreateListing(newlyCreatedItem);
    setIsFormOpen(false);
    
    // Reset form states
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
  };

  const handleInspectListing = (item: AuctionItem) => {
    setSelectedProduct(item);
    setCurrentScreen('product-detail');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Header with Add Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase size={22} className="text-blue-600" /> {currentUser?.name || 'User'}'s Listing Inventory
          </h1>
          <p className="text-xs text-slate-505 text-slate-500 mt-0.5">
            Check telemetry metrics, bids counts, SKU references, and draft list status.
          </p>
        </div>

        <button
          id="trigger-add-listing-form-btn"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer self-start shadow-xs"
        >
          <PlusCircle size={15} /> Create Auction Lot
        </button>
      </div>

      {/* 2. Listing simulation drawer form */}
      {isFormOpen && (
        <form onSubmit={handleFormSubmit} className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200 text-left shadow-xs">
          <div className="pb-2 border-b border-blue-100">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest">Simulator: List a New Vault Asset</h3>
            <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Enter item specs to append this lot directly on {currentUser?.name || 'User'}'s active seller ledger list.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Title / SKU */}
            <div className="space-y-1">
              <label htmlFor="new-title-input" className="block text-[10px] font-bold text-slate-450 uppercase">Product title</label>
              <input
                id="new-title-input"
                type="text"
                required
                placeholder="e.g. Vintage Omega Speedmaster"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Sku / Category */}
            <div className="space-y-1">
              <label htmlFor="new-cat-select" className="block text-[10px] font-bold text-slate-450 uppercase">Category</label>
              <select
                id="new-cat-select"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-hidden focus:border-blue-600"
              >
                <option value="Luxury Watches">Luxury Watches</option>
                <option value="Automotive">Automotive</option>
                <option value="Collectibles">Collectibles</option>
                <option value="Tech">Tech</option>
              </select>
            </div>

            {/* Start Price */}
            <div className="space-y-1">
              <label htmlFor="new-price-input" className="block text-[10px] font-bold text-slate-450 uppercase">Starting Bid price (INR)</label>
              <input
                id="new-price-input"
                type="number"
                required
                placeholder="e.g. 5200"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="new-sku-input" className="block text-[10px] font-bold text-slate-450 uppercase">Custom SKU Reference</label>
              <input
                id="new-sku-input"
                type="text"
                value={newSku}
                onChange={(e) => setNewSku(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="new-condition-select" className="block text-[10px] font-bold text-slate-450 uppercase">Condition Status</label>
              <select
                id="new-condition-select"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-hidden focus:border-blue-600"
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="new-image-select" className="block text-[10px] font-bold text-slate-450 uppercase">Preset highkey Asset Image</label>
              <select
                id="new-image-select"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-705 text-slate-700 focus:outline-hidden focus:border-blue-600"
              >
                <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuAEi87bMnKhFHqJ3-zB0UuV6jek8iK5RePOJRXV62pmn0yIcl4v8EvDYcm-Ly55EYUuEciZN5oWWuibLFf4Sip57Ik2O_0b75GPA3RWubAg0gKLKgrgn2zTb8dlt_zamBRtVL2N9HW1AlE_8BEJw_IWbh_hbEwUmic1hFqKY3IXbqkjTDm7iz5bbUxyfDgqThvUCty4I2ey0N8HC-ijylmRVLpJGcJHnU7QISv1-lhrS4lBidJGqCXYBqgEpkJcLyZajyJ7svbRlwr2">Vintage Heritage Chronograph (White dial)</option>
                <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuByfCkqOujvEdmy2-zAEdoFlsLGtUvvouDiSkCbEL0WpzEnY04flHcWBDHXsCUEYz76hw4BnUcwZoPGK81FgckpvpORBWnxx3n-PKFGqNQFF3zC7riH4BomzAo0yX7jAGe5cdGMPX7JQhVc437KuSM6y_C71EUFJ0DWV0qpmKsODDC8xxc1AhKCRdsUQVWiefB_dpf5tOaCdyV_-3lOoumnYicbda4csgB_sBcX4y5_hdPK1i9L9Frn50u8I29c3Slc0GjBJdjFdjIi">Titan Skeleton Dial (Contemporary Dark)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="new-desc-textarea" className="block text-[10px] font-bold text-slate-450 uppercase">Description Details</label>
            <textarea
              id="new-desc-textarea"
              rows={2}
              placeholder="Provide premium visual descriptors, package inclusions, and paper credentials..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              id="cancel-add-listing-btn"
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-white border border-slate-200 text-xs text-slate-550 text-slate-600 rounded-lg font-bold cursor-pointer hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              id="submit-add-listing-btn"
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-xs text-white rounded-lg font-bold shadow-xs cursor-pointer"
            >
              Verify & List Lot
            </button>
          </div>

        </form>
      )}

      {/* 3. Filter controller + Table list of active listings */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Filter headers */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          
          <div className="flex flex-wrap gap-1.5 ">
            {[
              { id: 'all', name: 'All Lots' },
              { id: 'active', name: 'Active Auctions' },
              { id: 'draft', name: 'Drafts' },
              { id: 'flagged', name: 'Audited / Suspended' }
            ].map((btn) => (
              <button
                id={`status-filter-my-listings-${btn.id}`}
                key={btn.id}
                onClick={() => setFilterStatus(btn.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  filterStatus === btn.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-550 hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                {btn.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              id="listings-search-input"
              type="text"
              placeholder="Search SKU or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50 text-slate-900"
            />
            <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
          </div>

        </div>

        {/* Listings content */}
        {filteredMyListings.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No lots matching query"
              description="You have no listed inventory matching this filter status. Let's list a new simulation lot above to begin."
              actionText="Reset Search"
              onAction={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-3xl text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                  <th className="py-3.5 px-6">Lot / SKU</th>
                  <th className="py-3.5 px-4">Condition</th>
                  <th className="py-3.5 px-4">Active Status</th>
                  <th className="py-3.5 px-4 text-right">Leading Bid</th>
                  <th className="py-3.5 px-4 text-center">Bidding Traffic</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 divide-slate-100">
                {filteredMyListings.map((item) => {
                  const isActive = item.status === 'active';
                  const isFlagged = item.status === 'flagged';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors text-xs text-slate-605 text-slate-700">
                      {/* Thumbnail & title */}
                      <td className="py-4 px-6 flex items-center gap-3.5">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-150 shadow-2xs"
                        />
                        <div>
                          <p onClick={() => handleInspectListing(item)} className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer max-w-xs truncate">{item.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">{item.sku}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[10px] text-blue-600 font-semibold uppercase">{item.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Condition */}
                      <td className="py-4 px-4 font-semibold text-slate-505 text-slate-500">
                        {item.condition}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 font-semibold">
                        <span className={`inline-flex items-center gap-1.5 text-[9px] uppercase font-bold px-2 py-0.5 rounded-sm ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : isFlagged 
                            ? 'bg-red-50 text-red-750 text-red-700 border border-red-100'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : isFlagged ? 'bg-red-500' : 'bg-slate-400'}`} />
                          {item.status.toUpperCase()}
                        </span>
                        {isFlagged && item.flagReason && (
                          <p className="text-[9px] text-red-700 mt-1">Reason: {item.flagReason}</p>
                        )}
                      </td>

                      {/* Current Leading Bid */}
                      <td className="py-4 px-4 text-right font-black text-slate-905 text-slate-900">
                        ₹{item.currentBid.toLocaleString()}
                      </td>

                      {/* Bids Count */}
                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-450 text-slate-400">
                        {item.totalBids}
                      </td>

                      {/* View Action buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 text-slate-400">
                          <button
                            id={`inspect-lot-btn-${item.id}`}
                            onClick={() => handleInspectListing(item)}
                            title="Inspect premium lot details"
                            className="p-1 px-2.5 bg-slate-50 border border-slate-200 hover:bg-white hover:text-blue-600 hover:border-blue-600 rounded-md transition-all text-[10px] text-slate-700 font-bold flex items-center gap-1 cursor-pointer shadow-3xs"
                          >
                            <Eye size={12} /> Inspect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
