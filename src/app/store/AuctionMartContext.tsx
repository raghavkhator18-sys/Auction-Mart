import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockAuctions } from '@/modules/auctions/services/mockAuctions.data';
import { mockActivities } from '@/modules/dashboard/services/mockActivities.data';
import { staticUsers } from '@/modules/users/services/mockUsers.data';
import { pathToScreen, screenToPath } from '@/shared/constants/routes';
import type { AuctionItem, RecentActivity, ScreenId, UserProfile, UserRole } from '@/shared/types';
import { getToken, removeToken, getUser, removeUser } from '@/lib/authHelpers';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

interface CurrentUser {
  name: string;
  email: string;
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

interface AuctionMartContextValue {
  currentScreen: ScreenId;
  setCurrentScreen: (s: ScreenId) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Data sources
  browseAuctions: AuctionItem[];    // demo + user-created (for Browse page)
  myListings: AuctionItem[];        // user-created only (for My Listings)
  auctions: AuctionItem[];          // alias for browseAuctions (backward compat)
  activities: RecentActivity[];
  users: UserProfile[];
  favorites: string[];
  selectedProduct: AuctionItem;
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
  
  // User-created listings (persisted in SQLite)
  const [userListings, setUserListings] = useState<AuctionItem[]>([]);
  
  // User bids (persisted in SQLite)
  const [userBids, setUserBids] = useState<UserBidRecord[]>([]);

  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [users, setUsers] = useState<UserProfile[]>(staticUsers);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<AuctionItem>(mockAuctions[0]);
  const [session, setSession] = useState<any | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // ── Derived data sources ──
  // Browse Auctions = demo + user-created, with bid info merged
  const browseAuctions = useMemo(() => {
    const mergedDemo = demoAuctions.map(item => {
      const userBid = userBids.find(b => b.auction_id === item.id);
      if (userBid) {
        return {
          ...item,
          yourBid: userBid.bid_amount,
          yourMaxBid: userBid.max_bid ?? undefined,
          bidStatus: userBid.bid_status as 'winning' | 'outbid' | 'none',
        };
      }
      return item;
    });
    return [...mergedDemo, ...userListings];
  }, [demoAuctions, userListings, userBids]);

  // My Listings = only user-created
  const myListings = userListings;

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

