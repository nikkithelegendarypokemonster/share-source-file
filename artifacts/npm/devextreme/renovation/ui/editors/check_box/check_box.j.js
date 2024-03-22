/**
* DevExtreme (renovation/ui/editors/check_box/check_box.j.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../core/component_registrator"));
var _check_box = _interopRequireDefault(require("../../../component_wrapper/editors/check_box"));
var _check_box2 = require("./check_box");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let CheckBox = exports.default = /*#__PURE__*/function (_BaseComponent) {
  _inheritsLoose(CheckBox, _BaseComponent);
  function CheckBox() {
    return _BaseComponent.apply(this, arguments) || this;
  }
  var _proto = CheckBox.prototype;
  _proto.getProps = function getProps() {
    const props = _BaseComponent.prototype.getProps.call(this);
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  };
  _proto.focus = function focus() {
    var _this$viewRef;
    return (_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.focus(...arguments);
  };
  _proto.blur = function blur() {
    var _this$viewRef2;
    return (_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.blur(...arguments);
  };
  _proto._getActionConfigs = function _getActionConfigs() {
    return {
      onFocusIn: {},
      onClick: {}
    };
  };
  _createClass(CheckBox, [{
    key: "_propsInfo",
    get: function () {
      return {
        twoWay: [['value', 'defaultValue', 'valueChange']],
        allowNull: ['defaultValue', 'validationError', 'validationErrors', 'value'],
        elements: [],
        templates: [],
        props: ['text', 'iconSize', 'enableThreeStateBehavior', 'activeStateEnabled', 'hoverStateEnabled', 'focusStateEnabled', 'saveValueChangeEvent', 'defaultValue', 'valueChange', 'readOnly', 'name', 'validationError', 'validationErrors', 'validationMessageMode', 'validationMessagePosition', 'validationStatus', 'isValid', 'isDirty', 'inputAttr', 'onFocusIn', 'className', 'accessKey', 'disabled', 'height', 'hint', 'onClick', 'onKeyDown', 'rtlEnabled', 'tabIndex', 'visible', 'width', 'aria', 'value']
      };
    }
  }, {
    key: "_viewComponent",
    get: function () {
      return _check_box2.CheckBox;
    }
  }]);
  return CheckBox;
}(_check_box.default);
(0, _component_registrator.default)('dxCheckBox', CheckBox);
CheckBox.defaultOptions = _check_box2.defaultOptions;
module.exports = exports.default;
module.exports.default = exports.default;
