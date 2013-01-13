var jade = require('jade-runtime');
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<p>' + escape((interp = message) == null ? '' : interp) + '</p><div class="close">x</div>');
}
return buf.join("");
}