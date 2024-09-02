"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectBox = exports.NumberBoxDefaultProps = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _select_box = _interopRequireDefault(require("../../../ui/select_box"));
var _dom_component_wrapper = require("../../core/r1/dom_component_wrapper");
var _editor_label_props = require("../editors/common/editor_label_props");
var _editor_props = require("../editors/common/editor_props");
var _editor_state_props = require("../editors/common/editor_state_props");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable @typescript-eslint/no-explicit-any */
const NumberBoxDefaultProps = exports.NumberBoxDefaultProps = _extends({}, _editor_props.EditorDefaultProps, _editor_state_props.EditorStateDefaultProps, _editor_label_props.EditorLabelDefaultProps, {
  placeholder: '',
  hoverStateEnabled: true,
  searchEnabled: false,
  value: null,
  isReactComponentWrapper: true
});
class SelectBox extends _inferno2.BaseInfernoComponent {
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
      "componentType": _select_box.default,
      "componentProps": this.componentProps,
      "templateNames": ['dropDownButtonTemplate', 'groupTemplate', 'itemTemplate']
    });
  }
}
exports.SelectBox = SelectBox;
SelectBox.defaultProps = NumberBoxDefaultProps;