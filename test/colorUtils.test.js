import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rgbToHex, getContrastColor, extractColors } from '../src/utils/colorUtils.js';

describe('colorUtils', () => {
  describe('rgbToHex', () => {
    it('should convert RGB to Hex correctly', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
      expect(rgbToHex(10, 15, 20)).toBe('#0a0f14');
    });
  });

  describe('getContrastColor', () => {
    it('should return black for bright colors', () => {
      expect(getContrastColor(255, 255, 255)).toBe('#000');
      expect(getContrastColor(200, 200, 200)).toBe('#000');
      expect(getContrastColor(255, 255, 0)).toBe('#000'); // Yellow
    });

    it('should return white for dark colors', () => {
      expect(getContrastColor(0, 0, 0)).toBe('#fff');
      expect(getContrastColor(50, 50, 50)).toBe('#fff');
      expect(getContrastColor(0, 0, 128)).toBe('#fff'); // Dark blue
    });
  });

  describe('extractColors', () => {
    let originalDocument;

    beforeEach(() => {
      originalDocument = global.document;
    });

    afterEach(() => {
      global.document = originalDocument;
    });

    it('should extract single dominant color from solid color image', () => {
      const mockCanvas = {
        width: 100,
        height: 100,
        getContext: vi.fn(() => ({
          drawImage: vi.fn(),
          getImageData: vi.fn(() => ({
            // Red image: R=255, G=0, B=0, A=255
            data: new Uint8ClampedArray(100 * 100 * 4).fill(255).map((_, i) => i % 4 === 0 ? 255 : (i % 4 === 3 ? 255 : 0))
          }))
        }))
      };

      global.document = {
        createElement: vi.fn(() => mockCanvas)
      };

      const mockImg = {};
      const colors = extractColors(mockImg, 5);

      expect(colors).toHaveLength(1);
      // Math.round(255/32)*32 = 256 for Red, 0 for Green and Blue
      expect(colors[0]).toEqual([256, 0, 0]);
    });

    it('should extract multiple dominant colors and respect the count parameter', () => {
      // Create an image with two colors: Red and Blue
      const data = new Uint8ClampedArray(100 * 100 * 4);
      for (let i = 0; i < data.length; i += 4) {
        if (i < data.length / 2) {
          // Red for first half
          data[i] = 255;
          data[i+1] = 0;
          data[i+2] = 0;
          data[i+3] = 255;
        } else {
          // Green for second half
          data[i] = 0;
          data[i+1] = 255;
          data[i+2] = 0;
          data[i+3] = 255;
        }
      }

      const mockCanvas = {
        width: 100,
        height: 100,
        getContext: vi.fn(() => ({
          drawImage: vi.fn(),
          getImageData: vi.fn(() => ({ data }))
        }))
      };

      global.document = {
        createElement: vi.fn(() => mockCanvas)
      };

      const mockImg = {};
      const colors = extractColors(mockImg, 1);

      // Should only return 1 color because count is 1
      expect(colors).toHaveLength(1);

      const colorsTwo = extractColors(mockImg, 2);
      expect(colorsTwo).toHaveLength(2);

      // Since red and green have equal counts, their order might depend on sorting stability,
      // but they both should be in the array
      const colorStrings = colorsTwo.map(c => c.join(','));
      expect(colorStrings).toContain('256,0,0');
      expect(colorStrings).toContain('0,256,0');
    });
  });
});
