const { performance } = require('perf_hooks');

const str = "This Is A Very Long String That Keeps Going And Going And Going And Going And Going And Going ".repeat(10000);

performance.mark('split-start');
const splitRes = str.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
performance.mark('split-end');
performance.measure('split', 'split-start', 'split-end');

performance.mark('loop-start');
let loopRes = "";
for (let i = 0; i < str.length; i++) {
  const c = str[i];
  if (c >= 'a' && c <= 'z') {
    loopRes += c.toUpperCase();
  } else if (c >= 'A' && c <= 'Z') {
    loopRes += c.toLowerCase();
  } else {
    loopRes += c;
  }
}
performance.mark('loop-end');
performance.measure('loop', 'loop-start', 'loop-end');

console.log(performance.getEntriesByName('split')[0].duration);
console.log(performance.getEntriesByName('loop')[0].duration);
