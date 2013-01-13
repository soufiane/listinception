var Dropdown      = require('dropdown'),
    $             = require('jquery');


/*
 * Logout
 */

function logout() {
  $.post('/api/auth/logout', function() {
    window.location.reload()
  })
};

module.exports = function() {
  var dropdown = Dropdown('#user-avatar')
        .option('selectable', false)
        .option('menu', false)
        .add('settings', logout)
        .add('logout', logout)
        .on('select', function(slug) { console.log(slug); })
        .on('show', function() {
          // position it correctly
          this.el.css({
            width: '130px',
            position: "absolute",
            top: '51px',
            left: 'auto',
            right: '0'
          })
    });

  return dropdown
};
