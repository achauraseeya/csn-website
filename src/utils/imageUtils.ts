export async function compressImageToBase64(file: File, maxSizeKB: number = 500): Promise<string> {
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

        // Initial aggressive resize if it's very large
        const MAX_DIMENSION = 1200;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            width = MAX_DIMENSION;
            height = MAX_DIMENSION / aspectRatio;
          } else {
            height = MAX_DIMENSION;
            width = MAX_DIMENSION * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context not found'));
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Binary search for quality
        let minQ = 0.1;
        let maxQ = 0.9;
        let quality = 0.7;
        let resultBase64 = canvas.toDataURL('image/jpeg', quality);
        
        let attempts = 0;
        const targetSize = maxSizeKB * 1024;

        // roughly estimate size of base64
        const getSize = (b64: string) => Math.round((b64.length * 3) / 4);

        while (attempts < 8 && getSize(resultBase64) > targetSize) {
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
