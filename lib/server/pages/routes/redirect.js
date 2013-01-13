
/*
 * Redirect to /home
 */


module.exports  = function (req, res, next) {
  if (!req.user) {
    res.redirect('/landing');
  } else {
    next()
  }
}
