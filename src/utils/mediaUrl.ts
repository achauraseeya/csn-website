/**
 * Media URL utility helper for Google Drive, YouTube, and direct media URLs.
 * Works seamlessly with Google Drive share links, YouTube links, mp4/webm, and image hosting services.
 */

export interface ParsedMediaUrl {
  formattedUrl: string;
  isEmbed: boolean;
  type: 'photo' | 'video';
  originalUrl: string;
}

/**
 * Extracts a Google Drive file ID from various Drive URL formats:
 * - https://drive.google.com/file/d/1A2B3C4D5E/view?usp=sharing
 * - https://drive.google.com/open?id=1A2B3C4D5E
 * - https://drive.google.com/uc?id=1A2B3C4D5E
 * - https://lh3.googleusercontent.com/d/1A2B3C4D5E
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const matchFileD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  const matchLh3 = url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (matchLh3 && matchLh3[1]) return matchLh3[1];

  const matchIdParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  return null;
}

/**
 * Extracts a Google Drive Folder ID from folder URLs:
 * - https://drive.google.com/drive/folders/1A2B3C4D5E
 * - https://drive.google.com/drive/u/0/folders/1A2B3C4D5E
 */
export function extractGoogleDriveFolderId(url: string): string | null {
  if (!url) return null;
  const matchFolder = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (matchFolder && matchFolder[1]) return matchFolder[1];

  const matchFolderParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchFolderParam && matchFolderParam[1] && url.includes('folders')) return matchFolderParam[1];

  return null;
}

export function getGoogleDriveFolderEmbedUrl(folderId: string): string {
  return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
}

export function getGoogleDriveFolderViewUrl(folderId: string): string {
  return `https://drive.google.com/drive/folders/${folderId}`;
}

/**
 * Helper to convert any Google Drive file ID or URL into a clean direct CDN image URL
 */
export function formatDriveImageUrl(urlOrId: string): string {
  const fileId = extractGoogleDriveId(urlOrId) || urlOrId.trim();
  if (fileId && fileId.length > 10 && !fileId.startsWith('http')) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return urlOrId;
}

/**
 * Parses a block of text containing multiple URLs or comma/line separated Google Drive links or YouTube links
 */
export function parseMultipleMediaLinks(text: string): Array<{ url: string; type: 'photo' | 'video' }> {
  if (!text) return [];
  const lines = text.split(/[\n,\s]+/).map(s => s.trim()).filter(Boolean);
  
  return lines.map(line => {
    const isYt = extractYouTubeId(line);
    const isVid = isYt || /\.(mp4|webm|ogg|m4v)($|\?)/i.test(line);
    return {
      url: line,
      type: isVid ? 'video' : 'photo'
    };
  });
}

/**
 * Extracts a YouTube Video ID from standard YouTube URLs:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const matchWatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (matchWatch && matchWatch[1]) return matchWatch[1];
  return null;
}

/**
 * Processes a raw media URL (Google Drive, YouTube, CDN link) and produces
 * a ready-to-render image source or video embed/source URL.
 */
export function parseMediaUrl(url: string, mediaType: 'photo' | 'video'): ParsedMediaUrl {
  if (!url) {
    return {
      formattedUrl: '',
      isEmbed: false,
      type: mediaType,
      originalUrl: url,
    };
  }

  // 0. Google Drive Folder URL check
  const folderId = extractGoogleDriveFolderId(url);
  if (folderId) {
    return {
      formattedUrl: `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
      isEmbed: true,
      type: 'photo',
      originalUrl: url,
    };
  }

  // 1. Google Drive URL check
  const driveId = extractGoogleDriveId(url);
  if (driveId) {
    if (mediaType === 'video') {
      return {
        formattedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
        isEmbed: true,
        type: 'video',
        originalUrl: url,
      };
    } else {
      // Photo on Google Drive: Use Google Content CDN for fast high-res rendering
      return {
        formattedUrl: `https://lh3.googleusercontent.com/d/${driveId}`,
        isEmbed: false,
        type: 'photo',
        originalUrl: url,
      };
    }
  }

  // 2. YouTube URL check
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return {
      formattedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`,
      isEmbed: true,
      type: 'video',
      originalUrl: url,
    };
  }

  // 3. Direct video file extensions or iframe embeds
  const isDirectVideo = /\.(mp4|webm|ogg|m4v)($|\?)/i.test(url);
  const isEmbedIframe = url.includes('embed') || url.includes('player.');

  return {
    formattedUrl: url,
    isEmbed: isEmbedIframe || (mediaType === 'video' && !isDirectVideo && !url.endsWith('.mp4')),
    type: mediaType,
    originalUrl: url,
  };
}
