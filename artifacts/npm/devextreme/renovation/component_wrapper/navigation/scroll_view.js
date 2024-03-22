/**
* DevExtreme (renovation/component_wrapper/navigation/scroll_view.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.ScrollViewWrapper = void 0;
var _component = _interopRequireDefault(require("../common/component"));
var _deferred = require("../../../core/utils/deferred");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let ScrollViewWrapper = exports.ScrollViewWrapper = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ScrollViewWrapper, _Component);
  function ScrollViewWrapper(element, options) {
    var _this;
    _this = _Component.call(this, element, options) || this;
    _this.updateAdditionalOptions();
    return _this;
  }
  var _proto = ScrollViewWrapper.prototype;
  _proto.update = function update() {
    var _this$viewRef;
    (_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.updateHandler();
    return (0, _deferred.Deferred)().resolve();
  };
  _proto.release = function release(preventScrollBottom) {
    this.viewRef.release(preventScrollBottom);
    return (0, _deferred.Deferred)().resolve();
  };
  _proto._dimensionChanged = function _dimensionChanged() {
    var _this$viewRef2;
    (_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.updateHandler();
  };
  _proto.isRenovated = function isRenovated() {
    return !!_component.default.IS_RENOVATED_WIDGET;
  };
  _proto.updateAdditionalOptions = function updateAdditionalOptions() {
    this.option('pullDownEnabled', this.hasActionSubscription('onPullDown'));
    this.option('reachBottomEnabled', this.hasActionSubscription('onReachBottom'));
  };
  _proto.on = function on() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    const callBase = _Component.prototype.on.apply(this, args);
    this.updateAdditionalOptions();
    return callBase;
  };
  _proto._optionChanged = function _optionChanged(option) {
    const {
      name
    } = option;
    if (name === 'useNative') {
      this._isNodeReplaced = false;
    }
    _Component.prototype._optionChanged.call(this, option);
    if (name === 'onPullDown' || name === 'onReachBottom') {
      this.updateAdditionalOptions();
    }
  };
  _proto._moveIsAllowed = function _moveIsAllowed(event) {
    return this.viewRef.scrollableRef.current.scrollableRef.moveIsAllowed(event);
  };
  return ScrollViewWrapper;
}(_component.default);
