/*
 * Landing page routes
 */

var Router        = require('router'),
    ButtonsView   = require('./buttons-view'),
    SignupView    = require('./signup-view'),
    LoginView     = require('./login-view');


var currentView = null;

function showView(View) {
  if (currentView) {
    console.log(currentView)
    currentView.$el.unbind()
    currentView.unbind();
    currentView = null
  }
  currentView = new View();

}


/*
 * Landing Page
 */


Router.route('landing', 'landing', function() {
  new ButtonsView();
  showView(SignupView);
});

/*
 * Signup
 */

Router.route('signup', 'signup', function() {
  $("#login-form").slideUp()
  $("#signup-form").slideDown()
  showView(SignupView);
});

/*
 * Login
 */

Router.route('login', 'login', function() {
  $("#signup-form").slideUp()
  $("#login-form").slideDown()

  showView(LoginView);
});
