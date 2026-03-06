import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// Read and extract the script content
const componentPath = path.resolve(__dirname, '../image-crop.astro');
const content = fs.readFileSync(componentPath, 'utf-8');
const scriptContent = content.match(/<script.*?>([\s\S]*?)<\/script>/)[1];

describe('image-crop updatePreview function', () => {
  let dom;
  let window;
  let document;

  beforeEach(() => {
    // Set up a JSDOM environment with the required elements
    dom = new JSDOM(`<!DOCTYPE html>
    <html>
    <body>
      <div id="cropContainer" style="width: 500px; height: 500px;">
        <div id="cropArea" style="left: 10%; top: 10%; width: 50%; height: 50%;"></div>
        <div id="dimOverlay"></div>
      </div>
      <img id="originalImage" />
      <img id="croppedPreview" />
      <div id="cropInfo"></div>
      <div id="dropZone"></div>
      <div id="controls"></div>
      <input type="file" id="fileInput" />
      <button id="cropBtn"></button>
      <button id="downloadBtn"></button>
      <button id="resetBtn"></button>
      <script>
        window._drawImageCalls = [];
        window._ctxMock = {
          drawImage: function(img, x, y) {
            window._drawImageCalls.push({img, x, y});
          }
        };

        window._createdCanvases = [];
        const originalCreateElement = document.createElement.bind(document);
        document.createElement = function(tagName) {
          const el = originalCreateElement(tagName);
          if (tagName.toLowerCase() === 'canvas') {
            window._createdCanvases.push(el);
          }
          return el;
        };

        HTMLCanvasElement.prototype.getContext = function() {
          return window._ctxMock;
        };
        HTMLCanvasElement.prototype.toDataURL = function() {
          return "data:image/png;base64,mocked-data";
        };
      </script>
      <script>${scriptContent}</script>
    </body>
    </html>`, { runScripts: "dangerously" });

    window = dom.window;
    document = window.document;

    // Setup typical environment state by evaluating in the context
    window.eval(`
      originalImageEl = { width: 1000, height: 800 };
      cropContainer.getBoundingClientRect = () => ({ width: 500, height: 400, left: 0, top: 0 });
    `);
  });

  it('calculates correct scaled dimensions and calls drawImage', () => {
    window.eval(`
      cropArea.style.left = '10%';
      cropArea.style.top = '20%';
      cropArea.style.width = '30%';
      cropArea.style.height = '40%';
      updatePreview();
    `);

    // container is 500x400
    // image is 1000x800
    // scaleX = 1000/500 = 2
    // scaleY = 800/400 = 2

    // left = 10% of 500 * 2 = 50 * 2 = 100
    // top = 20% of 400 * 2 = 80 * 2 = 160
    // width = 30% of 500 * 2 = 150 * 2 = 300
    // height = 40% of 400 * 2 = 160 * 2 = 320

    const drawCalls = window._drawImageCalls;
    expect(drawCalls.length).toBe(1);
    expect(drawCalls[0].img.width).toBe(1000);
    expect(drawCalls[0].img.height).toBe(800);
    expect(drawCalls[0].x).toBe(-100);
    expect(drawCalls[0].y).toBe(-160);

    const croppedPreview = document.getElementById('croppedPreview');
    expect(croppedPreview.src).toBe('data:image/png;base64,mocked-data');
  });

  it('does nothing if originalImageEl is missing', () => {
    window.eval(`
      originalImageEl = null;
      updatePreview();
    `);

    expect(window._drawImageCalls.length).toBe(0);
    const croppedPreview = document.getElementById('croppedPreview');
    expect(croppedPreview.src).toBe('');
  });

  it('handles zero or tiny dimensions correctly (Math.max(1, Math.round(width)))', () => {
    window.eval(`
      cropArea.style.left = '10%';
      cropArea.style.top = '20%';
      cropArea.style.width = '0%';
      cropArea.style.height = '0.1%'; // 0.1% of 400 * 2 = 0.8 => Math.round(0.8) = 1
      updatePreview();
    `);

    const canvases = window._createdCanvases;
    expect(canvases.length).toBe(1);
    expect(canvases[0].width).toBe(1); // max(1, 0)
    expect(canvases[0].height).toBe(1); // max(1, 1)
  });
});