  // ── Auth bootstrap ──
  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();
    if (token) {
      setSession({ access_token: token });
      
      let jwtName = 'User';
      let jwtEmail = token.replace('dummy-jwt-', '');
      
      if (token.split('.').length === 3) {
        try {
          const payloadBase64 = token.split('.')[1];
          const decodedJson = decodeURIComponent(escape(window.atob(payloadBase64)));
          const decoded = JSON.parse(decodedJson);
          if (decoded.name) jwtName = decoded.name;
          if (decoded.email) jwtEmail = decoded.email;
        } catch (e) {
          console.error("Failed to decode JWT:", e);
        }
      }

      const resolvedUser = storedUser
        ? { name: storedUser.name !== jwtEmail.split('@')[0] ? storedUser.name : jwtName, email: storedUser.email || jwtEmail }
        : { name: jwtName, email: jwtEmail };

      setCurrentUser(resolvedUser);
    }
    setIsAuthLoading(false);
  }, []);

  // ── Fetch user data from backend when user is known ──
  useEffect(() => {
    if (!currentUser?.email) return;

    // Fetch user's own listings
    axios.get(`${API_BASE}/auction/user/${encodeURIComponent(currentUser.email)}`)
      .then(res => {
        const dbListings: AuctionItem[] = (res.data || []).map((row: any) => ({
          id: `db-${row.id}`,
          title: row.title,
          category: row.category,
          description: row.description || '',
          sku: row.sku_reference || undefined,
          currentBid: row.starting_price,
          totalBids: 0,
          imageUrl: row.image_path ? `${API_BASE}${row.image_path}` : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEi87bMnKhFHqJ3-zB0UuV6jek8iK5RePOJRXV62pmn0yIcl4v8EvDYcm-Ly55EYUuEciZN5oWWuibLFf4Sip57Ik2O_0b75GPA3RWubAg0gKLKgrgn2zTb8dlt_zamBRtVL2N9HW1AlE_8BEJw_IWbh_hbEwUmic1hFqKY3IXbqkjTDm7iz5bbUxyfDgqThvUCty4I2ey0N8HC-ijylmRVLpJGcJHnU7QISv1-lhrS4lBidJGqCXYBqgEpkJcLyZajyJ7svbRlwr2',
          timerSeconds: row.duration || 604800,
          status: (row.status as any) || 'active',
          condition: (row.condition_status as any) || 'New',
          sellerName: row.seller_name || currentUser.name,
          sellerRating: 5.0,
          sellerSales: 0,
          sellerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJMliNAX9iwfBs5w9IqD-A5JVNLkceWMpZoXHttDLkZEn9GsuALDInSRPSVqEUs5GGYq5hJYwIMcA_AEsIR1pYOZAPxg1w-vtbzAHQcf7Xd-KYn_4reIVsYn08Nby_mysL-pYseyUnxPuL1-2-zzQyhbrw04Sh2jQ6v-ljtHCyKHj_dYb8UR3pIPlo_bG9h3PKpf9ujxJ6NbQ1Srun08ibBUmXs7jnMImhAnexk1IjdciFq59YeCsye27wK9nsIfcg4_WF-qg4uy0v',
        }));
        setUserListings(dbListings);
      })
      .catch(err => console.error("Failed to fetch user listings:", err));

    // Fetch user's bids
    axios.get(`${API_BASE}/bids/user/${encodeURIComponent(currentUser.email)}`)
      .then(res => {
        setUserBids(res.data || []);
      })
      .catch(err => console.error("Failed to fetch user bids:", err));
  }, [currentUser?.email]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }, []);

  // ── Create listing: POST to backend, then update local state ──
  const handleCreateListing = useCallback((newItem: AuctionItem) => {
    // Add to local state immediately for responsiveness
    setUserListings((prev) => [newItem, ...prev]);

    // Also persist via API (the MyListings form now handles the API call directly)
  }, []);

  const handleDeleteListing = useCallback(async (itemId: string) => {
    // Only allow deleting user-created listings (those with 'db-' prefix)
    if (!itemId.startsWith('db-')) return;
    
    // Optimistic delete
    setUserListings(prev => prev.filter(item => item.id !== itemId));

    // Persist delete
    try {
      const numericId = itemId.replace('db-', '');
      await axios.delete(`${API_BASE}/auction/${numericId}`);
    } catch (err) {
      console.error("Failed to delete listing:", err);
      // Optional: Handle error by refetching
    }
  }, []);

  // ── Place bid: POST to backend, then update local state ──
  const handlePlaceBid = useCallback((itemId: string, bidAmount: number, maxBid?: number) => {
    // Update demo auctions if it's a demo item
    setDemoAuctions((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            currentBid: bidAmount,
            yourBid: bidAmount,
            yourMaxBid: maxBid || item.yourMaxBid,
            totalBids: item.totalBids + 1,
            bidStatus: 'winning' as const
          };
        }
        return item;
      })
    );

    // Update user listings if it's a user item
    setUserListings((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            currentBid: bidAmount,
            yourBid: bidAmount,
            yourMaxBid: maxBid || item.yourMaxBid,
            totalBids: item.totalBids + 1,
            bidStatus: 'winning' as const
          };
        }
        return item;
      })
    );

    // Persist bid to backend
    if (currentUser) {
      axios.post(`${API_BASE}/bids/place`, {
        auction_id: itemId,
        user_email: currentUser.email,
        user_name: currentUser.name,
        bid_amount: bidAmount,
        max_bid: maxBid || null
      })
      .then(res => {
        // Update local bids state
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
      })
      .catch(err => console.error("Failed to persist bid:", err));
    }

    // Add activity
    setActivities((prevActivities) => {
      const allItems = [...demoAuctions, ...userListings];
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
  }, [currentUser, demoAuctions, userListings]);

  const handleBidIncrease = useCallback((itemId: string, newAmount: number) => {
    // Update demo auctions
    setDemoAuctions((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            currentBid: newAmount,
            yourBid: newAmount,
            totalBids: item.totalBids + 1,
            bidStatus: 'winning' as const
          };
        }
        return item;
      })
    );

    // Update user listings
    setUserListings((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            currentBid: newAmount,
            yourBid: newAmount,
            totalBids: item.totalBids + 1,
            bidStatus: 'winning' as const
          };
        }
        return item;
      })
    );

    // Persist bid
    if (currentUser) {
      axios.post(`${API_BASE}/bids/place`, {
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
      })
      .catch(err => console.error("Failed to persist bid increase:", err));
    }

    setActivities((prevActivities) => {
      const allItems = [...demoAuctions, ...userListings];
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
  }, [currentUser, demoAuctions, userListings]);

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
    setSession({ access_token: 'dummy-jwt-' + email });
  }, []);

  const logout = useCallback(async () => {
    removeToken();
    removeUser();
    setCurrentUser(null);
    setSession(null);
    setUserListings([]);
    setUserBids([]);
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
