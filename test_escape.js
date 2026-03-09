const text = "This is a <b>test</b> string with & and < and > and ' and \"".repeat(100);

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

// Need JSDOM for testing DOM performance in Node
