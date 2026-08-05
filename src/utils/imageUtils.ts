// Global memory cache to eliminate repeat canvas background removal calculations
const imageCleanCache = new Map<string, string>();

/**
 * Synchronously retrieves cached clean transparent image if available in memory or sessionStorage
 */
export function getCachedCleanImage(imageSrc: string, threshold = 195, maxDimension = 300): string | null {
  if (!imageSrc) return null;
  if (imageSrc.startsWith('data:image/png;base64,')) return imageSrc;
  const cacheKey = `clean_logo_${threshold}_${maxDimension}_${imageSrc.slice(-120)}`;
  if (imageCleanCache.has(cacheKey)) {
    return imageCleanCache.get(cacheKey)!;
  }
  try {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(cacheKey);
      if (stored) {
        imageCleanCache.set(cacheKey, stored);
        return stored;
      }
    }
  } catch (e) {}
  return null;
}

/**
 * Helper to process an image, scale it to optimal header logo dimensions (max ~300px),
 * convert white/near-white/corner background pixels to transparent PNG data URL (~10 KB).
 * Used for admin logo uploads and automatic background stripping.
 */
export function removeImageWhiteBackground(imageSrc: string, threshold = 195, maxDimension = 300): Promise<string> {
  return new Promise((resolve) => {
    if (!imageSrc) {
      resolve(imageSrc);
      return;
    }

    const cacheKey = `clean_logo_${threshold}_${maxDimension}_${imageSrc.slice(-120)}`;
    if (imageCleanCache.has(cacheKey)) {
      resolve(imageCleanCache.get(cacheKey)!);
      return;
    }

    try {
      const stored = typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
      if (stored) {
        imageCleanCache.set(cacheKey, stored);
        resolve(stored);
        return;
      }
    } catch (e) {}

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        // Calculate scaled dimensions for a crisp logo with tiny compressed footprint (~10 KB)
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        // Draw scaled image
        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Sample 4 corner pixels to detect the image background color
        const cornerIndices = [
          0, // top-left
          (width - 1) * 4, // top-right
          (height - 1) * width * 4, // bottom-left
          ((height - 1) * width + (width - 1)) * 4 // bottom-right
        ];

        let avgR = 0, avgG = 0, avgB = 0, validCorners = 0;
        cornerIndices.forEach(idx => {
          if (idx >= 0 && idx < data.length - 3) {
            avgR += data[idx];
            avgG += data[idx + 1];
            avgB += data[idx + 2];
            validCorners++;
          }
        });

        if (validCorners > 0) {
          avgR = Math.round(avgR / validCorners);
          avgG = Math.round(avgG / validCorners);
          avgB = Math.round(avgB / validCorners);
        } else {
          avgR = 255; avgG = 255; avgB = 255;
        }

        // Determine if corner background is light/white (average RGB > 150)
        const isLightBg = (avgR + avgG + avgB) / 3 > 150;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a === 0) continue;

          const lightness = (r + g + b) / 3;

          if (isLightBg) {
            const colorDist = Math.sqrt((r - avgR) ** 2 + (g - avgG) ** 2 + (b - avgB) ** 2);

            // Strip pure/near white or pixels matching corner background color
            if (lightness >= 195 || colorDist < 65 || (r >= 180 && g >= 180 && b >= 180)) {
              data[i + 3] = 0; // 100% transparent
            } else if (lightness >= 165 || colorDist < 90) {
              // Smooth feathering transition for edge anti-aliasing
              const alphaFactor = Math.max(0, (195 - lightness) / 30);
              data[i + 3] = Math.round(a * alphaFactor);
            }
          } else {
            // General white pixel removal fallback
            if (r >= threshold && g >= threshold && b >= threshold) {
              data[i + 3] = 0;
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const transparentDataUrl = canvas.toDataURL('image/png');
        imageCleanCache.set(cacheKey, transparentDataUrl);
        try {
          if (typeof window !== 'undefined') sessionStorage.setItem(cacheKey, transparentDataUrl);
        } catch (e) {}
        resolve(transparentDataUrl);
      } catch (e) {
        console.warn('Image transparency processing fallback:', e);
        resolve(imageSrc);
      }
    };
    img.onerror = () => {
      resolve(imageSrc);
    };
    img.src = imageSrc;
  });
}

/**
 * Utility to compress uploaded images to compressed base64 JPEG data URL for local/Firestore storage
 */
export function compressImageToBase64(file: File, maxWidth = 1000, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
