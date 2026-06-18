import React, { useState, useEffect } from 'react';
import {
  Search,
  Gavel,
  Heart,
  Shield,
  LogOut,
  Menu,
  X,
  Landmark,
  CheckCircle,
  Sun,
  Moon,
  Monitor,
  UserCircle
} from 'lucide-react';
import { useAuctionMart } from '@/app/store';
import { useTheme } from '@/shared/theme';
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

  const [hasReadNotice, setHasReadNotice] = useState(() => {
    return localStorage.getItem('auctionmart_notice_v1_read') === 'true';
  });

  useEffect(() => {
    if (isProfileDropdownOpen && !hasReadNotice) {
      setHasReadNotice(true);
      localStorage.setItem('auctionmart_notice_v1_read', 'true');
    }
  }, [isProfileDropdownOpen, hasReadNotice]);

  const handleSystemNoticeClick = () => {
    setIsNotificationOpen(false);
    setIsProfileDropdownOpen(true);
  };
  const {
    notifications,
    isNotificationOpen,
    setIsNotificationOpen,
    clearNotifications
  } = useNotifications();
  const { theme, setTheme } = useTheme();

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
  const themeOptions = [
    { value: 'light' as const, label: 'Light Mode', shortLabel: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark Mode', shortLabel: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System Default', shortLabel: 'System', icon: Monitor }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setCurrentScreen('home')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Gavel size={20} className="transform rotate-45" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
                Auction<span className="text-blue-600 font-extrabold">Mart</span>
              </span>
              <p className="text-[9px] text-slate-400 -mt-1 tracking-widest uppercase font-semibold">BIDDING HUB</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 flex-1 ml-8 max-w-xl">
            <nav className="flex items-center gap-1">
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
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${isActive
                      ? 'text-blue-600 bg-blue-50 font-semibold dark:bg-slate-800/50 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                      }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="fav-shortcut-btn"
              onClick={() => {
                setSearchQuery('');
                setCurrentScreen('browse');
              }}
              className="relative p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-white rounded-xl transition-all block"
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
              hasSystemNotice={!hasReadNotice}
              onSystemNoticeClick={handleSystemNoticeClick}
            />



            <div className="relative hidden lg:block">
              <button
                id="profile-dropdown-btn"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1.5 focus:outline-hidden p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300">
                  <UserCircle size={20} />
                </span>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 py-2 transition-colors duration-300">
                  <div className="px-4 py-2.5 border-b border-slate-150 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-950 dark:text-white">{currentUser?.name || 'User'}</p>
                      <CheckCircle size={12} className="text-emerald-500 fill-emerald-100 dark:fill-emerald-900/30" />
                    </div>
                    <p className="text-[10px] text-slate-400">{currentUser?.email || ''}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-blue-600 text-white text-[8px] font-bold uppercase tracking-wider">
                      {currentRole === 'client' ? 'Client' : currentRole.toUpperCase()}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      id="prof-menu-dashboard"
                      onClick={() => {
                        setCurrentScreen('dashboard');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
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
                        className="w-full text-left px-4 py-2 text-xs text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                      >
                        <Shield size={14} /> Administrator Panel
                      </button>
                    )}
                    
                    <div className="px-4 py-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Appearance</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {themeOptions.map(({ value, shortLabel, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => setTheme(value)}
                            className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${theme === value ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                          >
                            <Icon size={12} /> {shortLabel}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={`px-4 py-3 mt-1 border-t border-slate-100 dark:border-slate-800 transition-all duration-500 ${!hasReadNotice ? 'bg-amber-50 dark:bg-amber-900/10' : ''}`}>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                        Notice
                        {!hasReadNotice && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                      </p>
                      <div className="bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-2.5 rounded-lg shadow-sm">
                        <p className="text-[10px] text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                          ⚠️ Notice: This is the initial version of the website. Some features may still have bugs or unexpected behavior. We are actively improving the platform and appreciate your patience and feedback.
                        </p>
                      </div>
                    </div>

                    <button
                      id="prof-menu-auth"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800 transition-colors flex items-center gap-2"
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
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer content */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl py-6 px-4 pb-12 overflow-y-auto animate-in slide-in-from-right-full duration-300">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
                Menu
              </span>
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative w-full mb-6">
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  handleSearchKeyPress(e);
                  if (e.key === 'Enter') setIsMobileMenuOpen(false);
                }}
                className="w-full text-xs pl-8 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              {navigationItems.map((item) => (
                <button
                  id={`mobile-nav-link-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setCurrentScreen(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${currentScreen === item.id
                    ? 'text-blue-600 bg-blue-50 dark:bg-slate-800 dark:text-blue-400'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50'
                    }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                <p className="px-4 text-[10px] uppercase font-bold text-slate-400 mb-2">Appearance</p>
                <div className="flex flex-col gap-1.5">
                  {themeOptions.map(({ value, label, icon: Icon }) => (
                    <button
                      id={`mobile-theme-${value}`}
                      key={value}
                      onClick={() => setTheme(value)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${theme === value
                        ? 'text-blue-600 bg-blue-50 dark:bg-slate-800 dark:text-blue-400'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50'
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={16} /> {label}
                      </span>
                      {theme === value && <CheckCircle size={14} className="text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
              <div className="flex items-center gap-3 mb-6 min-w-0">
                <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex shrink-0 items-center justify-center text-slate-500 dark:text-slate-300">
                  <UserCircle size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.email || ''}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-semibold"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
