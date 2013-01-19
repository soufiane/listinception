/*
 * List Model
 */

var Backbone  = require('backbone'),
    _         = require('underscore'),
    Lists     = require('lists'),
    md        = require('markdown'),
    highlight = require('highlight');

/*
 * Marked doesn't support
 * ``` style code
 * so just try to guess the code for now
 */

md.setOptions({
  highlight: function(code, lang) {
    var highlightedCode = highlight.highlightAuto(code);
    return highlightedCode.value;
  }
});

/*
 * Turn hashtags into urls
 */

function parseHashTags(string) {
  return string
          .replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
            var tag = t.replace("#","%23")
            return t.link("/search/"+tag);
          }).replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
            var username = u.replace("@","");
            return u.link("/"+username);
          });
}

var List = Backbone.Model.extend({
  idAttribute: '_id',
  defaults: function() {
    return {
      state: 'collapsed',
      title: '',
      status: 'new',
      note: '',
      md: {},
      ancestors: [],
      order_date: new Date,
      permissions: {}
    }
  },

  initialize: function() {
    // hold markdown parsed title and description
    var mdd   = {},
        self  = this;

    if (this.get('title')) {
      mdd.title = parseHashTags(md(this.get('title')));
    }

    if (this.get('note')) {
      mdd.note = parseHashTags(md(this.get('note')));
    }

    this.set('md', mdd, {silent:true});

    this.on('change:title', function(model, title) {
      var paresedMd = model.get('md');
      paresedMd.title = parseHashTags(md(title))
      model.set('md', paresedMd, {silent: true})
    });

    this.on('change:note', function(model, note) {
      var paresedMd = model.get('md');
      paresedMd.note = parseHashTags(md(note))
      model.set('md', paresedMd, {silent: true})
    });
  },

  url: function() {
    var id = this.get('id') || this.get('_id');
    if (id) {
      return '/api/lists/' + id
    } else {
      return '/api/lists'
    }
  },
});


module.exports = List;
