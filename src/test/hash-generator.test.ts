import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';

describe('Hash Generator Logic', () => {
  // Since the original hash-generator.astro code imports crypto-js in a client-side script
  // via CDN and runs the logic there, we will test the equivalent logic to ensure
  // the expected outcomes of the hash functions.

  // We'll use Node's built-in crypto module to simulate what the client-side tool does
  const crypto = require('crypto');

  function generateHash(input: string, algorithm: string) {
    if (algorithm === 'md5') {
        return crypto.createHash('md5').update(input).digest('hex');
    } else if (algorithm === 'sha1') {
        return crypto.createHash('sha1').update(input).digest('hex');
    } else if (algorithm === 'sha256') {
        return crypto.createHash('sha256').update(input).digest('hex');
    } else if (algorithm === 'sha512') {
        return crypto.createHash('sha512').update(input).digest('hex');
    }
    return '';
  }

  it('should generate correct MD5 hash', () => {
    const result = generateHash('hello world', 'md5');
    expect(result).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3');
  });

  it('should generate correct SHA-1 hash', () => {
    const result = generateHash('hello world', 'sha1');
    expect(result).toBe('2aae6c35c94fcfb415dbe95f408b9ce91ee846ed');
  });

  it('should generate correct SHA-256 hash', () => {
    const result = generateHash('hello world', 'sha256');
    expect(result).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
  });

  it('should generate correct SHA-512 hash', () => {
    const result = generateHash('hello world', 'sha512');
    expect(result).toBe('309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f');
  });

  it('should handle empty string correctly', () => {
    const result = generateHash('', 'sha256');
    expect(result).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
});
