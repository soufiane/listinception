/*
 *
 * App Bootstrap
 * start the app
 * app = require('app')
 * app.init()
 *
 */

var Backbone  = require("backbone"),
    Router    = require('router'),
    Emitter   = require('emitter'),
    Landing   = require('landing'),
    Editor    = require('editor'),
    ErrorHandler  = require('error');



/*
 * Log all events in debug mode
 */

Emitter.on('all', function(){
  console.log(arguments);
});



/*
 * App
 */

var App = {};

/*
 * Init the app
 */

App.init = function (options) {
  this.config = options.config || {};
  return this
}


/*
 * Start the app
 */

App.start = function () {
  Emitter.trigger('app:starting');
  Backbone.history.start({pushState:true});
  return this
}


module.exports = App;
