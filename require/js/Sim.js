define(['socket.io', 'CustomerPanel', 'DialoguePanel', 'ModulePanel', 'ActionPanel', 'OverlayPanel', 'CounterPanel', 'text!templates/container.html', 'jquery', 'lodash', 'backbone'],
function(io,          CustomerPanel,   DialoguePanel,   ModulePanel,   ActionPanel,   OverlayPanel,   CounterPanel,   containerTemplate) {
  return Backbone.Model.extend({

    constructor: function(contextPath) {
      Backbone.Model.apply(this);
      this.set('contextPath', contextPath);

      this.socket = io.connect();
      this.modes = {
        correlate: false
      };
      this.$container = $('#container');

      this.dispatcher = _.clone(Backbone.Events);
      this.listenTo(this.dispatcher, 'correlating', this.evaluateCorrelation);
      this.listenTo(this.dispatcher, 'done-correlating', this.doneCorrelating);
      this.listenTo(this.dispatcher, 'action', this.reportAction);

      this.$container.mousemove($.proxy(function(e) {
        this.currentMouseEvent = e;
      }, this));

      $('#start').click($.proxy(function() {
        this.socket.emit('ready');
      }, this));

      _.each(['begin', 'end', 'advance', 'update'], function(eventName) {
        this.socket.on(eventName, $.proxy(this[eventName], this));
      }, this);

      this.$container.css({visibility: 'visible'});
    },

    begin: function(data) {
      this.$container.html(containerTemplate);
      this.set(data);
      this.currentScenario = 0;
      this.panels = [
        new OverlayPanel(this),
        new DialoguePanel(this),
        new CustomerPanel(this),
        new ModulePanel(this),
        new ActionPanel(this),
        new CounterPanel(this)
      ];

      this.startGatheringMetrics();
      this.logEventMetric('start');

      _.each(this.panels, function(p) {
        p.view.postRender();
      });
    },

    end: function(data) {
      this.logEventMetric('end');
      clearInterval(this.mouseHoversInterval);
      clearInterval(this.reportMetricsInterval);
      this.$container
        .css({
          'text-align': 'center',
          'background': 'none'
        })
        .html('<div>You correctly answered ' + _.filter(data, 'correct').length + ' out of ' + data.length + ' scenarios and took an average of ' + Math.round(_.reduce(_.pluck(data, 'time'), function(s, n) {return s + n;}) / data.length) + ' milliseconds per answer</div><br>')
        .append(_.map(data, function(d, i){return '<div>scenario ' + (i+1) + ': ' + d.time + ' milliseconds (' + (d.correct ? 'correct' : 'incorrect') + ')</div>';}).join('') + '<br>')
        .append('<div class="button" onclick="location.reload(true)">Retry</div>')
        .css({visibility: 'visible'});
    },

    advance: function(data) {
      this.currentScenario++;
      this.set(data);
      this.dispatcher.trigger('render');
      _.each(this.panels, function(p) {
        p.view.postRender();
      });
      this.$container.css({visibility: 'visible'});
    },

    update: function(data) {
      if(!_.isEmpty(data)) {
        _.merge(this.attributes, data, function(a,b){
          return _.isArray(a) ? a.concat(b) : undefined;
        });
      }
      this.dispatcher.trigger('update', data);
    },

    makeMetrics: function() {
      var metrics = {};
      metrics.hovers = {};
      metrics.clicks = {};
      metrics.events = {};
      return metrics;
    },

    startGatheringMetrics: function() {
      this.metrics = this.makeMetrics();
      this.mouseHoversInterval = setInterval($.proxy(function() {
        if(!_.isUndefined(this.currentMouseEvent)) {
          this.metrics.hovers[_.now()] = this.getEventId(this.currentMouseEvent);
        }
      }, this), 50);

      $(document).click($.proxy(function(e) {
        this.metrics.clicks[_.now()] = this.getEventId(e);
      }, this));

      this.reportMetricsInterval = setInterval($.proxy(function() {
        this.reportMetrics();
      }, this), 2000);
    },

    getEventId: function(e) {
      return $(e.target).closest('[id]').attr('id');
    },

    reportMetrics: function() {
      var report = {};
      report.scenario = this.currentScenario;
      report.metrics = this.metrics;
      this.metrics = this.makeMetrics();
      this.socket.emit('metric', report);
    },

    reportAction: function(action) {
      this.$container.css({visibility: 'hidden'});
      this.reportMetrics();
      var data = {};
      data.action = action;
      data.scenario = this.currentScenario;
      this.socket.emit('action', data);
    },

    logEventMetric: function(name, data) {
      this.metrics.events[_.now()] = {
        name: name,
        data: data
      };
    },

    toggleMode: function(mode) {
      var isActivated = !this.modes[mode];
      this.modes[mode] = isActivated;
      this.logEventMetric('mode-change', {
        mode: mode,
        activated: isActivated
      });
      this.dispatcher.trigger('mode:' + mode, isActivated);
      return isActivated;
    },

    isModeActive: function(mode) {
      return this.modes[mode];
    },

    evaluateCorrelation: function($correlating, $correlatingTo) {
      var data = {
        corrId1: $correlating.attr('id'),
        corrId2: $correlatingTo.attr('id')
      };
      this.socket.emit('correlation', data);
      this.logEventMetric('begin-correlating', data);
    },

    doneCorrelating: function(correct) {
      this.logEventMetric('end-correlating', {correct: correct});
    },

    getPanelContainer: function(name) {
      var panel = _.find(this.panels, function(p) {
        return p.name === name;
      });
      return panel.view.el;
    }
  });
});
