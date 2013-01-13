
/*
 * Export a different config based on NODE_ENV
 */

var development = require('./development'),
    production  = require('./production');

var NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'production') {
  // TODO change this to use production config
  module.exports = production;
} else {
  module.exports = development;
}

