import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockAuctions } from '@/modules/auctions/services/mockAuctions.data';
import { mockActivities } from '@/modules/dashboard/services/mockActivities.data';
import { staticUsers } from '@/modules/users/services/mockUsers.data';
import { pathToScreen, screenToPath } from '@/shared/constants/routes';
import type { AuctionItem, RecentActivity, ScreenId, UserProfile, UserRole } from '@/shared/types';
import api from '@/lib/axios';
import { supabase } from '@/lib/supabase';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface CurrentUser {
  name: string;
  email: string;
  avatar?: string;
}

// Shape of a bid row returned by the backend
interface UserBidRecord {
  id: number;
  auction_id: string;
  user_email: string;
  user_name: string | null;
  bid_amount: number;
  max_bid: number | null;
  bid_status: string;
  created_at: string;
}

// Shape of a highest-bid aggregate row
interface HighestBidRecord {
  auction_id: string;
  highest_bid: number;
  highest_bidder_email: string;
  highest_bidder_name: string | null;
  total_bids: number;
}

interface AuctionMartContextValue {
  currentScreen: ScreenId;
  setCurrentScreen: (s: ScreenId) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Data sources
  browseAuctions: AuctionItem[];    // demo + ALL user-created (for Browse page)
  myListings: AuctionItem[];        // current user's listings only (for My Listings)
  auctions: AuctionItem[];          // alias for browseAuctions (backward compat)
  activities: RecentActivity[];
  users: UserProfile[];
  favorites: string[];
  selectedProduct: AuctionItem | null;
  currentUser: CurrentUser | null;
  userBids: UserBidRecord[];
  // Actions
  toggleFavorite: (id: string) => void;
  handleCreateListing: (newItem: AuctionItem) => void;
  handleDeleteListing: (itemId: string) => void;
  handlePlaceBid: (itemId: string, bidAmount: number, maxBid?: number) => void;
  handleBidIncrease: (itemId: string, newAmount: number) => void;
  handleClearFlag: (id: string) => void;
  handleModifyUserStatus: (email: string, status: 'Verified' | 'Standard' | 'Flagged') => void;
  setSelectedProduct: (item: AuctionItem) => void;
  triggerBiddingWar: () => void;
  session: any | null;
  isAuthLoading: boolean;
  handleSignInSuccess: (name: string, email: string) => void;
  logout: () => Promise<void>;
}

const AuctionMartContext = createContext<AuctionMartContextValue | null>(null);

