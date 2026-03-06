export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function getContrastColor(r, g, b) {
  return (r * 0.299 + g * 0.587 + b * 0.114) > 150 ? '#000' : '#fff';
}

export function extractColors(img, count) {
  const canvas = document.createElement('canvas');
  const size = 100;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, size, size);

  const data = ctx.getImageData(0, 0, size, size).data;
  const colors = {};

  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i+1] / 32) * 32;
    const b = Math.round(data[i+2] / 32) * 32;
    const key = `${r},${g},${b}`;
    colors[key] = (colors[key] || 0) + 1;
  }

  return Object.entries(colors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key]) => key.split(',').map(Number));
}
