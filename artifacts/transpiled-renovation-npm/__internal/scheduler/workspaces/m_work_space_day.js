"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _m_constants = require("../m_constants");
var _m_work_space_vertical = _interopRequireDefault(require("./m_work_space_vertical"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const DAY_CLASS = 'dx-scheduler-work-space-day';
let SchedulerWorkSpaceDay = /*#__PURE__*/function (_SchedulerWorkSpaceVe) {
  _inheritsLoose(SchedulerWorkSpaceDay, _SchedulerWorkSpaceVe);
  function SchedulerWorkSpaceDay() {
    return _SchedulerWorkSpaceVe.apply(this, arguments) || this;
  }
  var _proto = SchedulerWorkSpaceDay.prototype;
  _proto._getElementClass = function _getElementClass() {
    return DAY_CLASS;
  };
  _proto._renderDateHeader = function _renderDateHeader() {
    return this.option('intervalCount') === 1 ? null : _SchedulerWorkSpaceVe.prototype._renderDateHeader.call(this);
  };
  _proto.renderRHeaderPanel = function renderRHeaderPanel() {
    if (this.option('intervalCount') === 1) {
      _SchedulerWorkSpaceVe.prototype.renderRHeaderPanel.call(this, false);
    } else {
      _SchedulerWorkSpaceVe.prototype.renderRHeaderPanel.call(this, true);
    }
  };
  _createClass(SchedulerWorkSpaceDay, [{
    key: "type",
    get: function () {
      return _m_constants.VIEWS.DAY;
    }
  }]);
  return SchedulerWorkSpaceDay;
}(_m_work_space_vertical.default);
(0, _component_registrator.default)('dxSchedulerWorkSpaceDay', SchedulerWorkSpaceDay);
var _default = exports.default = SchedulerWorkSpaceDay;