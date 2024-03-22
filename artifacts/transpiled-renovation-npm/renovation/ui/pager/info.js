"use strict";

exports.viewFunction = exports.PAGER_INFO_CLASS = exports.InfoTextProps = exports.InfoText = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _string = require("../../../core/utils/string");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _pager_props = require("./common/pager_props");
const _excluded = ["infoText", "pageCount", "pageIndex", "rootElementRef", "totalCount"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const PAGER_INFO_CLASS = exports.PAGER_INFO_CLASS = 'dx-info';
const viewFunction = _ref => {
  let {
    props: {
      rootElementRef
    },
    text
  } = _ref;
  return (0, _inferno.createVNode)(1, "div", PAGER_INFO_CLASS, text, 0, null, null, rootElementRef);
};
exports.viewFunction = viewFunction;
const InfoTextProps = exports.InfoTextProps = {};
const InfoTextPropsType = Object.defineProperties({}, {
  pageIndex: {
    get: function () {
      return _pager_props.InternalPagerProps.pageIndex;
    },
    configurable: true,
    enumerable: true
  },
  pageCount: {
    get: function () {
      return _pager_props.InternalPagerProps.pageCount;
    },
    configurable: true,
    enumerable: true
  },
  totalCount: {
    get: function () {
      return _pager_props.InternalPagerProps.totalCount;
    },
    configurable: true,
    enumerable: true
  }
});
let InfoText = exports.InfoText = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(InfoText, _BaseInfernoComponent);
  function InfoText(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }
  var _proto = InfoText.prototype;
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      infoText: this.infoText,
      text: this.text,
      restAttributes: this.restAttributes
    });
  };
  _createClass(InfoText, [{
    key: "infoText",
    get: function () {
      var _this$props$infoText;
      return ((_this$props$infoText = this.props.infoText) !== null && _this$props$infoText !== void 0 ? _this$props$infoText : '') || _message.default.getFormatter('dxPager-infoText')();
    }
  }, {
    key: "text",
    get: function () {
      const {
        pageCount,
        pageIndex,
        totalCount
      } = this.props;
      return (0, _string.format)(this.infoText, (pageIndex + 1).toString(), pageCount.toString(), totalCount.toString());
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return InfoText;
}(_inferno2.BaseInfernoComponent);
InfoText.defaultProps = InfoTextPropsType;