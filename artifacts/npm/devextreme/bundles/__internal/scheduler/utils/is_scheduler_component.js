/**
* DevExtreme (bundles/__internal/scheduler/utils/is_scheduler_component.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSchedulerComponent = isSchedulerComponent;
const schedulerComponentName = 'dxScheduler';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function isSchedulerComponent(component) {
  return component.NAME === schedulerComponentName;
}
