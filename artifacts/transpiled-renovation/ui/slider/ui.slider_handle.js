"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _ui2 = _interopRequireDefault(require("./ui.slider_tooltip"));
var _extend = require("../../core/utils/extend");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SLIDER_HANDLE_CLASS = 'dx-slider-handle';
const SliderHandle = _ui.default.inherit({
  _getDefaultOptions: function () {
    return (0, _extend.extend)(this.callBase(), {
      hoverStateEnabled: false,
      value: 0,
      tooltip: {
        enabled: false,
        format: value => value,
        position: 'top',
        showMode: 'onHover'
      }
    });
  },
  _initMarkup: function () {
    this.callBase();
    this.$element().addClass(SLIDER_HANDLE_CLASS);
    this.setAria({
      role: 'slider',
      'valuenow': this.option('value'),
      label: 'Slider'
    });
  },
  _render: function () {
    this.callBase();
    this._renderTooltip();
  },
  _renderTooltip: function () {
    const {
      tooltip,
      value
    } = this.option();
    const {
      position,
      format,
      enabled,
      showMode
    } = tooltip;
    const $sliderTooltip = (0, _renderer.default)('<div>');
    this._sliderTooltip = this._createComponent($sliderTooltip, _ui2.default, {
      target: this.$element(),
      container: $sliderTooltip,
      position,
      visible: enabled,
      showMode,
      format,
      value
    });
  },
  _clean: function () {
    this.callBase();
    this._sliderTooltip = null;
  },
  _updateTooltipOptions(args) {
    var _this$_sliderTooltip;
    const tooltipOptions = _ui.default.getOptionsFromContainer(args);
    this._setWidgetOption('_sliderTooltip', [tooltipOptions]);
    (_this$_sliderTooltip = this._sliderTooltip) === null || _this$_sliderTooltip === void 0 ? void 0 : _this$_sliderTooltip.option('visible', tooltipOptions.enabled);
  },
  _optionChanged: function (args) {
    const {
      name,
      value
    } = args;
    switch (name) {
      case 'value':
        {
          var _this$_sliderTooltip2;
          (_this$_sliderTooltip2 = this._sliderTooltip) === null || _this$_sliderTooltip2 === void 0 ? void 0 : _this$_sliderTooltip2.option('value', value);
          this.setAria('valuenow', value);
          break;
        }
      case 'tooltip':
        this._updateTooltipOptions(args);
        break;
      default:
        this.callBase(args);
    }
  },
  updateTooltipPosition: function () {
    var _this$_sliderTooltip3;
    (_this$_sliderTooltip3 = this._sliderTooltip) === null || _this$_sliderTooltip3 === void 0 ? void 0 : _this$_sliderTooltip3.updatePosition();
  },
  repaint: function () {
    var _this$_sliderTooltip4;
    (_this$_sliderTooltip4 = this._sliderTooltip) === null || _this$_sliderTooltip4 === void 0 ? void 0 : _this$_sliderTooltip4.repaint();
  }
});
var _default = exports.default = SliderHandle;
module.exports = exports.default;
module.exports.default = exports.default;