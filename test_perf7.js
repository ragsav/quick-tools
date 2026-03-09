const { performance } = require('perf_hooks');

const str = "This Is A Very Long String That Keeps Going And Going And Going And Going And Going And Going ".repeat(100000);

performance.mark('split-start');
const splitRes = str.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
performance.mark('split-end');
performance.measure('split', 'split-start', 'split-end');

performance.mark('regex-start');
const regexRes = str.replace(/[a-zA-Z]/g, c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase());
performance.mark('regex-end');
performance.measure('regex', 'regex-start', 'regex-end');

console.log(performance.getEntriesByName('split')[0].duration);
console.log(performance.getEntriesByName('regex')[0].duration);
