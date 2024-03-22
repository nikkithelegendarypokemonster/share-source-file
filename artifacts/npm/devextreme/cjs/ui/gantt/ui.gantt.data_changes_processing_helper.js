/**
* DevExtreme (cjs/ui/gantt/ui.gantt.data_changes_processing_helper.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.GanttDataChangesProcessingHelper = void 0;
let GanttDataChangesProcessingHelper = exports.GanttDataChangesProcessingHelper = /*#__PURE__*/function () {
  function GanttDataChangesProcessingHelper() {
    this._waitingForGanttViewReady = false;
    this._waitingForTreeListReady = false;
    this._completionActions = [];
  }
  var _proto = GanttDataChangesProcessingHelper.prototype;
  _proto.onGanttViewReady = function onGanttViewReady() {
    this._stopWaitForGanttViewReady();
    this.executeActionsIfPossible();
  };
  _proto.onTreeListReady = function onTreeListReady() {
    this._stopWaitForTreeListReady();
    this.executeActionsIfPossible();
  };
  _proto.addCompletionAction = function addCompletionAction(action, waitGanttViewReady, waitTreeListReady) {
    if (action) {
      if (waitGanttViewReady) {
        this._startWaitForGanttViewReady();
      }
      if (waitTreeListReady) {
        this._startWaitForTreeListReady();
      }
      this._completionActions.push(action);
    }
  };
  _proto.executeActionsIfPossible = function executeActionsIfPossible() {
    if (this._canExecuteActions()) {
      this._completionActions.forEach(act => act());
      this._completionActions = [];
    }
  };
  _proto._startWaitForGanttViewReady = function _startWaitForGanttViewReady() {
    this._waitingForGanttViewReady = true;
  };
  _proto._stopWaitForGanttViewReady = function _stopWaitForGanttViewReady() {
    this._waitingForGanttViewReady = false;
  };
  _proto._startWaitForTreeListReady = function _startWaitForTreeListReady() {
    this._waitingForTreeListReady = true;
  };
  _proto._stopWaitForTreeListReady = function _stopWaitForTreeListReady() {
    this._waitingForTreeListReady = false;
  };
  _proto._canExecuteActions = function _canExecuteActions() {
    return !(this._waitingForGanttViewReady || this._waitingForTreeListReady);
  };
  return GanttDataChangesProcessingHelper;
}();
