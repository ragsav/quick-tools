import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { setCropArea } from './image-crop.js';

describe('image-crop.js setCropArea', () => {
  let dom;
  let window;
  let document;
  let cropArea;
  let dimOverlay;
  let cropContainer;
  let originalImageEl;
  let cropInfo;

  beforeEach(() => {
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <div id="cropContainer" style="width: 500px; height: 500px;">
            <img id="originalImage" />
            <div id="cropOverlay">
              <div id="cropArea" style="left: 10%; top: 10%; width: 80%; height: 80%;">
              </div>
            </div>
            <div id="dimOverlay"></div>
          </div>
          <p id="cropInfo"></p>
        </body>
      </html>
    `;

    dom = new JSDOM(html);
    window = dom.window;
    document = window.document;

    cropArea = document.getElementById('cropArea');
    dimOverlay = document.getElementById('dimOverlay');
    cropContainer = document.getElementById('cropContainer');
    cropInfo = document.getElementById('cropInfo');
    originalImageEl = { width: 1000, height: 1000 };

    // Mock getBoundingClientRect
    window.HTMLElement.prototype.getBoundingClientRect = function() {
      if (this.id === 'cropContainer') {
        return { left: 0, top: 0, width: 500, height: 500, right: 500, bottom: 500 };
      }
      if (this.id === 'cropArea') {
        const left = parseFloat(this.style.left) / 100 * 500;
        const top = parseFloat(this.style.top) / 100 * 500;
        const width = parseFloat(this.style.width) / 100 * 500;
        const height = parseFloat(this.style.height) / 100 * 500;
        return { left, top, width, height, right: left + width, bottom: top + height };
      }
      return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 };
    };
  });

  it('should update cropArea styles correctly', () => {
    setCropArea(cropArea, dimOverlay, cropContainer, originalImageEl, cropInfo, 20, 30, 40, 50);

    expect(cropArea.style.left).toBe('20%');
    expect(cropArea.style.top).toBe('30%');
    expect(cropArea.style.width).toBe('40%');
    expect(cropArea.style.height).toBe('50%');
  });

  it('should update dimOverlay CSS variables', () => {
    setCropArea(cropArea, dimOverlay, cropContainer, originalImageEl, cropInfo, 20, 30, 40, 50);

    expect(dimOverlay.style.getPropertyValue('--left')).toBe('20%');
    expect(dimOverlay.style.getPropertyValue('--top')).toBe('30%');
    expect(dimOverlay.style.getPropertyValue('--right')).toBe('40%');
    expect(dimOverlay.style.getPropertyValue('--bottom')).toBe('20%'); // 100 - 30 - 50 = 20
  });

  it('should update cropInfo text content', () => {
    setCropArea(cropArea, dimOverlay, cropContainer, originalImageEl, cropInfo, 20, 30, 40, 50);

    expect(cropInfo.textContent).toBe('Selection: 400 × 500 px');
  });
});
