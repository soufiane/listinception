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
    //$("#login-form").slideUp()
    //$("#signup-form").slideDown()
  },

  login: function (e) {
    Router.navigate('login', {trigger: true});
    e.stopPropagation()
    return false
    //$("#signup-form").slideUp()
    //$("#login-form").slideDown()
  },

});
