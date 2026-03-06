export function showToast(toast, msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}
