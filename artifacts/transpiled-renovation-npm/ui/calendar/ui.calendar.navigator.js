"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _button = _interopRequireDefault(require("../button"));
var _themes = require("../themes");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const CALENDAR_NAVIGATOR_CLASS = 'dx-calendar-navigator';
const CALENDAR_NAVIGATOR_PREVIOUS_MONTH_CLASS = 'dx-calendar-navigator-previous-month';
const CALENDAR_NAVIGATOR_NEXT_MONTH_CLASS = 'dx-calendar-navigator-next-month';
const CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS = 'dx-calendar-navigator-previous-view';
const CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS = 'dx-calendar-navigator-next-view';
const CALENDAR_NAVIGATOR_DISABLED_LINK_CLASS = 'dx-calendar-disabled-navigator-link';
const CALENDAR_NAVIGATOR_CAPTION_BUTTON_CLASS = 'dx-calendar-caption-button';
const BUTTON_TEXT_CLASS = 'dx-button-text';
let Navigator = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(Navigator, _Widget);
  function Navigator() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = Navigator.prototype;
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      onClick: null,
      onCaptionClick: null,
      type: 'normal',
      stylingMode: 'outlined',
      text: ''
    });
  };
  _proto._defaultOptionsRules = function _defaultOptionsRules() {
    return _Widget.prototype._defaultOptionsRules.call(this).concat([{
      device: function () {
        return (0, _themes.isMaterial)();
      },
      options: {
        type: 'default',
        stylingMode: 'text'
      }
    }, {
      device: function () {
        return (0, _themes.isFluent)();
      },
      options: {
        type: 'normal',
        stylingMode: 'text'
      }
    }]);
  };
  _proto._init = function _init() {
    _Widget.prototype._init.call(this);
    this._initActions();
  };
  _proto._initActions = function _initActions() {
    this._clickAction = this._createActionByOption('onClick');
    this._captionClickAction = this._createActionByOption('onCaptionClick');
  };
  _proto._initMarkup = function _initMarkup() {
    _Widget.prototype._initMarkup.call(this);
    this.$element().addClass(CALENDAR_NAVIGATOR_CLASS);
    this._renderButtons();
    this._renderCaption();
  };
  _proto._renderButtons = function _renderButtons() {
    const {
      rtlEnabled,
      type,
      stylingMode,
      focusStateEnabled
    } = this.option();
    const direction = 1;
    this._prevButton = this._createComponent((0, _renderer.default)('<div>'), _button.default, {
      focusStateEnabled,
      icon: rtlEnabled ? 'chevronright' : 'chevronleft',
      onClick: e => {
        this._clickAction({
          direction: -direction,
          event: e
        });
      },
      type,
      stylingMode,
      integrationOptions: {}
    });
    const $prevButton = this._prevButton.$element().addClass(CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS).addClass(CALENDAR_NAVIGATOR_PREVIOUS_MONTH_CLASS);
    this._nextButton = this._createComponent((0, _renderer.default)('<div>'), _button.default, {
      focusStateEnabled,
      icon: rtlEnabled ? 'chevronleft' : 'chevronright',
      onClick: e => {
        this._clickAction({
          direction: direction,
          event: e
        });
      },
      type,
      stylingMode,
      integrationOptions: {}
    });
    const $nextButton = this._nextButton.$element().addClass(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS).addClass(CALENDAR_NAVIGATOR_NEXT_MONTH_CLASS);
    this._caption = this._createComponent((0, _renderer.default)('<div>').addClass(CALENDAR_NAVIGATOR_CAPTION_BUTTON_CLASS), _button.default, {
      focusStateEnabled,
      onClick: e => {
        this._captionClickAction({
          event: e
        });
      },
      type,
      stylingMode,
      template: (_, content) => {
        const {
          text
        } = this.option();
        const captionSeparator = ' - ';
        const viewCaptionTexts = text.split(captionSeparator);
        viewCaptionTexts.forEach(captionText => {
          (0, _renderer.default)(content).append((0, _renderer.default)('<span>').addClass(BUTTON_TEXT_CLASS).text(captionText));
        });
      },
      integrationOptions: {}
    });
    const $caption = this._caption.$element();
    this.$element().append($prevButton, $caption, $nextButton);
  };
  _proto._renderCaption = function _renderCaption() {
    this._caption.option('text', this.option('text'));
  };
  _proto.toggleButton = function toggleButton(buttonPrefix, value) {
    const buttonName = '_' + buttonPrefix + 'Button';
    const button = this[buttonName];
    if (button) {
      button.option('disabled', value);
      button.$element().toggleClass(CALENDAR_NAVIGATOR_DISABLED_LINK_CLASS, value);
    }
  };
  _proto._optionChanged = function _optionChanged(args) {
    switch (args.name) {
      case 'text':
        this._renderCaption();
        break;
      default:
        _Widget.prototype._optionChanged.call(this, args);
    }
  };
  return Navigator;
}(_ui.default);
var _default = exports.default = Navigator;
module.exports = exports.default;
module.exports.default = exports.default;