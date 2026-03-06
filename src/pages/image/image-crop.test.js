import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cropImage } from '../../utils/imageCropUtils';

describe('imageCropUtils - cropImage', () => {
  beforeEach(() => {
    // Reset the DOM elements needed for mocking
    document.body.innerHTML = '';

    // Mock Canvas APIs
    window.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      drawImage: vi.fn()
    }));

    window.HTMLCanvasElement.prototype.toBlob = vi.fn(function(cb, type) {
      if (type === 'image/error') {
        cb(null);
      } else {
        cb(new Blob(['fake image data'], { type }));
      }
    });
  });

  it('should correctly calculate dimensions and draw image', async () => {
    const originalImageEl = { width: 1000, height: 1000 };
    const containerRect = { width: 500, height: 500 };
    const cropAreaRect = { left: 10, top: 20, width: 50, height: 40 };
    const mimeType = 'image/jpeg';

    const blob = await cropImage(originalImageEl, containerRect, cropAreaRect, mimeType);

    // The scale is originalImageEl (1000) / containerRect (500) = 2
    // cropArea width is 50%, container is 500 => width is 250
    // scaled width is 250 * 2 = 500

    const getContextMock = window.HTMLCanvasElement.prototype.getContext;
    expect(getContextMock).toHaveBeenCalledWith('2d');

    const drawImageMock = getContextMock.mock.results[0].value.drawImage;
    // drawImage should be called with originalImageEl, -left, -top
    // left: 10% of 500 = 50. scaled left = 50 * 2 = 100. -left = -100
    // top: 20% of 500 = 100. scaled top = 100 * 2 = 200. -top = -200
    expect(drawImageMock).toHaveBeenCalledWith(originalImageEl, -100, -200);

    const toBlobMock = window.HTMLCanvasElement.prototype.toBlob;
    expect(toBlobMock).toHaveBeenCalled();
    expect(toBlobMock.mock.calls[0][1]).toBe('image/jpeg');

    expect(blob).toBeInstanceOf(Blob);
  });

  it('should handle png images', async () => {
    const originalImageEl = { width: 1000, height: 1000 };
    const containerRect = { width: 500, height: 500 };
    const cropAreaRect = { left: 0, top: 0, width: 100, height: 100 };
    const mimeType = 'image/png';

    await cropImage(originalImageEl, containerRect, cropAreaRect, mimeType);

    const toBlobMock = window.HTMLCanvasElement.prototype.toBlob;
    expect(toBlobMock).toHaveBeenCalled();
    expect(toBlobMock.mock.calls[0][1]).toBe('image/png');
  });

  it('should reject if originalImageEl is not set', async () => {
    const originalImageEl = null;
    const containerRect = { width: 500, height: 500 };
    const cropAreaRect = { left: 0, top: 0, width: 100, height: 100 };
    const mimeType = 'image/jpeg';

    await expect(cropImage(originalImageEl, containerRect, cropAreaRect, mimeType))
      .rejects.toThrow('Original image element is required');

    const getContextMock = window.HTMLCanvasElement.prototype.getContext;
    expect(getContextMock).not.toHaveBeenCalled();
  });

  it('should reject if toBlob returns null', async () => {
    const originalImageEl = { width: 1000, height: 1000 };
    const containerRect = { width: 500, height: 500 };
    const cropAreaRect = { left: 0, top: 0, width: 100, height: 100 };
    const mimeType = 'image/error'; // Triggers mock to return null

    await expect(cropImage(originalImageEl, containerRect, cropAreaRect, mimeType))
      .rejects.toThrow('Failed to create blob from canvas');
  });
});
