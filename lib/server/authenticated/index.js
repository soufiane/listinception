


function authenticated(req, res, next) {
  if (!req.user) {
    res.status(403);
    res.format({
      text: function() {
        res.send('unauthorized'); // TODO change this with a view
      },
      json: function() {
        res.send({errors: [{message: 'unauthorized'}]})
      }
    })
  } else {
    next();
  }
};

module.exports = authenticated;
