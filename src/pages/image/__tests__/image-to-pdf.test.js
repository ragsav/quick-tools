import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formatSize, renderImageList, escapeHtml } from '../image-to-pdf.js';

describe('image-to-pdf utilities', () => {
  describe('formatSize', () => {
    it('formats bytes correctly', () => {
      expect(formatSize(500)).toBe('500 B');
      expect(formatSize(0)).toBe('0 B');
    });

    it('formats kilobytes correctly', () => {
      expect(formatSize(1500)).toBe('1.5 KB');
      expect(formatSize(1024)).toBe('1.0 KB');
      expect(formatSize(1024 * 1024 - 1)).toBe('1024.0 KB');
    });

    it('formats megabytes correctly', () => {
      expect(formatSize(1500000)).toBe('1.43 MB');
      expect(formatSize(1048576)).toBe('1.00 MB');
      expect(formatSize(1048576 * 5)).toBe('5.00 MB');
    });
  });

  describe('escapeHtml', () => {
    it('escapes standard HTML characters', () => {
      expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
      expect(escapeHtml('"test"')).toBe('&quot;test&quot;');
      expect(escapeHtml("'test'")).toBe('&#039;test&#039;');
      expect(escapeHtml('a & b')).toBe('a &amp; b');
    });

    it('handles non-string values gracefully', () => {
      expect(escapeHtml(null)).toBe(null);
      expect(escapeHtml(123)).toBe(123);
      expect(escapeHtml(undefined)).toBe(undefined);
    });
  });

  describe('renderImageList', () => {
    let elements;

    beforeEach(() => {
      // Mock DOM elements
      elements = {
        imageList: { classList: { add: vi.fn(), remove: vi.fn() }, innerHTML: '' },
        options: { classList: { add: vi.fn(), remove: vi.fn() } },
        actions: { classList: { add: vi.fn(), remove: vi.fn() } },
        dropZone: { classList: { add: vi.fn(), remove: vi.fn() } }
      };
    });

    it('hides list and shows dropzone when images array is empty', () => {
      renderImageList([], elements);

      expect(elements.imageList.classList.add).toHaveBeenCalledWith('hidden');
      expect(elements.options.classList.add).toHaveBeenCalledWith('hidden');
      expect(elements.actions.classList.add).toHaveBeenCalledWith('hidden');
      expect(elements.dropZone.classList.remove).toHaveBeenCalledWith('hidden');
    });

    it('shows list and hides dropzone when images are present', () => {
      const images = [
        { name: 'test.jpg', size: 1024, width: 100, height: 100, dataUrl: 'data:image/jpeg;base64,...' }
      ];

      renderImageList(images, elements);

      expect(elements.dropZone.classList.add).toHaveBeenCalledWith('hidden');
      expect(elements.imageList.classList.remove).toHaveBeenCalledWith('hidden');
      expect(elements.options.classList.remove).toHaveBeenCalledWith('hidden');
      expect(elements.actions.classList.remove).toHaveBeenCalledWith('hidden');

      expect(elements.imageList.innerHTML).toContain('test.jpg');
      expect(elements.imageList.innerHTML).toContain('1.0 KB');
      expect(elements.imageList.innerHTML).toContain('100 × 100');
    });

    it('renders multiple images correctly', () => {
      const images = [
        { name: 'test1.jpg', size: 1024, width: 100, height: 100, dataUrl: 'data:image/jpeg;base64,...' },
        { name: 'test2.png', size: 2048, width: 200, height: 200, dataUrl: 'data:image/png;base64,...' }
      ];

      renderImageList(images, elements);

      expect(elements.imageList.innerHTML).toContain('test1.jpg');
      expect(elements.imageList.innerHTML).toContain('test2.png');
      expect(elements.imageList.innerHTML).toContain('data-index="0"');
      expect(elements.imageList.innerHTML).toContain('data-index="1"');
    });

    it('escapes image names when rendering to prevent XSS', () => {
      const images = [
        { name: '<script>alert("xss")</script>.jpg', size: 1024, width: 100, height: 100, dataUrl: 'data:image/jpeg;base64,...' }
      ];

      renderImageList(images, elements);

      expect(elements.imageList.innerHTML).not.toContain('<script>');
      expect(elements.imageList.innerHTML).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;.jpg');
    });
  });
});
