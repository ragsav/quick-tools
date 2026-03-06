import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const astroFilePath = path.resolve(__dirname, 'svg-to-png.astro');
const astroContent = fs.readFileSync(astroFilePath, 'utf-8');
const scriptMatch = astroContent.match(/<script is:inline>([\s\S]*?)<\/script>/);

// Make functions and variables accessible globally
const scriptContent = `
  ${scriptMatch[1]}
  window.convertImage = convertImage;
  window.setOriginalSvg = (val) => { originalSvg = val; };
  window.setBaseDims = (w, h) => { baseWidth = w; baseHeight = h; };
`;

describe('svg-to-png convertImage', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="dropZone"></div>
      <input type="file" id="fileInput" />
      <div id="controls"></div>
      <img id="originalPreview" />
      <img id="convertedPreview" />
      <div id="originalInfo"></div>
      <div id="convertedInfo"></div>
      <input type="number" id="width" value="200" />
      <input type="number" id="height" value="200" />
      <select id="scale"><option value="1">1</option></select>
      <input type="checkbox" id="maintainRatio" checked />
      <input type="checkbox" id="transparent" checked />
      <button id="convertBtn"></button>
      <button id="downloadBtn" class="hidden"></button>
      <button id="resetBtn"></button>
    `;

    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

    // Evaluate the script using eval instead of script tags to ensure sync execution
    // and access to the variables in the current scope
    eval(scriptContent);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should not do anything if originalSvg is null', () => {
    const canvasCreateSpy = vi.spyOn(document, 'createElement');
    window.setOriginalSvg(null);
    window.convertImage();
    expect(canvasCreateSpy).not.toHaveBeenCalledWith('canvas');
  });

  it('should create a canvas and draw the image with correct dimensions', () => {
    // Mock canvas and context
    const mockCtx = {
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    };

    const mockCanvas = {
      getContext: vi.fn(() => mockCtx),
      toBlob: vi.fn((cb) => cb(new Blob(['mock'])))
    };

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'canvas') return mockCanvas;
      return originalCreateElement(tag);
    });

    const mockImg = new Image();
    mockImg.width = 100;
    mockImg.height = 100;
    window.setOriginalSvg(mockImg);
    window.setBaseDims(100, 100);

    document.getElementById('width').value = '400';
    document.getElementById('height').value = '300';

    window.convertImage();

    expect(mockCanvas.width).toBe(400);
    expect(mockCanvas.height).toBe(300);
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');

    expect(mockCtx.fillRect).not.toHaveBeenCalled();
    expect(mockCtx.drawImage).toHaveBeenCalledWith(mockImg, 0, 0, 400, 300);
    expect(mockCanvas.toBlob).toHaveBeenCalled();
  });

  it('should fill background with white if transparent is unchecked', () => {
    const mockCtx = {
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    };

    const mockCanvas = {
      getContext: vi.fn(() => mockCtx),
      toBlob: vi.fn()
    };

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'canvas') return mockCanvas;
      return originalCreateElement(tag);
    });

    const mockImg = new Image();
    window.setOriginalSvg(mockImg);

    document.getElementById('transparent').checked = false;
    document.getElementById('width').value = '250';
    document.getElementById('height').value = '250';

    window.convertImage();

    expect(mockCtx.fillStyle).toBe('#ffffff');
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 250, 250);
  });

  it('should format size correctly and make download button visible', () => {
    // Mock canvas and context
    const mockCtx = {
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    };

    // We'll call the callback immediately to test the logic inside toBlob
    const mockBlob = new Blob(['mock content']);
    // Make sure size is what we want to test formatting
    Object.defineProperty(mockBlob, 'size', { value: 1024 * 1.5 }); // 1.5 KB

    const mockCanvas = {
      getContext: vi.fn(() => mockCtx),
      toBlob: vi.fn((cb) => cb(mockBlob))
    };

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'canvas') return mockCanvas;
      return originalCreateElement(tag);
    });

    const mockImg = new Image();
    window.setOriginalSvg(mockImg);

    document.getElementById('width').value = '300';
    document.getElementById('height').value = '300';

    const convertedInfo = document.getElementById('convertedInfo');
    const downloadBtn = document.getElementById('downloadBtn');
    const convertedPreview = document.getElementById('convertedPreview');

    window.convertImage();

    expect(convertedPreview.src).toBe('blob:mock-url');
    expect(convertedInfo.textContent).toBe('300 × 300 • 1.5 KB');
    expect(downloadBtn.classList.contains('hidden')).toBe(false);
  });
});
