"use strict";

exports.default = void 0;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _window = require("../../core/utils/window");
var _ui = _interopRequireDefault(require("../popup/ui.popup"));
var _uiDiagram = _interopRequireDefault(require("./ui.diagram.panel"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const DIAGRAM_MOBILE_POPUP_CLASS = 'dx-diagram-mobile-popup';
let DiagramFloatingPanel = /*#__PURE__*/function (_DiagramPanel) {
  _inheritsLoose(DiagramFloatingPanel, _DiagramPanel);
  function DiagramFloatingPanel() {
    return _DiagramPanel.apply(this, arguments) || this;
  }
  var _proto = DiagramFloatingPanel.prototype;
  _proto._init = function _init() {
    _DiagramPanel.prototype._init.call(this);
    this._createOnVisibilityChangingAction();
    this._createOnVisibilityChangedAction();
  };
  _proto.isVisible = function isVisible() {
    return this.option('isVisible');
  };
  _proto.isMobileView = function isMobileView() {
    return this.option('isMobileView');
  };
  _proto._initMarkup = function _initMarkup() {
    _DiagramPanel.prototype._initMarkup.call(this);
    const $parent = this.$element();
    const $popupElement = (0, _renderer.default)('<div>').addClass(this._getPopupClass()).addClass(this.isMobileView() && DIAGRAM_MOBILE_POPUP_CLASS).appendTo($parent);
    this._popup = this._createComponent($popupElement, _ui.default, this._getPopupOptions());
    this._updatePopupVisible();
  };
  _proto.show = function show() {
    this.option('isVisible', true);
  };
  _proto.hide = function hide() {
    this.option('isVisible', false);
  };
  _proto.toggle = function toggle() {
    this.option('isVisible', !this.isVisible());
  };
  _proto.repaint = function repaint() {
    this._popup.repaint();
  };
  _proto._getPopupContent = function _getPopupContent() {
    return this._popup.content();
  };
  _proto._getPopupTitle = function _getPopupTitle() {
    const $content = (0, _renderer.default)(this._getPopupContent());
    return $content.parent().find('.dx-popup-title');
  };
  _proto._getPointerUpElements = function _getPointerUpElements() {
    return [this._getPopupContent(), this._getPopupTitle()];
  };
  _proto._getVerticalPaddingsAndBorders = function _getVerticalPaddingsAndBorders() {
    const $content = (0, _renderer.default)(this._getPopupContent());
    return (0, _size.getOuterHeight)($content) - (0, _size.getHeight)($content);
  };
  _proto._getHorizontalPaddingsAndBorders = function _getHorizontalPaddingsAndBorders() {
    const $content = (0, _renderer.default)(this._getPopupContent());
    return (0, _size.getOuterWidth)($content) - (0, _size.getWidth)($content);
  };
  _proto._getPopupClass = function _getPopupClass() {
    return '';
  };
  _proto._getPopupWidth = function _getPopupWidth() {
    return this.option('width') || 'auto';
  };
  _proto._getPopupMaxWidth = function _getPopupMaxWidth() {
    return this.option('maxWidth');
  };
  _proto._getPopupMinWidth = function _getPopupMinWidth() {
    return this.option('minWidth');
  };
  _proto._getPopupHeight = function _getPopupHeight() {
    return this.option('height') || 'auto';
  };
  _proto._getPopupMaxHeight = function _getPopupMaxHeight() {
    return this.option('maxHeight');
  };
  _proto._getPopupMinHeight = function _getPopupMinHeight() {
    return this.option('minHeight');
  };
  _proto._getPopupPosition = function _getPopupPosition() {
    return {};
  };
  _proto._getPopupContainer = function _getPopupContainer() {
    return this.option('container');
  };
  _proto._getPopupSlideAnimationObject = function _getPopupSlideAnimationObject(properties) {
    return (0, _extend.extend)({
      type: 'slide',
      start: () => {
        (0, _renderer.default)('body').css('overflow', 'hidden');
      },
      complete: () => {
        (0, _renderer.default)('body').css('overflow', '');
      }
    }, properties);
  };
  _proto._getPopupAnimation = function _getPopupAnimation() {
    return {
      hide: {
        type: 'fadeOut'
      },
      show: {
        type: 'fadeIn'
      }
    };
  };
  _proto._getPopupOptions = function _getPopupOptions() {
    const that = this;
    let wrapperClass = this._getPopupClass();
    if (this.isMobileView()) {
      wrapperClass += " ".concat(DIAGRAM_MOBILE_POPUP_CLASS);
    }
    return {
      animation: (0, _window.hasWindow)() ? this._getPopupAnimation() : null,
      shading: false,
      showTitle: false,
      focusStateEnabled: false,
      container: this._getPopupContainer(),
      width: this._getPopupWidth(),
      height: this._getPopupHeight(),
      maxWidth: this._getPopupMaxWidth(),
      maxHeight: this._getPopupMaxHeight(),
      minWidth: this._getPopupMinWidth(),
      minHeight: this._getPopupMinHeight(),
      position: this._getPopupPosition(),
      showCloseButton: true,
      wrapperAttr: {
        class: wrapperClass
      },
      onContentReady: function () {
        that._renderPopupContent(that._popup.content());
      },
      onShowing: () => {
        this._onVisibilityChangingAction({
          visible: true,
          component: this
        });
      },
      onShown: () => {
        this.option('isVisible', true);
        this._onVisibilityChangedAction({
          visible: true,
          component: this
        });
      },
      onHiding: () => {
        this._onVisibilityChangingAction({
          visible: false,
          component: this
        });
      },
      onHidden: () => {
        this.option('isVisible', false);
        this._onVisibilityChangedAction({
          visible: false,
          component: this
        });
      }
    };
  };
  _proto._renderPopupContent = function _renderPopupContent($parent) {};
  _proto._updatePopupVisible = function _updatePopupVisible() {
    this._popup.option('visible', this.isVisible());
  };
  _proto._createOnVisibilityChangingAction = function _createOnVisibilityChangingAction() {
    this._onVisibilityChangingAction = this._createActionByOption('onVisibilityChanging');
  };
  _proto._createOnVisibilityChangedAction = function _createOnVisibilityChangedAction() {
    this._onVisibilityChangedAction = this._createActionByOption('onVisibilityChanged');
  };
  _proto._optionChanged = function _optionChanged(args) {
    switch (args.name) {
      case 'onVisibilityChanging':
        this._createOnVisibilityChangingAction();
        break;
      case 'onVisibilityChanged':
        this._createOnVisibilityChangedAction();
        break;
      case 'container':
        this._popup.option('container', this._getPopupContainer());
        break;
      case 'width':
        this._popup.option('width', this._getPopupWidth());
        break;
      case 'height':
        this._popup.option('height', this._getPopupHeight());
        break;
      case 'maxWidth':
        this._popup.option('maxWidth', this._getPopupMaxWidth());
        break;
      case 'maxHeight':
        this._popup.option('maxHeight', this._getPopupMaxHeight());
        break;
      case 'minWidth':
        this._popup.option('minWidth', this._getPopupMinWidth());
        break;
      case 'minHeight':
        this._popup.option('minHeight', this._getPopupMinHeight());
        break;
      case 'isMobileView':
        this._invalidate();
        break;
      case 'isVisible':
        this._updatePopupVisible();
        break;
      default:
        _DiagramPanel.prototype._optionChanged.call(this, args);
    }
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_DiagramPanel.prototype._getDefaultOptions.call(this), {
      isVisible: true,
      isMobileView: false,
      offsetX: 0,
      offsetY: 0
    });
  };
  return DiagramFloatingPanel;
}(_uiDiagram.default);
var _default = exports.default = DiagramFloatingPanel;
module.exports = exports.default;
module.exports.default = exports.default;