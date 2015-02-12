function now() {
  return +new Date();
}

function benchmark(times, fn) {
  var start = now();
  for (var i = 0; i < times; i++) { fn(); }
  var elapsed = now() - start;

  return {
    elapsed: elapsed,
    persec: Math.round(times / elapsed * 1000)
  };
}

function printBenchmark(name, fn) {
  console.log('\n  %s:', name);
  var result = benchmark(5000, fn);
  console.log('    %d/sec  [%dms]', result.persec, result.elapsed);
}

var mini = require('../index');
var mustache = require('mustache');

var data = {
  a: { one: 1 },
  b: { two: 2 },
  c: { three: 3 },
  d: { four: 4 },
  e: { five: 5 }
};
var tpl = '{{#a}}{{one}}{{#b}}{{one}}{{two}}{{one}}{{#c}}{{one}}{{two}}{{three}}{{two}}{{one}}{{#d}}{{one}}{{two}}{{three}}{{four}}{{three}}{{two}}{{one}}{{#e}}{{one}}{{two}}{{three}}{{four}}{{five}}{{four}}{{three}}{{two}}{{one}}{{/e}}{{one}}{{two}}{{three}}{{four}}{{three}}{{two}}{{one}}{{/d}}{{one}}{{two}}{{three}}{{two}}{{one}}{{/c}}{{one}}{{two}}{{one}}{{/b}}{{one}}{{/a}}';
var expected = '11211232112343211234543211234321123211211';
var out;

printBenchmark("ministache (recompiled)", function () {
  out = mini(tpl)(data);
});
if (out !== expected) console.log('    [failed]');

var compiled = mini(tpl);
printBenchmark("ministache (cached)", function () {
  out = compiled(data);
});
if (out !== expected) console.log('    [failed]');

printBenchmark("mustache.js", function () {
  out = mustache.render(tpl, data);
});
if (out !== expected) console.log('    [failed]');
