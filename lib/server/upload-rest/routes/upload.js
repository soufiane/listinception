/*
 * Upload a file to the server
 *
 */

var fs        = require('fs'),
    poath     = require('path');

/*
 * Write a file to the filesystem
 * and return it's url
 * file are uploaded using ajax and are base64 encoded
 */

module.exports = function(req, res, next) {
  var image = req.files.image;
  if (image) {
    var response = {
      type: image.type,
      path: path.basename(image.path)
    }
    res.send(201, response);
  } else {
    res.send(403, {errors: [{message: 'Bad request'}]});
  }
};
