var Router    = require('router'),
    $         = require('jquery'),
    Backbone  = require('backbone'),
    Emitter   = require('emitter');



var ViewChanger = Backbone.View.extend({
  el: $('#view-changer'),
  events: {
    'click li': 'changeView'
  },
  changeView: function(e) {
    var view = $(e.currentTarget).data('view');
    Emitter.trigger('view-changer:change', view);
  }
});

module.exports = ViewChanger;
