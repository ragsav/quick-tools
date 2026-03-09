const { performance } = require('perf_hooks');

const nums = Array.from({ length: 1000000 }, () => Math.floor(Math.random() * 1000));

performance.mark('reduce-start');
const reduceSum = nums.reduce((a, b) => a + b, 0);
performance.mark('reduce-end');
performance.measure('reduce', 'reduce-start', 'reduce-end');

performance.mark('loop-start');
let loopSum = 0;
for (let i = 0; i < nums.length; i++) {
  loopSum += nums[i];
}
performance.mark('loop-end');
performance.measure('loop', 'loop-start', 'loop-end');

console.log(performance.getEntriesByName('reduce')[0].duration);
console.log(performance.getEntriesByName('loop')[0].duration);
