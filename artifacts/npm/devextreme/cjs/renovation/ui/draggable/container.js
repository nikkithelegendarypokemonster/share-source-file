/**
* DevExtreme (cjs/renovation/ui/draggable/container.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.DraggableContainerProps = exports.DraggableContainer = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _drag = require("../../../events/drag");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _combine_classes = require("../../utils/combine_classes");
const _excluded = ["children", "className", "data", "disabled", "onDragEnd", "onDragMove", "onDragStart"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
    cssClasses,
    props: {
      children
    },
    restAttributes,
    widgetRef
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createVNode)(1, "div", cssClasses, children, 0, _extends({}, restAttributes), null, widgetRef));
};
exports.viewFunction = viewFunction;
const DraggableContainerProps = exports.DraggableContainerProps = {
  className: ''
};
let DraggableContainer = exports.DraggableContainer = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(DraggableContainer, _InfernoComponent);
  function DraggableContainer(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.widgetRef = (0, _inferno.createRef)();
    _this.state = {
      isDragging: false
    };
    _this.dragEffect = _this.dragEffect.bind(_assertThisInitialized(_this));
    _this.dragStartHandler = _this.dragStartHandler.bind(_assertThisInitialized(_this));
    _this.dragMoveHandler = _this.dragMoveHandler.bind(_assertThisInitialized(_this));
    _this.dragEndHandler = _this.dragEndHandler.bind(_assertThisInitialized(_this));
    _this.getEventArgs = _this.getEventArgs.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = DraggableContainer.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.dragEffect, [this.props.disabled, this.props.data, this.props.onDragStart, this.props.onDragMove, this.props.onDragEnd])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.disabled, this.props.data, this.props.onDragStart, this.props.onDragMove, this.props.onDragEnd]);
  };
  _proto.dragEffect = function dragEffect() {
    if (this.props.disabled) {
      return undefined;
    }
    _events_engine.default.on(this.widgetRef.current, _drag.start, this.dragStartHandler);
    _events_engine.default.on(this.widgetRef.current, _drag.move, this.dragMoveHandler);
    _events_engine.default.on(this.widgetRef.current, _drag.end, this.dragEndHandler);
    return () => {
      _events_engine.default.off(this.widgetRef.current, _drag.start, this.dragStartHandler);
      _events_engine.default.off(this.widgetRef.current, _drag.move, this.dragMoveHandler);
      _events_engine.default.off(this.widgetRef.current, _drag.end, this.dragEndHandler);
    };
  };
  _proto.dragStartHandler = function dragStartHandler(event) {
    this.setState(__state_argument => ({
      isDragging: true
    }));
    const dragStartArgs = this.getEventArgs(event);
    const {
      onDragStart
    } = this.props;
    onDragStart === null || onDragStart === void 0 ? void 0 : onDragStart(dragStartArgs);
  };
  _proto.dragMoveHandler = function dragMoveHandler(event) {
    const dragMoveArgs = this.getEventArgs(event);
    const {
      onDragMove
    } = this.props;
    onDragMove === null || onDragMove === void 0 ? void 0 : onDragMove(dragMoveArgs);
  };
  _proto.dragEndHandler = function dragEndHandler(event) {
    this.setState(__state_argument => ({
      isDragging: false
    }));
    const dragEndArgs = this.getEventArgs(event);
    const {
      onDragEnd
    } = this.props;
    onDragEnd === null || onDragEnd === void 0 ? void 0 : onDragEnd(dragEndArgs);
  };
  _proto.getEventArgs = function getEventArgs(e) {
    return {
      event: e,
      data: this.props.data,
      itemElement: this.widgetRef.current
    };
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      isDragging: this.state.isDragging,
      widgetRef: this.widgetRef,
      cssClasses: this.cssClasses,
      dragStartHandler: this.dragStartHandler,
      dragMoveHandler: this.dragMoveHandler,
      dragEndHandler: this.dragEndHandler,
      getEventArgs: this.getEventArgs,
      restAttributes: this.restAttributes
    });
  };
  _createClass(DraggableContainer, [{
    key: "cssClasses",
    get: function () {
      const {
        className,
        disabled
      } = this.props;
      const classesMap = {
        [className]: !!className,
        'dx-draggable': true,
        'dx-draggable-dragging': this.state.isDragging,
        'dx-state-disabled': !!disabled
      };
      return (0, _combine_classes.combineClasses)(classesMap);
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return DraggableContainer;
}(_inferno2.InfernoComponent);
DraggableContainer.defaultProps = DraggableContainerProps;
