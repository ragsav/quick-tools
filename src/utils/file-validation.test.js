import { describe, it, expect } from 'vitest';
import { validateImageFile } from './file-validation';

describe('validateImageFile', () => {
  it('should return isValid: true for a valid image file', () => {
    const file = { type: 'image/png' };
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should return isValid: true for a valid jpeg file', () => {
    const file = { type: 'image/jpeg' };
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should return isValid: false and an error message for a non-image file', () => {
    const file = { type: 'application/pdf' };
    const result = validateImageFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please select an image file.');
  });

  it('should return isValid: false and an error message for a null file', () => {
    const result = validateImageFile(null);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please select an image file.');
  });

  it('should return isValid: false and an error message for an undefined file', () => {
    const result = validateImageFile(undefined);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please select an image file.');
  });

  it('should return isValid: false and an error message for a file without a type property', () => {
    const file = { name: 'test.png' };
    const result = validateImageFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please select an image file.');
  });
});
