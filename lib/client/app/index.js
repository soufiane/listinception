/*
 * App Bootstrap
 * start the app
 * app = require('app')
 * app.init()
 *
 */

/*
 * Backbone uses id to identify the models state
 * mongodb uses _id
 * chnage bakcbone to use _id instead of id
 */

Backbone.Model.prototype.idAttribute = "_id";

App = {};

