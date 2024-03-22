"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _index = require("../../scheduler/__migration/utils/index");
var _m_constants = require("../m_constants");
var _m_work_space_vertical = _interopRequireDefault(require("./m_work_space_vertical"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const WEEK_CLASS = 'dx-scheduler-work-space-week';
let SchedulerWorkSpaceWeek = /*#__PURE__*/function (_SchedulerWorkSpaceVe) {
  _inheritsLoose(SchedulerWorkSpaceWeek, _SchedulerWorkSpaceVe);
  function SchedulerWorkSpaceWeek() {
    return _SchedulerWorkSpaceVe.apply(this, arguments) || this;
  }
  var _proto = SchedulerWorkSpaceWeek.prototype;
  _proto._getElementClass = function _getElementClass() {
    return WEEK_CLASS;
  };
  _proto._calculateViewStartDate = function _calculateViewStartDate() {
    return _index.weekUtils.calculateViewStartDate(this.option('startDate'), this._firstDayOfWeek());
  };
  _createClass(SchedulerWorkSpaceWeek, [{
    key: "type",
    get: function () {
      return _m_constants.VIEWS.WEEK;
    }
  }]);
  return SchedulerWorkSpaceWeek;
}(_m_work_space_vertical.default);
(0, _component_registrator.default)('dxSchedulerWorkSpaceWeek', SchedulerWorkSpaceWeek);
var _default = exports.default = SchedulerWorkSpaceWeek;