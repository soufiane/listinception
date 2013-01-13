var jade = require('jade-runtime');
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
 if (state === 'open')
{
buf.push('<span class="toggle collapse">-</span>');
}
 else
{
buf.push('<span class="toggle show">+</span>');
}
buf.push('<span class="circle"></span><!-- title--><span class="title md">' + ((interp = md.title) == null ? '' : interp) + '</span><!-- edit title--><input');
buf.push(attrs({ 'type':("text"), 'value':(title), "class": ('edit-input') }, {"type":true,"value":true}));
buf.push('/><!-- note--><div class="note md">' + ((interp = md.note) == null ? '' : interp) + ' </div><!-- edit note--><textarea class="edit-note">' + escape((interp = note) == null ? '' : interp) + '</textarea>');
 if (state === 'open')
{
buf.push('<ul class="children"></ul>');
}
 else
{
buf.push('<ul style="display:none" class="children"></ul>');
}
buf.push('<!--.tooltip.action-tooltip<ul class="buttons"><li class="add-note">add note</li>');
 if (status === 'new')
{
buf.push('<li class="complete">complete</li>');
}
 else
{
buf.push('<li class="mark-new">mark new</li>');
}
buf.push('<li class="share">share</li><li class="delete">delete</li></ul>--><!--.tooltip.editing-tooltip<ul class="buttons"><li><strong>b</strong></li><li><u>u</u></li><li><i>i</i></li><li>url</li><li>img</li><li>?</li></ul>--><span data-icon="&#59215;" class="drag"></span>');
}
return buf.join("");
}