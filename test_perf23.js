const { performance } = require('perf_hooks');

const str = "This Is A Very Long String That Keeps Going And Going And Going And Going And Going And Going ".repeat(10000);

performance.mark('split-start');
const splitRes = str.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
performance.mark('split-end');
performance.measure('split', 'split-start', 'split-end');

performance.mark('replace-start');
const replaceRes = str.replace(/[a-zA-Z]/g, c => {
  const code = c.charCodeAt(0);
  return String.fromCharCode(code ^ 32);
});
performance.mark('replace-end');
performance.measure('replace', 'replace-start', 'replace-end');

performance.mark('replace2-start');
const replace2Res = str.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0) ^ 32));
performance.mark('replace2-end');
performance.measure('replace2', 'replace2-start', 'replace2-end');

console.log(performance.getEntriesByName('split')[0].duration);
console.log(performance.getEntriesByName('replace')[0].duration);
console.log(performance.getEntriesByName('replace2')[0].duration);
