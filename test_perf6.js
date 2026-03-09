const { performance } = require('perf_hooks');

const str = "This Is A Very Long String That Keeps Going And Going And Going And Going And Going And Going ".repeat(100000);

performance.mark('split-start');
const splitRes = str.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
performance.mark('split-end');
performance.measure('split', 'split-start', 'split-end');

performance.mark('loop-start');
let loopRes = "";
for (let i = 0; i < str.length; i++) {
  const code = str.charCodeAt(i);
  if (code >= 97 && code <= 122) {
    loopRes += String.fromCharCode(code - 32);
  } else if (code >= 65 && code <= 90) {
    loopRes += String.fromCharCode(code + 32);
  } else {
    loopRes += str[i];
  }
}
performance.mark('loop-end');
performance.measure('loop', 'loop-start', 'loop-end');

console.log(performance.getEntriesByName('split')[0].duration);
console.log(performance.getEntriesByName('loop')[0].duration);
