import { AuctionItem } from '@/shared/types';

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Parse the imageUrl field into an array of fully-qualified URLs.
 *
 * DB rows store comma-separated relative paths like "/uploads/a.jpg,/uploads/b.jpg".
 * Demo items store a single absolute URL.
 *
 * This helper normalises both cases into a string[].
 */
export function getImageArray(item: AuctionItem): string[] {
  if (!item.imageUrl) return [];

  const isUserCreated = item.id.startsWith('db-');

  if (isUserCreated) {
    // User-uploaded images: comma-separated relative paths
    return item.imageUrl
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => (p.startsWith('http') ? p : `${API_URL}${p}`));
  }

  // Demo items: single absolute URL
  return [item.imageUrl];
}

/**
 * Return only the first image URL — used for thumbnails in cards and tables.
 */
export function getFirstImage(item: AuctionItem): string {
  const arr = getImageArray(item);
  return arr.length > 0 ? arr[0] : '';
}
