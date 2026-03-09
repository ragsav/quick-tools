const { performance } = require('perf_hooks');

const str = "This Is A Very Long String That Keeps Going And Going And Going And Going And Going And Going ".repeat(10000);

performance.mark('split-start');
const splitRes = str.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
performance.mark('split-end');
performance.measure('split', 'split-start', 'split-end');

performance.mark('replace-start');
const replaceRes = str.replace(/([a-z])|([A-Z])/g, (m, l, u) => l ? m.toUpperCase() : m.toLowerCase());
performance.mark('replace-end');
performance.measure('replace', 'replace-start', 'replace-end');

console.log(performance.getEntriesByName('split')[0].duration);
console.log(performance.getEntriesByName('replace')[0].duration);
