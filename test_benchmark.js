import { JSDOM } from 'jsdom';
const { window } = new JSDOM(`<!DOCTYPE html>`);
const document = window.document;

const text = "This is a <b>test</b> string with & and < and > and ' and \"".repeat(10);

function escapeHtmlDOM(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

const map = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
};

function escapeHtmlRegex(text) {
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

console.time("DOM");
for (let i = 0; i < 10000; i++) {
  escapeHtmlDOM(text);
}
console.timeEnd("DOM");

console.time("Regex");
for (let i = 0; i < 10000; i++) {
  escapeHtmlRegex(text);
}
console.timeEnd("Regex");
