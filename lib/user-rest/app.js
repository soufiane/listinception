
/**
 * user-rest
 * provide REST api, all other modules should talk using this api
 *
 * API:
 * GET  users/{id,username} -> get the list
 * POST users -> Create the list
 *  
 */

var express = require('express')
  , routes  = require('./routes')
  , http    = require('http')
  , path    = require('path');


var app = module.exports = express();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/*
 * Create a user
 */

app.post('/', routes.create);

/*
 * Get a user public information
 */

//app.get('/:id', routes.get);

// only listen when starting it directly: node app
if (!module.parent) {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
}
