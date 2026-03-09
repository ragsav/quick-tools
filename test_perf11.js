const { performance } = require('perf_hooks');

const nums = Array.from({ length: 1000000 }, () => Math.floor(Math.random() * 100));

performance.mark('obj-start');
const freqObj = {};
nums.forEach((n) => (freqObj[n] = (freqObj[n] || 0) + 1));
let maxFreqObj = 0;
for (const key in freqObj) {
    if (freqObj[key] > maxFreqObj) maxFreqObj = freqObj[key];
}
const modesObj = Object.keys(freqObj).filter((n) => freqObj[n] === maxFreqObj);
performance.mark('obj-end');
performance.measure('obj', 'obj-start', 'obj-end');


performance.mark('map-start');
const freqMap = new Map();
let maxFreqMap = 0;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  const count = (freqMap.get(n) || 0) + 1;
  freqMap.set(n, count);
  if (count > maxFreqMap) maxFreqMap = count;
}
const modesMap = [];
for (const [key, value] of freqMap) {
  if (value === maxFreqMap) modesMap.push(key);
}
performance.mark('map-end');
performance.measure('map', 'map-start', 'map-end');

console.log(performance.getEntriesByName('obj')[0].duration);
console.log(performance.getEntriesByName('map')[0].duration);
