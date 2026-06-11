import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  PlusCircle, Search, Eye, Package, TrendingUp,
  DollarSign, Clock, Upload, X, ImageIcon,
  Star, Gavel, Tag, FileText, Layers,
  CheckCircle2, ChevronRight, BarChart3, ShoppingBag
} from 'lucide-react';
import { AuctionItem, ScreenId } from '@/shared/types';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { useAuctionMart } from '@/app/store';

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
interface MyListingsProps {
  auctions: AuctionItem[];
  onCreateListing: (newItem: AuctionItem) => void;
  setCurrentScreen: (screen: ScreenId) => void;
  setSelectedProduct: (item: AuctionItem) => void;
}

/* Duration option maps auction duration label → timerSeconds value */
const DURATION_OPTIONS = [
  { label: '1 Day',  value: 86400 },
  { label: '3 Days', value: 259200 },
  { label: '7 Days', value: 604800 },
  { label: '14 Days',value: 1209600 },
  { label: '30 Days',value: 2592000 },
];

const CATEGORIES = [
  'Luxury Watches',
  'Automotive',
  'Collectibles',
  'Tech',
  'Art & Antiques',
  'Jewellery',
  'Fashion',
  'Sports Memorabilia',
  'Electronics',
  'Real Estate',
];

const CONDITIONS = ['New', 'Like New', 'Used', 'Refurbished', 'For Parts'];

const MAX_IMAGES = 5;
const MAX_DESC_CHARS = 2000;

/* ─────────────────────────────────────────────────────────────────────────────
   STAT CARD COMPONENT
───────────────────────────────────────────────────────────────────────────── */
interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  subLabel: string;
  color: string;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, subLabel, color, bg }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className={`${bg} p-3 rounded-xl flex-shrink-0`}>
      <div className={color}>{icon}</div>
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
      <p className="text-sm font-bold text-slate-700 mt-1">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{subLabel}</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   FORM SECTION WRAPPER
