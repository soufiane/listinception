
/**
 * Module dependencies.
 * Static Pages.
 */

var express   = require('express'),
    http      = require('http'),
    routes    = require('./routes'),
    path      = require('path');

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname + '/views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/', routes.redirect);

/*
 * Home page (landing page)
 *
 */

app.get('/landing', routes.home);
app.get('/signup', routes.home);
app.get('/login', routes.home);


// only listen when starting it directly: node app
if (!module.parent) {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
}
