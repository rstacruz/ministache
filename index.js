/* jshint evil: true, boss: true */

module.exports = function (tpl, partials) {
  var src = [], closers = [], m;

  while (typeof tpl === 'string') {
    tpl =
      $implicit(tpl) || $comment(tpl) || $context(tpl) || $negative(tpl) ||
      $close(tpl) || $raw(tpl) || $interpolate(tpl) || $text(tpl);
  }

  src = 'with(data||{}){var __val,__out="";'+src.join("")+'return __out;}'+esc+each;
  return new Function('data', src);

  function getVal(expr) {
    return 'try{__val=' + expr + '}' +
      'catch(e){' +
      '__val=void 0;' +
      'if (!(e instanceof ReferenceError)&&!(e instanceof TypeError))throw e' +
      '}';
  }

  function $text(tpl) {
    if (m = tpl.match(/^([\s\S]+?)(\{\{|$)/)) {
      src.push('__out+=' + JSON.stringify(m[1]) + ';');
      return tpl.substr(m[1].length) || 1;
    }
  }

  function $interpolate(tpl) {
    if (m = getTag(tpl)) {
      src.push(getVal(m[1]) + '__out+=__esc(__val||"");');
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $raw(tpl) {
    if (m = (getTag(tpl, null, true) || getTag(tpl, '&'))) {
      src.push(getVal(m[1]) + '__out+=__val||"";');
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $context(tpl) {
    if (m = getTag(tpl, '#')) {
      src.push(getVal(m[1])+'if(__val){__each(__val,function(__val){with(__val){');
      closers.push('}})}');
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $negative(tpl) {
    if (m = getTag(tpl, '\\^')) {
      src.push(getVal(m[1]) + 'if (!__val||__val.length===0){');
      closers.push('}');
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $close(tpl) {
    if (m = getTag(tpl, '/')) {
      src.push(closers.pop());
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $comment(tpl) {
    if (m = getTag(tpl, '(?:!|>)'))
      return tpl.substr(m[0].length) || 1;
  }

  function $implicit(tpl) {
    if (m = tpl.match(/^\{\{\s*\.\s*\}\}/)) {
      src.push('__out+=__val||"";');
      return tpl.substr(m[0].length) || 1;
    }
  }

  function getTag(tpl, prefix, triple) {
    var src = (prefix || '') + '([\\s\\S]*?)';
    src = triple ?
      ('^\\{\\{\\{' + src + '\\}\\}\\}') :
      ('^\\{\\{' + src + '\\}\\}');
    return tpl.match(new RegExp(src));
  }
};

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
