import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuctionItem, ScreenId } from '@/shared/types';
import { useAuctionMart } from '@/app/store';
import api from '@/lib/axios';
import { MyListingsHeader } from '../components/MyListingsHeader';
import { StatsCards } from '../components/StatsCards';
import { ListingsFilters } from '../components/ListingsFilters';
import { ListingsTable } from '../components/ListingsTable';
import { EmptyListingsState } from '../components/EmptyListingsState';
import { CreateListingForm } from '../create-listing/CreateListingForm';
import { ListingPreview } from '../components/ListingPreview';

import { useListingFilters } from '../hooks/useListingFilters';
import { useListingStats } from '../hooks/useListingStats';
import { useImageUpload } from '../hooks/useImageUpload';
import { DURATION_OPTIONS } from '../constants/listingConstants';

import { Gavel, X } from 'lucide-react';

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
  setSelectedProduct,
}) => {
  const { currentUser, handleDeleteListing } = useAuctionMart();

  /* ── Listing filter + search ── */
  const {
    filterStatus, setFilterStatus,
    searchQuery, setSearchQuery,
    myRealListings, filteredMyListings,
  } = useListingFilters(auctions);

  /* ── Form open/close ── */
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const generateRandomSku = () => `REF-${Math.floor(100000 + Math.random() * 900000)}`;

  /* ── Core form fields ── */
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Luxury Watches');
  const [newSku, setNewSku] = useState(generateRandomSku());
  const [newPrice, setNewPrice] = useState('');
  const [newCondition, setNewCondition] = useState('New');
  const [newDescription, setNewDescription] = useState('');

  /* ── UI-only fields ── */
  const [newReservePrice, setNewReservePrice] = useState('');
  const [newDuration, setNewDuration] = useState(604800); // 7 Days default

  /* ── Image Upload Hook ── */
  const {
    uploadedImages, isDragOver, setIsDragOver,
    handleFileDrop, handleFileInput, removeImage, clearImages
  } = useImageUpload();

  /* ── Statistics derived from myRealListings ── */
  const { activeCount, draftCount, soldCount, totalRevenue } = useListingStats(myRealListings);

  /* ── Form submit ── */
  const submitListing = async (status: 'active' | 'draft') => {
    if (!newTitle || !newPrice) return;

    const parsedPrice = parseFloat(newPrice) || 100;

    // Build FormData for multipart upload
    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('category', newCategory);
    formData.append('starting_price', parsedPrice.toString());
    formData.append('sku_reference', newSku);
    formData.append('condition_status', newCondition);
    formData.append('description', newDescription || '');
    formData.append('seller_email', currentUser?.email || '');
    formData.append('seller_name', currentUser?.name || '');
    formData.append('duration', newDuration.toString());
    formData.append('status', status);

    if (uploadedImages.length > 0) {
      uploadedImages.forEach((img) => {
        if (img.file) {
          formData.append('images', img.file);
        }
      });
    }

    try {
      let response;
      if (editingId) {
        const numericId = editingId.replace('db-', '');
        response = await api.put(`/auction/${numericId}`, formData);
        window.location.reload();
      } else {
        response = await api.post('/auction/create', formData);
        const data = response.data;
        const coverImageUrl = uploadedImages.length > 0 ? uploadedImages[0].preview : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEi87bMnKhFHqJ3-zB0UuV6jek8iK5RePOJRXV62pmn0yIcl4v8EvDYcm-Ly55EYUuEciZN5oWWuibLFf4Sip57Ik2O_0b75GPA3RWubAg0gKLKgrgn2zTb8dlt_zamBRtVL2N9HW1AlE_8BEJw_IWbh_hbEwUmic1hFqKY3IXbqkjTDm7iz5bbUxyfDgqThvUCty4I2ey0N8HC-ijylmRVLpJGcJHnU7QISv1-lhrS4lBidJGqCXYBqgEpkJcLyZajyJ7svbRlwr2';
        const galleryImageUrls = uploadedImages.length > 0 ? uploadedImages.map(img => img.preview) : [];

        const newlyCreatedItem: AuctionItem = {
          id: `db-${data.auctionId}`,
          title: newTitle,
          category: newCategory,
          sku: newSku,
          currentBid: parsedPrice,
          totalBids: 0,
          imageUrl: coverImageUrl,
          imageUrls: galleryImageUrls,
          timerSeconds: newDuration,
          status: status,
          condition: newCondition as any,
          description: newDescription || '',
          sellerName: currentUser?.name || 'You',
          sellerRating: 5.0,
          sellerSales: 0,
          sellerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJMliNAX9iwfBs5w9IqD-A5JVNLkceWMpZoXHttDLkZEn9GsuALDInSRPSVqEUs5GGYq5hJYwIMcA_AEsIR1pYOZAPxg1w-vtbzAHQcf7Xd-KYn_4reIVsYn08Nby_mysL-pYseyUnxPuL1-2-zzQyhbrw04Sh2jQ6v-ljtHCyKHj_dYb8UR3pIPlo_bG9h3PKpf9ujxJ6NbQ1Srun08ibBUmXs7jnMImhAnexk1IjdciFq59YeCsye27wK9nsIfcg4_WF-qg4uy0v',
        };

        onCreateListing(newlyCreatedItem);
      }

      setIsFormOpen(false);
      setEditingId(null);
      setNewTitle('');
      setNewPrice('');
      setNewDescription('');
      setNewReservePrice('');
      setNewDuration(604800);
      setNewCategory('Luxury Watches');
      setNewCondition('New');
      setNewSku(generateRandomSku());
      clearImages();
    } catch (err: any) {
      console.error('Failed to create/update listing:', err);
      const errMsg = err.response?.data?.message || 'Failed to process listing. Please try again.';
      alert(errMsg);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitListing('active');
  };

  const handleSaveDraft = () => {
    submitListing('draft');
  };

  const handleEditDraft = (item: AuctionItem) => {
    setEditingId(item.id);
    setNewTitle(item.title);
    setNewCategory(item.category);
    setNewSku(item.sku || generateRandomSku());
    setNewPrice(item.currentBid.toString());
    setNewCondition(item.condition);
    setNewDescription(item.description || '');
    setNewDuration(item.timerSeconds);
    clearImages(); // clear existing image previews to avoid confusion since they aren't Files
    setIsFormOpen(true);
  };

  /* ── Inspect listing ── */
  const navigateToProduct = useNavigate();
  const handleInspectListing = (item: AuctionItem) => {
    navigateToProduct(`/product/${item.id}`);
  };

  /* ── Live preview derived values ── */
  const previewImage = uploadedImages[0]?.preview ?? null;
  const previewTitle = newTitle || 'Your Product Title';
  const previewPrice = newPrice ? `₹${parseFloat(newPrice).toLocaleString()}` : '₹0';
  const previewDurationLabel = DURATION_OPTIONS.find(d => d.value === newDuration)?.label ?? '7 Days';
  const previewCategory = newCategory || '—';
  const previewCondition = newCondition || '—';

  return (
    <div className="space-y-7 pb-20">
      <MyListingsHeader isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} />
      
      <StatsCards
        activeCount={activeCount}
        draftCount={draftCount}
        soldCount={soldCount}
        totalRevenue={totalRevenue}
      />

      {isFormOpen && (
        <div className="animate-in fade-in slide-in-from-top-3 duration-250">
          {/* Form Card Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm mb-0 px-6 py-5 border-b-0 rounded-b-none flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Gavel size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">Create New Auction Listing</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fill in the details below to publish your auction lot.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setIsFormOpen(false); setEditingId(null); }}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 border-t-0 rounded-b-2xl p-6"
          >
            <div className="flex flex-col xl:flex-row gap-6 items-start">
              <CreateListingForm
                setIsFormOpen={setIsFormOpen}
                handleFormSubmit={handleFormSubmit}
                newTitle={newTitle} setNewTitle={setNewTitle}
                newCategory={newCategory} setNewCategory={setNewCategory}
                newCondition={newCondition} setNewCondition={setNewCondition}
                newPrice={newPrice} setNewPrice={setNewPrice}
                newReservePrice={newReservePrice} setNewReservePrice={setNewReservePrice}
                newDuration={newDuration} setNewDuration={setNewDuration}
                newSku={newSku} setNewSku={setNewSku}
                uploadedImages={uploadedImages}
                isDragOver={isDragOver} setIsDragOver={setIsDragOver}
                handleFileDrop={handleFileDrop} handleFileInput={handleFileInput} removeImage={removeImage}
                newDescription={newDescription} setNewDescription={setNewDescription}
                onSaveDraft={handleSaveDraft}
              />
              <ListingPreview
                previewImage={previewImage}
                previewTitle={previewTitle}
                previewPrice={previewPrice}
                previewDurationLabel={previewDurationLabel}
                previewCategory={previewCategory}
                previewCondition={previewCondition}
                uploadedImagesCount={uploadedImages.length}
              />
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <ListingsFilters
          filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        />
        {filteredMyListings.length === 0 ? (
          <EmptyListingsState onClearFilters={() => {
            setSearchQuery('');
            setFilterStatus('all');
          }} />
        ) : (
          <ListingsTable
            listings={filteredMyListings}
            onInspect={handleInspectListing}
            onDelete={handleDeleteListing}
            onEdit={handleEditDraft}
          />
        )}
      </div>
    </div>
  );
};
