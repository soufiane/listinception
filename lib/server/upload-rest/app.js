
/**
 * 
 * Upload-rest
 * handles file upload
 * POST -> /api/upload/ upload a file returns a url
 *  
 */

var express       = require('express'),
    routes        = require('./routes'),
    http          = require('http'),
    authenticated = require('../authenticated')
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
 * Authenticate user
 */

app.post('/', routes.upload);

// only listen when starting it directly: node app
if (!module.parent) {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
}
