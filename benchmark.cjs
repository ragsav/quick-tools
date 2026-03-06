const { JSDOM } = require("jsdom");
const { performance } = require("perf_hooks");

const rates = {
  USD: { name: "US Dollar", rate: 1, symbol: "$" },
  EUR: { name: "Euro", rate: 0.92, symbol: "€" },
  GBP: { name: "British Pound", rate: 0.79, symbol: "£" },
  JPY: { name: "Japanese Yen", rate: 149.5, symbol: "¥" },
  INR: { name: "Indian Rupee", rate: 83.12, symbol: "₹" },
  CAD: { name: "Canadian Dollar", rate: 1.36, symbol: "C$" },
  AUD: { name: "Australian Dollar", rate: 1.53, symbol: "A$" },
  CHF: { name: "Swiss Franc", rate: 0.88, symbol: "Fr" },
  CNY: { name: "Chinese Yuan", rate: 7.24, symbol: "¥" },
  SGD: { name: "Singapore Dollar", rate: 1.34, symbol: "S$" },
  AED: { name: "UAE Dirham", rate: 3.67, symbol: "د.إ" },
  MXN: { name: "Mexican Peso", rate: 17.15, symbol: "$" },
  BRL: { name: "Brazilian Real", rate: 4.97, symbol: "R$" },
  KRW: { name: "South Korean Won", rate: 1320, symbol: "₩" },
};

function setupDOM() {
  const dom = new JSDOM(`
    <select id="fromCurrency"></select>
    <select id="toCurrency"></select>
  `);
  return dom.window.document;
}

function runOld(document) {
  const fromSel = document.getElementById("fromCurrency");
  const toSel = document.getElementById("toCurrency");
  fromSel.innerHTML = "";
  toSel.innerHTML = "";

  Object.entries(rates).forEach(([code, data]) => {
    fromSel.innerHTML += `<option value="${code}">${code} - ${data.name}</option>`;
    toSel.innerHTML += `<option value="${code}">${code} - ${data.name}</option>`;
  });
}

function runNew(document) {
  const fromSel = document.getElementById("fromCurrency");
  const toSel = document.getElementById("toCurrency");
  fromSel.innerHTML = "";
  toSel.innerHTML = "";

  let optionsHTML = "";
  Object.entries(rates).forEach(([code, data]) => {
    optionsHTML += `<option value="${code}">${code} - ${data.name}</option>`;
  });
  fromSel.innerHTML = optionsHTML;
  toSel.innerHTML = optionsHTML;
}

const documentOld = setupDOM();
const documentNew = setupDOM();

// Warmup
for(let i=0; i<100; i++) {
    runOld(setupDOM());
    runNew(setupDOM());
}

const ITERATIONS = 1000;

const startOld = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  runOld(documentOld);
}
const endOld = performance.now();

const startNew = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  runNew(documentNew);
}
const endNew = performance.now();

console.log(`Old method took: ${(endOld - startOld).toFixed(2)} ms`);
console.log(`New method took: ${(endNew - startNew).toFixed(2)} ms`);
console.log(`Improvement: ${(((endOld - startOld) - (endNew - startNew)) / (endOld - startOld) * 100).toFixed(2)}%`);
