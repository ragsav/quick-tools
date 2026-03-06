import { describe, it, expect } from 'vitest';
import { rgbToHex } from '../../utils/colors.js';

describe('rgbToHex', () => {
  it('converts rgb(0, 0, 0) to #000000', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
  });

  it('converts rgb(255, 255, 255) to #ffffff', () => {
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
  });

  it('converts rgb(255, 0, 0) to #ff0000', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
  });

  it('converts rgb(0, 255, 0) to #00ff00', () => {
    expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
  });

  it('converts rgb(0, 0, 255) to #0000ff', () => {
    expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
  });

  it('converts custom rgb values correctly', () => {
    expect(rgbToHex(16, 32, 48)).toBe('#102030');
    expect(rgbToHex(171, 205, 239)).toBe('#abcdef');
  });

  it('handles single digit hex values correctly (pads with 0)', () => {
    expect(rgbToHex(1, 2, 3)).toBe('#010203');
    expect(rgbToHex(15, 15, 15)).toBe('#0f0f0f');
  });
});
