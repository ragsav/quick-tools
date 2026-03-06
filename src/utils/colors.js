export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function getContrastColor(r, g, b) {
  return (r * 0.299 + g * 0.587 + b * 0.114) > 150 ? '#000' : '#fff';
}
