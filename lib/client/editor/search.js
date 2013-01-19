/*
 * Search view
 * listen to search:search event
 * search the lists and filter them
 */

var Emitter     = require('emitter'),
    $           = require('jquery'),
    Backbone    = require('backbone');



var SearchView = Backbone.View.extend({
  el: $('#search'),
  events: {
    'keyup input': 'search'
  },
  initialize: function() {
    this.input = this.$('input');
    var self = this;
    Emitter.on('search:search', function(term) {
      self.input.val(term);
      self.search()
    })
  },
  search: function() {
    var val = this.input.val();

    var pattern = new RegExp(val, "gmi");

    // hide all the nodes
    $('.node').hide()
    // only show the matched nodes
    lists.filter(function(model) {
      if (pattern.test(model.get('title') + model.get('note'))) {
        model.view.$el.show().parents('li.node').show()
      }
    });

  }

});

module.exports = SearchView;
