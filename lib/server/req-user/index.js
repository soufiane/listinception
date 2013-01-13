
/*
 * Add user from session to req.user
 */

function reqUser(req, res, next) {
  if (req.session.user) {
    req.user = req.session.user;
  }
  next()
};

module.exports = reqUser;
