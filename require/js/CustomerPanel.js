define(['SimPanel', 'SimPanelView', 'text!templates/customer.html', 'backbone'],
function(SimPanel,   SimPanelView,   customerTemplate) {

  var CustomerPanelView = SimPanelView.extend({
    id: 'customer-panel',
    panelContainer: 'left-container',
    template: customerTemplate
  });

  return SimPanel.extend({
    name: 'customer',
    viewClass: CustomerPanelView
  });
});
