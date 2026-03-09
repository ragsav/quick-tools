const { performance } = require('perf_hooks');

const str = "This Is A Very Long String That Keeps Going And Going And Going And Going And Going And Going ".repeat(100000);

performance.mark('split-start');
const splitRes = str.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
performance.mark('split-end');
performance.measure('split', 'split-start', 'split-end');

performance.mark('replace2-start');
const replace2Res = str.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0) ^ 32));
performance.mark('replace2-end');
performance.measure('replace2', 'replace2-start', 'replace2-end');

console.log(performance.getEntriesByName('split')[0].duration);
console.log(performance.getEntriesByName('replace2')[0].duration);
