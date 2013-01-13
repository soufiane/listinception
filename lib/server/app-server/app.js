
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

var express     = require('express'),
    http        = require('http'),
    path        = require('path'),
    config      = require('../config'),
    nib         = require('nib'),
    stylus      = require('stylus'),
    RedisStore  = require('connect-redis')(express),
    reqUser     = require('../req-user');


var app = module.exports = express();

/*
 * Use nib
 */

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib())
    .import('nib');
};

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname + '../../views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({
    uploadDir: path.join(__dirname, '../../../public/uploads'),
    keepExtensions: true
  }));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    cookie: {
      //domain: config.session.domain,
      maxAge: config.session.maxAge},
    secret: config.session.secret,
    store: new RedisStore
  }));
  // add user from session to req.user
  app.use(reqUser);
  // add user from req.user to app.locals
  app.use(function(req, res, next) {
    if (req.user) {
      res.locals({
        user: req.user
      });
    }
      next()
  });
  app.use(app.router);
  app.use(stylus.middleware({
    compile: compile,
    src: path.join(__dirname + '../../../../public')
  }));
  app.use(express.static(path.join(__dirname, '../../../public')));
});


app.configure('development', function(){
  app.use(express.errorHandler());
});

/*
 * List REST api
 */

app.use('/api/lists', require('../list-rest'));

/*
 * User REST api
 */

app.use('/api/users', require('../user-rest'));

/*
 * Auth REST api
 */

app.use('/api/auth', require('../auth-rest'));

/*
 * Uploads
 */

app.use('/api/upload', require('../upload-rest'));


/*
 * Static pages
 */

app.use(require('../pages'));

/*
 * Lists-front end
 */

app.use(require('../list-front'));

/*
 * Editor
 */

app.use('/', require('../editor-front'));

// only listen when starting it directly: node app
if (!module.parent) {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
}
