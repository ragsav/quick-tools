const { performance } = require('perf_hooks');

const str = "This Is A Very Long String That Keeps Going And Going And Going And Going And Going And Going ".repeat(10000);

performance.mark('split-start');
const splitRes = str.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
performance.mark('split-end');
performance.measure('split', 'split-start', 'split-end');

performance.mark('regex-start');
const regexRes = str.replace(/([a-z])|([A-Z])/g, (m, l) => l ? m.toUpperCase() : m.toLowerCase());
performance.mark('regex-end');
performance.measure('regex', 'regex-start', 'regex-end');

performance.mark('replace-start');
const replaceRes = str.replace(/[a-zA-Z]/g, c => {
  const code = c.charCodeAt(0);
  return String.fromCharCode(code ^ 32);
});
performance.mark('replace-end');
performance.measure('replace', 'replace-start', 'replace-end');

console.log(performance.getEntriesByName('split')[0].duration);
console.log(performance.getEntriesByName('regex')[0].duration);
console.log(performance.getEntriesByName('replace')[0].duration);
