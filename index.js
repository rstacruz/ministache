/* jshint evil: true */
var esc = 'function e(s){' +
  'if (!s)return "";' +
  'return (""+s)' +
  '.replace(/&/g,"&amp;")' +
  '.replace(/"/g,"&quot;")' +
  '.replace(/</g,"&lt;")' +
  '.replace(/>/g,"&gt;")' +
  '}';

var each = 'function each(o,fn){' +
  'o.forEach?o.forEach(fn):fn(o)' +
  '}';

module.exports = function (tpl) {
  var src = '';
  var closers = [];
  var m;

  function getVal(expr) {
    return 'try{val=' + expr + '}' +
      'catch(e){' +
      'val=void 0;' +
      // 'if (!(e instanceof ReferenceError))throw e' +
      '}';
  }

  function $text(tpl) {
    m = tpl.match(/^([\s\S]+?)(\{\{|$)/);
    if (m) {
      src += 'out+=' + JSON.stringify(m[1]) + ';';
      return tpl.substr(m[1].length) || 1;
    }
  }

  function $tag(tpl) {
    m = tpl.match(/^\{\{([^\^\#\&\/][\s\S]*?)\}\}/);
    if (m) {
      src +=
        getVal(m[1]) +
        'out+=e(val||"");';
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $raw(tpl) {
    m = tpl.match(/^\{\{\{([\s\S]+?)\}\}\}/) ||
      tpl.match(/^\{\{&([\s\S]+?)\}\}/);
    if (m) {
      src +=
        getVal(m[1]) +
        'out+=val||"";';
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $context(tpl) {
    m = tpl.match(/^\{\{#([\s\S]+?)\}\}/);
    if (m) {
      src +=
        getVal(m[1]) +
        'if(val){each(val,function(val){with(val){';
      closers.push('}})}');
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $negative(tpl) {
    m = tpl.match(/^\{\{\^([\s\S]+?)\}\}/);
    if (m) {
      src +=
        getVal(m[1]) +
        'if (!val||val.length===0){if (1){';
      closers.push('}}');
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $close(tpl) {
    m = tpl.match(/^\{\{\/[\s\S]*?\}\}/);
    if (m) {
      src += closers.pop();
      return tpl.substr(m[0].length) || 1;
    }
  }

  function $comment(tpl) {
    m = tpl.match(/^\{\{![\s\S]*?\}\}/);
    if (m) return tpl.substr(m[0].length);
  }

  function $implicit(tpl) {
    m = tpl.match(/^\{\{\s*\.\s*\}\}/);
    if (m) {
      src += 'out+=val||"";';
      return tpl.substr(m[0].length);
    }
  }

  while (typeof tpl === 'string') {
    tpl =
      $implicit(tpl) ||
      $comment(tpl) || $context(tpl) || $negative(tpl) || $close(tpl) ||
      $raw(tpl) || $tag(tpl) || $text(tpl);
  }

  src = 'with(data||{}){var self,val,out="";' + src + 'return out;' + esc + each + '}';
  return new Function('data', src);
};
