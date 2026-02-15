/**
 * Unified image compression utility
 * Handles image compression for both product page and cart orders
 * - Accepts ANY image size
 * - Compresses only for Vercel payload limits (not for mobile UX)
 * - Returns base64 preview for Telegram
 */

export interface ImageCompressionResult {
  file: File;
  preview: string;
  mimeType: string;
}

export async function compressImage(file: File): Promise<ImageCompressionResult> {
  return new Promise((resolve, reject) => {
    // Validate file type only (no size limits)
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new window.Image();
      img.onload = () => {
        // Compress image for Vercel payload limits
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to create canvas context'));
          return;
        }

        // Set canvas size with reduced dimensions for better compression
        const maxWidth = 900;
        const maxHeight = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert compressed image to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              console.log(
                `📷 Image compressed: ${(file.size / 1024).toFixed(1)}KB → ${(blob.size / 1024).toFixed(1)}KB`
              );

              // Create preview from canvas
              const preview = canvas.toDataURL('image/jpeg', 0.65);

              resolve({
                file: compressedFile,
                preview: preview,
                mimeType: 'image/jpeg',
              });
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          0.65 // Quality level for compression
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = reader.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}
