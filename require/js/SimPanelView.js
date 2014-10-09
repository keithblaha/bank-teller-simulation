define(['jquery', 'lodash', 'backbone'], function() {
  return Backbone.View.extend({

    baseStyleClass: 'panel',
    buttonClass: 'button',
    deactivatedClass: 'deactivated',
    panelContainer: 'container',

    listeners: {},

    postConstructor: function() {},
    postRender: function() {},

    constructor: function(properties, name) {
      Backbone.View.apply(this, arguments);
      this.name = name;

      this.listenTo(this.model.dispatcher, 'deactivate:' + this.name, this.deactivate);
      this.listenTo(this.model.dispatcher, 'reactivate:' + this.name, this.reactivate);
      this.listenTo(this.model.dispatcher, 'render', this.render);
      _.each(this.listeners, function(callback, message) {
        this.listenTo(this.model.dispatcher, message, this[callback]);
      }, this);

      this.$el.addClass(this.baseStyleClass);
      var $panelContainer = $('#' + this.panelContainer);
      $panelContainer.append(this.el);

      if(!_.isUndefined(this.template)) {
        this.template = _.template(this.template);
      }

      this.postConstructor();
    },

    isActive: function(uiElement) {
      var $e = $(uiElement);
      return !$e.hasClass(this.deactivatedClass) && !$e.parent().hasClass(this.deactivatedClass);
    },

    toggleMode: function(mode) {
      return this.model.toggleMode(mode);
    },

    getPanelContainer: function(name) {
      return this.model.getPanelContainer(name);
    },

    isModeActive: function(mode) {
      return this.model.isModeActive(mode);
    },

    deactivate: function(notSelector) {
      this.$el.find('.'+this.buttonClass).not(this.deactivatedClass).not(notSelector).addClass(this.deactivatedClass);
    },

    reactivate: function(notSelector) {
      this.$el.find('.'+this.deactivatedClass).not(notSelector).removeClass(this.deactivatedClass);
    },

    getTopContainer: function() {
      return this.model.$container;
    },

    render: function() {
      if(!_.isUndefined(this.template)) {
        this.$el.html(this.template(this.model.attributes));
      }
      return this;
    },

    reportEventMetric: function(name, data) {
      this.model.logEventMetric(name, data);
    },

    trigger: function() {
      this.model.dispatcher.trigger.apply(this.model.dispatcher, arguments);
    }
  });
});
