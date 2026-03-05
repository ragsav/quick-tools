import { describe, it, expect } from 'vitest';

describe('URL Encoder/Decoder Logic', () => {
  // Simulating the exact client-side logic from url-encoder.astro
  function process(input: string, action: 'encode' | 'decode') {
    try {
      if (action === 'encode') {
        return encodeURIComponent(input);
      } else {
        return decodeURIComponent(input);
      }
    } catch (e: any) {
      return "Error: " + e.message;
    }
  }

  it('should encode URL with query parameters', () => {
    expect(process('https://example.com/search?q=hello world&page=1', 'encode'))
      .toBe('https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26page%3D1');
  });

  it('should decode URL correctly', () => {
    expect(process('https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26page%3D1', 'decode'))
      .toBe('https://example.com/search?q=hello world&page=1');
  });

  it('should handle special characters correctly', () => {
    expect(process('some @ special & chars + here', 'encode'))
      .toBe('some%20%40%20special%20%26%20chars%20%2B%20here');
  });

  it('should handle invalid decoding gracefully', () => {
    expect(process('%E0%A4%A', 'decode')).toContain('Error: URI malformed');
  });
});
