/**
* DevExtreme (cjs/__internal/scheduler/r1/components/wrappers/all_day_panel_title.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AllDayPanelTitleComponent = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../../core/component_registrator"));
var _index = require("../../../../core/r1/index");
var _all_day_panel_title = require("../base/all_day_panel_title");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class AllDayPanelTitleComponent extends _index.ComponentWrapper {
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: []
    };
  }
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-enable @typescript-eslint/explicit-function-return-type */
  // @ts-expect-error types error in R1
  get _viewComponent() {
    return _all_day_panel_title.AllDayPanelTitle;
  }
}
exports.AllDayPanelTitleComponent = AllDayPanelTitleComponent;
(0, _component_registrator.default)('dxAllDayPanelTitle', AllDayPanelTitleComponent);
