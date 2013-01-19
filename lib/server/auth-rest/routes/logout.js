/*
 * Log the user out
 *
 */



module.exports = function(req, res, next) {
  req.session.destroy(function() {
    res.send(200);
  });
};
