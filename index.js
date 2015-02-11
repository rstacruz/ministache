/* jshint evil: true */
var esc = 'function e(s){return s' +
  '.replace(/&/g,"&amp;")' +
  '.replace(/"/g,"&quot;")' +
  '.replace(/</g,"&lt;")' +
  '.replace(/>/g,"&gt;")' +
  '}';

module.exports = function (tpl) {
  var src = '';
  var m;

  function $text(tpl) {
    m = tpl.match(/^(.+?)(\{\{|$)/);
    if (m) {
      src += 'out+=' + JSON.stringify(m[1]) + ';';
      return tpl.substr(m[1].length) || 1;
    }
  }

  function $tag(tpl) {
    m = tpl.match(/^\{\{([^\^\#\&\/].+?)\}\}/);
    if (m) {
      src += 'out+=e(' + m[1] + ');';
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $raw(tpl) {
    m = tpl.match(/^\{\{\{(.+?)\}\}\}/);
    if (m) {
      src += 'out+=' + m[1] + ';';
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $context(tpl) {
    m = tpl.match(/^\{\{#(.+?)\}\}/);
    if (m) {
      src += 'if('+m[1]+'){with('+m[1]+'){';
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $close(tpl) {
    m = tpl.match(/^\{\{\/.*?\}\}/);
    if (m) {
      src += '}}';
      return tpl.substr(m[0].length) || 1;
    }
  }

  while (typeof tpl === 'string') {
    tpl =
      $context(tpl) || $close(tpl) ||
      $raw(tpl) || $tag(tpl) || $text(tpl);
  }

  src = 'with(data||{}){var out="";' + src + 'return out;' + esc + '}';
  return new Function('data', src);
};
