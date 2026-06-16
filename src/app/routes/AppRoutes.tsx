import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuctionMart } from '@/app/store';
import { AdminDashboard } from '@/modules/admin/pages/AdminDashboard';
import { AuthPage } from '@/modules/auth/pages/AuthPage';
import { OtpVerificationPage } from '@/modules/auth/pages/OtpVerificationPage';
import { ForgotPasswordPage } from '@/modules/auth/pages/ForgotPasswordPage';
import { BrowseAuctions } from '@/modules/auctions/pages/BrowseAuctions';
import { LandingHome } from '@/modules/auctions/pages/LandingHome';
import { MyListings } from '@/modules/my-listings/pages/MyListings';
import { DashboardOverview } from '@/modules/dashboard/pages/DashboardOverview';
import { MyBids } from '@/modules/bids/pages/MyBids';
import { ProductDetail } from '@/modules/products/pages/ProductDetail';
import { ProductDetailRoute } from './ProductDetailRoute';

export const AppRoutes: React.FC = () => {
  const {
    auctions,
    browseAuctions,
    myListings,
    activities,
    users,
    favorites,
    selectedProduct,
    searchQuery,
    setSearchQuery,
    setCurrentScreen,
    setSelectedProduct,
    toggleFavorite,
    handleCreateListing,
    handlePlaceBid,
    handleBidIncrease,
    handleClearFlag,
    handleModifyUserStatus,
    session,
    isAuthLoading
  } = useAuctionMart();

  if (isAuthLoading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">Checking authentication...</div>;
  }

  if (!session) {
    return (
      <Routes>
        <Route
          path="/auth"
          element={
            <div className="animate-in fade-in duration-350">
              <AuthPage setCurrentScreen={setCurrentScreen} />
            </div>
          }
        />
        <Route 
          path="/verify-otp" 
          element={
            <div className="animate-in fade-in duration-350">
              <OtpVerificationPage />
            </div>
          } 
        />
        <Route
          path="/forgot-password"
          element={
            <div className="animate-in fade-in duration-350">
              <ForgotPasswordPage />
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="animate-in fade-in duration-350">
            <LandingHome
              setCurrentScreen={setCurrentScreen}
              featuredAuctions={auctions}
              setSearchQuery={setSearchQuery}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              setSelectedProduct={setSelectedProduct}
            />
          </div>
        }
      />

      <Route
        path="/browse"
        element={
          <div className="animate-in fade-in duration-350">
            <BrowseAuctions
              auctions={browseAuctions}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              setSelectedProduct={setSelectedProduct}
              setCurrentScreen={setCurrentScreen}
            />
          </div>
        }
      />

      <Route
        path="/dashboard"
        element={
          <div className="animate-in fade-in duration-350">
            <DashboardOverview
              activities={activities}
              auctions={auctions}
              setCurrentScreen={setCurrentScreen}
              setSelectedProduct={setSelectedProduct}
              setSearchQuery={setSearchQuery}
            />
          </div>
        }
      />

      <Route
        path="/listings"
        element={
          <div className="animate-in fade-in duration-350">
            <MyListings
              auctions={myListings}
              onCreateListing={handleCreateListing}
              setCurrentScreen={setCurrentScreen}
              setSelectedProduct={setSelectedProduct}
            />
          </div>
        }
      />

      <Route
        path="/bids"
        element={
          <div className="animate-in fade-in duration-350">
            <MyBids
              auctions={auctions}
              onBidIncrease={handleBidIncrease}
              setCurrentScreen={setCurrentScreen}
              setSelectedProduct={setSelectedProduct}
            />
          </div>
        }
      />

      <Route
        path="/product-detail"
        element={
          <div className="animate-in fade-in duration-350">
            <ProductDetail
              item={selectedProduct}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              onPlaceBid={handlePlaceBid}
              setCurrentScreen={setCurrentScreen}
            />
          </div>
        }
      />

      <Route path="/product/:id" element={<ProductDetailRoute />} />

      <Route
        path="/admin"
        element={
          <div className="animate-in fade-in duration-355">
            <AdminDashboard
              auctions={auctions}
              users={users}
              onClearFlag={handleClearFlag}
              onModifyUserStatus={handleModifyUserStatus}
              currentRole="admin"
            />
          </div>
        }
      />

      <Route path="/auth" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
