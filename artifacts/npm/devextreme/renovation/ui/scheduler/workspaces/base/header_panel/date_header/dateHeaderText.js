/**
* DevExtreme (renovation/ui/scheduler/workspaces/base/header_panel/date_header/dateHeaderText.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.DateHeaderTextProps = exports.DateHeaderText = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
const _excluded = ["splitText", "text"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const viewFunction = _ref => {
  let {
    props: {
      splitText,
      text
    },
    textParts
  } = _ref;
  return (0, _inferno.createFragment)(splitText ? textParts.map(part => (0, _inferno.createVNode)(1, "div", "dx-scheduler-header-panel-cell-date", (0, _inferno.createVNode)(1, "span", null, part, 0), 2)) : text, 0);
};
exports.viewFunction = viewFunction;
const DateHeaderTextProps = exports.DateHeaderTextProps = {
  text: '',
  splitText: false
};
let DateHeaderText = exports.DateHeaderText = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(DateHeaderText, _BaseInfernoComponent);
  function DateHeaderText(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    return _this;
  }
  var _proto = DateHeaderText.prototype;
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props['text'] !== nextProps['text']) {
      this.__getterCache['textParts'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      textParts: this.textParts,
      restAttributes: this.restAttributes
    });
  };
  _createClass(DateHeaderText, [{
    key: "textParts",
    get: function () {
      if (this.__getterCache['textParts'] !== undefined) {
        return this.__getterCache['textParts'];
      }
      return this.__getterCache['textParts'] = (() => {
        const {
          text
        } = this.props;
        return text ? text.split(' ') : [''];
      })();
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return DateHeaderText;
}(_inferno2.BaseInfernoComponent);
DateHeaderText.defaultProps = DateHeaderTextProps;
