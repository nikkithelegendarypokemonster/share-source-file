/**
* DevExtreme (renovation/ui/pager/page_size/selector.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.PageSizeSelector = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _small = require("./small");
var _large = require("./large");
var _pager_props = require("../common/pager_props");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _consts = require("../common/consts");
const _excluded = ["isLargeDisplayMode", "pageSize", "pageSizeChange", "pageSizes", "rootElementRef"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const viewFunction = _ref => {
  let {
    htmlRef,
    normalizedPageSizes,
    props: {
      isLargeDisplayMode,
      pageSize,
      pageSizeChange
    }
  } = _ref;
  return (0, _inferno.createVNode)(1, "div", _consts.PAGER_PAGE_SIZES_CLASS, [isLargeDisplayMode && (0, _inferno.createComponentVNode)(2, _large.PageSizeLarge, {
    "pageSizes": normalizedPageSizes,
    "pageSize": pageSize,
    "pageSizeChange": pageSizeChange
  }), !isLargeDisplayMode && (0, _inferno.createComponentVNode)(2, _small.PageSizeSmall, {
    "parentRef": htmlRef,
    "pageSizes": normalizedPageSizes,
    "pageSize": pageSize,
    "pageSizeChange": pageSizeChange
  })], 0, null, null, htmlRef);
};
exports.viewFunction = viewFunction;
function getAllText() {
  return _message.default.getFormatter('dxPager-pageSizesAllText')();
}
const PageSizeSelectorProps = {
  isLargeDisplayMode: true
};
const PageSizeSelectorPropsType = Object.defineProperties({}, {
  pageSize: {
    get: function () {
      return _pager_props.InternalPagerProps.pageSize;
    },
    configurable: true,
    enumerable: true
  },
  pageSizes: {
    get: function () {
      return _pager_props.InternalPagerProps.pageSizes;
    },
    configurable: true,
    enumerable: true
  },
  isLargeDisplayMode: {
    get: function () {
      return PageSizeSelectorProps.isLargeDisplayMode;
    },
    configurable: true,
    enumerable: true
  }
});
let PageSizeSelector = exports.PageSizeSelector = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(PageSizeSelector, _InfernoComponent);
  function PageSizeSelector(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.htmlRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.setRootElementRef = _this.setRootElementRef.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = PageSizeSelector.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.setRootElementRef, [])];
  };
  _proto.setRootElementRef = function setRootElementRef() {
    const {
      rootElementRef
    } = this.props;
    if (rootElementRef) {
      rootElementRef.current = this.htmlRef.current;
    }
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoComponent.prototype.componentWillUpdate.call(this);
    if (this.props['pageSizes'] !== nextProps['pageSizes']) {
      this.__getterCache['normalizedPageSizes'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      htmlRef: this.htmlRef,
      normalizedPageSizes: this.normalizedPageSizes,
      restAttributes: this.restAttributes
    });
  };
  _createClass(PageSizeSelector, [{
    key: "normalizedPageSizes",
    get: function () {
      if (this.__getterCache['normalizedPageSizes'] !== undefined) {
        return this.__getterCache['normalizedPageSizes'];
      }
      return this.__getterCache['normalizedPageSizes'] = (() => {
        const {
          pageSizes
        } = this.props;
        return pageSizes.map(p => p === 'all' || p === 0 ? {
          text: getAllText(),
          value: 0
        } : {
          text: String(p),
          value: p
        });
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
  return PageSizeSelector;
}(_inferno2.InfernoComponent);
PageSizeSelector.defaultProps = PageSizeSelectorPropsType;
