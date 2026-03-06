import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('updateCropInfo in image-crop.astro', () => {
  let dom;
  let document;
  let window;
  let updateCropInfoFn;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
      <body>
        <div id="cropContainer" style="width: 500px; height: 300px;"></div>
        <div id="cropArea" style="left: 10%; top: 10%; width: 50%; height: 50%;"></div>
        <p id="cropInfo"></p>
      </body>
      </html>
    `);

    window = dom.window;
    document = window.document;

    // Mock getBoundingClientRect
    const container = document.getElementById('cropContainer');
    container.getBoundingClientRect = () => ({
      width: 500,
      height: 300,
      top: 0,
      left: 0,
      right: 500,
      bottom: 300
    });

    const astroFile = fs.readFileSync(path.resolve(__dirname, './image-crop.astro'), 'utf-8');
    const funcMatch = astroFile.match(/function updateCropInfo\(\) \{[\s\S]*?\n    \}/);
    if (!funcMatch) throw new Error('Could not find updateCropInfo function');

    const updateCropInfoSrc = funcMatch[0];

    updateCropInfoFn = (originalImageEl) => {
      const sandbox = {
        cropContainer: container,
        cropArea: document.getElementById('cropArea'),
        cropInfo: document.getElementById('cropInfo'),
        originalImageEl,
        Math,
        parseFloat
      };

      const run = new Function(...Object.keys(sandbox), `
        ${updateCropInfoSrc}
        updateCropInfo();
      `);

      run(...Object.values(sandbox));
    };
  });

  it('calculates correct crop dimensions for standard scaling', () => {
    updateCropInfoFn({ width: 1000, height: 600 });

    // width is 50% of 500 = 250
    // scaleX is 1000 / 500 = 2
    // realWidth = 250 * 2 = 500
    // height is 50% of 300 = 150
    // scaleY is 600 / 300 = 2
    // realHeight = 150 * 2 = 300
    expect(document.getElementById('cropInfo').textContent).toBe('Selection: 500 × 300 px');
  });

  it('handles downscaled images correctly', () => {
    updateCropInfoFn({ width: 250, height: 150 });

    // scaleX is 250 / 500 = 0.5
    // realWidth = 250 * 0.5 = 125
    // scaleY is 150 / 300 = 0.5
    // realHeight = 150 * 0.5 = 75
    expect(document.getElementById('cropInfo').textContent).toBe('Selection: 125 × 75 px');
  });

  it('handles non-integer dimensions by rounding', () => {
    // 33.3% of 500 = 166.5
    document.getElementById('cropArea').style.width = '33.3%';
    document.getElementById('cropArea').style.height = '33.3%';

    updateCropInfoFn({ width: 1000, height: 600 });

    // realWidth = Math.round(166.5 * 2) = 333
    // 33.3% of 300 = 99.9
    // realHeight = Math.round(99.9 * 2) = 200
    expect(document.getElementById('cropInfo').textContent).toBe('Selection: 333 × 200 px');
  });

  it('handles zero dimensions safely', () => {
    document.getElementById('cropArea').style.width = '0%';
    document.getElementById('cropArea').style.height = '0%';

    updateCropInfoFn({ width: 1000, height: 600 });

    expect(document.getElementById('cropInfo').textContent).toBe('Selection: 0 × 0 px');
  });
});
