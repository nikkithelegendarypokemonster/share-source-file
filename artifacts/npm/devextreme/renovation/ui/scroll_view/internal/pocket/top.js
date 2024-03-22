/**
* DevExtreme (renovation/ui/scroll_view/internal/pocket/top.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.TopPocketProps = exports.TopPocket = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _load_indicator = require("../../../load_indicator");
var _combine_classes = require("../../../../utils/combine_classes");
var _message = _interopRequireDefault(require("../../../../../localization/message"));
var _consts = require("../../common/consts");
var _themes = require("../../../../../ui/themes");
const _excluded = ["pocketState", "pocketTop", "pullDownIconAngle", "pullDownOpacity", "pullDownTranslateTop", "pulledDownText", "pullingDownText", "refreshStrategy", "refreshingText", "topPocketRef", "topPocketTranslateTop", "visible"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const viewFunction = viewModel => {
  const {
    props: {
      pulledDownText,
      pullingDownText,
      refreshStrategy,
      refreshingText,
      topPocketRef
    },
    pullDownClasses,
    pullDownIconStyles,
    pullDownRef,
    pullDownStyles,
    readyVisibleClass,
    refreshVisibleClass,
    releaseVisibleClass,
    topPocketClasses,
    topPocketStyles
  } = viewModel;
  return (0, _inferno.createVNode)(1, "div", topPocketClasses, (0, _inferno.createVNode)(1, "div", pullDownClasses, [refreshStrategy !== 'swipeDown' && (0, _inferno.createVNode)(1, "div", _consts.SCROLLVIEW_PULLDOWN_IMAGE_CLASS), refreshStrategy === 'swipeDown' && (0, _inferno.createVNode)(1, "div", _consts.PULLDOWN_ICON_CLASS, null, 1, {
    "style": (0, _inferno2.normalizeStyles)(pullDownIconStyles)
  }), (0, _inferno.createVNode)(1, "div", _consts.SCROLLVIEW_PULLDOWN_INDICATOR_CLASS, (0, _inferno.createComponentVNode)(2, _load_indicator.LoadIndicator), 2), refreshStrategy !== 'swipeDown' && (0, _inferno.createVNode)(1, "div", _consts.SCROLLVIEW_PULLDOWN_TEXT_CLASS, [(0, _inferno.createVNode)(1, "div", releaseVisibleClass, pullingDownText, 0), (0, _inferno.createVNode)(1, "div", readyVisibleClass, pulledDownText, 0), (0, _inferno.createVNode)(1, "div", refreshVisibleClass, refreshingText, 0)], 4)], 0, {
    "style": (0, _inferno2.normalizeStyles)(pullDownStyles)
  }, null, pullDownRef), 2, {
    "style": (0, _inferno2.normalizeStyles)(topPocketStyles)
  }, null, topPocketRef);
};
exports.viewFunction = viewFunction;
const TopPocketProps = exports.TopPocketProps = Object.defineProperties({
  pullDownTranslateTop: 0,
  pullDownIconAngle: 0,
  pullDownOpacity: 0,
  pocketTop: 0,
  topPocketTranslateTop: 0,
  visible: true
}, {
  pullingDownText: {
    get: function () {
      return (0, _themes.isMaterial)((0, _themes.current)()) ? '' : _message.default.format('dxScrollView-pullingDownText');
    },
    configurable: true,
    enumerable: true
  },
  pulledDownText: {
    get: function () {
      return (0, _themes.isMaterial)((0, _themes.current)()) ? '' : _message.default.format('dxScrollView-pulledDownText');
    },
    configurable: true,
    enumerable: true
  },
  refreshingText: {
    get: function () {
      return (0, _themes.isMaterial)((0, _themes.current)()) ? '' : _message.default.format('dxScrollView-refreshingText');
    },
    configurable: true,
    enumerable: true
  },
  pocketState: {
    get: function () {
      return _consts.TopPocketState.STATE_RELEASED;
    },
    configurable: true,
    enumerable: true
  }
});
let TopPocket = exports.TopPocket = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(TopPocket, _BaseInfernoComponent);
  function TopPocket(props) {
    var _this;
    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.pullDownRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    return _this;
  }
  var _proto = TopPocket.prototype;
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props['refreshStrategy'] !== nextProps['refreshStrategy'] || this.props['pullDownOpacity'] !== nextProps['pullDownOpacity'] || this.props['pullDownTranslateTop'] !== nextProps['pullDownTranslateTop']) {
      this.__getterCache['pullDownStyles'] = undefined;
    }
    if (this.props['refreshStrategy'] !== nextProps['refreshStrategy'] || this.props['pocketTop'] !== nextProps['pocketTop'] || this.props['topPocketTranslateTop'] !== nextProps['topPocketTranslateTop']) {
      this.__getterCache['topPocketStyles'] = undefined;
    }
    if (this.props['pullDownIconAngle'] !== nextProps['pullDownIconAngle']) {
      this.__getterCache['pullDownIconStyles'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      pullDownRef: this.pullDownRef,
      releaseVisibleClass: this.releaseVisibleClass,
      readyVisibleClass: this.readyVisibleClass,
      refreshVisibleClass: this.refreshVisibleClass,
      pullDownClasses: this.pullDownClasses,
      topPocketClasses: this.topPocketClasses,
      pullDownStyles: this.pullDownStyles,
      topPocketStyles: this.topPocketStyles,
      pullDownIconStyles: this.pullDownIconStyles,
      restAttributes: this.restAttributes
    });
  };
  _createClass(TopPocket, [{
    key: "releaseVisibleClass",
    get: function () {
      return this.props.pocketState === _consts.TopPocketState.STATE_RELEASED ? _consts.SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS : undefined;
    }
  }, {
    key: "readyVisibleClass",
    get: function () {
      return this.props.pocketState === _consts.TopPocketState.STATE_READY ? _consts.SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS : undefined;
    }
  }, {
    key: "refreshVisibleClass",
    get: function () {
      return this.props.pocketState === _consts.TopPocketState.STATE_REFRESHING ? _consts.SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS : undefined;
    }
  }, {
    key: "pullDownClasses",
    get: function () {
      const {
        pocketState,
        visible
      } = this.props;
      const classesMap = {
        [_consts.SCROLLVIEW_PULLDOWN]: true,
        [_consts.SCROLLVIEW_PULLDOWN_READY_CLASS]: pocketState === _consts.TopPocketState.STATE_READY,
        [_consts.SCROLLVIEW_PULLDOWN_LOADING_CLASS]: pocketState === _consts.TopPocketState.STATE_REFRESHING,
        'dx-state-invisible': !visible
      };
      return (0, _combine_classes.combineClasses)(classesMap);
    }
  }, {
    key: "topPocketClasses",
    get: function () {
      const classesMap = {
        [_consts.SCROLLVIEW_TOP_POCKET_CLASS]: true,
        'dx-state-invisible': !this.props.visible
      };
      return (0, _combine_classes.combineClasses)(classesMap);
    }
  }, {
    key: "pullDownStyles",
    get: function () {
      if (this.__getterCache['pullDownStyles'] !== undefined) {
        return this.__getterCache['pullDownStyles'];
      }
      return this.__getterCache['pullDownStyles'] = (() => {
        if (this.props.refreshStrategy === 'swipeDown') {
          return {
            opacity: this.props.pullDownOpacity,
            transform: "translate(0px, ".concat(this.props.pullDownTranslateTop, "px)")
          };
        }
        return undefined;
      })();
    }
  }, {
    key: "topPocketStyles",
    get: function () {
      if (this.__getterCache['topPocketStyles'] !== undefined) {
        return this.__getterCache['topPocketStyles'];
      }
      return this.__getterCache['topPocketStyles'] = (() => {
        if (this.props.refreshStrategy === 'pullDown') {
          return {
            top: "".concat(-this.props.pocketTop, "px"),
            transform: "translate(0px, ".concat(this.props.topPocketTranslateTop, "px)")
          };
        }
        return undefined;
      })();
    }
  }, {
    key: "pullDownIconStyles",
    get: function () {
      if (this.__getterCache['pullDownIconStyles'] !== undefined) {
        return this.__getterCache['pullDownIconStyles'];
      }
      return this.__getterCache['pullDownIconStyles'] = (() => {
        return {
          transform: "rotate(".concat(this.props.pullDownIconAngle, "deg)")
        };
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
  return TopPocket;
}(_inferno2.BaseInfernoComponent);
TopPocket.defaultProps = TopPocketProps;
