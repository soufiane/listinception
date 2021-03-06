/*
 * Error Handler
 * Listen to error:error
 * and display appropriate error messages
 * all components should just send error messages
 * and this component will handle them properly
 *
 */

var Emitter   = require('emitter'),
    Backbone  = require('backbone'),
    $         = require('jquery'),
    error     = require('./templates/error');

/*
 * Convenient error model
 */

var ErrorModel = Backbone.Model.extend({});


/*
 * Render and display the error
 */

var ErrorView = Backbone.View.extend({
  className: 'error',
  template: error,

  events: {
    'click .close': 'close',
  },

  initialize: function() {
    var that = this,
        timeout = this.model.get('timeout') || 5000;

    setTimeout(function() {
      that.destroy()
    }, timeout);
  },

  close: function() {
    this.destroy()
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()))
    return this
  },

  destroy: function() {
    this.trigger('destroy');
    this.undelegateEvents();
    this.unbind();
    this.$el.removeData().unbind();
    this.remove();
    this.model.destroy();
  }
})

/*
 * Handle ajax errors
 * listen to jquery ajax error and handle them
 */

$('body').ajaxError(function(e, xhr, settings, exception) {

  var vent = {};

  try {
    // erorr is json
    vent.errors = JSON.parse(xhr.responseText).errors;
  } catch (e) {
    // error is just a text, just display it
    vent.errors = [{message: xhr.responseText}];
  }

  if (xhr.status > 399) {
    console.log(vent)
    Emitter.trigger('error:ajax', vent);
  }

});

/*
 * Added the errors list $element
 */

var $errors = $('<div/>', {class:"errors"}).appendTo('body');

/*
 * Handle errors
 */

Emitter.on('error:ajax error:error', function(e) {
  var errors = e.errors || [];
  // render errors
  errors.forEach(function(err) {
    var errView = new ErrorView({model: new ErrorModel(err)});
    errView.render().$el.appendTo($errors);
  });

});
