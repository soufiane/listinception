var jade = require('jade-runtime');
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<tr');
buf.push(attrs({ 'data-id':(_id) }, {"data-id":true}));
buf.push('><td>' + escape((interp = username) == null ? '' : interp) + '</td><td><ul class="buttons">');
// iterate permissions
;(function(){
  if ('number' == typeof permissions.length) {

    for (var $index = 0, $$l = permissions.length; $index < $$l; $index++) {
      var p = permissions[$index];

buf.push('<li class="active">' + escape((interp = p) == null ? '' : interp) + '</li>');
    }

  } else {
    var $$l = 0;
    for (var $index in permissions) {
      $$l++;      var p = permissions[$index];

buf.push('<li class="active">' + escape((interp = p) == null ? '' : interp) + '</li>');
    }

  }
}).call(this);

buf.push('</ul></td><td><span class="remove">x</span></td></tr>');
}
return buf.join("");
}