"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _track_bar = _interopRequireDefault(require("../../ui/track_bar"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const PROGRESSBAR_CLASS = 'dx-progressbar';
const PROGRESSBAR_CONTAINER_CLASS = 'dx-progressbar-container';
const PROGRESSBAR_RANGE_CONTAINER_CLASS = 'dx-progressbar-range-container';
const PROGRESSBAR_RANGE_CLASS = 'dx-progressbar-range';
const PROGRESSBAR_WRAPPER_CLASS = 'dx-progressbar-wrapper';
const PROGRESSBAR_STATUS_CLASS = 'dx-progressbar-status';
const PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER = 'dx-progressbar-animating-container';
const PROGRESSBAR_INDETERMINATE_SEGMENT = 'dx-progressbar-animating-segment';
// @ts-expect-error
const ProgressBar = _track_bar.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      value: 0,
      statusFormat(ratio) {
        return `Progress: ${Math.round(ratio * 100)}%`;
      },
      showStatus: true,
      onComplete: null,
      activeStateEnabled: false,
      statusPosition: 'bottom left',
      _animatingSegmentCount: 0
    });
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device(device) {
        return device.platform === 'android';
      },
      options: {
        _animatingSegmentCount: 2
      }
    }]);
  },
  _toggleReadOnlyState() {
    this.setAria('readonly', undefined);
  },
  _initMarkup() {
    this._renderStatus();
    this._createCompleteAction();
    this.callBase();
    this.$element().addClass(PROGRESSBAR_CLASS);
    this._$wrapper.addClass(PROGRESSBAR_WRAPPER_CLASS);
    this._$bar.addClass(PROGRESSBAR_CONTAINER_CLASS);
    this.setAria('role', 'progressbar');
    (0, _renderer.default)('<div>').addClass(PROGRESSBAR_RANGE_CONTAINER_CLASS).appendTo(this._$wrapper).append(this._$bar);
    this._$range.addClass(PROGRESSBAR_RANGE_CLASS);
    this._toggleStatus(this.option('showStatus'));
  },
  _useTemplates() {
    return false;
  },
  _createCompleteAction() {
    this._completeAction = this._createActionByOption('onComplete');
  },
  _renderStatus() {
    this._$status = (0, _renderer.default)('<div>').addClass(PROGRESSBAR_STATUS_CLASS);
  },
  _renderIndeterminateState() {
    this._$segmentContainer = (0, _renderer.default)('<div>').addClass(PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER);
    const segments = this.option('_animatingSegmentCount');
    for (let i = 0; i < segments; i++) {
      (0, _renderer.default)('<div>').addClass(PROGRESSBAR_INDETERMINATE_SEGMENT).addClass(`${PROGRESSBAR_INDETERMINATE_SEGMENT}-${i + 1}`).appendTo(this._$segmentContainer);
    }
    this._$segmentContainer.appendTo(this._$wrapper);
  },
  _toggleStatus(value) {
    const splitPosition = this.option('statusPosition').split(' ');
    if (value) {
      if (splitPosition[0] === 'top' || splitPosition[0] === 'left') {
        this._$status.prependTo(this._$wrapper);
      } else {
        this._$status.appendTo(this._$wrapper);
      }
    } else {
      this._$status.detach();
    }
    this._togglePositionClass();
  },
  _togglePositionClass() {
    const position = this.option('statusPosition');
    const splitPosition = position.split(' ');
    this._$wrapper.removeClass('dx-position-top-left dx-position-top-right dx-position-bottom-left dx-position-bottom-right dx-position-left dx-position-right');
    let positionClass = `dx-position-${splitPosition[0]}`;
    if (splitPosition[1]) {
      positionClass += `-${splitPosition[1]}`;
    }
    this._$wrapper.addClass(positionClass);
  },
  _toggleIndeterminateState(value) {
    if (value) {
      this._renderIndeterminateState();
      this._$bar.toggle(false);
    } else {
      this._$bar.toggle(true);
      this._$segmentContainer.remove();
      delete this._$segmentContainer;
    }
  },
  _renderValue() {
    const val = this.option('value');
    const max = this.option('max');
    if (!val && val !== 0) {
      this._toggleIndeterminateState(true);
      return;
    }
    if (this._$segmentContainer) {
      this._toggleIndeterminateState(false);
    }
    if (val === max) {
      this._completeAction();
    }
    this.callBase();
    this._setStatus();
  },
  _setStatus() {
    let format = this.option('statusFormat');
    if ((0, _type.isFunction)(format)) {
      format = format.bind(this);
    } else {
      format = function (value) {
        return value;
      };
    }
    const statusText = format(this._currentRatio, this.option('value'));
    this._$status.text(statusText);
  },
  _dispose() {
    this._$status.remove();
    this.callBase();
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'statusFormat':
        this._setStatus();
        break;
      case 'showStatus':
        this._toggleStatus(args.value);
        break;
      case 'statusPosition':
        this._toggleStatus(this.option('showStatus'));
        break;
      case 'onComplete':
        this._createCompleteAction();
        break;
      case '_animatingSegmentCount':
        break;
      default:
        this.callBase(args);
    }
  }
});
(0, _component_registrator.default)('dxProgressBar', ProgressBar);
var _default = exports.default = ProgressBar;