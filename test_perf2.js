const { performance } = require('perf_hooks');

const str = "this is a very long string ".repeat(10000);

performance.mark('split-start');
const toggleSplit = str.split("\n").map(l => l.trim()).filter(l => l.length > 0).join("\n");
performance.mark('split-end');
performance.measure('split', 'split-start', 'split-end');

console.log(performance.getEntriesByName('split')[0].duration);
