/**
* DevExtreme (cjs/renovation/ui/scheduler/workspaces/base/group_panel/group_panel.j.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../../../core/component_registrator"));
var _group_panel = require("../../../../../component_wrapper/scheduler/group_panel");
var _group_panel2 = require("./group_panel");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let GroupPanel = exports.default = /*#__PURE__*/function (_GroupPanelWrapper) {
  _inheritsLoose(GroupPanel, _GroupPanelWrapper);
  function GroupPanel() {
    return _GroupPanelWrapper.apply(this, arguments) || this;
  }
  _createClass(GroupPanel, [{
    key: "_propsInfo",
    get: function () {
      return {
        twoWay: [],
        allowNull: [],
        elements: [],
        templates: ['resourceCellTemplate'],
        props: ['groups', 'groupOrientation', 'groupPanelData', 'groupByDate', 'height', 'className', 'resourceCellTemplate']
      };
    }
  }, {
    key: "_viewComponent",
    get: function () {
      return _group_panel2.GroupPanel;
    }
  }]);
  return GroupPanel;
}(_group_panel.GroupPanelWrapper);
(0, _component_registrator.default)('dxGroupPanel', GroupPanel);
module.exports = exports.default;
module.exports.default = exports.default;
