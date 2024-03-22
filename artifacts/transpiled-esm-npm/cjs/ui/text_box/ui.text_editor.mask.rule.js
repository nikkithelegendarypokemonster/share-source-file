"use strict";

exports.StubMaskRule = exports.MaskRule = exports.EmptyMaskRule = void 0;
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const EMPTY_CHAR = ' ';
let BaseMaskRule = /*#__PURE__*/function () {
  function BaseMaskRule(config) {
    this._value = EMPTY_CHAR;
    (0, _extend.extend)(this, config);
  }
  var _proto = BaseMaskRule.prototype;
  _proto.next = function next(rule) {
    if (!arguments.length) {
      return this._next;
    }
    this._next = rule;
  };
  _proto._prepareHandlingArgs = function _prepareHandlingArgs(args, config) {
    var _config$str, _config$start, _config$length;
    config = config || {};
    const handlingProperty = Object.prototype.hasOwnProperty.call(args, 'value') ? 'value' : 'text';
    args[handlingProperty] = (_config$str = config.str) !== null && _config$str !== void 0 ? _config$str : args[handlingProperty];
    args.start = (_config$start = config.start) !== null && _config$start !== void 0 ? _config$start : args.start;
    args.length = (_config$length = config.length) !== null && _config$length !== void 0 ? _config$length : args.length;
    args.index = args.index + 1;
    return args;
  };
  _proto.first = function first(index) {
    index = index || 0;
    return this.next().first(index + 1);
  };
  _proto.isAccepted = function isAccepted() {
    return false;
  };
  _proto.adjustedCaret = function adjustedCaret(caret, isForwardDirection, char) {
    return isForwardDirection ? this._adjustedForward(caret, 0, char) : this._adjustedBackward(caret, 0, char);
  };
  _proto._adjustedForward = function _adjustedForward() {};
  _proto._adjustedBackward = function _adjustedBackward() {};
  _proto.isValid = function isValid() {};
  _proto.reset = function reset() {};
  _proto.clear = function clear() {};
  _proto.text = function text() {};
  _proto.value = function value() {};
  _proto.rawValue = function rawValue() {};
  _proto.handle = function handle() {};
  return BaseMaskRule;
}();
let EmptyMaskRule = exports.EmptyMaskRule = /*#__PURE__*/function (_BaseMaskRule) {
  _inheritsLoose(EmptyMaskRule, _BaseMaskRule);
  function EmptyMaskRule() {
    return _BaseMaskRule.apply(this, arguments) || this;
  }
  var _proto2 = EmptyMaskRule.prototype;
  _proto2.next = function next() {};
  _proto2.handle = function handle() {
    return 0;
  };
  _proto2.text = function text() {
    return '';
  };
  _proto2.value = function value() {
    return '';
  };
  _proto2.first = function first() {
    return 0;
  };
  _proto2.rawValue = function rawValue() {
    return '';
  };
  _proto2.adjustedCaret = function adjustedCaret() {
    return 0;
  };
  _proto2.isValid = function isValid() {
    return true;
  };
  return EmptyMaskRule;
}(BaseMaskRule);
let MaskRule = exports.MaskRule = /*#__PURE__*/function (_BaseMaskRule2) {
  _inheritsLoose(MaskRule, _BaseMaskRule2);
  function MaskRule() {
    return _BaseMaskRule2.apply(this, arguments) || this;
  }
  var _proto3 = MaskRule.prototype;
  _proto3.text = function text() {
    return (this._value !== EMPTY_CHAR ? this._value : this.maskChar) + this.next().text();
  };
  _proto3.value = function value() {
    return this._value + this.next().value();
  };
  _proto3.rawValue = function rawValue() {
    return this._value + this.next().rawValue();
  };
  _proto3.handle = function handle(args) {
    const str = Object.prototype.hasOwnProperty.call(args, 'value') ? args.value : args.text;
    if (!str || !str.length || !args.length) {
      return 0;
    }
    if (args.start) {
      return this.next().handle(this._prepareHandlingArgs(args, {
        start: args.start - 1
      }));
    }
    const char = str[0];
    const rest = str.substring(1);
    this._tryAcceptChar(char, args);
    return this._accepted() ? this.next().handle(this._prepareHandlingArgs(args, {
      str: rest,
      length: args.length - 1
    })) + 1 : this.handle(this._prepareHandlingArgs(args, {
      str: rest,
      length: args.length - 1
    }));
  };
  _proto3.clear = function clear(args) {
    this._tryAcceptChar(EMPTY_CHAR, args);
    this.next().clear(this._prepareHandlingArgs(args));
  };
  _proto3.reset = function reset() {
    this._accepted(false);
    this.next().reset();
  };
  _proto3._tryAcceptChar = function _tryAcceptChar(char, args) {
    this._accepted(false);
    if (!this._isAllowed(char, args)) {
      return;
    }
    const acceptedChar = char === EMPTY_CHAR ? this.maskChar : char;
    args.fullText = args.fullText.substring(0, args.index) + acceptedChar + args.fullText.substring(args.index + 1);
    this._accepted(true);
    this._value = char;
  };
  _proto3._accepted = function _accepted(value) {
    if (!arguments.length) {
      return !!this._isAccepted;
    }
    this._isAccepted = !!value;
  };
  _proto3.first = function first(index) {
    return this._value === EMPTY_CHAR ? index || 0 : _BaseMaskRule2.prototype.first.call(this, index);
  };
  _proto3._isAllowed = function _isAllowed(char, args) {
    if (char === EMPTY_CHAR) {
      return true;
    }
    return this._isValid(char, args);
  };
  _proto3._isValid = function _isValid(char, args) {
    const allowedChars = this.allowedChars;
    if (allowedChars instanceof RegExp) {
      return allowedChars.test(char);
    }
    if ((0, _type.isFunction)(allowedChars)) {
      return allowedChars(char, args.index, args.fullText);
    }
    if (Array.isArray(allowedChars)) {
      return allowedChars.includes(char);
    }
    return allowedChars === char;
  };
  _proto3.isAccepted = function isAccepted(caret) {
    return caret === 0 ? this._accepted() : this.next().isAccepted(caret - 1);
  };
  _proto3._adjustedForward = function _adjustedForward(caret, index, char) {
    if (index >= caret) {
      return index;
    }
    return this.next()._adjustedForward(caret, index + 1, char) || index + 1;
  };
  _proto3._adjustedBackward = function _adjustedBackward(caret, index) {
    if (index >= caret - 1) {
      return caret;
    }
    return this.next()._adjustedBackward(caret, index + 1) || index + 1;
  };
  _proto3.isValid = function isValid(args) {
    return this._isValid(this._value, args) && this.next().isValid(this._prepareHandlingArgs(args));
  };
  return MaskRule;
}(BaseMaskRule);
let StubMaskRule = exports.StubMaskRule = /*#__PURE__*/function (_MaskRule) {
  _inheritsLoose(StubMaskRule, _MaskRule);
  function StubMaskRule() {
    return _MaskRule.apply(this, arguments) || this;
  }
  var _proto4 = StubMaskRule.prototype;
  _proto4.value = function value() {
    return this.next().value();
  };
  _proto4.handle = function handle(args) {
    const hasValueProperty = Object.prototype.hasOwnProperty.call(args, 'value');
    const str = hasValueProperty ? args.value : args.text;
    if (!str.length || !args.length) {
      return 0;
    }
    if (args.start || hasValueProperty) {
      return this.next().handle(this._prepareHandlingArgs(args, {
        start: args.start && args.start - 1
      }));
    }
    const char = str[0];
    const rest = str.substring(1);
    this._tryAcceptChar(char);
    const nextArgs = this._isAllowed(char) ? this._prepareHandlingArgs(args, {
      str: rest,
      length: args.length - 1
    }) : args;
    return this.next().handle(nextArgs) + 1;
  };
  _proto4.clear = function clear(args) {
    this._accepted(false);
    this.next().clear(this._prepareHandlingArgs(args));
  };
  _proto4._tryAcceptChar = function _tryAcceptChar(char) {
    this._accepted(this._isValid(char));
  };
  _proto4._isValid = function _isValid(char) {
    return char === this.maskChar;
  };
  _proto4.first = function first(index) {
    index = index || 0;
    return this.next().first(index + 1);
  };
  _proto4._adjustedForward = function _adjustedForward(caret, index, char) {
    if (index >= caret && char === this.maskChar) {
      return index;
    }
    if (caret === index + 1 && this._accepted()) {
      return caret;
    }
    return this.next()._adjustedForward(caret, index + 1, char);
  };
  _proto4._adjustedBackward = function _adjustedBackward(caret, index) {
    if (index >= caret - 1) {
      return 0;
    }
    return this.next()._adjustedBackward(caret, index + 1);
  };
  _proto4.isValid = function isValid(args) {
    return this.next().isValid(this._prepareHandlingArgs(args));
  };
  return StubMaskRule;
}(MaskRule);