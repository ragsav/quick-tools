export function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export function setCropArea(cropArea, dimOverlay, cropContainer, originalImageEl, cropInfo, leftPct, topPct, widthPct, heightPct) {
  cropArea.style.left = leftPct + '%';
  cropArea.style.top = topPct + '%';
  cropArea.style.width = widthPct + '%';
  cropArea.style.height = heightPct + '%';
  updateDimOverlay(cropArea, dimOverlay, cropContainer);
  updateCropInfo(cropArea, cropContainer, originalImageEl, cropInfo);
}

export function updateDimOverlay(cropArea, dimOverlay, cropContainer) {
  const rect = cropArea.getBoundingClientRect();
  const containerRect = cropContainer.getBoundingClientRect();

  const left = ((rect.left - containerRect.left) / containerRect.width * 100);
  const top = ((rect.top - containerRect.top) / containerRect.height * 100);
  const right = 100 - left - (rect.width / containerRect.width * 100);
  const bottom = 100 - top - (rect.height / containerRect.height * 100);

  dimOverlay.style.setProperty('--left', left + '%');
  dimOverlay.style.setProperty('--top', top + '%');
  dimOverlay.style.setProperty('--right', right + '%');
  dimOverlay.style.setProperty('--bottom', bottom + '%');
}

export function updateCropInfo(cropArea, cropContainer, originalImageEl, cropInfo) {
  if (!originalImageEl) return;
  const containerRect = cropContainer.getBoundingClientRect();
  const scaleX = originalImageEl.width / containerRect.width;
  const scaleY = originalImageEl.height / containerRect.height;

  const width = parseFloat(cropArea.style.width) / 100 * containerRect.width;
  const height = parseFloat(cropArea.style.height) / 100 * containerRect.height;

  const realWidth = Math.round(width * scaleX);
  const realHeight = Math.round(height * scaleY);

  cropInfo.textContent = `Selection: ${realWidth} × ${realHeight} px`;
}

export function updatePreview(originalImageEl, cropContainer, cropArea, croppedPreview) {
  if (!originalImageEl) return;

  const containerRect = cropContainer.getBoundingClientRect();
  const scaleX = originalImageEl.width / containerRect.width;
  const scaleY = originalImageEl.height / containerRect.height;

  const left = parseFloat(cropArea.style.left) / 100 * containerRect.width * scaleX;
  const top = parseFloat(cropArea.style.top) / 100 * containerRect.height * scaleY;
  const width = parseFloat(cropArea.style.width) / 100 * containerRect.width * scaleX;
  const height = parseFloat(cropArea.style.height) / 100 * containerRect.height * scaleY;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const ctx = canvas.getContext('2d');
  ctx.drawImage(originalImageEl, -left, -top);

  croppedPreview.src = canvas.toDataURL('image/png');
}

export function performCrop(originalImageEl, cropContainer, cropArea, originalFile, downloadBtn, setCroppedBlob) {
  if (!originalImageEl) return;

  const containerRect = cropContainer.getBoundingClientRect();
  const scaleX = originalImageEl.width / containerRect.width;
  const scaleY = originalImageEl.height / containerRect.height;

  const left = parseFloat(cropArea.style.left) / 100 * containerRect.width * scaleX;
  const top = parseFloat(cropArea.style.top) / 100 * containerRect.height * scaleY;
  const width = parseFloat(cropArea.style.width) / 100 * containerRect.width * scaleX;
  const height = parseFloat(cropArea.style.height) / 100 * containerRect.height * scaleY;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const ctx = canvas.getContext('2d');
  ctx.drawImage(originalImageEl, -left, -top);

  const mimeType = originalFile.type.includes('png') ? 'image/png' : 'image/jpeg';
  canvas.toBlob((blob) => {
    setCroppedBlob(blob);
    downloadBtn.classList.remove('hidden');
  }, mimeType, 0.92);
}
