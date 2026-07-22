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
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const matchFileD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  const matchIdParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  return null;
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
