
/**
 * list-rest
 * provide REST api, all other modules should talk using this api
 *
 * API:
 * GET  lists/id -> get the list
 * POST lists -> Create the list
 *  
 */

var express       = require('express'),
    routes        = require('./routes'),
    http          = require('http'),
    authenticated = require('../authenticated'),
    path          = require('path');


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
 * Create a list
 */

app.post('/', authenticated, routes.create);

/*
 * Get a list
 */

app.get('/:id', authenticated, routes.get);

/*
 * Get all lists for the current logged in user
 */

app.get('/me', authenticated, routes.me);


// only listen when starting it directly: node app
if (!module.parent) {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
}
