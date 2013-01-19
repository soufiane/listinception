var Backbone        = require('backbone'),
    Emitter         = require('emitter'),
    Router          = require('router'),
    _               = require('underscore'),
    ShareView       = require('./share'),
    template        = require('../templates/action-tooltip');

/*
 * Display an action tooltip after hovering over the list circle for
 * 1 second
 */

var ActionTooltipView = Backbone.View.extend({

  className: 'tooltip action-tooltip',
  template: template,

  events: {
    'click .add-note': 'note',
    'click .complete': 'complete',
    'click .mark-new': 'markNew',
    'click .share'   : 'share',
    'click .delete'  : 'del',
    'mouseleave'     : 'destroy'
  },

  initialize: function() {
    this.parentView   = this.options.parentView;
    this.parentModel  = this.parentView.model;
    var p             = this.parentView;
    var that          = this;

    // remove this view
    // when the parent view is destroyed
    p.on('destroy', _.bind(this.destroy, this));

    // get the view element when the parent view has been rendered
    this.on('render', function() {
       // buttons
      this.buttons = {
        addNote: that.$('.add-note'),
        markNew: that.$('.mark-new'),
        complete: that.$('.complete'),
        share: that.$('.share'),
        del: that.$('.delete')
      }
    })

  },

  note: function (e) {
    // show the note text area
    // get note value and add it there
    // hide the note

    //Emitter.trigger('view:list-view:add-note', {model: this.model});
    this.parentView.editNote(e);
  },

  complete: function (e) {
    this.parentModel.set('status', 'completed');
    this.buttons.markNew.show();
    this.buttons.complete.hide();
  },

  markNew: function () {
    this.parentModel.set('status', 'new');
    this.buttons.markNew.hide();
    this.buttons.complete.show();
  },

  share: function (e) {
    var shareView = new ShareView({model: this.parentModel});
    shareView.render();
  },

  del: function (e) {
    var that = this;
    that.parentView.deleteModel();
  },

  render: function() {
    this.$el.html(this.template({status:this.parentModel.get('status')}));
    this.trigger('render');
    return this
  },

  destroy: function() {
    this.trigger('destroy');
    this.undelegateEvents();
    this.unbind();
    this.$el.removeData().unbind();
    this.remove();
    console.log('action view destroyed.');
  },

});


module.exports = ActionTooltipView;
