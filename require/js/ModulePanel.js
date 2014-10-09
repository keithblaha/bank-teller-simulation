define(['SimPanel', 'SimPanelView', 'text!templates/module.html', 'backbone'],
function(SimPanel,   SimPanelView,   moduleTemplate) {

  var selectedClass = 'selected';

  var ModulePanelView = SimPanelView.extend({
    buttonClass: 'module-selector',
    id: 'module-panel',
    panelContainer: 'right-container',
    template: moduleTemplate,

    events: {
      'click .module-selector': 'selectModule'
    },

    listeners: {
      'correlating': 'deactivate',
      'done-correlating': 'reactivate'
    },

    selectModule: function(e) {
      var $target = $(e.target);
      if(this.isActive(e.target) && !$target.hasClass(selectedClass)) {
        this.$el.find('.'+selectedClass).removeClass(selectedClass);
        $target.addClass(selectedClass);
        $('#'+e.target.id.replace('-selector','')).addClass(selectedClass);
      }
    }
  });

  return SimPanel.extend({
    name: 'module',
    viewClass: ModulePanelView
  });
});
