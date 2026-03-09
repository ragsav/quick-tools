const { performance } = require('perf_hooks');

const str = "This Is A Very Long String That Keeps Going And Going And Going And Going And Going And Going ".repeat(10000);

performance.mark('split-start');
const splitRes = str.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
performance.mark('split-end');
performance.measure('split', 'split-start', 'split-end');

performance.mark('replace2-start');
const replace2Res = str.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0) ^ 32));
performance.mark('replace2-end');
performance.measure('replace2', 'replace2-start', 'replace2-end');

performance.mark('replace3-start');
const replace3Res = str.replace(/[a-zA-Z]/g, c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase());
performance.mark('replace3-end');
performance.measure('replace3', 'replace3-start', 'replace3-end');


console.log(performance.getEntriesByName('split')[0].duration);
console.log(performance.getEntriesByName('replace2')[0].duration);
console.log(performance.getEntriesByName('replace3')[0].duration);
