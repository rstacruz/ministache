/* jshint evil: true */

var esc = 'function __esc(s){' +
  'if (!s)return "";' +
  'return (""+s)' +
  '.replace(/&/g,"&amp;")' +
  '.replace(/"/g,"&quot;")' +
  '.replace(/</g,"&lt;")' +
  '.replace(/>/g,"&gt;")' +
  '}';

var each = 'function __each(o,fn){' +
  'o.forEach?o.forEach(fn):fn(o)' +
  '}';

module.exports = function (tpl, partials) {
  var src = '';
  var closers = [];
  var m;

  while (typeof tpl === 'string') {
    tpl =
      $implicit(tpl) ||
      $comment(tpl) || $context(tpl) || $negative(tpl) || $close(tpl) ||
      $raw(tpl) || $interpolate(tpl) || $text(tpl);
  }

  src = 'with(data||{}){var __val,__out="";' + src + 'return __out;' + esc + each + '}';
  return new Function('data', src);

  function getVal(expr) {
    return 'try{__val=' + expr + '}' +
      'catch(e){' +
      '__val=void 0;' +
      'if (!(e instanceof ReferenceError)&&!(e instanceof TypeError))throw e' +
      '}';
  }

  function $text(tpl) {
    m = tpl.match(/^([\s\S]+?)(\{\{|$)/);
    if (m) {
      src += '__out+=' + JSON.stringify(m[1]) + ';';
      return tpl.substr(m[1].length) || 1;
    }
  }

  function $interpolate(tpl) {
    m = _tag(tpl);
    if (m) {
      src +=
        getVal(m[1]) +
        '__out+=__esc(__val||"");';
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $raw(tpl) {
    m = _tag(tpl, null, true) || _tag(tpl, '&');
    if (m) {
      src +=
        getVal(m[1]) +
        '__out+=__val||"";';
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $context(tpl) {
    m = _tag(tpl, '#');
    if (m) {
      src +=
        getVal(m[1]) +
        'if(__val){__each(__val,function(__val){with(__val){';
      closers.push('}})}');
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $negative(tpl) {
    m = _tag(tpl, '\\^');
    if (m) {
      src +=
        getVal(m[1]) +
        'if (!__val||__val.length===0){if (1){';
      closers.push('}}');
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $close(tpl) {
    m = _tag(tpl, '/');
    if (m) {
      src += closers.pop();
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $comment(tpl) {
    m = _tag(tpl, '(?:!|>)');
    if (m) return tpl.substr(m[0].length);
  }

  function $implicit(tpl) {
    m = tpl.match(/^\{\{\s*\.\s*\}\}/);
    if (m) {
      src += '__out+=__val||"";';
      return tpl.substr(m[0].length);
    }
  }

  function _tag(tpl, prefix, triple) {
    var src = (prefix || '') + '([\\s\\S]*?)';
    src = triple ?
      ('^\\{\\{\\{' + src + '\\}\\}\\}') :
      ('^\\{\\{' + src + '\\}\\}');
    return tpl.match(new RegExp(src));
  }
};
