export function validateImageFile(file) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select an image file.' };
  }
  return { isValid: true };
}
