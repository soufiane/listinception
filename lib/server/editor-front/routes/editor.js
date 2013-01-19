/*
 * Render editor view
 *
 */

var crypto  = require('crypto');

/*
 * return md5 hash from text
 * used to generate gravatar hashes from email
 */

function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

module.exports = function (req, res) {
  res.render("editor", {md5: md5});
}
