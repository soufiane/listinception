var Emitter   = require('emitter'),
    $         = require('jquery'),
    template  = require('./template');

/*
 * Progress el
 */

var el = $(template);

/*
 * Append to dom
 */

el.appendTo('body');

/*
 * Show
 */

Emitter.on('progress:show', function() {
  el.slideDown(); 
});

/*
 * Hide
 */

Emitter.on('progress:hide', function() {
  el.slideUp(); 
  el.find('.elapsed-time').css('width', 0);
});


/*
 * Update
 */

Emitter.on('progress:update', function(e) {
  var percent = e.percent;
  el.find('.elapsed-time').css('width', percent);
});

