import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { showToast } from '../toast';

describe('showToast', () => {
  let toastElement;

  beforeEach(() => {
    // Set up a mock DOM element
    toastElement = document.createElement('div');
    toastElement.classList.add('hidden');
    document.body.appendChild(toastElement);

    // Mock setTimeout
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Clean up the DOM and timers
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should set textContent and remove hidden class', () => {
    showToast(toastElement, 'Test message');

    expect(toastElement.textContent).toBe('Test message');
    expect(toastElement.classList.contains('hidden')).toBe(false);
  });

  it('should add hidden class after 2000ms', () => {
    showToast(toastElement, 'Test message');

    // Initially not hidden
    expect(toastElement.classList.contains('hidden')).toBe(false);

    // Advance timer by 1999ms, still not hidden
    vi.advanceTimersByTime(1999);
    expect(toastElement.classList.contains('hidden')).toBe(false);

    // Advance timer by 1ms (total 2000ms), should be hidden
    vi.advanceTimersByTime(1);
    expect(toastElement.classList.contains('hidden')).toBe(true);
  });
});
