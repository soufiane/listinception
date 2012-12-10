/*
 * Get a list
 */

couchdb = require('../../couchdb');

module.exports = function(req, res, next) {
  id = req.params.id;
  couchdb.get(id, function(err, body, header) {
    if (err && err.status_code === 404) {
      res.send(404, {errors: [{message: "list is not found."}]});
    } else if (err) {
      res.send(500, {errors: [{message: "Cannot get the document."}]});
      console.log(err);
    } else {
      res.send(body);
    }
  });
};
