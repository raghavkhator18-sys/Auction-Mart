import type { ScreenId } from '@/shared/types';

export const screenToPath = (s: ScreenId): string => {
  switch (s) {
    case 'home':
      return '/';
    case 'browse':
      return '/browse-auctions';
    case 'dashboard':
      return '/dashboard';
    case 'listings':
      return '/my-listings';
    case 'bids':
      return '/my-bids';
    case 'product-detail':
      return '/browse-auctions';
    case 'admin':
      return '/admin';
    case 'auth':
      return '/auth';
    default:
      return '/';
  }
};

export const pathToScreen = (path: string): ScreenId => {
  if (path === '/' || path === '') return 'home';
  if (path.startsWith('/browse-auctions') || path.startsWith('/browse')) return 'browse';
  if (path.startsWith('/dashboard')) return 'dashboard';
  if (path.startsWith('/my-listings') || path.startsWith('/listings')) return 'listings';
  if (path.startsWith('/my-bids') || path.startsWith('/bids')) return 'bids';
  if (path.startsWith('/product/') || path.startsWith('/product-detail')) return 'product-detail';
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/auth')) return 'auth';
  return 'home';
};
