var ObjectID  = require('mongodb').ObjectID,
    List      = require('../../list'),
    crypto    = require('crypto'),
    request   = require('superagent');


function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

module.exports = function(req, res, next)  {
  var id      = req.params.id,
      errors  = [];
  
  request
    .get('localhost:3000/api/lists/' + id + '/tree')
    .set('cookie', req.header('cookie'))
    .end(function(err, resp) {
      if (resp.ok) {
        res.render('editor', {md5:md5})
      } else {
        //res.send(resp.status, resp.body);
        res.send(resp.status, "cant get the list");
      }
    });
}
