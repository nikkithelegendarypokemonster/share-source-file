"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NumberBoxDefaultProps = exports.NumberBox = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _number_box = _interopRequireDefault(require("../../../ui/number_box"));
var _dom_component_wrapper = require("../../core/r1/dom_component_wrapper");
var _editor_label_props = require("./common/editor_label_props");
var _editor_props = require("./common/editor_props");
var _editor_state_props = require("./common/editor_state_props");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable @typescript-eslint/no-explicit-any */
const DEFAULT_VALUE = 0;
const NumberBoxDefaultProps = exports.NumberBoxDefaultProps = _extends({}, _editor_props.EditorDefaultProps, _editor_state_props.EditorStateDefaultProps, _editor_label_props.EditorLabelDefaultProps, {
  value: DEFAULT_VALUE,
  isReactComponentWrapper: true
});
class NumberBox extends _inferno2.BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this.state = {};
    this.refs = null;
  }
  /* istanbul ignore next: WA for Angular */
  get componentProps() {
    return this.props;
  }
  render() {
    return (0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, {
      "componentType": _number_box.default,
      "componentProps": this.componentProps,
      "templateNames": []
    });
  }
}
exports.NumberBox = NumberBox;
NumberBox.defaultProps = NumberBoxDefaultProps;