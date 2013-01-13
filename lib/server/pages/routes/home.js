
/*
 * Render the landing page for anonymous users
 * Render the editor for loggedin users
 */


module.exports  = function (req, res, next) {
  res.render('home');
}
