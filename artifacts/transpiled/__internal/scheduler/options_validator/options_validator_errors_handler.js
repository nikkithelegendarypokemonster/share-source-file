"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SchedulerOptionsValidatorErrorsHandler = void 0;
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.errors"));
var _index = require("./core/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const GLOBAL_ERROR_HANDLER = {
  logError: errorCode => {
    _ui.default.log(errorCode);
  },
  throwError: errorCode => {
    throw _ui.default.Error(errorCode);
  }
};
let SchedulerOptionsValidatorErrorsHandler = exports.SchedulerOptionsValidatorErrorsHandler = /*#__PURE__*/function (_OptionsValidatorErro) {
  _inheritsLoose(SchedulerOptionsValidatorErrorsHandler, _OptionsValidatorErro);
  function SchedulerOptionsValidatorErrorsHandler() {
    return _OptionsValidatorErro.call(this, {
      startDayHour: 'E1058',
      endDayHour: 'E1058',
      startDayHourAndEndDayHour: 'E1058',
      offset: 'E1061',
      cellDuration: 'E1062',
      cellDurationAndVisibleInterval: 'E1062'
    }, GLOBAL_ERROR_HANDLER) || this;
  }
  return SchedulerOptionsValidatorErrorsHandler;
}(_index.OptionsValidatorErrorHandler);