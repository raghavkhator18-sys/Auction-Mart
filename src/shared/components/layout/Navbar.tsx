import React, { useState, useEffect, useRef } from 'react';
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
    logout,
    setOpenListingForm
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

  const desktopNavRef = useRef<HTMLDivElement>(null);
  const desktopItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [desktopIndicatorStyle, setDesktopIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const mobileNavRef = useRef<HTMLDivElement>(null);
  const mobileItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [mobileIndicatorStyle, setMobileIndicatorStyle] = useState({ top: 0, height: 0, opacity: 0 });

  const navigationItems = [
    { id: 'home' as ScreenId, name: 'Home' },
    { id: 'browse' as ScreenId, name: 'Browse Auctions' },
    { id: 'dashboard' as ScreenId, name: 'Dashboard' },
    { id: 'listings' as ScreenId, name: 'My Listings' },
    { id: 'bids' as ScreenId, name: 'My Bids' }
  ];

  // Keep a ref to current screen so our stable callbacks can read the latest value
  const currentScreenRef = useRef(currentScreen);
  currentScreenRef.current = currentScreen;

  // Detect prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const updateDesktopIndicator = React.useCallback(() => {
    requestAnimationFrame(() => {
      const activeIndex = navigationItems.findIndex(item => item.id === currentScreenRef.current);
      const activeItem = desktopItemRefs.current[activeIndex];
      const navContainer = desktopNavRef.current;

      if (activeItem && navContainer) {
        setDesktopIndicatorStyle({
          left: activeItem.offsetLeft,
          width: activeItem.offsetWidth,
          opacity: 1
        });
      } else {
        setDesktopIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    });
  }, []);

  const updateMobileIndicator = React.useCallback(() => {
    requestAnimationFrame(() => {
      const activeIndex = navigationItems.findIndex(item => item.id === currentScreenRef.current);
      const activeItem = mobileItemRefs.current[activeIndex];

      if (activeItem && mobileNavRef.current) {
        setMobileIndicatorStyle({
          top: activeItem.offsetTop,
          height: activeItem.offsetHeight,
          opacity: 1
        });
      } else {
        setMobileIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    });
  }, []);

  useEffect(() => {
    updateDesktopIndicator();
    updateMobileIndicator();
    window.addEventListener('resize', updateDesktopIndicator);
    window.addEventListener('resize', updateMobileIndicator);
    return () => {
      window.removeEventListener('resize', updateDesktopIndicator);
      window.removeEventListener('resize', updateMobileIndicator);
    };
  }, [currentScreen, updateDesktopIndicator, updateMobileIndicator]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      updateDesktopIndicator();
      updateMobileIndicator();
    });
    if (desktopNavRef.current) observer.observe(desktopNavRef.current);
    if (mobileNavRef.current) observer.observe(mobileNavRef.current);
    return () => observer.disconnect();
  }, [updateDesktopIndicator, updateMobileIndicator]);


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
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 transition-all duration-300">
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-[32px] shadow-xs flex items-center justify-between h-[60px] px-3 sm:px-5">
          {/* LEFT: Logo & Branding */}
          <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => setCurrentScreen('home')}>
            <div className="w-[38px] h-[38px] bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform hover:scale-105 duration-200">
              <Gavel size={20} className="transform rotate-45" />
            </div>
            <div className="hidden sm:block leading-none">
              <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300 block">
                Auction<span className="text-blue-600 font-extrabold">Mart</span>
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-[0.15em] block mt-[3px]">
                Bidding Hub
              </span>
            </div>
          </div>

          {/* MIDDLE: Desktop Navigation */}
          <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 h-full">
            <nav
              ref={desktopNavRef}
              className="relative flex items-center h-full gap-2"
              aria-label="Main navigation"
            >
              {/* Shared glass indicator — one physical element that slides */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: `translateX(${desktopIndicatorStyle.left}px) translateY(-50%)`,
                  width: desktopIndicatorStyle.width,
                  opacity: desktopIndicatorStyle.opacity,
                  height: '36px',
                  transition: prefersReducedMotion
                    ? 'opacity 200ms ease'
                    : 'transform 480ms cubic-bezier(0.2,0.8,0.2,1), width 480ms cubic-bezier(0.2,0.8,0.2,1), opacity 200ms ease',
                  zIndex: 0,
                  left: 0,
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(16px) saturate(1.8)',
                  WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 2px 12px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
                }}
                className="dark:[background:rgba(30,41,59,0.65)] dark:[border-color:rgba(255,255,255,0.1)]"
              />

              {navigationItems.map((item, index) => {
                const isActive = currentScreen === item.id;
                return (
                  <button
                    id={`nav-link-${item.id}`}
                    key={item.id}
                    ref={(el) => { desktopItemRefs.current[index] = el; }}
                    onClick={() => {
                      setCurrentScreen(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative z-10 px-4 h-9 flex items-center text-[13px] font-semibold transition-colors duration-200 cursor-pointer whitespace-nowrap rounded-[10px] ${
                      isActive
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/30 dark:hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="search-btn"
              onClick={() => setCurrentScreen('browse')}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 dark:hover:text-white rounded-xl transition-all"
              title="Search"
            >
              <Search size={20} />
            </button>

            <button
              id="fav-shortcut-btn"
              onClick={() => {
                setSearchQuery('');
                setCurrentScreen('bids');
              }}
              className="relative p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 dark:hover:text-white rounded-xl transition-all"
              title="Watchlist"
            >
              <Heart size={20} className={favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''} />
              {favoritesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
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

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700/50 mx-1 hidden sm:block" />

            <div className="relative hidden lg:block">
              <button
                id="profile-dropdown-btn"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1.5 focus:outline-hidden p-1 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-300">
                  <UserCircle size={20} />
                </span>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 py-2 transition-colors duration-300">
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
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2"
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
                        className="w-full text-left px-4 py-2 text-xs text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2"
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
                            className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${theme === value ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
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
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setCurrentScreen('listings');
                setOpenListingForm(true);
              }}
              className="hidden sm:flex items-center justify-center gap-1.5 ml-2 px-5 py-[9px] bg-blue-600 text-white text-[13px] font-bold rounded-full hover:bg-blue-700 transition-colors shadow-md"
            >
              + Create Listing
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl transition-all"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Adding a placeholder to prevent content from jumping under the fixed floating navbar */}
      <div className="h-[84px] w-full" />

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 shadow-2xl py-6 px-4 pb-12 overflow-y-auto animate-in slide-in-from-right-full duration-300">
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

            <div
              ref={mobileNavRef}
              className="relative flex flex-col gap-1.5 flex-1"
            >
              {/* Shared vertical glass indicator for mobile */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: mobileIndicatorStyle.top,
                  height: mobileIndicatorStyle.height,
                  opacity: mobileIndicatorStyle.opacity,
                  transition: prefersReducedMotion
                    ? 'opacity 200ms ease'
                    : 'top 480ms cubic-bezier(0.2,0.8,0.2,1), height 480ms cubic-bezier(0.2,0.8,0.2,1), opacity 200ms ease',
                  zIndex: 0,
                  borderRadius: '12px',
                  background: 'rgba(37,99,235,0.07)',
                  border: '1px solid rgba(37,99,235,0.12)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
                }}
                className="dark:[background:rgba(37,99,235,0.12)] dark:[border-color:rgba(37,99,235,0.2)]"
              />

              {navigationItems.map((item, index) => (
                <button
                  id={`mobile-nav-link-${item.id}`}
                  key={item.id}
                  ref={(el) => { mobileItemRefs.current[index] = el; }}
                  onClick={() => {
                    setCurrentScreen(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  aria-current={currentScreen === item.id ? 'page' : undefined}
                  className={`relative z-10 w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-colors duration-200 cursor-pointer ${
                    currentScreen === item.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}

              
              <button
                onClick={() => {
                  setCurrentScreen('listings');
                  setOpenListingForm(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-2 text-left px-4 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer bg-blue-600 text-white hover:bg-blue-700 flex justify-center items-center gap-2"
              >
                + Create Listing
              </button>
              
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
    </>
  );
};
