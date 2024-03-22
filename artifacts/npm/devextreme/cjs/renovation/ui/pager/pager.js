/**
* DevExtreme (cjs/renovation/ui/pager/pager.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.Pager = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _resizable_container = require("./resizable_container");
var _pager_props = require("./common/pager_props");
var _content = require("./content");
var _combine_classes = require("../../utils/combine_classes");
const _excluded = ["className", "defaultPageIndex", "defaultPageSize", "displayMode", "gridCompatibility", "hasKnownLastPage", "infoText", "label", "lightModeEnabled", "maxPagesCount", "onKeyDown", "pageCount", "pageIndex", "pageIndexChange", "pageSize", "pageSizeChange", "pageSizes", "pagesCountText", "pagesNavigatorVisible", "rtlEnabled", "showInfo", "showNavigationButtons", "showPageSizes", "totalCount", "visible"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    pagerProps,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _resizable_container.ResizableContainer, _extends({
    "contentTemplate": _content.PagerContent,
    "pagerProps": pagerProps
  }, restAttributes)));
};
exports.viewFunction = viewFunction;
let Pager = exports.Pager = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(Pager, _InfernoWrapperCompon);
  function Pager(props) {
    var _this;
    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.__getterCache = {};
    _this.state = {
      pageSize: _this.props.pageSize !== undefined ? _this.props.pageSize : _this.props.defaultPageSize,
      pageIndex: _this.props.pageIndex !== undefined ? _this.props.pageIndex : _this.props.defaultPageIndex
    };
    _this.pageIndexChange = _this.pageIndexChange.bind(_assertThisInitialized(_this));
    _this.pageSizeChange = _this.pageSizeChange.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = Pager.prototype;
  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };
  _proto.pageIndexChange = function pageIndexChange(newPageIndex) {
    if (this.props.gridCompatibility) {
      {
        let __newValue;
        this.setState(__state_argument => {
          __newValue = newPageIndex + 1;
          return {
            pageIndex: __newValue
          };
        });
        this.props.pageIndexChange(__newValue);
      }
    } else {
      {
        let __newValue;
        this.setState(__state_argument => {
          __newValue = newPageIndex;
          return {
            pageIndex: __newValue
          };
        });
        this.props.pageIndexChange(__newValue);
      }
    }
  };
  _proto.pageSizeChange = function pageSizeChange(newPageSize) {
    {
      let __newValue;
      this.setState(__state_argument => {
        __newValue = newPageSize;
        return {
          pageSize: __newValue
        };
      });
      this.props.pageSizeChange(__newValue);
    }
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoWrapperCompon.prototype.componentWillUpdate.call(this);
    if (this.props !== nextProps || this.props['gridCompatibility'] !== nextProps['gridCompatibility'] || this.props['className'] !== nextProps['className'] || this.state['pageIndex'] !== nextState['pageIndex'] || this.props['pageIndex'] !== nextProps['pageIndex'] || this.props['pageIndexChange'] !== nextProps['pageIndexChange'] || this.props['pageSizeChange'] !== nextProps['pageSizeChange']) {
      this.__getterCache['pagerProps'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        pageSize: this.props.pageSize !== undefined ? this.props.pageSize : this.state.pageSize,
        pageIndex: this.props.pageIndex !== undefined ? this.props.pageIndex : this.state.pageIndex
      }),
      pageIndexChange: this.pageIndexChange,
      pageIndex: this.pageIndex,
      pageSizeChange: this.pageSizeChange,
      className: this.className,
      pagerProps: this.pagerProps,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Pager, [{
    key: "pageIndex",
    get: function () {
      if (this.props.gridCompatibility) {
        return (this.props.pageIndex !== undefined ? this.props.pageIndex : this.state.pageIndex) - 1;
      }
      return this.props.pageIndex !== undefined ? this.props.pageIndex : this.state.pageIndex;
    }
  }, {
    key: "className",
    get: function () {
      if (this.props.gridCompatibility) {
        return (0, _combine_classes.combineClasses)({
          'dx-datagrid-pager': true,
          ["".concat(this.props.className)]: !!this.props.className
        });
      }
      return this.props.className;
    }
  }, {
    key: "pagerProps",
    get: function () {
      if (this.__getterCache['pagerProps'] !== undefined) {
        return this.__getterCache['pagerProps'];
      }
      return this.__getterCache['pagerProps'] = (() => {
        return _extends({}, _extends({}, this.props, {
          pageSize: this.props.pageSize !== undefined ? this.props.pageSize : this.state.pageSize,
          pageIndex: this.props.pageIndex !== undefined ? this.props.pageIndex : this.state.pageIndex
        }), {
          className: this.className,
          pageIndex: this.pageIndex,
          pageIndexChange: pageIndex => this.pageIndexChange(pageIndex),
          pageSizeChange: pageSize => this.pageSizeChange(pageSize)
        });
      })();
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props$pageSize$ = _extends({}, this.props, {
          pageSize: this.props.pageSize !== undefined ? this.props.pageSize : this.state.pageSize,
          pageIndex: this.props.pageIndex !== undefined ? this.props.pageIndex : this.state.pageIndex
        }),
        restProps = _objectWithoutPropertiesLoose(_this$props$pageSize$, _excluded);
      return restProps;
    }
  }]);
  return Pager;
}(_inferno2.InfernoWrapperComponent);
Pager.defaultProps = _pager_props.PagerProps;
