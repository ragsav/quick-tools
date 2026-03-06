// Extracted logic for testing

export function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderImageList(images, elements) {
  const { imageList, options, actions, dropZone } = elements;

  if (images.length === 0) {
    imageList.classList.add('hidden');
    options.classList.add('hidden');
    actions.classList.add('hidden');
    dropZone.classList.remove('hidden');
    return;
  }

  dropZone.classList.add('hidden');
  imageList.classList.remove('hidden');
  options.classList.remove('hidden');
  actions.classList.remove('hidden');

  imageList.innerHTML = images.map((img, i) => `
    <div class="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded" data-index="${i}">
      <span class="text-slate-400 cursor-move">⋮⋮</span>
      <img src="${img.dataUrl}" class="w-12 h-12 object-cover rounded" />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-700 truncate">${escapeHtml(img.name)}</p>
        <p class="text-xs text-slate-500">${img.width} × ${img.height} • ${formatSize(img.size)}</p>
      </div>
      <button class="remove-btn text-red-500 hover:text-red-700 p-1" data-index="${i}">✕</button>
    </div>
  `).join('');
}
