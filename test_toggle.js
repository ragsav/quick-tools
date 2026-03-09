const assert = require('assert');

function toggleCase(input) {
  return input.replace(/[a-zA-Z]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) ^ 32),
  );
}

assert.strictEqual(toggleCase("hello WORLD"), "HELLO world");
assert.strictEqual(toggleCase("123 abc! DEF?"), "123 ABC! def?");
assert.strictEqual(toggleCase(""), "");

console.log("All toggle case tests passed!");
