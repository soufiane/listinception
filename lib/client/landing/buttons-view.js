/*
 * Header buttons view
 */

var Backbone  = require('backbone'),
    $         = require('jquery'),
    Router    = require('router');

module.exports = Backbone.View.extend({
  el: $('#action-buttons'),
  events: {
    'click .signup': 'signup',
    'click .login': 'login'
  },
  signup: function (e) {
    // just navigate the url
    Router.navigate('signup', {trigger: true});
    e.stopPropagation()
    return false
  },

  login: function (e) {
    Router.navigate('login', {trigger: true});
    e.stopPropagation()
    return false
  },
});
