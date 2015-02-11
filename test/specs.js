var expect = require('chai').expect;
var tpl = require('../index');

function eachSpec (fn) {
  var yaml = require('js-yaml');
  var fs = require('fs');

  var path = __dirname + '/../specs';
  var files = fs.readdirSync(path, 'utf-8');

  files.forEach(function (file) {
    if (file.substr(0, 1) === '~') return;
    var fname = path + '/' + file;
    var data = yaml.safeLoad(fs.readFileSync(fname, 'utf-8'));
    data.tests.forEach(function (test) {
      fn(file, test);
    });
  });
}

describe('specs', function () {
  eachSpec(function (name, spec) {
    it(name + ': ' + spec.name, function () {
      var fn = tpl(spec.template);
      var out = fn(spec.data);
      if (out !== spec.expected) {
        console.log(spec.name);
        console.log(spec.desc);
        console.log("Data: %j", spec.data);
        console.log(spec.template);
        console.log(fn.toString());
        expect(out).eql(spec.expected);
      }
    });
  });
});
