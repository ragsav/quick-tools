const { performance } = require('perf_hooks');

const str = "this is a very long string ".repeat(10000);

performance.mark('split-start');
const toggleSplit = str.split("").map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
performance.mark('split-end');
performance.measure('split', 'split-start', 'split-end');

performance.mark('regex-start');
const toggleRegex = str.replace(/[a-zA-Z]/g, (c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase());
performance.mark('regex-end');
performance.measure('regex', 'regex-start', 'regex-end');

console.log(performance.getEntriesByName('split')[0].duration);
console.log(performance.getEntriesByName('regex')[0].duration);
