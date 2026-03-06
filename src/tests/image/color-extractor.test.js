import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('color-extractor handleFile', () => {
  let dom;
  let window;
  let document;

  beforeEach(() => {
    // Read the actual Astro file
    const astroFile = fs.readFileSync(path.resolve(__dirname, '../../pages/image/color-extractor.astro'), 'utf-8');

    // Extract the script tag content
    const scriptMatch = astroFile.match(/<script is:inline>([\s\S]*?)<\/script>/);
    const scriptContent = scriptMatch ? scriptMatch[1] : '';

    dom = new JSDOM(`
      <body>
        <div id="dropZone" class="visible"></div>
        <input type="file" id="fileInput" />
        <div id="controls" class="hidden"></div>
        <img id="preview" />
        <div id="dominantColor"></div>
        <div id="palette"></div>
        <div id="toast" class="hidden"></div>
        <button id="resetBtn"></button>
        <script>
          // We attach variables to window so we can test them
          window.updatePaletteCalled = false;

          // Mock some DOM APIs
          window.navigator = {
            clipboard: {
              writeText: () => Promise.resolve()
            }
          };

          // Inject script content
          ${scriptContent}

          // Override updatePalette locally just to track calls without doing complex canvas ops
          // which JSDOM has trouble with. We must assign it after the script defines it.
          const originalUpdatePalette = updatePalette;
          updatePalette = function() {
            window.updatePaletteCalled = true;
          };

          // Attach to window for testing
          window.handleFile = handleFile;
          // expose currentImage getter so test can check its value correctly since the script has \`let currentImage = null;\`
          window.getCurrentImage = () => currentImage;
        </script>
      </body>
    `, { resources: 'usable', runScripts: 'dangerously' });

    window = dom.window;
    document = window.document;
  });

  it('should not process if file is null', () => {
    window.handleFile(null);
    expect(window.getCurrentImage()).toBeNull();
  });

  it('should not process if file is not an image', () => {
    const file = new window.File(['test'], 'test.txt', { type: 'text/plain' });
    window.handleFile(file);
    expect(window.getCurrentImage()).toBeNull();
  });

  it('should process a valid image file, update DOM and call updatePalette', async () => {
    const base64Pixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const binaryString = atob(base64Pixel);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const file = new window.File([bytes], 'test.png', { type: 'image/png' });

    return new Promise((resolve) => {
      const dropZone = window.document.getElementById('dropZone');
      const controls = window.document.getElementById('controls');
      const preview = window.document.getElementById('preview');

      // Hook into the image's onload which is internal to handleFile
      const originalImage = window.Image;
      window.Image = function() {
        const img = new originalImage();
        setTimeout(() => {
            if (img.onload) {
              img.onload();
              // Check after onload is called
              expect(window.getCurrentImage()).not.toBeNull();
              expect(preview.src).toContain('data:image/png;base64');
              expect(controls.classList.contains('hidden')).toBe(false);
              expect(dropZone.classList.contains('hidden')).toBe(true);
              expect(window.updatePaletteCalled).toBe(true);
              resolve();
            }
        }, 10);
        return img;
      };

      window.handleFile(file);
    });
  });
});
