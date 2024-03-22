"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _message = _interopRequireDefault(require("../../localization/message"));
var _uiFile_manager = require("./ui.file_manager.common");
var _uiFile_manager2 = _interopRequireDefault(require("./ui.file_manager.dialog"));
var _uiFile_manager3 = _interopRequireDefault(require("./ui.file_manager.files_tree_view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const FILE_MANAGER_DIALOG_FOLDER_CHOOSER = 'dx-filemanager-dialog-folder-chooser';
const FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP = 'dx-filemanager-dialog-folder-chooser-popup';
let FileManagerFolderChooserDialog = /*#__PURE__*/function (_FileManagerDialogBas) {
  _inheritsLoose(FileManagerFolderChooserDialog, _FileManagerDialogBas);
  function FileManagerFolderChooserDialog() {
    return _FileManagerDialogBas.apply(this, arguments) || this;
  }
  var _proto = FileManagerFolderChooserDialog.prototype;
  _proto.show = function show() {
    var _this$_filesTreeView;
    this._setSelectedDirInfo(null);
    (_this$_filesTreeView = this._filesTreeView) === null || _this$_filesTreeView === void 0 ? void 0 : _this$_filesTreeView.refresh();
    _FileManagerDialogBas.prototype.show.call(this);
  };
  _proto.switchToCopyDialog = function switchToCopyDialog(targetItemInfos) {
    this._targetItemInfos = targetItemInfos;
    this._setTitle(_message.default.format('dxFileManager-dialogDirectoryChooserCopyTitle'));
    this._setApplyButtonOptions({
      text: _message.default.format('dxFileManager-dialogDirectoryChooserCopyButtonText'),
      disabled: true
    });
  };
  _proto.switchToMoveDialog = function switchToMoveDialog(targetItemInfos) {
    this._targetItemInfos = targetItemInfos;
    this._setTitle(_message.default.format('dxFileManager-dialogDirectoryChooserMoveTitle'));
    this._setApplyButtonOptions({
      text: _message.default.format('dxFileManager-dialogDirectoryChooserMoveButtonText'),
      disabled: true
    });
  };
  _proto._getDialogOptions = function _getDialogOptions() {
    return (0, _extend.extend)(_FileManagerDialogBas.prototype._getDialogOptions.call(this), {
      contentCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER,
      popupCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP
    });
  };
  _proto._createContentTemplate = function _createContentTemplate(element) {
    _FileManagerDialogBas.prototype._createContentTemplate.call(this, element);
    this._filesTreeView = this._createComponent((0, _renderer.default)('<div>'), _uiFile_manager3.default, {
      getDirectories: this.option('getDirectories'),
      getCurrentDirectory: () => this._getDialogSelectedDirectory(),
      onDirectoryClick: e => this._onFilesTreeViewDirectoryClick(e),
      onFilesTreeViewContentReady: () => this._toggleUnavailableLocationsDisabled(true)
    });
    this._$contentElement.append(this._filesTreeView.$element());
  };
  _proto._getDialogResult = function _getDialogResult() {
    const result = this._getDialogSelectedDirectory();
    return result ? {
      folder: result
    } : result;
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_FileManagerDialogBas.prototype._getDefaultOptions.call(this), {
      getItems: null
    });
  };
  _proto._getDialogSelectedDirectory = function _getDialogSelectedDirectory() {
    return this._selectedDirectoryInfo;
  };
  _proto._onFilesTreeViewDirectoryClick = function _onFilesTreeViewDirectoryClick(_ref) {
    let {
      itemData
    } = _ref;
    this._setSelectedDirInfo(itemData);
    this._filesTreeView.updateCurrentDirectory();
  };
  _proto._setSelectedDirInfo = function _setSelectedDirInfo(dirInfo) {
    this._selectedDirectoryInfo = dirInfo;
    this._setApplyButtonOptions({
      disabled: !dirInfo
    });
  };
  _proto._onPopupShown = function _onPopupShown() {
    this._toggleUnavailableLocationsDisabled(true);
    _FileManagerDialogBas.prototype._onPopupShown.call(this);
  };
  _proto._onPopupHiding = function _onPopupHiding() {
    this._toggleUnavailableLocationsDisabled(false);
    _FileManagerDialogBas.prototype._onPopupHiding.call(this);
  };
  _proto._toggleUnavailableLocationsDisabled = function _toggleUnavailableLocationsDisabled(isDisabled) {
    if (!this._filesTreeView) {
      return;
    }
    const locations = this._getLocationsToProcess(isDisabled);
    this._filesTreeView.toggleDirectoryExpandedStateRecursive(locations.locationsToExpand[0], isDisabled).then(() => this._filesTreeView.toggleDirectoryLineExpandedState(locations.locationsToCollapse, !isDisabled).then(() => locations.locationKeysToDisable.forEach(key => this._filesTreeView.toggleNodeDisabledState(key, isDisabled))));
  };
  _proto._getLocationsToProcess = function _getLocationsToProcess(isDisabled) {
    const expandLocations = {};
    const collapseLocations = {};
    this._targetItemInfos.forEach(itemInfo => {
      if (itemInfo.parentDirectory) {
        expandLocations[itemInfo.parentDirectory.getInternalKey()] = itemInfo.parentDirectory;
      }
      if (itemInfo.fileItem.isDirectory) {
        collapseLocations[itemInfo.getInternalKey()] = itemInfo;
      }
    });
    const expandMap = (0, _uiFile_manager.getMapFromObject)(expandLocations);
    const collapseMap = (0, _uiFile_manager.getMapFromObject)(collapseLocations);
    return {
      locationsToExpand: isDisabled ? expandMap.values : [],
      locationsToCollapse: isDisabled ? collapseMap.values : [],
      locationKeysToDisable: expandMap.keys.concat(...collapseMap.keys)
    };
  };
  return FileManagerFolderChooserDialog;
}(_uiFile_manager2.default);
var _default = exports.default = FileManagerFolderChooserDialog;
module.exports = exports.default;
module.exports.default = exports.default;