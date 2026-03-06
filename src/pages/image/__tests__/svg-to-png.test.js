import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleFile, formatSize, convertImage } from '../utils/svg-to-png-utils.js';

describe('svg-to-png handleFile utility', () => {
  let originalFileReader;
  let originalURL;
  let originalBlob;
  let originalImage;
  let alertMock;

  beforeEach(() => {
    // Save originals
    originalFileReader = global.FileReader;
    originalURL = global.URL;
    originalBlob = global.Blob;
    originalImage = global.Image;

    // Setup mocks
    alertMock = vi.fn();
    global.alert = alertMock;

    global.URL = {
      createObjectURL: vi.fn(() => 'mock-url'),
    };

    global.Blob = class {
      constructor(content, options) {
        this.content = content;
        this.options = options;
      }
    };
  });

  afterEach(() => {
    // Restore originals
    global.FileReader = originalFileReader;
    global.URL = originalURL;
    global.Blob = originalBlob;
    global.Image = originalImage;
    global.alert = undefined;
  });

  it('should alert if no file is provided and no callback provided', () => {
    handleFile(null);
    expect(alertMock).toHaveBeenCalledWith('Please select an SVG file.');
  });

  it('should call onError if no file is provided and callback provided', () => {
    const onErrorMock = vi.fn();
    handleFile(null, { onError: onErrorMock });
    expect(onErrorMock).toHaveBeenCalledWith('Please select an SVG file.');
    expect(alertMock).not.toHaveBeenCalled();
  });

  it('should call onError if file type does not include svg', () => {
    const onErrorMock = vi.fn();
    const file = { type: 'image/png' };
    handleFile(file, { onError: onErrorMock });
    expect(onErrorMock).toHaveBeenCalledWith('Please select an SVG file.');
  });

  it('should read the file as text if it is an svg', () => {
    const file = { type: 'image/svg+xml' };
    const mockReadAsText = vi.fn();

    global.FileReader = class {
      constructor() {
        this.onload = null;
      }
      readAsText = mockReadAsText;
    };

    handleFile(file, {});

    expect(mockReadAsText).toHaveBeenCalledWith(file);
  });

  it('should handle FileReader onload and Image onload', () => {
    const file = { type: 'image/svg+xml', size: 1024 };

    let fileReaderInstance;
    global.FileReader = class {
      constructor() {
        this.onload = null;
        fileReaderInstance = this;
      }
      readAsText() {}
    };

    let imgInstance = {
      width: 400,
      height: 300,
      onload: null
    };
    global.Image = class {
      constructor() {
        return imgInstance;
      }
    };

    const onSuccessMock = vi.fn();

    handleFile(file, { onSuccess: onSuccessMock });

    // Simulate FileReader onload
    fileReaderInstance.onload({
      target: { result: '<svg></svg>' }
    });

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(imgInstance.src).toBe('mock-url');

    // Simulate Image onload
    imgInstance.onload();

    expect(onSuccessMock).toHaveBeenCalledWith({
      img: imgInstance,
      baseWidth: 400,
      baseHeight: 300,
      aspectRatio: 400 / 300,
      url: 'mock-url',
      fileSize: 1024
    });
  });

  it('should handle missing width/height on image', () => {
    const file = { type: 'image/svg+xml', size: 1024 };

    let fileReaderInstance;
    global.FileReader = class {
      constructor() {
        this.onload = null;
        fileReaderInstance = this;
      }
      readAsText() {}
    };

    let imgInstance = {
      onload: null
    };
    global.Image = class {
      constructor() {
        return imgInstance;
      }
    };

    const onSuccessMock = vi.fn();

    handleFile(file, { onSuccess: onSuccessMock });

    // Simulate FileReader onload
    fileReaderInstance.onload({
      target: { result: '<svg></svg>' }
    });

    // Simulate Image onload
    imgInstance.onload();

    expect(onSuccessMock).toHaveBeenCalledWith({
      img: imgInstance,
      baseWidth: 200,
      baseHeight: 200,
      aspectRatio: 1,
      url: 'mock-url',
      fileSize: 1024
    });
  });
});

describe('formatSize utility', () => {
  it('should format bytes', () => {
    expect(formatSize(500)).toBe('500 B');
  });

  it('should format kilobytes', () => {
    expect(formatSize(1024 * 1.5)).toBe('1.5 KB');
  });

  it('should format megabytes', () => {
    expect(formatSize(1024 * 1024 * 2.5)).toBe('2.50 MB');
  });
});

describe('convertImage utility', () => {
  let originalDocument;

  beforeEach(() => {
    originalDocument = global.document;
  });

  afterEach(() => {
    global.document = originalDocument;
  });

  it('should return undefined if no originalSvg provided', () => {
    expect(convertImage({ originalSvg: null })).toBeUndefined();
  });

  it('should convert image properly with transparent bg', () => {
    const mockCtx = {
      fillStyle: null,
      fillRect: vi.fn(),
      drawImage: vi.fn()
    };

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockCtx),
      toBlob: vi.fn((cb) => cb('mock-blob'))
    };

    global.document = {
      createElement: vi.fn(() => mockCanvas)
    };

    const onSuccessMock = vi.fn();

    convertImage({
      originalSvg: 'mock-svg',
      width: 800,
      height: 600,
      isTransparent: true
    }, { onSuccess: onSuccessMock });

    expect(global.document.createElement).toHaveBeenCalledWith('canvas');
    expect(mockCanvas.width).toBe(800);
    expect(mockCanvas.height).toBe(600);
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');

    expect(mockCtx.fillRect).not.toHaveBeenCalled();
    expect(mockCtx.drawImage).toHaveBeenCalledWith('mock-svg', 0, 0, 800, 600);

    expect(mockCanvas.toBlob).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalledWith('mock-blob');
  });

  it('should convert image properly with white bg', () => {
    const mockCtx = {
      fillStyle: null,
      fillRect: vi.fn(),
      drawImage: vi.fn()
    };

    const mockCanvas = {
      getContext: vi.fn(() => mockCtx),
      toBlob: vi.fn()
    };

    global.document = {
      createElement: vi.fn(() => mockCanvas)
    };

    convertImage({
      originalSvg: 'mock-svg',
      width: 800,
      height: 600,
      isTransparent: false
    });

    expect(mockCtx.fillStyle).toBe('#ffffff');
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
  });
});
