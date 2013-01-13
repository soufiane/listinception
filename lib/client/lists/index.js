/*
 * Lists collection
 */

var Backbone  = require('backbone');

var Lists = Backbone.Collection.extend({
  url: "/api/lists",
  comparator: function(m) {
    var d = new Date(m.get('order_date')).getTime()
    return d
  }
});


module.exports = Lists;
