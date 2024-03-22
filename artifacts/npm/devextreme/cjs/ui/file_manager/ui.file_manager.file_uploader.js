/**
* DevExtreme (cjs/ui/file_manager/ui.file_manager.file_uploader.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _deferred = require("../../core/utils/deferred");
var _window = require("../../core/utils/window");
var _guid = _interopRequireDefault(require("../../core/guid"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _file_uploader = _interopRequireDefault(require("../file_uploader"));
var _uiFile_manager = require("./ui.file_manager.common");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const FILE_MANAGER_FILE_UPLOADER_CLASS = 'dx-filemanager-fileuploader';
const FILE_MANAGER_FILE_UPLOADER_DROPZONE_PLACEHOLER_CLASS = 'dx-filemanager-fileuploader-dropzone-placeholder';
let FileManagerFileUploader = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(FileManagerFileUploader, _Widget);
  function FileManagerFileUploader() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = FileManagerFileUploader.prototype;
  _proto._initMarkup = function _initMarkup() {
    this._initActions();
    this.$element().addClass(FILE_MANAGER_FILE_UPLOADER_CLASS);
    this._uploaderInfos = [];
    this._createInternalFileUploader();
    this._createDropZonePlaceholder();
    this._setDropZonePlaceholderVisible(false);
    _Widget.prototype._initMarkup.call(this);
  };
  _proto._createInternalFileUploader = function _createInternalFileUploader() {
    const chunkSize = this._getController().chunkSize;
    const $fileUploader = (0, _renderer.default)('<div>').appendTo(this.$element());
    const fileUploader = this._createComponent($fileUploader, _file_uploader.default, {
      name: 'file',
      multiple: true,
      showFileList: false,
      activeStateEnabled: false,
      focusStateEnabled: false,
      hoverStateEnabled: false,
      labelText: '',
      readyToUploadMessage: '',
      accept: '*',
      chunkSize,
      dropZone: this.option('dropZone'),
      onValueChanged: e => this._onFileUploaderValueChanged(e),
      onProgress: e => this._onFileUploaderProgress(e),
      onUploaded: e => this._onFileUploaderUploaded(e),
      onFilesUploaded: e => this._onFileUploaderAllFilesUploaded(e),
      onUploadAborted: e => this._onFileUploaderUploadAborted(e),
      onUploadError: e => this._onFileUploaderUploadError(e),
      onDropZoneEnter: () => this._setDropZonePlaceholderVisible(true),
      onDropZoneLeave: () => this._setDropZonePlaceholderVisible(false)
    });
    fileUploader.option({
      uploadChunk: (file, chunksData) => this._fileUploaderUploadChunk(fileUploader, file, chunksData),
      abortUpload: (file, chunksData) => this._fileUploaderAbortUpload(fileUploader, file, chunksData)
    });
    fileUploader._shouldRaiseDragLeaveBase = fileUploader._shouldRaiseDragLeave;
    fileUploader._shouldRaiseDragLeave = e => this._shouldRaiseDragLeave(e, fileUploader);
    const uploaderInfo = {
      fileUploader
    };
    this._uploaderInfos.push(uploaderInfo);
  };
  _proto.tryUpload = function tryUpload() {
    const info = this._findAndUpdateAvailableUploaderInfo();
    if (info) {
      info.fileUploader._selectButtonClickHandler();
    }
  };
  _proto.cancelUpload = function cancelUpload(sessionId) {
    this._cancelUpload(sessionId);
  };
  _proto.cancelFileUpload = function cancelFileUpload(sessionId, fileIndex) {
    this._cancelUpload(sessionId, fileIndex);
  };
  _proto._cancelUpload = function _cancelUpload(sessionId, fileIndex) {
    const {
      fileUploader
    } = this._findUploaderInfoBySessionId(sessionId);
    fileUploader.abortUpload(fileIndex);
  };
  _proto._fileUploaderUploadChunk = function _fileUploaderUploadChunk(fileUploader, file, chunksInfo) {
    const {
      session,
      fileIndex
    } = this._findSessionByFile(fileUploader, file);
    const controller = session.controller;
    chunksInfo.fileIndex = fileIndex;
    return controller.uploadFileChunk(file, chunksInfo);
  };
  _proto._fileUploaderAbortUpload = function _fileUploaderAbortUpload(fileUploader, file, chunksInfo) {
    const {
      session,
      fileIndex
    } = this._findSessionByFile(fileUploader, file);
    const controller = session.controller;
    chunksInfo.fileIndex = fileIndex;
    return controller.abortFileUpload(file, chunksInfo);
  };
  _proto._onFileUploaderValueChanged = function _onFileUploaderValueChanged(_ref) {
    let {
      component,
      value
    } = _ref;
    if (value.length === 0) {
      return;
    }
    const files = value.slice();
    const uploaderInfo = this._findUploaderInfo(component);
    this._uploadFiles(uploaderInfo, files);
    setTimeout(() => {
      if (!this._findAndUpdateAvailableUploaderInfo()) {
        this._createInternalFileUploader();
      }
    });
  };
  _proto._onFileUploaderProgress = function _onFileUploaderProgress(_ref2) {
    let {
      component,
      file,
      bytesLoaded,
      bytesTotal
    } = _ref2;
    const {
      session,
      fileIndex
    } = this._findSessionByFile(component, file);
    const fileValue = bytesTotal !== 0 ? bytesLoaded / bytesTotal : 1;
    const commonValue = component.option('progress') / 100;
    const args = {
      sessionId: session.id,
      fileIndex,
      commonValue,
      fileValue
    };
    this._raiseUploadProgress(args);
  };
  _proto._onFileUploaderAllFilesUploaded = function _onFileUploaderAllFilesUploaded(_ref3) {
    let {
      component
    } = _ref3;
    const {
      session
    } = this._findSessionByFile(component, component._files[0].value);
    this._raiseUploadFinished({
      sessionId: session.id,
      commonValue: component.option('progress') / 100
    });
  };
  _proto._onFileUploaderUploaded = function _onFileUploaderUploaded(_ref4) {
    let {
      component,
      file
    } = _ref4;
    const deferred = this._getDeferredForFile(component, file);
    deferred.resolve();
  };
  _proto._onFileUploaderUploadAborted = function _onFileUploaderUploadAborted(_ref5) {
    let {
      component,
      file
    } = _ref5;
    const deferred = this._getDeferredForFile(component, file);
    deferred.resolve({
      canceled: true
    });
  };
  _proto._onFileUploaderUploadError = function _onFileUploaderUploadError(_ref6) {
    let {
      component,
      file,
      error
    } = _ref6;
    const deferred = this._getDeferredForFile(component, file);
    deferred.reject(error);
  };
  _proto._createDropZonePlaceholder = function _createDropZonePlaceholder() {
    this._$dropZonePlaceholder = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_FILE_UPLOADER_DROPZONE_PLACEHOLER_CLASS).appendTo(this.option('dropZonePlaceholderContainer'));
  };
  _proto._adjustDropZonePlaceholder = function _adjustDropZonePlaceholder() {
    const $dropZoneTarget = this.option('dropZone');
    if (!(0, _window.hasWindow)() || $dropZoneTarget.length === 0) {
      return;
    }
    const placeholderBorderTopWidth = parseFloat(this._$dropZonePlaceholder.css('borderTopWidth'));
    const placeholderBorderLeftWidth = parseFloat(this._$dropZonePlaceholder.css('borderLeftWidth'));
    const $placeholderContainer = this.option('dropZonePlaceholderContainer');
    const containerBorderBottomWidth = parseFloat($placeholderContainer.css('borderBottomWidth'));
    const containerBorderLeftWidth = parseFloat($placeholderContainer.css('borderLeftWidth'));
    const containerHeight = (0, _size.getInnerHeight)($placeholderContainer);
    const containerOffset = $placeholderContainer.offset();
    const dropZoneOffset = $dropZoneTarget.offset();
    this._$dropZonePlaceholder.css({
      top: dropZoneOffset.top - containerOffset.top - containerHeight - containerBorderBottomWidth,
      left: dropZoneOffset.left - containerOffset.left - containerBorderLeftWidth
    });
    (0, _size.setHeight)(this._$dropZonePlaceholder, $dropZoneTarget.get(0).offsetHeight - placeholderBorderTopWidth * 2);
    (0, _size.setWidth)(this._$dropZonePlaceholder, $dropZoneTarget.get(0).offsetWidth - placeholderBorderLeftWidth * 2);
  };
  _proto._setDropZonePlaceholderVisible = function _setDropZonePlaceholderVisible(visible) {
    if (visible) {
      this._adjustDropZonePlaceholder();
      this._$dropZonePlaceholder.css('display', '');
    } else {
      this._$dropZonePlaceholder.css('display', 'none');
    }
  };
  _proto._shouldRaiseDragLeave = function _shouldRaiseDragLeave(e, uploaderInstance) {
    return uploaderInstance.isMouseOverElement(e, this.option('splitterElement')) || uploaderInstance._shouldRaiseDragLeaveBase(e, true);
  };
  _proto._uploadFiles = function _uploadFiles(uploaderInfo, files) {
    this._setDropZonePlaceholderVisible(false);
    const sessionId = new _guid.default().toString();
    const controller = this._getController();
    const deferreds = files.map(() => new _deferred.Deferred());
    const session = {
      id: sessionId,
      controller,
      files,
      deferreds
    };
    uploaderInfo.session = session;
    const sessionInfo = {
      sessionId,
      deferreds,
      files
    };
    this._raiseUploadSessionStarted(sessionInfo);
    return (0, _uiFile_manager.whenSome)(deferreds).always(() => setTimeout(() => {
      uploaderInfo.fileUploader.clear();
      uploaderInfo.session = null;
    }));
  };
  _proto._getDeferredForFile = function _getDeferredForFile(fileUploader, file) {
    const {
      session,
      fileIndex
    } = this._findSessionByFile(fileUploader, file);
    return session.deferreds[fileIndex];
  };
  _proto._findSessionByFile = function _findSessionByFile(fileUploader, file) {
    const uploaderInfo = this._findUploaderInfo(fileUploader);
    const session = uploaderInfo.session;
    const fileIndex = session.files.indexOf(file);
    return {
      session,
      fileIndex
    };
  };
  _proto._findUploaderInfoBySessionId = function _findUploaderInfoBySessionId(sessionId) {
    for (let i = 0; i < this._uploaderInfos.length; i++) {
      const uploaderInfo = this._uploaderInfos[i];
      const session = uploaderInfo.session;
      if (session && session.id === sessionId) {
        return uploaderInfo;
      }
    }
    return null;
  };
  _proto._findAndUpdateAvailableUploaderInfo = function _findAndUpdateAvailableUploaderInfo() {
    var _info;
    let info = null;
    for (let i = 0; i < this._uploaderInfos.length; i++) {
      const currentInfo = this._uploaderInfos[i];
      currentInfo.fileUploader.option('dropZone', '');
      if (!info && !currentInfo.session) {
        info = currentInfo;
      }
    }
    (_info = info) === null || _info === void 0 ? void 0 : _info.fileUploader.option('dropZone', this.option('dropZone'));
    return info;
  };
  _proto._findUploaderInfo = function _findUploaderInfo(fileUploader) {
    for (let i = 0; i < this._uploaderInfos.length; i++) {
      const info = this._uploaderInfos[i];
      if (info.fileUploader === fileUploader) {
        return info;
      }
    }
    return null;
  };
  _proto._getController = function _getController() {
    const controllerGetter = this.option('getController');
    return controllerGetter();
  };
  _proto._raiseUploadSessionStarted = function _raiseUploadSessionStarted(sessionInfo) {
    this._actions.onUploadSessionStarted({
      sessionInfo
    });
  };
  _proto._raiseUploadProgress = function _raiseUploadProgress(args) {
    this._actions.onUploadProgress(args);
  };
  _proto._raiseUploadFinished = function _raiseUploadFinished(args) {
    this._actions.onUploadFinished(args);
  };
  _proto._initActions = function _initActions() {
    this._actions = {
      onUploadSessionStarted: this._createActionByOption('onUploadSessionStarted'),
      onUploadProgress: this._createActionByOption('onUploadProgress'),
      onUploadFinished: this._createActionByOption('onUploadFinished')
    };
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      getController: null,
      onUploadSessionStarted: null,
      onUploadProgress: null,
      onUploadFinished: null,
      splitterElement: null
    });
  };
  _proto._optionChanged = function _optionChanged(args) {
    const name = args.name;
    switch (name) {
      case 'getController':
        this.repaint();
        break;
      case 'onUploadSessionStarted':
      case 'onUploadProgress':
      case 'onUploadFinished':
        this._actions[name] = this._createActionByOption(name);
        break;
      case 'dropZone':
        this._findAndUpdateAvailableUploaderInfo();
        this._adjustDropZonePlaceholder();
        break;
      case 'dropZonePlaceholderContainer':
        this._$dropZonePlaceholder.detach();
        this._$dropZonePlaceholder.appendTo(args.value);
        break;
      case 'splitterElement':
        break;
      default:
        _Widget.prototype._optionChanged.call(this, args);
    }
  };
  return FileManagerFileUploader;
}(_ui.default);
var _default = exports.default = FileManagerFileUploader;
module.exports = exports.default;
module.exports.default = exports.default;
