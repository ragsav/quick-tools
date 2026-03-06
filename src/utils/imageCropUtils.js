/**
 * Crops an image based on container and area dimensions and returns a Blob.
 *
 * @param {HTMLImageElement} originalImageEl The original image element.
 * @param {Object} containerRect The bounding client rect of the crop container.
 * @param {Object} cropAreaRect The position and size percentages of the crop area.
 * @param {string} mimeType The mime type for the resulting blob.
 * @returns {Promise<Blob>} A promise that resolves to the cropped image blob.
 */
export function cropImage(originalImageEl, containerRect, cropAreaRect, mimeType) {
  return new Promise((resolve, reject) => {
    try {
      if (!originalImageEl) {
        throw new Error('Original image element is required');
      }

      const scaleX = originalImageEl.width / containerRect.width;
      const scaleY = originalImageEl.height / containerRect.height;

      const left = (cropAreaRect.left / 100) * containerRect.width * scaleX;
      const top = (cropAreaRect.top / 100) * containerRect.height * scaleY;
      const width = (cropAreaRect.width / 100) * containerRect.width * scaleX;
      const height = (cropAreaRect.height / 100) * containerRect.height * scaleY;

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width));
      canvas.height = Math.max(1, Math.round(height));

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get 2d context from canvas');
      }

      ctx.drawImage(originalImageEl, -left, -top);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, mimeType, 0.92);
    } catch (error) {
      reject(error);
    }
  });
}
