var jade = require('jade-runtime');
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<ul class="buttons"><li data-icon="&#59160;" title="Add a note" class="add-note"></li>');
 if (status === 'new')
{
buf.push('<li data-icon="&#127919;" title="Complete" class="complete"></li><li data-icon="&#128281;" title="Mark new" style="display: none" class="mark-new"></li>');
}
 else
{
buf.push('<li data-icon="&#127919;" title="Complete" style="display: none" class="complete"></li><li data-icon="&#128281;" title="Mark new" class="mark-new"></li>');
}
buf.push('<li data-icon="&#59196;" title="Share" class="share"></li><li data-icon="&#10060;" title="delete" class="delete"></li></ul>');
}
return buf.join("");
}