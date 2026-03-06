import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('formatSize from image-crop.astro', () => {
  let formatSize;

  beforeAll(() => {
    const filePath = path.resolve(__dirname, '../image-crop.astro');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Extract the formatSize function
    // Match `function formatSize(bytes) { ... }`
    const functionRegex = /function\s+formatSize\s*\(([^)]*)\)\s*\{([\s\S]*?)\n\s*\}/;
    const match = fileContent.match(functionRegex);

    if (!match) {
      throw new Error('Could not find formatSize function in image-crop.astro');
    }

    const params = match[1];
    const body = match[2];

    // Create the function dynamically
    formatSize = new Function(params, body);
  });

  it('formats bytes correctly (under 1 KB)', () => {
    expect(formatSize(0)).toBe('0 B');
    expect(formatSize(500)).toBe('500 B');
    expect(formatSize(1023)).toBe('1023 B');
  });

  it('formats kilobytes correctly (1 KB to under 1 MB)', () => {
    expect(formatSize(1024)).toBe('1.0 KB');
    expect(formatSize(1536)).toBe('1.5 KB');
    expect(formatSize(1048575)).toBe('1024.0 KB'); // 1024 * 1024 - 1
  });

  it('formats megabytes correctly (1 MB and above)', () => {
    expect(formatSize(1048576)).toBe('1.00 MB'); // 1024 * 1024
    expect(formatSize(1572864)).toBe('1.50 MB'); // 1.5 * 1024 * 1024
    expect(formatSize(10485760)).toBe('10.00 MB'); // 10 * 1024 * 1024
  });
});
