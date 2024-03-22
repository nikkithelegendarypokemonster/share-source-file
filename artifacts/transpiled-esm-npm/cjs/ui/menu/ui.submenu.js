"use strict";

exports.default = void 0;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _common = require("../../core/utils/common");
var _element = require("../../core/element");
var _position = _interopRequireDefault(require("../../animation/position"));
var _extend = require("../../core/utils/extend");
var _context_menu = _interopRequireDefault(require("../context_menu"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS = 'dx-context-menu-content-delimiter';
const DX_SUBMENU_CLASS = 'dx-submenu';
let Submenu = /*#__PURE__*/function (_ContextMenu) {
  _inheritsLoose(Submenu, _ContextMenu);
  function Submenu() {
    return _ContextMenu.apply(this, arguments) || this;
  }
  var _proto = Submenu.prototype;
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_ContextMenu.prototype._getDefaultOptions.call(this), {
      orientation: 'horizontal',
      tabIndex: null,
      onHoverStart: _common.noop
    });
  };
  _proto._initDataAdapter = function _initDataAdapter() {
    this._dataAdapter = this.option('_dataAdapter');
    if (!this._dataAdapter) {
      _ContextMenu.prototype._initDataAdapter.call(this);
    }
  };
  _proto._renderContentImpl = function _renderContentImpl() {
    this._renderContextMenuOverlay();
    _ContextMenu.prototype._renderContentImpl.call(this);
    const node = this._dataAdapter.getNodeByKey(this.option('_parentKey'));
    node && this._renderItems(this._getChildNodes(node));
    this._renderDelimiter();
  };
  _proto._renderDelimiter = function _renderDelimiter() {
    this.$contentDelimiter = (0, _renderer.default)('<div>').appendTo(this._itemContainer()).addClass(DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS);
  };
  _proto._getOverlayOptions = function _getOverlayOptions() {
    return (0, _extend.extend)(true, _ContextMenu.prototype._getOverlayOptions.call(this), {
      onPositioned: this._overlayPositionedActionHandler.bind(this),
      position: {
        precise: true
      }
    });
  };
  _proto._overlayPositionedActionHandler = function _overlayPositionedActionHandler(arg) {
    this._showDelimiter(arg);
  };
  _proto._hoverEndHandler = function _hoverEndHandler(e) {
    _ContextMenu.prototype._hoverEndHandler.call(this, e);
    this._toggleFocusClass(false, e.currentTarget);
  };
  _proto._isMenuHorizontal = function _isMenuHorizontal() {
    return this.option('orientation') === 'horizontal';
  };
  _proto._hoverStartHandler = function _hoverStartHandler(e) {
    const hoverStartAction = this.option('onHoverStart');
    hoverStartAction(e);
    _ContextMenu.prototype._hoverStartHandler.call(this, e);
    this._toggleFocusClass(true, e.currentTarget);
  };
  _proto._drawSubmenu = function _drawSubmenu($rootItem) {
    this._actions.onShowing({
      rootItem: (0, _element.getPublicElement)($rootItem),
      submenu: this
    });
    _ContextMenu.prototype._drawSubmenu.call(this, $rootItem);
    this._actions.onShown({
      rootItem: (0, _element.getPublicElement)($rootItem),
      submenu: this
    });
  };
  _proto._hideSubmenu = function _hideSubmenu($rootItem) {
    this._actions.onHiding({
      cancel: true,
      rootItem: (0, _element.getPublicElement)($rootItem),
      submenu: this
    });
    _ContextMenu.prototype._hideSubmenu.call(this, $rootItem);
    this._actions.onHidden({
      rootItem: (0, _element.getPublicElement)($rootItem),
      submenu: this
    });
  }

  // TODO: try to simplify it
  ;
  _proto._showDelimiter = function _showDelimiter(arg) {
    if (!this.$contentDelimiter) {
      return;
    }
    const $submenu = this._itemContainer().children(".".concat(DX_SUBMENU_CLASS)).eq(0);
    const $rootItem = this.option('position').of.find('.dx-context-menu-container-border');
    const position = {
      of: $submenu,
      precise: true
    };
    const containerOffset = arg.position;
    const vLocation = containerOffset.v.location;
    const hLocation = containerOffset.h.location;
    const rootOffset = $rootItem.offset();
    const offsetLeft = Math.round(rootOffset.left);
    const offsetTop = Math.round(rootOffset.top);
    const rootWidth = (0, _size.getWidth)($rootItem);
    const rootHeight = (0, _size.getHeight)($rootItem);
    const submenuWidth = (0, _size.getWidth)($submenu);
    const submenuHeight = (0, _size.getHeight)($submenu);
    this.$contentDelimiter.css('display', 'block');
    (0, _size.setWidth)(this.$contentDelimiter, this._isMenuHorizontal() ? rootWidth < submenuWidth ? rootWidth : submenuWidth : 3);
    (0, _size.setHeight)(this.$contentDelimiter, this._isMenuHorizontal() ? 3 : rootHeight < submenuHeight ? rootHeight : submenuHeight);
    if (this._isMenuHorizontal()) {
      if (vLocation > offsetTop) {
        if (Math.round(hLocation) === offsetLeft) {
          position.offset = '0 -2.5';
          position.at = position.my = 'left top';
        } else {
          position.offset = '0 -2.5';
          position.at = position.my = 'right top';
        }
      } else {
        (0, _size.setHeight)(this.$contentDelimiter, 5);
        if (Math.round(hLocation) === offsetLeft) {
          position.offset = '0 5';
          position.at = position.my = 'left bottom';
        } else {
          position.offset = '0 5';
          position.at = position.my = 'right bottom';
        }
      }
    } else {
      if (hLocation > offsetLeft) {
        if (Math.round(vLocation) === offsetTop) {
          position.offset = '-2.5 0';
          position.at = position.my = 'left top';
        } else {
          position.offset = '-2.5 0';
          position.at = position.my = 'left bottom';
        }
      } else {
        if (Math.round(vLocation) === offsetTop) {
          position.offset = '2.5 0';
          position.at = position.my = 'right top';
        } else {
          position.offset = '2.5 0';
          position.at = position.my = 'right bottom';
        }
      }
    }
    _position.default.setup(this.$contentDelimiter, position);
  };
  _proto._getContextMenuPosition = function _getContextMenuPosition() {
    return this.option('position');
  };
  _proto.isOverlayVisible = function isOverlayVisible() {
    return this._overlay.option('visible');
  };
  _proto.getOverlayContent = function getOverlayContent() {
    return this._overlay.$content();
  };
  return Submenu;
}(_context_menu.default);
var _default = exports.default = Submenu;
module.exports = exports.default;
module.exports.default = exports.default;