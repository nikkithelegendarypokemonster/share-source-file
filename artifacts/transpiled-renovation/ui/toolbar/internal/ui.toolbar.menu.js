"use strict";

exports.default = void 0;
var _size = require("../../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _extend = require("../../../core/utils/extend");
var _ui = _interopRequireDefault(require("../../widget/ui.widget"));
var _button = _interopRequireDefault(require("../../button"));
var _uiToolbarMenu = _interopRequireDefault(require("./ui.toolbar.menu.list"));
var _themes = require("../../themes");
var _child_default_template = require("../../../core/templates/child_default_template");
var _uiToolbar = require("../ui.toolbar.utils");
var _window = require("../../../core/utils/window");
require("../../popup");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
const DROP_DOWN_MENU_POPUP_CLASS = 'dx-dropdownmenu-popup';
const DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = 'dx-dropdownmenu-popup-wrapper';
const DROP_DOWN_MENU_LIST_CLASS = 'dx-dropdownmenu-list';
const DROP_DOWN_MENU_BUTTON_CLASS = 'dx-dropdownmenu-button';
const POPUP_BOUNDARY_VERTICAL_OFFSET = 10;
const POPUP_VERTICAL_OFFSET = 3;
let DropDownMenu = exports.default = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(DropDownMenu, _Widget);
  function DropDownMenu() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = DropDownMenu.prototype;
  _proto._supportedKeys = function _supportedKeys() {
    let extension = {};
    if (!this.option('opened') || !this._list.option('focusedElement')) {
      extension = this._button._supportedKeys();
    }
    return (0, _extend.extend)(_Widget.prototype._supportedKeys.call(this), extension, {
      tab: function () {
        this._popup && this._popup.hide();
      }
    });
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      items: [],
      onItemClick: null,
      dataSource: null,
      itemTemplate: 'item',
      onButtonClick: null,
      activeStateEnabled: true,
      hoverStateEnabled: true,
      opened: false,
      onItemRendered: null,
      closeOnClick: true,
      useInkRipple: false,
      container: undefined,
      animation: {
        show: {
          type: 'fade',
          from: 0,
          to: 1
        },
        hide: {
          type: 'fade',
          to: 0
        }
      }
    });
  };
  _proto._defaultOptionsRules = function _defaultOptionsRules() {
    return _Widget.prototype._defaultOptionsRules.call(this).concat([{
      device: function () {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device: function () {
        return (0, _themes.isMaterialBased)();
      },
      options: {
        useInkRipple: true,
        animation: {
          show: {
            type: 'pop',
            duration: 200,
            from: {
              scale: 0
            },
            to: {
              scale: 1
            }
          },
          hide: {
            type: 'pop',
            duration: 200,
            from: {
              scale: 1
            },
            to: {
              scale: 0
            }
          }
        }
      }
    }]);
  };
  _proto._init = function _init() {
    _Widget.prototype._init.call(this);
    this.$element().addClass(DROP_DOWN_MENU_CLASS);
    this._initItemClickAction();
    this._initButtonClickAction();
  };
  _proto._initItemClickAction = function _initItemClickAction() {
    this._itemClickAction = this._createActionByOption('onItemClick');
  };
  _proto._initButtonClickAction = function _initButtonClickAction() {
    this._buttonClickAction = this._createActionByOption('onButtonClick');
  };
  _proto._initTemplates = function _initTemplates() {
    this._templateManager.addDefaultTemplates({
      content: new _child_default_template.ChildDefaultTemplate('content')
    });
    _Widget.prototype._initTemplates.call(this);
  };
  _proto._initMarkup = function _initMarkup() {
    this._renderButton();
    _Widget.prototype._initMarkup.call(this);
  };
  _proto._render = function _render() {
    _Widget.prototype._render.call(this);
    this.setAria({
      'haspopup': true,
      'expanded': this.option('opened')
    });
  };
  _proto._renderContentImpl = function _renderContentImpl() {
    if (this.option('opened')) {
      this._renderPopup();
    }
  };
  _proto._clean = function _clean() {
    this._cleanFocusState();
    this._list && this._list.$element().remove();
    this._popup && this._popup.$element().remove();
    delete this._list;
    delete this._popup;
  };
  _proto._renderButton = function _renderButton() {
    const $button = this.$element().addClass(DROP_DOWN_MENU_BUTTON_CLASS);
    this._button = this._createComponent($button, _button.default, {
      icon: 'overflow',
      template: 'content',
      stylingMode: (0, _themes.isFluent)() ? 'text' : 'contained',
      useInkRipple: this.option('useInkRipple'),
      hoverStateEnabled: false,
      focusStateEnabled: false,
      onClick: e => {
        this.option('opened', !this.option('opened'));
        this._buttonClickAction(e);
      }
    });
  };
  _proto._toggleActiveState = function _toggleActiveState($element, value, e) {
    this._button._toggleActiveState($element, value, e);
  };
  _proto._toggleMenuVisibility = function _toggleMenuVisibility(opened) {
    const state = opened !== null && opened !== void 0 ? opened : !this._popup.option('visible');
    if (opened) {
      this._renderPopup();
    }
    this._popup.toggle(state);
    this.setAria('expanded', state);
  };
  _proto._renderPopup = function _renderPopup() {
    if (this._$popup) {
      return;
    }
    this._$popup = (0, _renderer.default)('<div>').appendTo(this.$element());
    const {
      rtlEnabled,
      container,
      animation
    } = this.option();
    this._popup = this._createComponent(this._$popup, 'dxPopup', {
      onInitialized(_ref) {
        let {
          component
        } = _ref;
        component.$wrapper().addClass(DROP_DOWN_MENU_POPUP_WRAPPER_CLASS).addClass(DROP_DOWN_MENU_POPUP_CLASS);
      },
      deferRendering: false,
      contentTemplate: contentElement => this._renderList(contentElement),
      _ignoreFunctionValueDeprecation: true,
      maxHeight: () => this._getMaxHeight(),
      position: {
        my: "top ".concat(rtlEnabled ? 'left' : 'right'),
        at: "bottom ".concat(rtlEnabled ? 'left' : 'right'),
        collision: 'fit flip',
        offset: {
          v: POPUP_VERTICAL_OFFSET
        },
        of: this.$element()
      },
      animation,
      onOptionChanged: _ref2 => {
        let {
          name,
          value
        } = _ref2;
        if (name === 'visible') {
          this.option('opened', value);
        }
      },
      container,
      autoResizeEnabled: false,
      height: 'auto',
      width: 'auto',
      hideOnOutsideClick: e => this._closeOutsideDropDownHandler(e),
      hideOnParentScroll: true,
      shading: false,
      dragEnabled: false,
      showTitle: false,
      fullScreen: false,
      _fixWrapperPosition: true
    });
  };
  _proto._getMaxHeight = function _getMaxHeight() {
    const $element = this.$element();
    const offsetTop = $element.offset().top;
    const windowHeight = (0, _size.getOuterHeight)((0, _window.getWindow)());
    const maxHeight = Math.max(offsetTop, windowHeight - offsetTop - (0, _size.getOuterHeight)($element));
    return Math.min(windowHeight, maxHeight - POPUP_VERTICAL_OFFSET - POPUP_BOUNDARY_VERTICAL_OFFSET);
  };
  _proto._closeOutsideDropDownHandler = function _closeOutsideDropDownHandler(e) {
    const isOutsideClick = !(0, _renderer.default)(e.target).closest(this.$element()).length;
    return isOutsideClick;
  };
  _proto._renderList = function _renderList(contentElement) {
    const $content = (0, _renderer.default)(contentElement);
    $content.addClass(DROP_DOWN_MENU_LIST_CLASS);
    this._list = this._createComponent($content, _uiToolbarMenu.default, {
      dataSource: this._getListDataSource(),
      pageLoadMode: 'scrollBottom',
      indicateLoading: false,
      noDataText: '',
      itemTemplate: this.option('itemTemplate'),
      onItemClick: e => {
        if (this.option('closeOnClick')) {
          this.option('opened', false);
        }
        this._itemClickAction(e);
      },
      tabIndex: -1,
      focusStateEnabled: false,
      activeStateEnabled: true,
      onItemRendered: this.option('onItemRendered'),
      _itemAttributes: {
        role: 'menuitem'
      }
    });
  };
  _proto._itemOptionChanged = function _itemOptionChanged(item, property, value) {
    var _this$_list;
    (_this$_list = this._list) === null || _this$_list === void 0 ? void 0 : _this$_list._itemOptionChanged(item, property, value);
    (0, _uiToolbar.toggleItemFocusableElementTabIndex)(this._list, item);
  };
  _proto._getListDataSource = function _getListDataSource() {
    var _this$option;
    return (_this$option = this.option('dataSource')) !== null && _this$option !== void 0 ? _this$option : this.option('items');
  };
  _proto._setListDataSource = function _setListDataSource() {
    var _this$_list2;
    (_this$_list2 = this._list) === null || _this$_list2 === void 0 ? void 0 : _this$_list2.option('dataSource', this._getListDataSource());
    delete this._deferRendering;
  };
  _proto._getKeyboardListeners = function _getKeyboardListeners() {
    return _Widget.prototype._getKeyboardListeners.call(this).concat([this._list]);
  };
  _proto._toggleVisibility = function _toggleVisibility(visible) {
    _Widget.prototype._toggleVisibility.call(this, visible);
    this._button.option('visible', visible);
  };
  _proto._optionChanged = function _optionChanged(args) {
    var _this$_list3, _this$_list4, _this$_list5;
    const {
      name,
      value
    } = args;
    switch (name) {
      case 'items':
      case 'dataSource':
        if (!this.option('opened')) {
          this._deferRendering = true;
        } else {
          this._setListDataSource();
        }
        break;
      case 'itemTemplate':
        (_this$_list3 = this._list) === null || _this$_list3 === void 0 ? void 0 : _this$_list3.option(name, this._getTemplate(value));
        break;
      case 'onItemClick':
        this._initItemClickAction();
        break;
      case 'onButtonClick':
        this._buttonClickAction();
        break;
      case 'useInkRipple':
        this._invalidate();
        break;
      case 'focusStateEnabled':
        (_this$_list4 = this._list) === null || _this$_list4 === void 0 ? void 0 : _this$_list4.option(name, value);
        _Widget.prototype._optionChanged.call(this, args);
        break;
      case 'onItemRendered':
        (_this$_list5 = this._list) === null || _this$_list5 === void 0 ? void 0 : _this$_list5.option(name, value);
        break;
      case 'opened':
        if (this._deferRendering) {
          this._setListDataSource();
        }
        this._toggleMenuVisibility(value);
        this._updateFocusableItemsTabIndex();
        break;
      case 'closeOnClick':
        break;
      case 'container':
        this._popup && this._popup.option(name, value);
        break;
      case 'disabled':
        if (this._list) {
          this._updateFocusableItemsTabIndex();
        }
        break;
      default:
        _Widget.prototype._optionChanged.call(this, args);
    }
  };
  _proto._updateFocusableItemsTabIndex = function _updateFocusableItemsTabIndex() {
    this.option('items').forEach(item => (0, _uiToolbar.toggleItemFocusableElementTabIndex)(this._list, item));
  };
  return DropDownMenu;
}(_ui.default);
module.exports = exports.default;
module.exports.default = exports.default;