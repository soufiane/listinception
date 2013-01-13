/*
 * Login view
 */

var Backbone  = require('backbone'),
    $         = require('jquery'),
    Router    = require('router');

module.exports = Backbone.View.extend({
  el: $('#signup-form'),
  initialize: function() {
    // j shortcut for this.$
    this.inputs = {
      username: this.$('.username-input'),
      password: this.$('.password-input'),
      email:   this.$('.email-input')
    };

  },

  events: {
    'click .button': 'signup',
  },

  signup: function () {
    // TODO 
    // 1. add email validation
    // 2. handle errors in a global ajax error handling

    var data = {
      username: this.inputs.username.val(),
      password: this.inputs.password.val(),
      email:    this.inputs.email.val()
    }

    var req = $.ajax('/api/users', {data: data, type: 'POST'})
    req.done(function(res, txtStatus, xhr) {
      location.href = "/"
    });

  },

});
