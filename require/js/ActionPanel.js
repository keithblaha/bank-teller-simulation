define(['SimPanel', 'SimPanelView', 'text!templates/action.html', 'backbone'],
function(SimPanel,   SimPanelView,   actionTemplate) {

  var ActionPanelView = SimPanelView.extend({
    id: 'action-panel',
    panelContainer: 'right-container',
    template: actionTemplate,

    events: {
      'click .action': 'reportAction',
      'click .correlate': 'toggleCorrelateMode'
    },

    listeners: {
      'correlating': 'deactivate',
      'done-correlating': 'doneCorrelating'
    },

    reportAction: function(e) {
      if(this.isActive(e.target)) {
        this.trigger('action', e.target.id);
      }
    },

    toggleCorrelateMode: function(e) {
      if(this.isActive(e.target)) {
        var isActivated = this.toggleMode('correlate');
        if(isActivated) {
          this.deactivate('.correlate');
        }
        else {
          this.reactivate();
        }
      }
    },

    doneCorrelating: function(correct) {
      if(!correct) {
        this.reactivate('.action');
      }
    }
  });

  return SimPanel.extend({
    name: 'action',
    viewClass: ActionPanelView
  });
});
