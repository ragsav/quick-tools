export function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export function handleFile(file, callbacks) {
  if (!file || !file.type.includes('svg')) {
    if (callbacks && callbacks.onError) {
      callbacks.onError('Please select an SVG file.');
    } else {
      alert('Please select an SVG file.');
    }
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    const svgContent = e.target.result;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const baseWidth = img.width || 200;
      const baseHeight = img.height || 200;
      const aspectRatio = baseWidth / baseHeight;

      if (callbacks && callbacks.onSuccess) {
        callbacks.onSuccess({
          img,
          baseWidth,
          baseHeight,
          aspectRatio,
          url,
          fileSize: file.size
        });
      }
    };
    img.src = url;
  };

  reader.readAsText(file);
}

export function convertImage(options, callbacks) {
  const {
    originalSvg,
    width,
    height,
    isTransparent
  } = options;

  if (!originalSvg) return;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!isTransparent) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(originalSvg, 0, 0, width, height);

  canvas.toBlob((blob) => {
    if (callbacks && callbacks.onSuccess) {
      callbacks.onSuccess(blob);
    }
  }, 'image/png');
}
