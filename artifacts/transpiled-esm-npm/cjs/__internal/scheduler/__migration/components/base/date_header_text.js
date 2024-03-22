"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateHeaderText = void 0;
var _inferno = require("@devextreme/runtime/inferno");
var _inferno2 = require("inferno");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const DateHeaderTextDefaultProps = {
  text: '',
  splitText: false
};
let DateHeaderText = exports.DateHeaderText = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(DateHeaderText, _BaseInfernoComponent);
  function DateHeaderText() {
    var _this;
    _this = _BaseInfernoComponent.apply(this, arguments) || this;
    _this._textCache = null;
    return _this;
  }
  var _proto = DateHeaderText.prototype;
  _proto.getTextParts = function getTextParts() {
    if (this._textCache !== null) {
      return this._textCache;
    }
    const {
      text
    } = this.props;
    this._textCache = text ? text.split(' ') : [''];
    return this._textCache;
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps) {
    if (this.props.text !== nextProps.text) {
      this._textCache = null;
    }
  };
  _proto.render = function render() {
    const {
      splitText,
      text
    } = this.props;
    const textParts = this.getTextParts();
    return (0, _inferno2.createFragment)(splitText ? textParts.map(part => (0, _inferno2.createVNode)(1, 'div', 'dx-scheduler-header-panel-cell-date', (0, _inferno2.createVNode)(1, 'span', null, part, 0), 2)) : text, 0);
  };
  return DateHeaderText;
}(_inferno.BaseInfernoComponent);
DateHeaderText.defaultProps = DateHeaderTextDefaultProps;