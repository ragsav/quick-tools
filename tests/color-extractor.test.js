import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const astroComponentPath = path.resolve(__dirname, '../src/pages/image/color-extractor.astro');
const fileContent = fs.readFileSync(astroComponentPath, 'utf-8');

const scriptContentMatch = fileContent.match(/<script is:inline>([\s\S]*?)<\/script>/);
const scriptContent = scriptContentMatch ? scriptContentMatch[1] : '';

describe('color-extractor', () => {
  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = `
      <div id="dropZone" class="hidden"></div>
      <input type="file" id="fileInput" class="hidden" />
      <div id="controls" class="hidden"></div>
      <img id="preview" />
      <div id="dominantColor"></div>
      <div id="palette"></div>
      <div id="toast" class="hidden"></div>
      <button id="resetBtn"></button>
    `;

    // Make functions globally available by creating a script and evaluating it directly
    // Instead of appending a script tag, let's eval the script so it populates the window
    // First modify variable declarations to make them accessible or var

    // We attach them explicitly to window to make sure we can test them
    const safeScript = scriptContent
      .replace(/let currentImage = null;/, 'window.currentImage = null;')
      .replace(/let paletteCount = 8;/, 'window.paletteCount = 8;')
      .replace(/function rgbToHex/, 'window.rgbToHex = function rgbToHex')
      .replace(/function getContrastColor/, 'window.getContrastColor = function getContrastColor')
      .replace(/function extractColors/, 'window.extractColors = function extractColors')
      .replace(/function showToast/, 'window.showToast = function showToast')
      .replace(/function handleFile/, 'window.handleFile = function handleFile')
      .replace(/function updatePalette/, 'window.updatePalette = function updatePalette');

    // Execute the modified script to populate globals
    // We need to provide the DOM elements because the script expects them
    window.dropZone = document.getElementById('dropZone');
    window.fileInput = document.getElementById('fileInput');
    window.controls = document.getElementById('controls');
    window.preview = document.getElementById('preview');
    window.dominantColor = document.getElementById('dominantColor');
    window.palette = document.getElementById('palette');
    window.toast = document.getElementById('toast');
    window.resetBtn = document.getElementById('resetBtn');

    // Mute event listeners binding to not throw errors
    const scriptWithoutListeners = safeScript.split('document.querySelectorAll')[0];

    eval(scriptWithoutListeners);

    // Polyfill writeText
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn()
      }
    });
  });

  it('updatePalette should return early if currentImage is null', () => {
    window.currentImage = null;
    window.updatePalette();
    const dominantColor = document.getElementById('dominantColor');
    expect(dominantColor.style.backgroundColor).toBe('');
    expect(document.getElementById('palette').innerHTML).toBe('');
  });

  it('updatePalette should update DOM with extracted colors', () => {
    // Mock the image
    window.currentImage = new Image();

    // Mock extractColors to return a predefined set of colors
    window.extractColors = vi.fn().mockReturnValue([
      [255, 0, 0],   // Red (Dominant)
      [0, 255, 0],   // Green
      [0, 0, 255]    // Blue
    ]);

    window.updatePalette();

    const dominantColor = document.getElementById('dominantColor');
    const palette = document.getElementById('palette');

    // Check dominant color
    expect(dominantColor.style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(dominantColor.textContent).toBe('#FF0000');

    // Check palette colors
    expect(palette.children.length).toBe(3);
    expect(palette.children[0].style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(palette.children[1].style.backgroundColor).toBe('rgb(0, 255, 0)');
    expect(palette.children[2].style.backgroundColor).toBe('rgb(0, 0, 255)');
  });

  it('updatePalette colors should be clickable to copy HEX code', () => {
    vi.useFakeTimers();

    window.currentImage = new Image();
    window.extractColors = vi.fn().mockReturnValue([
      [255, 255, 255] // White
    ]);

    // Spy on clipboard
    const clipboardSpy = vi.spyOn(navigator.clipboard, 'writeText');

    window.updatePalette();

    const dominantColor = document.getElementById('dominantColor');
    const palette = document.getElementById('palette');
    const toast = document.getElementById('toast');

    // Click dominant color
    dominantColor.click();
    expect(clipboardSpy).toHaveBeenCalledWith('#ffffff');
    expect(toast.classList.contains('hidden')).toBe(false);
    expect(toast.textContent).toBe('Copied #ffffff');

    // Advance timers to hide toast
    vi.advanceTimersByTime(2000);
    expect(toast.classList.contains('hidden')).toBe(true);

    // Click palette color
    palette.children[0].click();
    expect(clipboardSpy).toHaveBeenCalledWith('#ffffff');

    vi.useRealTimers();
  });
});
