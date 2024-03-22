"use strict";

exports.default = void 0;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _deferred = require("../../core/utils/deferred");
var _window = require("../../core/utils/window");
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _ui2 = _interopRequireDefault(require("../popup/ui.popup"));
var _ui3 = _interopRequireDefault(require("../drawer/ui.drawer"));
var _uiFile_manager = require("./ui.file_manager.notification_manager");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const window = (0, _window.getWindow)();
const ADAPTIVE_STATE_SCREEN_WIDTH = 1000;
const FILE_MANAGER_NOTIFICATION_CLASS = 'dx-filemanager-notification';
const FILE_MANAGER_NOTIFICATION_DRAWER_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-drawer");
const FILE_MANAGER_NOTIFICATION_DRAWER_PANEL_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_DRAWER_CLASS, "-panel");
const FILE_MANAGER_NOTIFICATION_POPUP_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-popup");
const FILE_MANAGER_NOTIFICATION_POPUP_ERROR_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-popup-error");
const FILE_MANAGER_NOTIFICATION_COMMON_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-common");
const FILE_MANAGER_NOTIFICATION_SEPARATOR_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-separator");
const FILE_MANAGER_NOTIFICATION_DETAILS_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-details");
const FILE_MANAGER_NOTIFICATION_COMMON_NO_ITEM_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-common-no-item");
let FileManagerNotificationControl = exports.default = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(FileManagerNotificationControl, _Widget);
  function FileManagerNotificationControl() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = FileManagerNotificationControl.prototype;
  _proto._initMarkup = function _initMarkup() {
    _Widget.prototype._initMarkup.call(this);
    this._initActions();
    this._isInAdaptiveState = this._isSmallScreen();
    this._managerMap = {};
    this._notificationManagerStubId = null;
    this._setNotificationManager();
    const $progressPanelContainer = this.option('progressPanelContainer');
    const $progressDrawer = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_NOTIFICATION_DRAWER_CLASS).appendTo($progressPanelContainer);
    (0, _renderer.default)('<div>').addClass(FILE_MANAGER_NOTIFICATION_DRAWER_PANEL_CLASS).appendTo($progressDrawer);
    const drawerOptions = (0, _extend.extend)({
      opened: false,
      position: 'right',
      template: container => this._ensureProgressPanelCreated(container)
    }, this._getProgressDrawerAdaptiveOptions());
    this._progressDrawer = this._createComponent($progressDrawer, _ui3.default, drawerOptions);
    const $drawerContent = $progressDrawer.find(".".concat(FILE_MANAGER_NOTIFICATION_DRAWER_PANEL_CLASS)).first();
    const contentRenderer = this.option('contentTemplate');
    if ((0, _type.isFunction)(contentRenderer)) {
      contentRenderer($drawerContent, this);
    }
  };
  _proto._setNotificationManager = function _setNotificationManager(options) {
    options = (0, _extend.extend)({
      onActionProgressStatusChanged: this._raiseActionProgress.bind(this)
    }, options);
    if (!this._notificationManagerStubId) {
      const stubManager = new _uiFile_manager.NotificationManagerStub(options);
      this._notificationManagerStubId = stubManager.getId();
      this._managerMap[this._notificationManagerStubId] = stubManager;
    }
    if (!this._isProgressDrawerDisabled()) {
      const notificationManagerComponent = this._getProgressManagerComponent();
      options.isActual = true;
      const defaultManager = new notificationManagerComponent(options);
      this._managerMap[defaultManager.getId()] = defaultManager;
    }
  };
  _proto._getNotificationManager = function _getNotificationManager(operationInfo) {
    const actualManagerId = (operationInfo === null || operationInfo === void 0 ? void 0 : operationInfo[_uiFile_manager.MANAGER_ID_NAME]) || this._getActualNotificationManagerId();
    return this._managerMap[actualManagerId] || this._managerMap[this._notificationManagerStubId];
  };
  _proto._clearManagerMap = function _clearManagerMap() {
    const stubManager = this._managerMap[this._notificationManagerStubId];
    delete this._managerMap;
    this._managerMap = {
      [this._notificationManagerStubId]: stubManager
    };
  };
  _proto._getActualNotificationManagerId = function _getActualNotificationManagerId() {
    return Object.keys(this._managerMap).filter(managerId => this._managerMap[managerId].isActual())[0];
  };
  _proto.tryShowProgressPanel = function tryShowProgressPanel() {
    const promise = new _deferred.Deferred();
    const notificationManager = this._getNotificationManager();
    if (notificationManager.isActionProgressStatusDefault() || this._isProgressDrawerOpened() || this._isProgressDrawerDisabled()) {
      return promise.resolve().promise();
    }
    setTimeout(() => {
      this._progressDrawer.show().done(promise.resolve);
      this._hidePopup();
      notificationManager.tryHideActionProgress();
    });
    return promise.promise();
  };
  _proto.addOperation = function addOperation(processingMessage, allowCancel, allowProgressAutoUpdate) {
    const notificationManager = this._getNotificationManager();
    return notificationManager.addOperation(processingMessage, allowCancel, allowProgressAutoUpdate);
  };
  _proto.addOperationDetails = function addOperationDetails(operationInfo, details, showCloseButton) {
    const notificationManager = this._getNotificationManager(operationInfo);
    notificationManager.addOperationDetails(operationInfo, details, showCloseButton);
  };
  _proto.updateOperationItemProgress = function updateOperationItemProgress(operationInfo, itemIndex, itemProgress, commonProgress) {
    const notificationManager = this._getNotificationManager(operationInfo);
    notificationManager.updateOperationItemProgress(operationInfo, itemIndex, itemProgress, commonProgress);
  };
  _proto.completeOperationItem = function completeOperationItem(operationInfo, itemIndex, commonProgress) {
    const notificationManager = this._getNotificationManager(operationInfo);
    notificationManager.completeOperationItem(operationInfo, itemIndex, commonProgress);
  };
  _proto.finishOperation = function finishOperation(operationInfo, commonProgress) {
    const notificationManager = this._getNotificationManager(operationInfo);
    notificationManager.finishOperation(operationInfo, commonProgress);
  };
  _proto.completeOperation = function completeOperation(operationInfo, commonText, isError, statusText) {
    const notificationManager = this._getNotificationManager(operationInfo);
    if (!isError) {
      this._showPopup(commonText);
    }
    notificationManager.completeOperation(operationInfo, commonText, isError, statusText);
    if (!this._isProgressDrawerOpened() || !notificationManager.hasNoOperations()) {
      notificationManager.updateActionProgressStatus(operationInfo);
    } else {
      notificationManager.tryHideActionProgress();
    }
  };
  _proto.completeSingleOperationWithError = function completeSingleOperationWithError(operationInfo, errorInfo) {
    const notificationManager = this._getNotificationManager(operationInfo);
    notificationManager.completeSingleOperationWithError(operationInfo, errorInfo);
    this._showPopupError(errorInfo);
  };
  _proto.addOperationDetailsError = function addOperationDetailsError(operationInfo, errorInfo) {
    const notificationManager = this._getNotificationManager(operationInfo);
    notificationManager.addOperationDetailsError(operationInfo, errorInfo);
    this._showPopupError(errorInfo);
  };
  _proto._hideProgressPanel = function _hideProgressPanel() {
    setTimeout(() => this._progressDrawer.hide());
  };
  _proto._isSmallScreen = function _isSmallScreen() {
    if (!(0, _window.hasWindow)()) {
      return false;
    }
    return (0, _size.getWidth)(window) <= ADAPTIVE_STATE_SCREEN_WIDTH;
  };
  _proto._dimensionChanged = function _dimensionChanged(dimension) {
    if (!(dimension && dimension === 'height')) {
      this._checkAdaptiveState();
    }
  };
  _proto._checkAdaptiveState = function _checkAdaptiveState() {
    const oldState = this._isInAdaptiveState;
    this._isInAdaptiveState = this._isSmallScreen();
    if (oldState !== this._isInAdaptiveState && this._progressDrawer) {
      const notificationManager = this._getNotificationManager();
      if (notificationManager.handleDimensionChanged()) {
        const options = this._getProgressDrawerAdaptiveOptions();
        this._progressDrawer.option(options);
      }
    }
  };
  _proto._getProgressDrawerAdaptiveOptions = function _getProgressDrawerAdaptiveOptions() {
    if (this._isInAdaptiveState) {
      return {
        openedStateMode: 'overlap',
        shading: true,
        hideOnOutsideClick: true
      };
    } else {
      return {
        openedStateMode: 'shrink',
        shading: false,
        hideOnOutsideClick: false
      };
    }
  };
  _proto._ensureProgressPanelCreated = function _ensureProgressPanelCreated(container) {
    const notificationManager = this._getNotificationManager();
    notificationManager.ensureProgressPanelCreated(container, {
      onOperationCanceled: _ref => {
        let {
          info
        } = _ref;
        return this._raiseOperationCanceled(info);
      },
      onOperationItemCanceled: _ref2 => {
        let {
          item,
          itemIndex
        } = _ref2;
        return this._raiseOperationItemCanceled(item, itemIndex);
      },
      onPanelClosed: () => this._hideProgressPanel()
    });
  }

  // needed for editingProgress.tests.js
  ;
  _proto._getProgressManagerComponent = function _getProgressManagerComponent() {
    return _uiFile_manager.NotificationManager;
  };
  _proto._isProgressDrawerDisabled = function _isProgressDrawerDisabled() {
    return !this.option('showProgressPanel');
  };
  _proto._isProgressDrawerOpened = function _isProgressDrawerOpened() {
    return this._progressDrawer.option('opened');
  };
  _proto._hidePopup = function _hidePopup(forceHide) {
    if (!this.option('showNotificationPopup') && !forceHide) {
      return;
    }
    this._getNotificationPopup().hide();
  };
  _proto._showPopup = function _showPopup(content, errorMode) {
    if (this._isProgressDrawerOpened() || !this.option('showNotificationPopup')) {
      return;
    }
    this._getNotificationPopup().$wrapper().toggleClass(FILE_MANAGER_NOTIFICATION_POPUP_ERROR_CLASS, !!errorMode);
    this._getNotificationPopup().option('contentTemplate', content);
    if (!this._getNotificationPopup().option('visible')) {
      this._getNotificationPopup().show();
    }
  };
  _proto._showPopupError = function _showPopupError(errorInfo) {
    if (!this.option('showNotificationPopup')) {
      return;
    }
    const notificationManager = this._getNotificationManager();
    const $content = (0, _renderer.default)('<div>');
    const $message = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_NOTIFICATION_COMMON_CLASS).text(errorInfo.commonErrorText);
    const $separator = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_NOTIFICATION_SEPARATOR_CLASS);
    (0, _renderer.default)('<div>').appendTo($separator);
    const $details = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_NOTIFICATION_DETAILS_CLASS);
    if (errorInfo.item) {
      notificationManager.createErrorDetailsProgressBox($details, errorInfo.item, errorInfo.detailErrorText);
    } else {
      $message.addClass(FILE_MANAGER_NOTIFICATION_COMMON_NO_ITEM_CLASS);
      notificationManager.renderError($details, errorInfo.detailErrorText);
    }
    $content.append($message, $separator, $details);
    this._showPopup($content, true);
  };
  _proto._getNotificationPopup = function _getNotificationPopup() {
    if (!this._notificationPopup) {
      const $popup = (0, _renderer.default)('<div>').appendTo(this.$element());
      this._notificationPopup = this._createComponent($popup, _ui2.default, {
        container: this.$element(),
        width: 'auto',
        height: 'auto',
        showTitle: false,
        dragEnabled: false,
        shading: false,
        visible: false,
        hideOnOutsideClick: true,
        animation: {
          duration: 0
        },
        position: {
          my: 'right top',
          at: 'right top',
          of: this.option('positionTarget'),
          offset: '-10 -5'
        },
        _wrapperClassExternal: FILE_MANAGER_NOTIFICATION_POPUP_CLASS
      });
    }
    return this._notificationPopup;
  };
  _proto._raiseActionProgress = function _raiseActionProgress(message, status) {
    this._actions.onActionProgress({
      message,
      status
    });
  };
  _proto._raiseOperationCanceled = function _raiseOperationCanceled(info) {
    this._actions.onOperationCanceled({
      info
    });
  };
  _proto._raiseOperationItemCanceled = function _raiseOperationItemCanceled(item, index) {
    this._actions.onOperationItemCanceled({
      item,
      itemIndex: index
    });
  };
  _proto._initActions = function _initActions() {
    this._actions = {
      onActionProgress: this._createActionByOption('onActionProgress'),
      onOperationCanceled: this._createActionByOption('onOperationCanceled'),
      onOperationItemCanceled: this._createActionByOption('onOperationItemCanceled')
    };
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      progressPanelContainer: null,
      contentTemplate: null,
      onActionProgress: null,
      onOperationCanceled: null,
      onOperationItemCanceled: null,
      showProgressPanel: true,
      showNotificationPopup: true
    });
  };
  _proto._optionChanged = function _optionChanged(args) {
    const name = args.name;
    switch (name) {
      case 'progressPanelContainer':
      case 'contentTemplate':
        break;
      case 'showProgressPanel':
        this._setNotificationManager();
        this._getNotificationManager().updateActionProgressStatus();
        if (!args.value) {
          this._hideProgressPanel();
          this._clearManagerMap();
        }
        this._progressDrawer.repaint();
        break;
      case 'showNotificationPopup':
        if (!args.value) {
          this._hidePopup(true);
        }
        break;
      case 'onActionProgress':
      case 'onOperationCanceled':
      case 'onOperationItemCanceled':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        _Widget.prototype._optionChanged.call(this, args);
    }
  };
  return FileManagerNotificationControl;
}(_ui.default);
module.exports = exports.default;
module.exports.default = exports.default;