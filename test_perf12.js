const { performance } = require('perf_hooks');

performance.mark('split-start');
const splitRes = "this is a very long string ".repeat(10000).toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
performance.mark('split-end');
performance.measure('split', 'split-start', 'split-end');

console.log(performance.getEntriesByName('split')[0].duration);
