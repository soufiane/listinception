
/**
 * Module dependencies.
 * app-server
 * bootstrap the app
 * all other components mount there apps here
 * ex
 *    list = require('listinception.list');
 *    app.use('/lists/', list)
 *
 */

var express = require('express'),
    http    = require('http'),
    crypto  = require('crypto'),
    path    = require('path'),
    routes  = require('./routes');

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


function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

/*
 * Editor route
 */

app.get('/', routes.editor);

// only listen when starting it directly: node app
if (!module.parent) {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
}
