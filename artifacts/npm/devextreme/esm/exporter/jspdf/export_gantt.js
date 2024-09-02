/**
* DevExtreme (esm/exporter/jspdf/export_gantt.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
function exportGantt(options) {
  const component = options.component;
  return component === null || component === void 0 ? void 0 : component.exportToPdf(options);
}
export { exportGantt };
