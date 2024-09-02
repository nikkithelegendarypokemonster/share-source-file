import { isClient, registerCustomComponents, renderTrialPanel } from './trial_panel.client';
export function showTrialPanel(buyNowUrl, version, customStyles) {
  if (isClient()) {
    renderTrialPanel(buyNowUrl, version, customStyles);
  }
}
export function registerTrialPanelComponents(customStyles) {
  if (isClient()) {
    registerCustomComponents(customStyles);
  }
}