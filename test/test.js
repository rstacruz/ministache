var expect = require('chai').expect;
var tpl = require('../index');

it('works', function () {
  var out = tpl
    ('hello {{world}}')
    ({ world: 'world' });

  expect(out).eql('hello world');
});

it('escaping', function () {
  var out = tpl
    ('hello {{world}}')
    ({ world: 'me & you' });

  expect(out).eql('hello me &amp; you');
});

it('unescaped', function () {
  var out = tpl
    ('hello {{{world}}}')
    ({ world: 'me & you' });

  expect(out).eql('hello me & you');
});
it('context: object', function () {
  var out = tpl
    ('so, {{#message}}hello {{world}}{{/message}}!')
    ({ message: { world: 'world' }});

  expect(out).eql('so, hello world!');
});
