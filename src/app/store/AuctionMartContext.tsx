// If you delete this file:

//❌ Auctions won't load
//❌ Favorites won't work
//❌ Bidding won't work
//❌ User login state won't work
//❌ Navigation state won't sync
//❌ Admin actions won't work

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockAuctions } from '@/modules/auctions/services/mockAuctions.data';
import { mockActivities } from '@/modules/analytics/services/mockActivities.data';
import { staticUsers } from '@/modules/users/services/mockUsers.data';
import { pathToScreen, screenToPath } from '@/shared/constants/routes';
import type { AuctionItem, RecentActivity, ScreenId, UserProfile, UserRole } from '@/shared/types';
import { getToken, removeToken, getUser, removeUser } from '@/lib/authHelpers';

interface CurrentUser {
  name: string;
  email: string;
}

interface AuctionMartContextValue {
  currentScreen: ScreenId;
  setCurrentScreen: (s: ScreenId) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  auctions: AuctionItem[];
  activities: RecentActivity[];
  users: UserProfile[];
  favorites: string[];
  selectedProduct: AuctionItem;
  currentUser: CurrentUser | null;
  toggleFavorite: (id: string) => void;
  handleCreateListing: (newItem: AuctionItem) => void;
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
  const [auctions, setAuctions] = useState<AuctionItem[]>(mockAuctions);
  const [activities, setActivities] = useState<RecentActivity[]>(mockActivities);
  const [users, setUsers] = useState<UserProfile[]>(staticUsers);
  const [favorites, setFavorites] = useState<string[]>(['daytona', 'birkin']);
  const [selectedProduct, setSelectedProduct] = useState<AuctionItem>(mockAuctions[0]);
  const [session, setSession] = useState<any | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

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

  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();
    if (token) {
      setSession({ access_token: token });
      
      let jwtName = 'User';
      let jwtEmail = token.replace('dummy-jwt-', '');
      
      // Attempt to decode the JWT token to extract name and email
      if (token.split('.').length === 3) {
        try {
          const payloadBase64 = token.split('.')[1];
          // use decodeURIComponent(escape(window.atob(...))) to handle unicode safely
          const decodedJson = decodeURIComponent(escape(window.atob(payloadBase64)));
          const decoded = JSON.parse(decodedJson);
          if (decoded.name) jwtName = decoded.name;
          if (decoded.email) jwtEmail = decoded.email;
        } catch (e) {
          console.error("Failed to decode JWT:", e);
        }
      }

      if (storedUser) {
        // If storedUser exists, we can still override it if it has fallback name but JWT has real name
        setCurrentUser({ 
          name: storedUser.name !== jwtEmail.split('@')[0] ? storedUser.name : jwtName, 
          email: storedUser.email || jwtEmail 
        });
      } else {
        setCurrentUser({ name: jwtName, email: jwtEmail });
      }
    }
    setIsAuthLoading(false);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }, []);

  const handleCreateListing = useCallback((newItem: AuctionItem) => {
    setAuctions((prev) => [newItem, ...prev]);
  }, []);

  const handlePlaceBid = useCallback((itemId: string, bidAmount: number, maxBid?: number) => {
    setAuctions((prev) =>
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

    setActivities((prevActivities) => {
      const item = auctions.find((a) => a.id === itemId);
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
  }, [auctions]);

  const handleBidIncrease = useCallback((itemId: string, newAmount: number) => {
    setAuctions((prev) =>
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

    setActivities((prevActivities) => {
      const item = auctions.find((a) => a.id === itemId);
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
  }, [auctions]);

  const handleClearFlag = useCallback((id: string) => {
    setAuctions((prev) =>
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
    navigate('/auth');
  }, [navigate]);

  const triggerBiddingWar = useCallback(() => {
    const daytonaObj = auctions.find((a) => a.id === 'daytona');
    if (!daytonaObj) return;

    const competitorOffer = daytonaObj.currentBid + Math.ceil(daytonaObj.currentBid * 0.08);

    setAuctions((prev) =>
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
      `Bidding War Alert! Michael Kross raises bid to $${competitorOffer.toLocaleString()}! Your status on the Rolex Daytona is now OUTBID. Raise your bid in My Bids!`
    );
  }, [auctions]);

  const value = useMemo(
    () => ({
      currentScreen,
      setCurrentScreen,
      currentRole,
      setCurrentRole,
      searchQuery,
      setSearchQuery,
      auctions,
      activities,
      users,
      favorites,
      selectedProduct,
      currentUser,
      toggleFavorite,
      handleCreateListing,
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
      auctions,
      activities,
      users,
      favorites,
      selectedProduct,
      currentUser,
      toggleFavorite,
      handleCreateListing,
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
