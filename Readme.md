# ministache

Mustache templating solution with a focus on a slim size and fast runtime.
Semi-spec compliant mustache implementation.

<br>

## API

```js
var compile = require('ministache');
var template = "Greetings, {{name}}";

var tpl = compile(template);
  
tpl({ name: "John Constantine" })
=> "Greetings, John Constantine"
```

See the [mustache(5)](http://mustache.github.io/mustache.5.html) man page for
an overview of features.

<br>

## Why?

ministache is ideal for use in embedding in other redistributable frontend
libraries.

* __Small:__ Only <1kb gzipped.
* __Standard:__ Compliant with almost all mustache specs (see below)

<br>

## Why not?

There are some mustache features that were dropped to achieve its minimal size.

* It's only about 40% the speed of mustache.js.
* Does not support whitespace collapsing. Not really an issue much for HTML, anyway.
* Does not support partials.
* Does not support set-delimiters (`{{=<% %>=}}`).

<br>

## Also see

* [tj/minstache](https://github.com/visionmedia/minstache) (`min` and not `mini`), which isn't spec compliant and doesn't support contexts (`{{#user}}{{name}}{{/}}`)

* [janl/mustache.js](https://github.com/janl/mustache.js), a fast and feature-filled solution that supports partials and such