export const AuctionMartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentScreen, setCurrentScreenState] = useState<ScreenId>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('client');
  const [searchQuery, setSearchQuery] = useState('');

  // Demo data (read-only baseline)
  const [demoAuctions, setDemoAuctions] = useState<AuctionItem[]>(mockAuctions);

  // ALL user-created listings from every seller (persisted in SQLite)
  const [allDbListings, setAllDbListings] = useState<AuctionItem[]>([]);

  // User bids (persisted in SQLite)
  const [userBids, setUserBids] = useState<UserBidRecord[]>([]);

  // Highest bid aggregates per auction (persisted in SQLite)
  const [highestBids, setHighestBids] = useState<HighestBidRecord[]>([]);

  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [users, setUsers] = useState<UserProfile[]>(staticUsers);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<AuctionItem | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (currentUser?.email) {
      const saved = localStorage.getItem(`auctionmart_watchlist_${currentUser.email}`);
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch(e) {}
      }
    } else {
      setFavorites([]);
    }
  }, [currentUser?.email]);

  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(`auctionmart_watchlist_${currentUser.email}`, JSON.stringify(favorites));
    }
  }, [favorites, currentUser?.email]);

  // ── Helper: map a DB row to AuctionItem ──
  const mapDbRowToAuctionItem = useCallback((row: any): AuctionItem => ({
    id: `db-${row.id}`,
    title: row.title,
    category: row.category,
    description: row.description || '',
    sku: row.sku_reference || undefined,
    currentBid: row.starting_price,
    totalBids: 0,
    imageUrl: row.image_path
      ? row.image_path.split(',').map((p: string) => `${API_BASE}${p.trim()}`)[0]
      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEi87bMnKhFHqJ3-zB0UuV6jek8iK5RePOJRXV62pmn0yIcl4v8EvDYcm-Ly55EYUuEciZN5oWWuibLFf4Sip57Ik2O_0b75GPA3RWubAg0gKLKgrgn2zTb8dlt_zamBRtVL2N9HW1AlE_8BEJw_IWbh_hbEwUmic1hFqKY3IXbqkjTDm7iz5bbUxyfDgqThvUCty4I2ey0N8HC-ijylmRVLpJGcJHnU7QISv1-lhrS4lBidJGqCXYBqgEpkJcLyZajyJ7svbRlwr2',
    imageUrls: row.image_path
      ? row.image_path.split(',').map((p: string) => `${API_BASE}${p.trim()}`)
      : [],
    timerSeconds: row.duration || 604800,
    status: (row.status as any) || 'active',
    condition: (row.condition_status as any) || 'New',
    sellerName: row.seller_name || row.seller_email?.split('@')[0] || 'Seller',
    sellerRating: 5.0,
    sellerSales: 0,
    sellerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJMliNAX9iwfBs5w9IqD-A5JVNLkceWMpZoXHttDLkZEn9GsuALDInSRPSVqEUs5GGYq5hJYwIMcA_AEsIR1pYOZAPxg1w-vtbzAHQcf7Xd-KYn_4reIVsYn08Nby_mysL-pYseyUnxPuL1-2-zzQyhbrw04Sh2jQ6v-ljtHCyKHj_dYb8UR3pIPlo_bG9h3PKpf9ujxJ6NbQ1Srun08ibBUmXs7jnMImhAnexk1IjdciFq59YeCsye27wK9nsIfcg4_WF-qg4uy0v',
  }), []);

  // ── Derived data sources ──
  // Browse Auctions = demo + ALL DB listings, with highest-bid data merged
  const browseAuctions = useMemo(() => {
    // Build a lookup of highest bids by auction_id
    const bidLookup: Record<string, HighestBidRecord> = {};
    highestBids.forEach(hb => { bidLookup[hb.auction_id] = hb; });

    const mergedDemo = demoAuctions.map(item => {
      const hb = bidLookup[item.id];
      const userBid = userBids.find(b => b.auction_id === item.id);

      return {
        ...item,
        // If bids exist in DB, use the highest bid as currentBid
        currentBid: hb ? hb.highest_bid : item.currentBid,
        totalBids: hb ? hb.total_bids : item.totalBids,
        // User's own bid info
        ...(userBid ? {
          yourBid: userBid.bid_amount,
          yourMaxBid: userBid.max_bid ?? undefined,
          bidStatus: userBid.bid_status as 'winning' | 'outbid' | 'none',
        } : {}),
      };
    });

    const mergedDb = allDbListings.map(item => {
      const hb = bidLookup[item.id];
      const userBid = userBids.find(b => b.auction_id === item.id);

      return {
        ...item,
        currentBid: hb ? hb.highest_bid : item.currentBid,
        totalBids: hb ? hb.total_bids : item.totalBids,
        ...(userBid ? {
          yourBid: userBid.bid_amount,
          yourMaxBid: userBid.max_bid ?? undefined,
          bidStatus: userBid.bid_status as 'winning' | 'outbid' | 'none',
        } : {}),
      };
    });

    return [...mergedDemo, ...mergedDb];
  }, [demoAuctions, allDbListings, highestBids, userBids]);

  // My Listings = DB listings filtered to the current user
  const myListings = useMemo(() => {
    if (!currentUser?.email) return [];
    return browseAuctions.filter(item => (item as any)._sellerEmail === currentUser.email);
  }, [browseAuctions, currentUser?.email]);

  // Backward compat alias
  const auctions = browseAuctions;

  const setCurrentScreen = useCallback(
    (s: ScreenId) => {
      setCurrentScreenState(s);
      const p = screenToPath(s);
      if (location.pathname !== p) navigate(p);
    },
    [location.pathname, navigate]
  );

  useEffect(() => {
    const s = pathToScreen(location.pathname);
    setCurrentScreenState(s);
  }, [location.pathname]);

  const resolveSupabaseUser = useCallback((user: any): CurrentUser | null => {
    if (!user?.email) return null;

    return {
      name: user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0],
      email: user.email,
      avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || user.user_metadata?.avatar
    };
  }, []);

  // ── Auth bootstrap ──
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;

      setSession(data.session);
      setCurrentUser(resolveSupabaseUser(data.session?.user));
      setIsAuthLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setCurrentUser(resolveSupabaseUser(newSession?.user));
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [resolveSupabaseUser]);

  // ── Helper: refresh highest bids from backend ──
  const refreshHighestBids = useCallback(() => {
    api.get('/bids/highest')
      .then(res => setHighestBids(res.data || []))
      .catch(err => console.error("Failed to fetch highest bids:", err));
  }, []);

  // ── Fetch ALL data from backend when user is known ──
  useEffect(() => {
    if (!currentUser?.email) return;

    // Fetch ALL listings from all sellers (for Browse page cross-account visibility)
    api.get('/auction/all')
      .then(res => {
        const dbListings: AuctionItem[] = (res.data || []).map((row: any) => ({
          ...mapDbRowToAuctionItem(row),
          _sellerEmail: row.seller_email, // stash for filtering myListings
        }));
        setAllDbListings(dbListings);
      })
      .catch(err => console.error("Failed to fetch all listings:", err));

    // Fetch user's bids
    api.get(`/bids/user/${encodeURIComponent(currentUser.email)}`)
      .then(res => {
        setUserBids(res.data || []);
      })
      .catch(err => console.error("Failed to fetch user bids:", err));

    // Fetch highest bids
    refreshHighestBids();
  }, [currentUser?.email, mapDbRowToAuctionItem, refreshHighestBids]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }, []);

  // ── Create listing: POST to backend, then update local state ──
  const handleCreateListing = useCallback((newItem: AuctionItem) => {
    // Add to local allDbListings state immediately for responsiveness
    setAllDbListings((prev) => [newItem, ...prev]);

    // Also persist via API (the MyListings form now handles the API call directly)
  }, []);

  const handleDeleteListing = useCallback(async (itemId: string) => {
    // Only allow deleting user-created listings (those with 'db-' prefix)
    if (!itemId.startsWith('db-')) return;

    // Optimistic delete
    setAllDbListings(prev => prev.filter(item => item.id !== itemId));

    // Persist delete
    try {
      const numericId = itemId.replace('db-', '');
      await api.delete(`/auction/${numericId}`);
    } catch (err) {
      console.error("Failed to delete listing:", err);
    }
  }, []);

  // ── Place bid: POST to backend, then refresh highest bids ──
  const handlePlaceBid = useCallback((itemId: string, bidAmount: number, maxBid?: number) => {
    // Persist bid to backend FIRST, then refresh
    if (currentUser) {
      // Optimistic update
      setHighestBids(prev => {
        const existing = prev.find(h => h.auction_id === itemId);
        const others = prev.filter(h => h.auction_id !== itemId);
        return [...others, {
          auction_id: itemId,
          highest_bid: Math.max(existing?.highest_bid || 0, bidAmount),
          highest_bidder_email: currentUser.email,
          highest_bidder_name: currentUser.name,
          total_bids: (existing?.total_bids || 0) + 1
        }];
      });

      api.post(`/bids/place`, {
        auction_id: itemId,
        user_email: currentUser.email,
        user_name: currentUser.name,
        bid_amount: bidAmount,
        max_bid: maxBid || null
      })
        .then(res => {
          // Update local user-bids state
          setUserBids(prev => {
            const filtered = prev.filter(b => b.auction_id !== itemId);
            return [...filtered, {
              id: res.data.bidId,
              auction_id: itemId,
              user_email: currentUser.email,
              user_name: currentUser.name,
              bid_amount: bidAmount,
              max_bid: maxBid || null,
              bid_status: 'winning',
              created_at: new Date().toISOString()
            }];
          });

          // Refresh highest bids so ALL views update
          refreshHighestBids();
        })
        .catch(err => {
          console.error("Failed to persist bid:", err);
          refreshHighestBids(); // revert optimistic update
        });
    }

    // Add activity
    setActivities((prevActivities) => {
      const allItems = [...demoAuctions, ...allDbListings];
      const item = allItems.find((a) => a.id === itemId);
      if (!item) return prevActivities;
      const newAct: RecentActivity = {
        id: `act-${Date.now()}`,
        type: 'bid_placed',
        title: item.title,
        timeAgo: 'Just now',
        amount: bidAmount,
        thumbnail: item.imageUrl,
        statusText: 'Leading',
        statusType: 'leading'
      };
      return [newAct, ...prevActivities];
    });
  }, [currentUser, demoAuctions, allDbListings, refreshHighestBids]);

  const handleBidIncrease = useCallback((itemId: string, newAmount: number) => {
    // Persist bid
    if (currentUser) {
      // Optimistic update
      setHighestBids(prev => {
        const existing = prev.find(h => h.auction_id === itemId);
        const others = prev.filter(h => h.auction_id !== itemId);
        return [...others, {
          auction_id: itemId,
          highest_bid: Math.max(existing?.highest_bid || 0, newAmount),
          highest_bidder_email: currentUser.email,
          highest_bidder_name: currentUser.name,
          total_bids: (existing?.total_bids || 0) + 1
        }];
      });

      api.post(`/bids/place`, {
        auction_id: itemId,
        user_email: currentUser.email,
        user_name: currentUser.name,
        bid_amount: newAmount,
      })
        .then(res => {
          setUserBids(prev => {
            const filtered = prev.filter(b => b.auction_id !== itemId);
            return [...filtered, {
              id: res.data.bidId,
              auction_id: itemId,
              user_email: currentUser.email,
              user_name: currentUser.name,
              bid_amount: newAmount,
              max_bid: null,
              bid_status: 'winning',
              created_at: new Date().toISOString()
            }];
          });

          // Refresh highest bids so ALL views update
          refreshHighestBids();
        })
        .catch(err => {
          console.error("Failed to persist bid increase:", err);
          refreshHighestBids(); // revert optimistic update
        });
    }

    setActivities((prevActivities) => {
      const allItems = [...demoAuctions, ...allDbListings];
      const item = allItems.find((a) => a.id === itemId);
      if (!item) return prevActivities;
      const newAct: RecentActivity = {
        id: `act-${Date.now()}`,
        type: 'bid_placed',
        title: item.title,
        timeAgo: 'Just now',
        amount: newAmount,
        thumbnail: item.imageUrl,
        statusText: 'Leading',
        statusType: 'leading'
      };
      return [newAct, ...prevActivities];
    });
  }, [currentUser, demoAuctions, allDbListings, refreshHighestBids]);

  const handleClearFlag = useCallback((id: string) => {
    setDemoAuctions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, status: 'active' as const };
        }
        return item;
      })
    );
  }, []);

  const handleModifyUserStatus = useCallback(
    (email: string, status: 'Verified' | 'Standard' | 'Flagged') => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.email === email) {
            return { ...u, status };
          }
          return u;
        })
      );
    },
    []
  );

  const handleSignInSuccess = useCallback((name: string, email: string) => {
    setCurrentUser({ name, email });
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setSession(null);
    setAllDbListings([]);
    setUserBids([]);
    setHighestBids([]);
    setActivities([]);
    setFavorites([]);
    // Reset demo auctions to original state
    setDemoAuctions(mockAuctions);
    navigate('/auth');
  }, [navigate]);

  const triggerBiddingWar = useCallback(() => {
    const daytonaObj = demoAuctions.find((a) => a.id === 'daytona');
    if (!daytonaObj) return;

    const competitorOffer = daytonaObj.currentBid + Math.ceil(daytonaObj.currentBid * 0.08);

    setDemoAuctions((prev) =>
      prev.map((item) => {
        if (item.id === 'daytona') {
          return {
            ...item,
            currentBid: competitorOffer,
            totalBids: item.totalBids + 1,
            bidStatus: 'outbid' as const
          };
        }
        return item;
      })
    );

    setActivities((prevActivities) => {
      const rAct: RecentActivity = {
        id: `war-${Date.now()}`,
        type: 'ended_lost',
        title: 'Rolex Cosmograph Daytona 116500',
        timeAgo: 'Just now',
        amount: competitorOffer,
        thumbnail: daytonaObj.imageUrl,
        statusText: 'Outbid',
        statusType: 'outbid'
      };
      return [rAct, ...prevActivities];
    });

    alert(
      `Bidding War Alert! Michael Kross raises bid to ₹${competitorOffer.toLocaleString()}! Your status on the Rolex Daytona is now OUTBID. Raise your bid in My Bids!`
    );
  }, [demoAuctions]);

  const value = useMemo(
    () => ({
      currentScreen,
      setCurrentScreen,
      currentRole,
      setCurrentRole,
      searchQuery,
      setSearchQuery,
      browseAuctions,
      myListings,
      auctions,
      activities,
      users,
      favorites,
      selectedProduct,
      currentUser,
      userBids,
      toggleFavorite,
      handleCreateListing,
      handleDeleteListing,
      handlePlaceBid,
      handleBidIncrease,
      handleClearFlag,
      handleModifyUserStatus,
      setSelectedProduct,
      triggerBiddingWar,
      session,
      isAuthLoading,
      handleSignInSuccess,
      logout
    }),
    [
      currentScreen,
      setCurrentScreen,
      currentRole,
      searchQuery,
      browseAuctions,
      myListings,
      auctions,
      activities,
      users,
      favorites,
      selectedProduct,
      currentUser,
      userBids,
      toggleFavorite,
      handleCreateListing,
      handleDeleteListing,
      handlePlaceBid,
      handleBidIncrease,
      handleClearFlag,
      handleModifyUserStatus,
      triggerBiddingWar,
      session,
      isAuthLoading,
      handleSignInSuccess,
      logout
    ]
  );

  return <AuctionMartContext.Provider value={value}>{children}</AuctionMartContext.Provider>;
};

export const useAuctionMart = (): AuctionMartContextValue => {
  const ctx = useContext(AuctionMartContext);
  if (!ctx) {
    throw new Error('useAuctionMart must be used within AuctionMartProvider');
  }
  return ctx;
};
