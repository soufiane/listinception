var Backbone = require('backbone'),
    Emitter  = require('emitter'),
    $        = require('jquery'),
    _        = require('underscore'),
    share    = require('../templates/share'),
    collaboratorTemplate  = require('../templates/collaborator');

/*
 * Overlay
 * TODO
 * 1. move this to it's own package
 */


/*
 * create the model view
 * loop over the permissions
 * create a new view for each one
 * add them to the model view
 * each view is responsible for managing it's model
 */

$.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}

var overlay = $('<div/>', {
  id: 'overlay'
}).appendTo('body');

Emitter
  .on('overlay:hide', function() {
    overlay.slideUp();
  })
  .on('overlay:show', function () {
    overlay.slideDown();
  })

var ShareView = Backbone.View.extend({
  template: share,
  events: {
    'click .close': 'destroy',
    'click .share': 'share',
    'click .permissions li': 'changePermissions',
    'click .remove': 'removePermission'
  },

  initialize: function() {
    var self = this;
    this.on('render-collaborators', _.bind(this.renderCollaborators, this));
    this.on('update-collaborators', _.bind(this.updateCollaborators, this));

    if (!_.isEmpty(this.model.get('permissions'))) {
      self.trigger('update-collaborators');
    }

  },

  updateCollaborators: function() {
    var self = this;
    $.get(this.model.url() + '/permissions', function(data) {
      self.trigger('render-collaborators', data)
    });
  },

  renderCollaborators: function(data) {
    var html = "";
    data.forEach(function(c) {
      html += collaboratorTemplate(c);
    });
    this.$('.collaborators').append(html);
  }, 

  getPermissions: function(el) {
    var perms = [];
    el.find('.permissions li.active')
      .each(function(i,p) {
        perms.push($(p).data('name'));
      })
    return perms
  },

  changePermissions: function(e) {
    console.log(e.currentTarget)
    $(e.currentTarget).toggleClass('active'); //.siblings().removeClass('active');
  },

  removePermission: function(e) {
    var p = $(e.currentTarget).parents('tr:first'),
        self = this;

    if (p.data('id') === this.model.get('user').id) {
      alert('you cant remove the owner of the list');
      return
    }

    var req = $.ajax({
      url: this.model.url() + '/permissions',
      data: {id: p.data('id')},
      type: 'DELETE'
    });

    req.done(function() {
      // remove the element from the dome
      // remove it from the model
      var perms = self.model.get('permissions');
      delete perms[p.data('id')]
      self.model.set('permissions', perms);
      p.slideUp().remove();
    });
  },

  share: function() {

    var newPerms        = this.getPermissions(this.$('.share-user')),
        model           = this.model,
        usernameInput   = this.$('.username'),
        username        = usernameInput.val(),
        self            = this;

    if (username === model.get('user').username) {
      alert('the owner cant be added');
      return
    }

    if (newPerms.length === 0) {
      alert('plase choose permissions')
      return
    }

    if (username) {

      $.get('/api/users/' + username, function(user) {
        var perms = model.get('permissions'),
            isThere = perms[user._id];
        if (isThere) {
          alert(user.username + ' is already in the permissions');
          return
        }

        perms[user._id] = newPerms;
        model.set('permissions', perms);
        console.log(model.get('permissions'));

        // save the permissions
        $.post(model.url() + '/permissions', {id: user._id, permissions: newPerms}, function(data) {
          console.log('updated');
          console.log(data);
          self.trigger('render-collaborators', [{_id: user._id, username: user.username, permissions: newPerms}]);
          // render the model there, so it can add and readd the permissions;
        });

      });
    }
  },

  destroy: function() {
    this.trigger('destroy');
    this.undelegateEvents();
    this.unbind();
    this.$el.removeData().unbind();
    this.remove();
    Emitter.trigger('overlay:hide');
    console.log('action view destroyed.');
  },
  render: function () {
    Emitter.trigger('overlay:show');
    this.setElement($(this.template(this.model.toJSON())));
    this.$el.appendTo('body').center();

    return this
  }

});

module.exports = ShareView;
