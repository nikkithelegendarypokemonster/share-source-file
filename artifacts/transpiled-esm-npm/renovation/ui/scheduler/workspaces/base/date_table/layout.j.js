"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../../../core/component_registrator"));
var _date_table = require("../../../../../component_wrapper/scheduler/date_table");
var _layout = require("./layout");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let DateTableLayoutBase = exports.default = /*#__PURE__*/function (_DateTable) {
  _inheritsLoose(DateTableLayoutBase, _DateTable);
  function DateTableLayoutBase() {
    return _DateTable.apply(this, arguments) || this;
  }
  _createClass(DateTableLayoutBase, [{
    key: "_propsInfo",
    get: function () {
      return {
        twoWay: [],
        allowNull: [],
        elements: [],
        templates: ['cellTemplate', 'dataCellTemplate'],
        props: ['cellTemplate', 'viewData', 'groupOrientation', 'leftVirtualCellWidth', 'rightVirtualCellWidth', 'topVirtualRowHeight', 'bottomVirtualRowHeight', 'addDateTableClass', 'addVerticalSizesClassToRows', 'width', 'dataCellTemplate']
      };
    }
  }, {
    key: "_viewComponent",
    get: function () {
      return _layout.DateTableLayoutBase;
    }
  }]);
  return DateTableLayoutBase;
}(_date_table.DateTable);
(0, _component_registrator.default)('dxDateTableLayoutBase', DateTableLayoutBase);
module.exports = exports.default;
module.exports.default = exports.default;