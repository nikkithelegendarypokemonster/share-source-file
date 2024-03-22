/**
* DevExtreme (cjs/renovation/ui/resizable/handle.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.ResizableHandleProps = exports.ResizableHandle = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _drag = require("../../../events/drag");
var _index = require("../../../events/utils/index");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _utils = require("../../../core/options/utils");
const _excluded = ["direction", "disabled", "onResize", "onResizeEnd", "onResizeStart"];
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
const namespace = 'dxResizable';
const dragStartEvent = (0, _index.addNamespace)(_drag.start, namespace);
const dragEvent = (0, _index.addNamespace)(_drag.move, namespace);
const dragEndEvent = (0, _index.addNamespace)(_drag.end, namespace);
const viewFunction = viewModel => {
  const {
    mainRef,
    props
  } = viewModel;
  const {
    direction
  } = props;
  return (0, _inferno.createVNode)(1, "div", "dx-resizable-handle dx-resizable-handle-".concat(direction), null, 1, null, null, mainRef);
};
exports.viewFunction = viewFunction;
const ResizableHandleProps = exports.ResizableHandleProps = {
  direction: 'top',
  disabled: false
};
let ResizableHandle = exports.ResizableHandle = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(ResizableHandle, _InfernoComponent);
  function ResizableHandle(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.mainRef = (0, _inferno.createRef)();
    _this.dragEventsEffect = _this.dragEventsEffect.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = ResizableHandle.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.dragEventsEffect, [this.props.disabled, this.props.onResize, this.props.onResizeEnd, this.props.onResizeStart])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.disabled, this.props.onResize, this.props.onResizeEnd, this.props.onResizeStart]);
  };
  _proto.dragEventsEffect = function dragEventsEffect() {
    const {
      disabled,
      onResize,
      onResizeEnd,
      onResizeStart
    } = this.props;
    if (!disabled) {
      const handleEl = this.mainRef.current;
      const opts = {
        direction: 'both',
        immediate: true
      };
      _events_engine.default.on(handleEl, {
        [dragStartEvent]: event => {
          _events_engine.default.on(handleEl, {
            [dragEvent]: onResize,
            [dragEndEvent]: onResizeEnd
          }, opts);
          onResizeStart === null || onResizeStart === void 0 ? void 0 : onResizeStart(event);
        }
      }, opts);
      return () => _events_engine.default.off(handleEl, undefined, undefined);
    }
    return undefined;
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      mainRef: this.mainRef,
      restAttributes: this.restAttributes
    });
  };
  _createClass(ResizableHandle, [{
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return ResizableHandle;
}(_inferno2.InfernoComponent);
ResizableHandle.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(ResizableHandleProps), Object.getOwnPropertyDescriptors(_extends({}, (0, _utils.convertRulesToOptions)([])))));
const __defaultOptionRules = [];
function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  ResizableHandle.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(ResizableHandle.defaultProps), Object.getOwnPropertyDescriptors((0, _utils.convertRulesToOptions)([])), Object.getOwnPropertyDescriptors((0, _utils.convertRulesToOptions)(__defaultOptionRules))));
}
