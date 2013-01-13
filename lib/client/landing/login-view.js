/*
 * Signup view
 */

var Backbone  = require('backbone'),
    $         = require('jquery'),
    Router    = require('router');

module.exports = Backbone.View.extend({
  el: $('#login-form'),

  initialize: function() {
    this.inputs = {
      username: this.$('.username-input'),
      password: this.$('.password-input'),
    };
  },

  events: {
    'click .button': 'login',
  },

  login: function () {
    var data = {
      username: this.inputs.username.val(),
      password: this.inputs.password.val(),
    }

    var req = $.ajax('/api/auth', {data: data, type: 'POST'})
    req.done(function(res, txtStatus, xhr) {
      location.href = "/";
    });


  },

});
