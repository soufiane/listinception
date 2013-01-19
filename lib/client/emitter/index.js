/*
 *
 * Emitter
 * global event dispatcher
 * @extend backbone.events
 *
 */


var Backbone    = require('backbone'),
    _           = require('underscore');


var Emitter = {};

/*
 * Extend Emitter
 */

_.extend(Emitter, Backbone.Events);


module.exports = Emitter;

