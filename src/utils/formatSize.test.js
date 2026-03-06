import { describe, it, expect } from 'vitest';
import { formatSize } from '../../public/scripts/formatSize.js';

describe('formatSize', () => {
  it('formats bytes correctly', () => {
    expect(formatSize(500)).toBe('500 B');
    expect(formatSize(1023)).toBe('1023 B');
  });

  it('formats kilobytes correctly', () => {
    expect(formatSize(1024)).toBe('1.0 KB');
    expect(formatSize(1536)).toBe('1.5 KB');
    expect(formatSize(1048575)).toBe('1024.0 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatSize(1048576)).toBe('1.00 MB');
    expect(formatSize(1572864)).toBe('1.50 MB');
    expect(formatSize(10485760)).toBe('10.00 MB');
  });

  it('handles 0 correctly', () => {
    expect(formatSize(0)).toBe('0 B');
  });
});
