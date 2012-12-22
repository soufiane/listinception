/*
 * Lists collection
 */

var Backbone  = require('backbone'),
    List      = require('list');

var Lists = Backbone.extend({
  model: List,
  url: "/api/lists"
})