───────────────────────────────────────────────────────────────────────────── */
interface SectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const FormSection: React.FC<SectionProps> = ({ icon, title, subtitle, children }) => (
  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
      <div className="text-blue-600">{icon}</div>
      <div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   FIELD LABEL COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const FieldLabel: React.FC<{ htmlFor: string; required?: boolean; children: React.ReactNode }> = ({
  htmlFor, required, children
}) => (
  <label htmlFor={htmlFor} className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED INPUT CLASSES
───────────────────────────────────────────────────────────────────────────── */
const INPUT_CLS =
  'w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150';

const SELECT_CLS =
  'w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150 cursor-pointer appearance-none';

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export const MyListings: React.FC<MyListingsProps> = ({
  auctions,
  onCreateListing,
  setCurrentScreen,
  setSelectedProduct,
}) => {
  const { currentUser } = useAuctionMart();

  /* ── Listing filter + search (EXISTING — unchanged) ── */
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  /* ── Form open/close (EXISTING — unchanged) ── */
  const [isFormOpen, setIsFormOpen] = useState(false);

  /* ── Core form fields (EXISTING — unchanged) ── */
  const [newTitle,       setNewTitle]       = useState('');
  const [newCategory,    setNewCategory]    = useState('Luxury Watches');
  const [newSku,         setNewSku]         = useState('WA-NEW-99');
  const [newPrice,       setNewPrice]       = useState('');
  const [newCondition,   setNewCondition]   = useState<'New' | 'Used'>('New');
  const [newDescription, setNewDescription] = useState('');

  /* ── NEW UI-only fields ── */
  const [newReservePrice,    setNewReservePrice]    = useState('');
  const [newDuration,        setNewDuration]        = useState(604800); // 7 Days default
  const [uploadedImages,     setUploadedImages]     = useState<{ file: File; preview: string }[]>([]);
  const [isDragOver,         setIsDragOver]         = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Cleanup preview object URLs on unmount ── */
  useEffect(() => {
    return () => {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [uploadedImages]);

  /* ─────────────────────────────────────────────────────────
     Existing derived data (UNCHANGED)
  ───────────────────────────────────────────────────────── */
  const myRealListings = auctions.filter(
    (item) => item.sellerName === 'Timepiece Legends'
  );

  const filteredMyListings = myRealListings.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  /* ─────────────────────────────────────────────────────────
     Statistics derived from myRealListings
  ───────────────────────────────────────────────────────── */
  const activeCount  = myRealListings.filter(i => i.status === 'active').length;
  const draftCount   = myRealListings.filter(i => i.status === 'draft').length;
  const soldCount    = myRealListings.filter(i => i.status === 'ended').length;
  const totalRevenue = myRealListings
    .filter(i => i.status === 'ended')
    .reduce((sum, i) => sum + i.currentBid, 0);

  /* ─────────────────────────────────────────────────────────
     Image upload handlers (NEW UI feature)
  ───────────────────────────────────────────────────────── */
  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const remaining = MAX_IMAGES - uploadedImages.length;
    const toAdd = Array.from(files)
      .filter(f => allowed.includes(f.type) && f.size <= 5 * 1024 * 1024)
      .slice(0, remaining);
    const newPreviews = toAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setUploadedImages(prev => [...prev, ...newPreviews]);
  }, [uploadedImages.length]);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  /* ─────────────────────────────────────────────────────────
     Form submit (EXISTING LOGIC — unchanged)
     Only imageUrl source updated to use real upload preview
     if available, otherwise falls back to original default.
  ───────────────────────────────────────────────────────── */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const parsedPrice = parseFloat(newPrice) || 100;

    // Use first uploaded image preview if available, else use original fallback
    const resolvedImageUrl =
      uploadedImages.length > 0
        ? uploadedImages[0].preview
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEi87bMnKhFHqJ3-zB0UuV6jek8iK5RePOJRXV62pmn0yIcl4v8EvDYcm-Ly55EYUuEciZN5oWWuibLFf4Sip57Ik2O_0b75GPA3RWubAg0gKLKgrgn2zTb8dlt_zamBRtVL2N9HW1AlE_8BEJw_IWbh_hbEwUmic1hFqKY3IXbqkjTDm7iz5bbUxyfDgqThvUCty4I2ey0N8HC-ijylmRVLpJGcJHnU7QISv1-lhrS4lBidJGqCXYBqgEpkJcLyZajyJ7svbRlwr2';

    const newlyCreatedItem: AuctionItem = {
      id: `new-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      sku: newSku,
      currentBid: parsedPrice,
      totalBids: 0,
      imageUrl: resolvedImageUrl,
      timerSeconds: newDuration,           // mapped from duration picker
      status: 'active',
      condition: newCondition,
      description:
        newDescription ||
        'Premium verified vintage collectible watch or accessory listed directly on elite ledger network.',
      sellerName: 'Timepiece Legends',
      sellerRating: 4.9,
      sellerSales: 1241,
      sellerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAJMliNAX9iwfBs5w9IqD-A5JVNLkceWMpZoXHttDLkZEn9GsuALDInSRPSVqEUs5GGYq5hJYwIMcA_AEsIR1pYOZAPxg1w-vtbzAHQcf7Xd-KYn_4reIVsYn08Nby_mysL-pYseyUnxPuL1-2-zzQyhbrw04Sh2jQ6v-ljtHCyKHj_dYb8UR3pIPlo_bG9h3PKpf9ujxJ6NbQ1Srun08ibBUmXs7jnMImhAnexk1IjdciFq59YeCsye27wK9nsIfcg4_WF-qg4uy0v',
    };

    onCreateListing(newlyCreatedItem);
    setIsFormOpen(false);

    // Reset all form states
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
    setNewReservePrice('');
    setNewDuration(604800);
    setNewCategory('Luxury Watches');
    setNewCondition('New');
    setNewSku('WA-NEW-99');
    uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setUploadedImages([]);
  };

  /* ─────────────────────────────────────────────────────────
     Inspect listing (EXISTING — unchanged)
  ───────────────────────────────────────────────────────── */
  const handleInspectListing = (item: AuctionItem) => {
    setSelectedProduct(item);
    setCurrentScreen('product-detail');
  };

  /* ─────────────────────────────────────────────────────────
     Live preview derived values
  ───────────────────────────────────────────────────────── */
  const previewImage  = uploadedImages[0]?.preview ?? null;
  const previewTitle  = newTitle   || 'Your Product Title';
  const previewPrice  = newPrice   ? `₹${parseFloat(newPrice).toLocaleString()}` : '₹0';
  const previewDurationLabel = DURATION_OPTIONS.find(d => d.value === newDuration)?.label ?? '7 Days';
  const previewCategory  = newCategory  || '—';
  const previewCondition = newCondition || '—';

  /* ─────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────── */
  return (
    <div className="space-y-7 pb-20">

      {/* ═══════════════════════════════════════════════════
          1. PAGE HEADER
      ════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Listings
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Create, manage, and track your auction listings from one place.
            {currentUser?.name && (
              <span className="text-blue-600 font-semibold ml-1">
                — {currentUser.name}
              </span>
            )}
          </p>
        </div>

        <button
          id="trigger-add-listing-form-btn"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer ${
            isFormOpen
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
          }`}
        >
          <PlusCircle size={16} />
          {isFormOpen ? 'Close Form' : 'Create New Listing'}
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════
          2. STATISTICS CARDS
      ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Gavel size={20} />}
          value={String(activeCount)}
          label="Active Listings"
          subLabel="Currently live auctions"
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          icon={<FileText size={20} />}
          value={String(draftCount)}
          label="Draft Listings"
          subLabel="Saved, not yet published"
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <StatCard
          icon={<ShoppingBag size={20} />}
          value={String(soldCount)}
          label="Sold Items"
          subLabel="Completed auctions"
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          value={totalRevenue > 0 ? `₹${totalRevenue.toLocaleString()}` : '₹0'}
          label="Total Revenue"
          subLabel="From completed sales"
          color="text-purple-600"
          bg="bg-purple-50"
        />
      </div>

      {/* ═══════════════════════════════════════════════════
          3. CREATE LISTING FORM (collapsible)
      ════════════════════════════════════════════════════ */}
      {isFormOpen && (
        <div className="animate-in fade-in slide-in-from-top-3 duration-250">
          {/* Form Card Header */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-0 px-6 py-5 border-b-0 rounded-b-none flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Gavel size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Create New Auction Listing</h2>
                <p className="text-xs text-slate-500">
                  Fill in the details below to publish your auction lot.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Two-column layout: Form (left) + Preview (right) */}
          <form
            onSubmit={handleFormSubmit}
            className="bg-slate-50 border border-slate-200 border-t-0 rounded-b-2xl p-6"
          >
            <div className="flex flex-col xl:flex-row gap-6 items-start">

              {/* ── LEFT: Form sections ── */}
              <div className="flex-1 min-w-0 space-y-5">

                {/* ── SECTION A: Basic Information ── */}
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
                          onChange={e => setNewCondition(e.target.value as any)}
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

                {/* ── SECTION B: Pricing & Auction Settings ── */}
                <FormSection
                  icon={<DollarSign size={16} />}
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
                    <FieldLabel htmlFor="new-sku-input">Internal Reference Code</FieldLabel>
                    <input
                      id="new-sku-input"
                      type="text"
                      value={newSku}
                      onChange={e => setNewSku(e.target.value)}
                      placeholder="e.g. WA-2024-001"
                      className={INPUT_CLS}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      For your own inventory tracking (not shown to buyers)
                    </p>
                  </div>
                </FormSection>

                {/* ── SECTION C: Product Images ── */}
                <FormSection
                  icon={<ImageIcon size={16} />}
                  title="Product Images"
                  subtitle={`Upload up to ${MAX_IMAGES} images · JPG, PNG, WEBP · Max 5 MB each`}
                >
                  {/* Drag & Drop Zone */}
                  {uploadedImages.length < MAX_IMAGES && (
                    <div
                      onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 select-none ${
                        isDragOver
                          ? 'border-blue-500 bg-blue-50/80 scale-[0.99]'
                          : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className={`p-3 rounded-xl transition-colors ${isDragOver ? 'bg-blue-100' : 'bg-slate-100'}`}>
                          <Upload size={22} className={isDragOver ? 'text-blue-600' : 'text-slate-400'} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            Drag &amp; Drop Images Here
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">or</p>
                          <span className="inline-block mt-1.5 text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1 rounded-lg">
                            Browse Files
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {MAX_IMAGES - uploadedImages.length} of {MAX_IMAGES} image slots remaining
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleFileInput}
                      />
                    </div>
                  )}

                  {/* Image Preview Grid */}
                  {uploadedImages.length > 0 && (
                    <div className={`grid grid-cols-3 sm:grid-cols-5 gap-3 ${uploadedImages.length < MAX_IMAGES ? 'mt-4' : ''}`}>
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="relative group aspect-square">
                          <img
                            src={img.preview}
                            alt={`Preview ${i + 1}`}
                            className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm"
                          />
                          {i === 0 && (
                            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-md">
                              Main
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                      {/* Add more button if below limit */}
                      {uploadedImages.length < MAX_IMAGES && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50/40 transition-all cursor-pointer text-slate-400 hover:text-blue-600"
                        >
                          <PlusCircle size={18} />
                          <span className="text-[9px] font-bold">Add</span>
                        </button>
                      )}
                    </div>
                  )}
                </FormSection>

                {/* ── SECTION D: Product Description ── */}
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
                      <span className={`text-[10px] font-semibold tabular-nums ${
                        newDescription.length > MAX_DESC_CHARS * 0.9 ? 'text-amber-500' : 'text-slate-400'
                      }`}>
                        {newDescription.length} / {MAX_DESC_CHARS}
                      </span>
                    </div>
                  </div>
                </FormSection>

                {/* ── ACTION BUTTONS ── */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {/* Ghost: Save Draft */}
                  <button
                    id="cancel-add-listing-btn"
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Save Draft
                  </button>

                  <div className="flex items-center gap-3">
                    {/* Secondary: Preview */}
                    <button
                      type="button"
                      className="px-4 py-2.5 text-sm font-bold text-blue-600 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer"
                    >
                      Preview Listing
                    </button>

                    {/* Primary: Publish */}
                    <button
                      id="submit-add-listing-btn"
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 transition-all cursor-pointer"
                    >
                      <CheckCircle2 size={15} />
                      Publish Auction
                    </button>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Live Preview Panel ── */}
              <div className="xl:w-72 xl:flex-shrink-0 xl:sticky xl:top-4">
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  {/* Preview header */}
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-3.5 flex items-center gap-2">
                    <Eye size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Listing Preview
                    </span>
                  </div>

                  {/* Preview image */}
                  <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
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
                    <h3 className="font-black text-slate-900 text-sm leading-tight line-clamp-2">
                      {previewTitle}
                    </h3>

                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-slate-500">Starting Bid</span>
                    </div>
                    <p className="text-2xl font-black text-blue-600 -mt-2">
                      {previewPrice}
                    </p>

                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Condition</span>
                        <span className="font-bold text-slate-800">{previewCondition}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Category</span>
                        <span className="font-bold text-blue-600 truncate max-w-32 text-right">{previewCategory}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Auction Ends</span>
                        <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                          <Clock size={10} />
                          {previewDurationLabel}
                        </span>
                      </div>
                    </div>

                    {/* Seller badge */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                        {currentUser?.name?.[0]?.toUpperCase() ?? 'U'}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Listed by</p>
                        <p className="text-xs font-bold text-slate-800">
                          {currentUser?.name ?? 'You'}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-0.5 text-amber-500">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[10px] font-bold text-slate-600">4.9</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload progress hint */}
                {uploadedImages.length > 0 && (
                  <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <p className="text-xs font-semibold text-emerald-700">
                      {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''} ready to upload
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          4. MY LISTINGS TABLE
      ════════════════════════════════════════════════════ */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

        {/* Filter bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all',     name: 'All Listings' },
              { id: 'active',  name: 'Active' },
              { id: 'draft',   name: 'Drafts' },
              { id: 'flagged', name: 'Suspended' },
            ].map(btn => (
              <button
                id={`status-filter-my-listings-${btn.id}`}
                key={btn.id}
                onClick={() => setFilterStatus(btn.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  filterStatus === btn.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
              placeholder="Search by title or SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-white text-slate-900 placeholder-slate-400"
            />
            <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
          </div>
        </div>

        {/* Table */}
        {filteredMyListings.length === 0 ? (
          <div className="py-16">
            <EmptyState
              title="No listings found"
              description="You have no listings matching this filter. Create a new listing above to get started."
              actionText="Clear Filters"
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
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">Condition</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Current Bid</th>
                  <th className="py-3.5 px-4 text-center">Total Bids</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMyListings.map((item) => {
                  const isActive  = item.status === 'active';
                  const isFlagged = item.status === 'flagged';
                  const isDraft   = item.status === 'draft';
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-colors text-xs text-slate-700"
                    >
                      {/* Thumbnail & title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200 shadow-sm flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p
                              onClick={() => handleInspectListing(item)}
                              className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer max-w-xs truncate transition-colors"
                            >
                              {item.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">
                                {item.sku}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-[10px] text-blue-600 font-semibold uppercase">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Condition */}
                      <td className="py-4 px-4 font-semibold text-slate-500">
                        {item.condition}
                      </td>

                      {/* Status badge */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 text-[9px] uppercase font-bold px-2.5 py-1 rounded-full ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isFlagged
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : isDraft
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-emerald-500' : isFlagged ? 'bg-red-500' : isDraft ? 'bg-amber-500' : 'bg-slate-400'
                          }`} />
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                        {isFlagged && item.flagReason && (
                          <p className="text-[9px] text-red-600 mt-1 max-w-36 leading-tight">
                            {item.flagReason}
                          </p>
                        )}
                      </td>

                      {/* Current Bid */}
                      <td className="py-4 px-4 text-right font-black text-slate-900">
                        ₹{item.currentBid.toLocaleString()}
                      </td>

                      {/* Total Bids */}
                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-400">
                        {item.totalBids}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          id={`inspect-lot-btn-${item.id}`}
                          onClick={() => handleInspectListing(item)}
                          title="View listing details"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white rounded-lg text-[11px] text-slate-700 font-bold transition-all duration-150 cursor-pointer shadow-sm"
                        >
                          <Eye size={11} />
                          View
                        </button>
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
