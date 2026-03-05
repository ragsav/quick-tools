import { describe, it, expect } from 'vitest';

describe('Base64 Encoder/Decoder Logic', () => {
  // Simulating the exact client-side logic from base64.astro
  function encode(input: string) {
    try {
      return btoa(unescape(encodeURIComponent(input)));
    } catch (e: any) {
      return "Error encoding: " + e.message;
    }
  }

  function decode(input: string) {
    try {
      return decodeURIComponent(escape(atob(input)));
    } catch (e: any) {
      return "Error decoding: Invalid Base64 string";
    }
  }

  it('should encode simple ascii text', () => {
    expect(encode('hello world')).toBe('aGVsbG8gd29ybGQ=');
  });

  it('should encode utf-8 special characters', () => {
    expect(encode('hello 🌍')).toBe('aGVsbG8g8J+MjQ==');
  });

  it('should decode simple base64 to text', () => {
    expect(decode('aGVsbG8gd29ybGQ=')).toBe('hello world');
  });

  it('should decode utf-8 base64 to text', () => {
    expect(decode('aGVsbG8g8J+MjQ==')).toBe('hello 🌍');
  });

  it('should handle invalid base64 gracefully', () => {
    expect(decode('invalid base64 string!!!')).toBe('Error decoding: Invalid Base64 string');
  });
});
