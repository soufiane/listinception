/*
 * List Model
 */

var Lists = require('lists'),
    _     = require('underscore');


var List = Backbone.extend({
  initialize: function() {
    if (_.isArray(this.children)) {
      this.children = new Lists(this.children);
    }
  }
});
