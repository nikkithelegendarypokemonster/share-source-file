"use strict";

exports.GanttTemplatesManager = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _element = require("../../core/element");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let GanttTemplatesManager = exports.GanttTemplatesManager = /*#__PURE__*/function () {
  function GanttTemplatesManager(gantt) {
    this._gantt = gantt;
  }
  var _proto = GanttTemplatesManager.prototype;
  _proto.getTaskTooltipContentTemplateFunc = function getTaskTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
    const isTooltipShowing = true;
    const template = taskTooltipContentTemplateOption && this._gantt._getTemplate(taskTooltipContentTemplateOption);
    const createTemplateFunction = template && ((container, item, callback) => {
      template.render({
        model: this._gantt.getTaskDataByCoreData(item),
        container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
        onRendered: () => {
          callback();
        }
      });
      return isTooltipShowing;
    });
    return createTemplateFunction;
  };
  _proto.getTaskProgressTooltipContentTemplateFunc = function getTaskProgressTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
    const isTooltipShowing = true;
    const template = taskTooltipContentTemplateOption && this._gantt._getTemplate(taskTooltipContentTemplateOption);
    const createTemplateFunction = template && ((container, item, callback) => {
      template.render({
        model: item,
        container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
        onRendered: () => {
          callback();
        }
      });
      return isTooltipShowing;
    });
    return createTemplateFunction;
  };
  _proto.getTaskTimeTooltipContentTemplateFunc = function getTaskTimeTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
    const isTooltipShowing = true;
    const template = taskTooltipContentTemplateOption && this._gantt._getTemplate(taskTooltipContentTemplateOption);
    const createTemplateFunction = template && ((container, item, callback) => {
      template.render({
        model: item,
        container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
        onRendered: () => {
          callback();
        }
      });
      return isTooltipShowing;
    });
    return createTemplateFunction;
  };
  _proto.getTaskContentTemplateFunc = function getTaskContentTemplateFunc(taskContentTemplateOption) {
    const isTaskShowing = true;
    const template = taskContentTemplateOption && this._gantt._getTemplate(taskContentTemplateOption);
    const createTemplateFunction = template && ((container, item, callback, index) => {
      item.taskData = this._gantt.getTaskDataByCoreData(item.taskData);
      template.render({
        model: item,
        container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
        onRendered: () => {
          callback(container, index);
        }
      });
      return isTaskShowing;
    });
    return createTemplateFunction;
  };
  return GanttTemplatesManager;
}();