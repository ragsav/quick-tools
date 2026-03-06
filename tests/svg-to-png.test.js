import { describe, it, expect } from 'vitest';
import { formatSize } from '../src/utils/formatSize.js';

describe('formatSize (from src/utils/formatSize.js)', () => {
  it('formats bytes correctly (less than 1024 B)', () => {
    expect(formatSize(0)).toBe('0 B');
    expect(formatSize(500)).toBe('500 B');
    expect(formatSize(1023)).toBe('1023 B');
  });

  it('formats kilobytes correctly (between 1024 B and 1 MB)', () => {
    expect(formatSize(1024)).toBe('1.0 KB');
    expect(formatSize(1536)).toBe('1.5 KB');
    expect(formatSize(1024 * 1024 - 1)).toBe('1024.0 KB');
  });

  it('formats megabytes correctly (1 MB or more)', () => {
    expect(formatSize(1024 * 1024)).toBe('1.00 MB');
    expect(formatSize(1024 * 1024 * 1.5)).toBe('1.50 MB');
    expect(formatSize(1024 * 1024 * 10)).toBe('10.00 MB');
  });
});
