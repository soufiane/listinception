var jade = require('jade-runtime');
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="modal share-modal"><h5 class="title">Share</h5><span class="close">x</span><ul id="sharing-types"><!--li.share-link<h5>Via a secret link.</h5><p>Anyone you give the link to can access the list. No login required.</p><strong>pemissions: </strong><ul class="buttons permissions"><li data-name="view" class="active">view</li><li data-name="edit">edit</li></ul><div class="input-wrapper"><label for="share link">Link:</label><input name="share link" type="text" value="meow my ass" class="share-link"/></div><br/><span class="button share-guest">share</span>--><li class="share-user"><h5>Share with a listinception user</h5><p>Only people you specify can access this list.</p><label for="email">Username:</label><input name="username" type="text" class="username"/><p class="hint">type guest to share with anonymouse users</p><strong>pemissions: </strong><ul class="buttons permissions"><li data-name="view" class="active">view</li><li data-name="edit">edit</li></ul><br/><span class="button share">share</span></li><li class="shared-with"><strong>Shared with:</strong><table class="collaborators"><tr><th>username</th><th>permissions</th><th>delete</th></tr></table></li><li class="public-url"><strong>Public url:</strong><input');
buf.push(attrs({ 'type':("text"), 'value':("http://listinception.com/shared/" + _id) }, {"type":true,"value":true}));
buf.push('/><p class="hint">send this link to the people you want to share this list with</p></li></ul></div>');
}
return buf.join("");
}