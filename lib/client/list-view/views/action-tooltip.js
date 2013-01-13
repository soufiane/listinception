var Backbone        = require('backbone'),
    Emitter         = require('emitter'),
    Router          = require('router'),
    _               = require('underscore'),
    ShareView       = require('./share'),
    template        = require('../templates/action-tooltip');



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
    console.log('completing');
    // TODO change this
    this.parentModel.set('status', 'completed');
    this.buttons.markNew.show();
    this.buttons.complete.hide();
  },

  markNew: function () {
    console.log('marking new');
    // TODO change this
    this.parentModel.set('status', 'new');
    this.buttons.markNew.hide();
    this.buttons.complete.show();
    
  },

  share: function (e) {
    console.log('share');
    // create a new Share-tooltip view
    // render it, and add it to the body
    // it will be cleaned automaticy
    var shareView = new ShareView({model: this.parentModel});
    shareView.render();
  },

  del: function (e) {
    // TODO change this
    /*
    if (this.parentModel.children.length > 0) {
      alert('Implement deletion of list whit childs')
    } else {
      this.parentView.deleteModel();
    }*/

    var that = this;
    /*
    Emitter.trigger('collection:lists:has-children', {model: this.parentModel}, function(res) {
      if (res) {
        alert('Implement deleting list whith children');
      } else {
        that.parentView.deleteModel();
      }
    });
    */

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
