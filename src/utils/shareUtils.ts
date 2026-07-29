import { Language } from '../types';

export type ShareableType = 'post' | 'album' | 'notice' | 'event' | 'news' | 'member' | 'network';

/**
 * Generates a clean, separate deep-link URL for specific posts, notices, events, etc.
 */
export function getShareUrl(type: ShareableType, id: string): string {
  const origin = window.location.origin + window.location.pathname;
  const cleanId = encodeURIComponent(id);

  if (type === 'post' || type === 'album') {
    return `${origin}?post=${cleanId}`;
  }
  if (type === 'notice') {
    return `${origin}?notice=${cleanId}`;
  }
  if (type === 'event') {
    return `${origin}?event=${cleanId}`;
  }
  if (type === 'news') {
    return `${origin}?news=${cleanId}`;
  }
  if (type === 'member') {
    return `${origin}?member=${cleanId}`;
  }
  if (type === 'network') {
    return `${origin}?network=${cleanId}`;
  }

  return origin;
}

/**
 * Detects if a title string looks like a raw filename (e.g. IMG_123.jpg, cdo.png, 1ttMPCthjxnK.jpg)
 */
export function isFileName(titleStr: string): boolean {
  if (!titleStr) return true;
  const trimmed = titleStr.trim();
  const lower = trimmed.toLowerCase();

  // Has common file extension
  if (/\.(jpg|jpeg|png|webp|gif|heic|mp4|mov|avi|svg)$/i.test(lower)) return true;
  
  // Camera file defaults like IMG_001, DSC_002, photo_1
  if (/^(img|dsc|photo|pic|image|frame|video|media|cover|file|thumbnail)[_-\d]/i.test(lower)) return true;
  
  // Raw drive file ID string (20+ random alphanumerics with dash/underscore)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return true;

  return false;
}

/**
 * Returns a clean, human-readable media title instead of displaying raw filenames in sliders/galleries.
 */
export function getCleanMediaTitle(
  itemTitle: string,
  albumTitle: string,
  index: number,
  totalItems: number,
  lang: Language
): string {
  if (!itemTitle || isFileName(itemTitle)) {
    if (albumTitle) {
      return totalItems > 1
        ? `${albumTitle} (${lang === 'en' ? 'Photo' : 'फोटो'} ${index + 1})`
        : albumTitle;
    }
    return lang === 'en' ? `Photo ${index + 1}` : `फोटो ${index + 1}`;
  }
  return itemTitle;
}
