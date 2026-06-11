import React, { useState } from 'react';
import {
  Search,
  Gavel,
  Heart,
  Shield,
  LogOut,
  Menu,
  X,
  Landmark,
  CheckCircle
} from 'lucide-react';
import { useAuctionMart } from '@/app/store';
import { NotificationDropdown } from '@/modules/notifications/components/NotificationDropdown';
import { useNotifications } from '@/modules/notifications/hooks/useNotifications';
import type { ScreenId } from '@/shared/types';

export const Navbar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    currentRole,
    setCurrentRole,
    searchQuery,
    setSearchQuery,
    favorites,
    currentUser,
    logout
  } = useAuctionMart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const {
    notifications,
    isNotificationOpen,
    setIsNotificationOpen,
    clearNotifications
  } = useNotifications();

  const navigationItems = [
    { id: 'home' as ScreenId, name: 'Home' },
    { id: 'browse' as ScreenId, name: 'Browse Auctions' },
    { id: 'dashboard' as ScreenId, name: 'Dashboard' },
    { id: 'listings' as ScreenId, name: 'My Listings' },
    { id: 'bids' as ScreenId, name: 'My Bids' }
  ];

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentScreen('browse');
    }
  };

  const favoritesCount = favorites.length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setCurrentScreen('home')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Gavel size={20} className="transform rotate-45" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Auction<span className="text-blue-600 font-extrabold">Mart</span>
              </span>
              <p className="text-[9px] text-slate-400 -mt-1 tracking-widest uppercase font-semibold">ONLINE HUB</p>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg relative mx-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              id="global-search-input"
              type="text"
              placeholder="Search Rolex, Ferrari, Hermès, Cameras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full text-sm pl-10 pr-24 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors bg-slate-50"
            />
            <button
              id="global-search-btn"
              onClick={() => setCurrentScreen('browse')}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  id={`nav-link-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setCurrentScreen(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${isActive
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              id="fav-shortcut-btn"
              onClick={() => {
                setSearchQuery('');
                setCurrentScreen('browse');
              }}
              className="relative p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-55 hover:bg-slate-50 rounded-xl transition-all block"
              title="View saved items"
            >
              <Heart size={20} className={favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''} />
              {favoritesCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              notifications={notifications}
              isOpen={isNotificationOpen}
              onToggle={() => setIsNotificationOpen(!isNotificationOpen)}
              onClear={clearNotifications}
            />

            <div className="hidden sm:flex items-center border border-slate-200 bg-slate-50 px-2.5 py-1 rounded-xl gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">ROLE:</span>
              <select
                id="role-switch-select"
                value={currentRole}
                onChange={(e) => {
                  const r = e.target.value as 'client' | 'admin';
                  setCurrentRole(r);
                  if (r === 'admin') {
                    setCurrentScreen('admin');
                  } else {
                    setCurrentScreen('home');
                  }
                }}
                className="text-xs font-semibold focus:outline-hidden bg-transparent border-0 text-slate-900 cursor-pointer pr-1"
              >
                <option value="client">Client (User)</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="relative">
              <button
                id="profile-dropdown-btn"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1.5 focus:outline-hidden p-1 rounded-full hover:bg-slate-50 transition-colors"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC52XPX68f7szipt695KhrDJcnIhxiHn0yR4ZoBwVs-3gBxPlSBfgYyK1Ndjgj3Ab9sr6McYjjpoIomk14ByO6O7NQUBj4mD-nf7at2S0a-l0q9ZNbvRp8wtwBCIGYxnJnnBouDrRKkqy6J-QYf_IGa6b8Th3fnxP8PVmCHtj2m_evcHpIqgHzdCNGmQPIfCTpWhHmZuNS8iQZBgjyNNvXY0vztyxP0o2GNwVSSBKBHFQyYLTtEhYbx1tv8d4DPgGgv583VbykPoOOW"
                  alt={`${currentUser?.name || 'User'} Avatar`}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2">
                  <div className="px-4 py-2.5 border-b border-slate-150">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-950">{currentUser?.name || 'User'}</p>
                      <CheckCircle size={12} className="text-emerald-500 fill-emerald-100" />
                    </div>
                    <p className="text-[10px] text-slate-400">{currentUser?.email || ''}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-blue-600 text-white text-[8px] font-bold uppercase tracking-wider">
                      {currentRole === 'client' ? 'Client PRO' : currentRole.toUpperCase()}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      id="prof-menu-dashboard"
                      onClick={() => {
                        setCurrentScreen('dashboard');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <Landmark size={14} /> My Dashboard
                    </button>
                    {currentRole === 'admin' && (
                      <button
                        id="prof-menu-admin"
                        onClick={() => {
                          setCurrentScreen('admin');
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-blue-600 font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                      >
                        <Shield size={14} /> Administrator Panel
                      </button>
                    )}
                    <button
                      id="prof-menu-auth"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 border-t border-slate-100 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-950"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg px-4 pt-2 pb-4 space-y-3">
          <div className="relative w-full">
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full text-xs pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            <Search size={14} className="absolute left-2.5 top-3 text-slate-400" />
          </div>

          <div className="flex flex-col gap-1.5">
            {navigationItems.map((item) => (
              <button
                id={`mobile-nav-link-${item.id}`}
                key={item.id}
                onClick={() => {
                  setCurrentScreen(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${currentScreen === item.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Dynamic Role Selection:</span>
            <select
              id="mobile-role-switch-select"
              value={currentRole}
              onChange={(e) => {
                const r = e.target.value as 'client' | 'admin';
                setCurrentRole(r);
                if (r === 'admin') {
                  setCurrentScreen('admin');
                } else {
                  setCurrentScreen('home');
                }
                setIsMobileMenuOpen(false);
              }}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg"
            >
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
