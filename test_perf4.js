const { performance } = require('perf_hooks');

const str = "this is a very long string ".repeat(10000);

performance.mark('map-start');
const mapRes = str.split("\n").map(l => l.trim()).filter(l => l.length > 0).join("\n");
performance.mark('map-end');
performance.measure('map', 'map-start', 'map-end');

console.log(performance.getEntriesByName('map')[0].duration);
