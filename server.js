var app     = require('./lib/server/app-server'),
    http    = require('http'),
    port    = process.env.NODE_PORT || app.get('port');

/*
 * Start the server
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + port);
});
