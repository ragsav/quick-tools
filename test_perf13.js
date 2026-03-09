const { performance } = require('perf_hooks');

const str = "This Is A Very Long String That Keeps Going And Going And Going And Going And Going And Going ".repeat(10000);

performance.mark('split-start');
const splitRes = str.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
performance.mark('split-end');
performance.measure('split', 'split-start', 'split-end');

performance.mark('regex-start');
const regexRes = str.replace(/([a-z]+)|([A-Z]+)/g, (m, l, u) => l ? m.toUpperCase() : m.toLowerCase());
performance.mark('regex-end');
performance.measure('regex', 'regex-start', 'regex-end');

performance.mark('regex-char-start');
const regexCharRes = str.replace(/[a-zA-Z]/g, c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase());
performance.mark('regex-char-end');
performance.measure('regex-char', 'regex-char-start', 'regex-char-end');

performance.mark('loop-start');
let loopRes = "";
for(let i=0; i<str.length; i++) {
  let c = str[i];
  if(c>='a' && c<='z') loopRes += c.toUpperCase();
  else if(c>='A' && c<='Z') loopRes += c.toLowerCase();
  else loopRes += c;
}
performance.mark('loop-end');
performance.measure('loop', 'loop-start', 'loop-end');


console.log(performance.getEntriesByName('split')[0].duration);
console.log(performance.getEntriesByName('regex')[0].duration);
console.log(performance.getEntriesByName('regex-char')[0].duration);
console.log(performance.getEntriesByName('loop')[0].duration);
