"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DomComponentWrapper = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _get_updated_options = require("../../../renovation/ui/common/utils/get_updated_options");
var _extend = require("../../../core/utils/extend");
var _config_context = require("./config_context");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable @typescript-eslint/explicit-module-boundary-types */ /* eslint-disable @typescript-eslint/no-unsafe-return */ /* eslint-disable @typescript-eslint/no-explicit-any */
const normalizeProps = props => Object.keys(props).reduce((accumulator, key) => {
  if (props[key] !== undefined) {
    accumulator[key] = props[key];
  }
  return accumulator;
}, {});
class DomComponentWrapper extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.refs = null;
    this.widgetRef = (0, _inferno.createRef)();
    this.instance = null;
    this.prevProps = null;
    this.getInstance = this.getInstance.bind(this);
    this.setupWidget = this.setupWidget.bind(this);
    this.updateWidget = this.updateWidget.bind(this);
  }
  getConfig() {
    const {
      id
    } = _config_context.ConfigContext;
    if (this.context[id]) {
      return this.context[id];
    }
    return _config_context.ConfigContext.defaultValue;
  }
  render() {
    return normalizeProps((0, _inferno.createVNode)(1, "div", this.props.componentProps.className, null, 1, _extends({}, this.props), null, this.widgetRef));
  }
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate(nextProps, nextState, context);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.setupWidget, []), new _inferno2.InfernoEffect(this.updateWidget, [this.props.componentProps, this.getConfig(), this.props.templateNames])];
  }
  updateEffects() {
    var _this$_effects$;
    const dependency = [this.props.componentProps, this.getConfig(), this.props.templateNames];
    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 || _this$_effects$.update(dependency);
  }
  setupWidget() {
    const current = this.widgetRef.current;
    // eslint-disable-next-line new-cap
    const componentInstance = new this.props.componentType(current, this.getProperties());
    this.instance = componentInstance;
    return () => {
      componentInstance.dispose();
      this.instance = null;
    };
  }
  updateWidget() {
    if (!this.instance) {
      return;
    }
    const updatedOptions = (0, _get_updated_options.getUpdatedOptions)(this.prevProps ?? {}, this.getProperties());
    if (updatedOptions.length) {
      this.instance.beginUpdate();
      updatedOptions.forEach(_ref2 => {
        var _this$instance;
        const {
          path,
          value
        } = _ref2;
        (_this$instance = this.instance) === null || _this$instance === void 0 || _this$instance.option(path, value);
      });
      this.instance.endUpdate();
    }
    this.prevProps = this.getProperties();
  }
  getProperties() {
    var _this$getConfig;
    const normalizedProps = normalizeProps(this.props.componentProps);
    const {
      valueChange
    } = normalizedProps;
    const properties = (0, _extend.extend)({
      rtlEnabled: (_this$getConfig = this.getConfig()) === null || _this$getConfig === void 0 ? void 0 : _this$getConfig.rtlEnabled,
      isRenovated: true
    }, normalizedProps);
    if (valueChange) {
      properties.onValueChanged = _ref3 => {
        const {
          value
        } = _ref3;
        return valueChange(value);
      };
    }
    const templates = this.props.templateNames;
    templates.forEach(name => {
      if ((0, _inferno2.hasTemplate)(name, properties, this)) {
        properties[name] = (item, index, container) => {
          (0, _inferno2.renderTemplate)(this.props.componentProps[name], {
            item,
            index,
            container
          }, this);
        };
      }
    });
    return properties;
  }
  getInstance() {
    return this.instance;
  }
}
exports.DomComponentWrapper = DomComponentWrapper;