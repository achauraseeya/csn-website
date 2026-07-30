export async function compressImageToBase64(file: File, maxSizeKB: number = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        const aspectRatio = width / height;

        // Adaptive max dimension for compact base64 size
        const MAX_DIMENSION = maxSizeKB <= 200 ? 600 : (maxSizeKB <= 350 ? 800 : 1000);
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            width = MAX_DIMENSION;
            height = MAX_DIMENSION / aspectRatio;
          } else {
            height = MAX_DIMENSION;
            width = MAX_DIMENSION * aspectRatio;
          }
        }

        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context not found'));
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Binary search for quality
        let minQ = 0.2;
        let maxQ = 0.85;
        let quality = 0.75;
        let resultBase64 = canvas.toDataURL('image/jpeg', quality);
        
        let attempts = 0;
        const targetSize = maxSizeKB * 1024;

        // roughly estimate size of base64
        const getSize = (b64: string) => Math.round((b64.length * 3) / 4);

        while (attempts < 8 && getSize(resultBase64) > targetSize && quality > 0.15) {
          maxQ = quality;
          quality = (minQ + maxQ) / 2;
          resultBase64 = canvas.toDataURL('image/jpeg', quality);
          attempts++;
        }

        resolve(resultBase64);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}
