/**
* DevExtreme (renovation/ui/pager/pages/page.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.PageProps = exports.Page = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _light_button = require("../common/light_button");
var _consts = require("../common/consts");
var _combine_classes = require("../../../utils/combine_classes");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _string = require("../../../../core/utils/string");
const _excluded = ["className", "index", "onClick", "selected"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
    className,
    label,
    props: {
      onClick,
      selected
    },
    value
  } = _ref;
  return (0, _inferno.createComponentVNode)(2, _light_button.LightButton, {
    "className": className,
    "label": label,
    "onClick": onClick,
    "selected": selected,
    children: value
  });
};
exports.viewFunction = viewFunction;
const PageProps = exports.PageProps = {
  index: 0,
  selected: false,
  className: _consts.PAGER_PAGE_CLASS
};
let Page = exports.Page = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(Page, _BaseInfernoComponent);
  function Page(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = Page.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      label: this.label,
      value: this.value,
      className: this.className,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Page, [{
    key: "label",
    get: function () {
      return (0, _string.format)(_message.default.getFormatter('dxPager-page'), this.value);
    }
  }, {
    key: "value",
    get: function () {
      return this.props.index + 1;
    }
  }, {
    key: "className",
    get: function () {
      const {
        selected
      } = this.props;
      return (0, _combine_classes.combineClasses)({
        ["".concat(this.props.className)]: !!this.props.className,
        [_consts.PAGER_SELECTION_CLASS]: !!selected
      });
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return Page;
}(_inferno2.BaseInfernoComponent);
Page.defaultProps = PageProps;
