"use strict";

exports.viewFunction = exports.ScrollViewLoadPanel = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _load_panel = require("../../overlays/load_panel");
var _scrollview_loadpanel_props = require("../common/scrollview_loadpanel_props");
const _excluded = ["refreshingText", "targetElement", "visible"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const SCROLLVIEW_LOADPANEL = 'dx-scrollview-loadpanel';
const viewFunction = viewModel => {
  const {
    position,
    props: {
      visible
    },
    refreshingText
  } = viewModel;
  return (0, _inferno.createComponentVNode)(2, _load_panel.LoadPanel, {
    "className": SCROLLVIEW_LOADPANEL,
    "shading": false,
    "delay": 400,
    "message": refreshingText,
    "position": position,
    "visible": visible
  });
};
exports.viewFunction = viewFunction;
let ScrollViewLoadPanel = exports.ScrollViewLoadPanel = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(ScrollViewLoadPanel, _BaseInfernoComponent);
  function ScrollViewLoadPanel(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    return _this;
  }
  var _proto = ScrollViewLoadPanel.prototype;
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props['targetElement?.current'] !== nextProps['targetElement?.current']) {
      this.__getterCache['position'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      refreshingText: this.refreshingText,
      position: this.position,
      restAttributes: this.restAttributes
    });
  };
  _createClass(ScrollViewLoadPanel, [{
    key: "refreshingText",
    get: function () {
      const {
        refreshingText
      } = this.props;
      if ((0, _type.isDefined)(refreshingText)) {
        return refreshingText;
      }
      return _message.default.format('dxScrollView-refreshingText');
    }
  }, {
    key: "position",
    get: function () {
      if (this.__getterCache['position'] !== undefined) {
        return this.__getterCache['position'];
      }
      return this.__getterCache['position'] = (() => {
        if (this.props.targetElement) {
          return {
            of: this.props.targetElement.current
          };
        }
        return undefined;
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
  return ScrollViewLoadPanel;
}(_inferno2.BaseInfernoComponent);
ScrollViewLoadPanel.defaultProps = _scrollview_loadpanel_props.ScrollViewLoadPanelProps;