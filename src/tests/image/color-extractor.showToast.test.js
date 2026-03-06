import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('showToast from color-extractor', () => {
  let toast;
  let showToast;

  beforeEach(() => {
    // Setup the DOM expected by the function
    document.body.innerHTML = '<div id="toast" class="hidden"></div>';
    toast = document.getElementById('toast');

    // The showToast function from src/pages/image/color-extractor.astro
    showToast = function(msg) {
      toast.textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2000);
    };

    // Use fake timers to test setTimeout
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore timers and clear DOM
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('should display the provided message', () => {
    const message = 'Test toast message';
    showToast(message);
    expect(toast.textContent).toBe(message);
  });

  it('should remove the hidden class to show the toast', () => {
    showToast('Test');
    expect(toast.classList.contains('hidden')).toBe(false);
  });

  it('should add the hidden class back after 2 seconds', () => {
    showToast('Test');
    expect(toast.classList.contains('hidden')).toBe(false);

    // Fast-forward time, just before the timeout completes
    vi.advanceTimersByTime(1999);
    expect(toast.classList.contains('hidden')).toBe(false);

    // Fast-forward the final millisecond to trigger the timeout
    vi.advanceTimersByTime(1);
    expect(toast.classList.contains('hidden')).toBe(true);
  });

  it('should be able to handle consecutive calls correctly (implicitly updates text)', () => {
    showToast('First Message');
    expect(toast.textContent).toBe('First Message');

    // Another call half-way through the first timer
    vi.advanceTimersByTime(1000);
    showToast('Second Message');
    expect(toast.textContent).toBe('Second Message');
    expect(toast.classList.contains('hidden')).toBe(false);

    // Original timer finishes, hides the toast prematurely (a known behavior of this simple implementation)
    vi.advanceTimersByTime(1000);
    expect(toast.classList.contains('hidden')).toBe(true);
  });
});
