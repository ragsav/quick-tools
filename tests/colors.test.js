import { describe, it, expect } from 'vitest';
import { rgbToHex, getContrastColor } from '../src/utils/colors.js';

describe('Color Utilities', () => {
  describe('rgbToHex', () => {
    it('converts black correctly', () => {
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    it('converts white correctly', () => {
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    });

    it('converts red correctly', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
    });

    it('pads single hex digits with zero', () => {
      expect(rgbToHex(10, 15, 5)).toBe('#0a0f05');
    });
  });

  describe('getContrastColor', () => {
    it('returns black for light colors', () => {
      // White -> black
      expect(getContrastColor(255, 255, 255)).toBe('#000');
      // Light gray -> black
      expect(getContrastColor(200, 200, 200)).toBe('#000');
    });

    it('returns white for dark colors', () => {
      // Black -> white
      expect(getContrastColor(0, 0, 0)).toBe('#fff');
      // Dark gray -> white
      expect(getContrastColor(50, 50, 50)).toBe('#fff');
      // Pure Blue (low luminance) -> white
      expect(getContrastColor(0, 0, 255)).toBe('#fff');
      // Pure Green (0 * 0.299 + 255 * 0.587 + 0 * 0.114 = 149.685) -> white
      expect(getContrastColor(0, 255, 0)).toBe('#fff');
    });

    it('handles the exact threshold', () => {
      // Find exactly what threshold looks like
      // 128 * 0.299 + 128 * 0.587 + 128 * 0.114 = 128
      const result = getContrastColor(128, 128, 128);
      expect(result).toBe('#fff'); // 128 <= 150

      const lighterResult = getContrastColor(160, 160, 160); // 160 * (0.299 + 0.587 + 0.114) = 160
      expect(lighterResult).toBe('#000'); // 160 > 150
    });
  });
});
