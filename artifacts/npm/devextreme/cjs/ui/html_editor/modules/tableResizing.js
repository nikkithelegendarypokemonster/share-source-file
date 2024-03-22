/**
* DevExtreme (cjs/ui/html_editor/modules/tableResizing.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _size = require("../../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _type = require("../../../core/utils/type");
var _index = require("../../../events/utils/index");
var _resize_callbacks = _interopRequireDefault(require("../../../core/utils/resize_callbacks"));
var _translator = require("../../../animation/translator");
var _position = require("../../../core/utils/position");
var _base = _interopRequireDefault(require("./base"));
var _draggable = _interopRequireDefault(require("../../draggable"));
var _iterator = require("../../../core/utils/iterator");
var _window = require("../../../core/utils/window");
var _extend = require("../../../core/utils/extend");
var _table_helper = require("../utils/table_helper");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const DX_COLUMN_RESIZE_FRAME_CLASS = 'dx-table-resize-frame';
const DX_COLUMN_RESIZER_CLASS = 'dx-htmleditor-column-resizer';
const DX_ROW_RESIZER_CLASS = 'dx-htmleditor-row-resizer';
const DEFAULTS = {
  minColumnWidth: 40,
  minRowHeight: 24
};
const DRAGGABLE_ELEMENT_OFFSET = 2;
const ROUGH_OFFSET = 3;
const MODULE_NAMESPACE = 'dxHtmlTableResizingModule';
const POINTERDOWN_EVENT = (0, _index.addNamespace)('dxpointerdown', MODULE_NAMESPACE);
const SCROLL_EVENT = (0, _index.addNamespace)('scroll', MODULE_NAMESPACE);
let TableResizingModule = exports.default = /*#__PURE__*/function (_BaseModule) {
  _inheritsLoose(TableResizingModule, _BaseModule);
  function TableResizingModule(quill, options) {
    var _this;
    _this = _BaseModule.call(this, quill, options) || this;
    _this.enabled = !!options.enabled;
    _this._tableResizeFrames = [];
    _this._minColumnWidth = _this._minSizeLimit('minColumnWidth', options.minColumnWidth);
    _this._minRowHeight = _this._minSizeLimit('minRowHeight', options.minRowHeight);
    _this._quillContainer = _this.editorInstance._getQuillContainer();
    _this._tableData = [];
    if (_this.enabled) {
      _this._applyResizing();
    }
    return _this;
  }
  var _proto = TableResizingModule.prototype;
  _proto._applyResizing = function _applyResizing(forcedStart) {
    if (forcedStart) {
      this._applyResizingImpl();
    } else {
      this.editorInstance.addContentInitializedCallback(this._applyResizingImpl.bind(this));
    }
    this.addCleanCallback(this.clean.bind(this));
    this._resizeHandlerWithContext = _resize_callbacks.default.add(this._resizeHandler.bind(this));
  };
  _proto._minSizeLimit = function _minSizeLimit(propertyName, newValue) {
    return (0, _type.isDefined)(newValue) ? Math.max(newValue, 0) : DEFAULTS[propertyName];
  };
  _proto._applyResizingImpl = function _applyResizingImpl() {
    const $tables = this._findTables();
    if ($tables.length) {
      this._fixTablesWidths($tables);
      this._createResizeFrames($tables);
      this._updateFramesPositions();
      this._updateFramesSeparators();
    }
    this._attachEvents();
  };
  _proto._attachEvents = function _attachEvents() {
    _events_engine.default.on(this.editorInstance._getContent(), SCROLL_EVENT, this._updateFramesPositions.bind(this));
    this.quill.on('text-change', this._getQuillTextChangeHandler());
  };
  _proto._detachEvents = function _detachEvents() {
    _events_engine.default.off(this.editorInstance._getContent(), MODULE_NAMESPACE);
    this.quill.off('text-change', this._quillTextChangeHandler);
  };
  _proto._getQuillTextChangeHandler = function _getQuillTextChangeHandler(delta, oldContent, source) {
    return (delta, oldContent, source) => {
      if (this._isTableChanging()) {
        const $tables = this._findTables();
        this._removeResizeFrames();
        if (source === 'api') {
          this._fixTablesWidths($tables);
        }
        this._updateTablesColumnsWidth($tables);
        this._createResizeFrames($tables);
        this._updateFramesPositions();
        this._updateFramesSeparators();
      } else {
        this._updateFramesPositions();
        if (!this._isDragging) {
          this._updateFramesSeparators();
        }
      }
    };
  };
  _proto._getFrameForTable = function _getFrameForTable($table) {
    var _this$_framesForTable;
    return (_this$_framesForTable = this._framesForTables) === null || _this$_framesForTable === void 0 ? void 0 : _this$_framesForTable.get($table.get(0));
  };
  _proto._resizeHandler = function _resizeHandler() {
    this._windowResizeTimeout = setTimeout(() => {
      const $tables = this._findTables();
      (0, _iterator.each)($tables, (index, table) => {
        const $table = (0, _renderer.default)(table);
        const frame = this._tableResizeFrames[index];
        const actualTableWidth = (0, _size.getOuterWidth)($table);
        const lastTableWidth = this._tableLastWidth(frame);
        if (Math.abs(actualTableWidth - lastTableWidth) > 1) {
          this._tableLastWidth(frame, actualTableWidth);
          this._updateColumnsWidth($table, index);
        }
      });
      this._updateFramesPositions();
      this._updateFramesSeparators();
    });
  };
  _proto._findTables = function _findTables() {
    return (0, _renderer.default)(this._quillContainer).find('table');
  };
  _proto._getWidthStyleValue = function _getWidthStyleValue($element) {
    const styleValue = $element[0].style.width;
    return styleValue !== '' ? parseInt(styleValue) : undefined;
  };
  _proto._tableLastWidth = function _tableLastWidth(frame, newValue) {
    if ((0, _type.isDefined)(newValue)) {
      frame.lastWidth = newValue;
    } else {
      return frame === null || frame === void 0 ? void 0 : frame.lastWidth;
    }
  };
  _proto._fixTablesWidths = function _fixTablesWidths($tables) {
    (0, _iterator.each)($tables, (index, table) => {
      const $table = (0, _renderer.default)(table);
      const $columnElements = this._getTableDeterminantElements($table, 'horizontal');
      if (!this._tableResizeFrames[index]) {
        this._tableResizeFrames[index] = {
          lastWidth: undefined
        };
      }
      const frame = this._getFrameForTable($table);
      if (!frame) {
        this._tableResizeFrames.push({
          $table: $table
        });
      }
      if ((0, _table_helper.getAutoSizedElements)($table).length === 0) {
        var _this$_tableLastWidth;
        const {
          columnsSum
        } = this._getColumnElementsSum($columnElements);
        (0, _table_helper.unfixTableWidth)($table, {
          quill: this.quill
        });
        const tableWidth = (_this$_tableLastWidth = this._tableLastWidth(frame)) !== null && _this$_tableLastWidth !== void 0 ? _this$_tableLastWidth : (0, _size.getOuterWidth)($table);
        if (frame) {
          this._tableLastWidth(frame, Math.max(columnsSum, tableWidth));
        }
      }
    });
  };
  _proto._createResizeFrames = function _createResizeFrames($tables) {
    this._framesForTables = new Map();
    $tables.each((index, table) => {
      var _this$_tableResizeFra;
      const $table = (0, _renderer.default)(table);
      const $lastTable = (_this$_tableResizeFra = this._tableResizeFrames[index]) === null || _this$_tableResizeFra === void 0 ? void 0 : _this$_tableResizeFra.$table;
      const $tableLastWidth = this._tableResizeFrames[index].lastWidth;
      this._tableResizeFrames[index] = {
        $frame: this._createTableResizeFrame(table),
        $table: $table,
        index: index,
        lastWidth: $lastTable && table === $lastTable.get(0) ? $tableLastWidth : undefined,
        columnsCount: this._getTableDeterminantElements($table, 'horizontal').length,
        rowsCount: this._getTableDeterminantElements($table, 'vertical').length
      };
      this._framesForTables.set(table, this._tableResizeFrames[index]);
    });
    this._tableResizeFrames.length = $tables.length;
  };
  _proto._isTableChanging = function _isTableChanging() {
    const $tables = this._findTables();
    let result = false;
    if ($tables.length !== this._tableResizeFrames.length) {
      result = true;
    } else {
      (0, _iterator.each)($tables, (index, table) => {
        const $table = (0, _renderer.default)(table);
        const frame = this._tableResizeFrames[index];
        const isColumnsCountChanged = (frame === null || frame === void 0 ? void 0 : frame.columnsCount) !== this._getTableDeterminantElements($table, 'horizontal').length;
        const isRowCountChanged = (frame === null || frame === void 0 ? void 0 : frame.rowsCount) !== this._getTableDeterminantElements($table, 'vertical').length;
        if (isColumnsCountChanged || isRowCountChanged) {
          result = true;
          return false;
        }
      });
    }
    return result;
  };
  _proto._removeResizeFrames = function _removeResizeFrames(clearArray) {
    var _this$_framesForTable2;
    (0, _iterator.each)(this._tableResizeFrames, (index, resizeFrame) => {
      if (resizeFrame.$frame) {
        var _resizeFrame$$frame;
        const resizerElementsSelector = ".".concat(DX_COLUMN_RESIZER_CLASS, ", .").concat(DX_ROW_RESIZER_CLASS);
        this._detachSeparatorEvents((_resizeFrame$$frame = resizeFrame.$frame) === null || _resizeFrame$$frame === void 0 ? void 0 : _resizeFrame$$frame.find(resizerElementsSelector));
        resizeFrame.$frame.remove();
      }
    });
    (_this$_framesForTable2 = this._framesForTables) === null || _this$_framesForTable2 === void 0 ? void 0 : _this$_framesForTable2.clear();
    if (clearArray) {
      this._tableResizeFrames = [];
    }
  };
  _proto._detachSeparatorEvents = function _detachSeparatorEvents($lineSeparators) {
    $lineSeparators.each((i, $lineSeparator) => {
      _events_engine.default.off($lineSeparator, POINTERDOWN_EVENT);
    });
  };
  _proto._createTableResizeFrame = function _createTableResizeFrame() {
    return (0, _renderer.default)('<div>').addClass(DX_COLUMN_RESIZE_FRAME_CLASS).appendTo(this._quillContainer);
  };
  _proto._updateFramesPositions = function _updateFramesPositions() {
    (0, _iterator.each)(this._tableResizeFrames, (index, tableResizeFrame) => {
      this._updateFramePosition(tableResizeFrame.$table, tableResizeFrame.$frame);
    });
  };
  _proto._updateFramePosition = function _updateFramePosition($table, $frame) {
    const {
      height,
      width,
      top: targetTop,
      left: targetLeft
    } = (0, _position.getBoundingRect)($table.get(0));
    const {
      top: containerTop,
      left: containerLeft
    } = (0, _position.getBoundingRect)(this.quill.root);
    $frame.css({
      height: height,
      width: width,
      top: targetTop - containerTop,
      left: targetLeft - containerLeft
    });
    (0, _translator.move)($frame, {
      left: 0,
      top: 0
    });
  };
  _proto._updateFramesSeparators = function _updateFramesSeparators(direction) {
    (0, _iterator.each)(this._tableResizeFrames, (index, frame) => {
      if (direction) {
        this._updateFrameSeparators(frame, direction);
      } else {
        this._updateFrameSeparators(frame, 'vertical');
        this._updateFrameSeparators(frame, 'horizontal');
      }
    });
  };
  _proto._isDraggable = function _isDraggable($element) {
    return $element.hasClass('dx-draggable') && $element.is(':visible');
  };
  _proto._removeDraggable = function _removeDraggable($currentLineSeparator, lineResizerClass) {
    if (this._isDraggable($currentLineSeparator)) {
      const draggable = (0, _renderer.default)($currentLineSeparator).dxDraggable('instance');
      draggable.dispose();
      (0, _renderer.default)($currentLineSeparator).addClass(lineResizerClass);
    }
  };
  _proto._getDirectionInfo = function _getDirectionInfo(direction) {
    if (direction === 'vertical') {
      return {
        lineResizerClass: DX_ROW_RESIZER_CLASS,
        sizeFunction: x => (0, _size.getOuterHeight)(x),
        positionCoordinate: 'top',
        positionStyleProperty: 'height',
        positionCoordinateName: 'y'
      };
    } else {
      return {
        lineResizerClass: DX_COLUMN_RESIZER_CLASS,
        sizeFunction: x => (0, _size.getOuterWidth)(x),
        positionCoordinate: this.editorInstance.option('rtlEnabled') ? 'right' : 'left',
        positionStyleProperty: 'width',
        positionCoordinateName: 'x'
      };
    }
  };
  _proto._getSize = function _getSize($element, directionInfo) {
    return directionInfo.sizeFunction($element);
  };
  _proto._updateFrameSeparators = function _updateFrameSeparators(frame, direction) {
    const $determinantElements = this._getTableDeterminantElements(frame.$table, direction);
    const determinantElementsCount = $determinantElements.length;
    const determinantElementsSeparatorsCount = determinantElementsCount - 1;
    const directionInfo = this._getDirectionInfo(direction);
    const lineSeparators = frame.$frame.find(".".concat(directionInfo.lineResizerClass));
    const styleOptions = {
      transform: 'none'
    };
    let currentPosition = 0;
    for (let i = 0; i <= determinantElementsSeparatorsCount; i++) {
      currentPosition += this._getSize($determinantElements.eq(i), directionInfo);
      if (!(0, _type.isDefined)(lineSeparators[i])) {
        lineSeparators[i] = (0, _renderer.default)('<div>').addClass(directionInfo.lineResizerClass).appendTo(frame.$frame).get(0);
      }
      const $currentLineSeparator = (0, _renderer.default)(lineSeparators[i]);
      this._removeDraggable($currentLineSeparator, directionInfo.lineResizerClass);
      styleOptions[directionInfo.positionCoordinate] = currentPosition - DRAGGABLE_ELEMENT_OFFSET;
      (0, _renderer.default)($currentLineSeparator).css(styleOptions);
      const attachSeparatorData = {
        lineSeparator: lineSeparators[i],
        index: i,
        $determinantElements,
        frame,
        direction
      };
      this._attachColumnSeparatorEvents(attachSeparatorData);
    }
  };
  _proto._getTableDeterminantElements = function _getTableDeterminantElements($table, direction) {
    if (direction === 'vertical') {
      return $table.find('th:first-child, td:first-child');
    } else {
      return (0, _table_helper.getColumnElements)($table);
    }
  };
  _proto._attachColumnSeparatorEvents = function _attachColumnSeparatorEvents(options) {
    _events_engine.default.on(options.lineSeparator, POINTERDOWN_EVENT, () => {
      this._createDraggableElement(options);
    });
  };
  _proto._dragStartHandler = function _dragStartHandler(_ref) {
    let {
      $determinantElements,
      index,
      frame,
      direction,
      lineSeparator
    } = _ref;
    const directionInfo = this._getDirectionInfo(direction);
    this._isDragging = true;
    this._fixColumnsWidth(frame.$table);
    this._startLineSize = parseInt(this._getSize((0, _renderer.default)($determinantElements[index]), directionInfo));
    this._startTableWidth = (0, _size.getOuterWidth)(frame.$table);
    this._startLineSeparatorPosition = parseInt((0, _renderer.default)(lineSeparator).css(directionInfo.positionCoordinate));
    this._nextLineSize = 0;
    if ($determinantElements[index + 1]) {
      this._nextLineSize = parseInt(this._getSize((0, _renderer.default)($determinantElements[index + 1]), directionInfo));
    } else if (direction === 'horizontal') {
      (0, _table_helper.unfixTableWidth)(frame.$table, {
        quill: this.quill
      });
    }
  };
  _proto._shouldRevertOffset = function _shouldRevertOffset(direction) {
    return direction === 'horizontal' && this.editorInstance.option('rtlEnabled');
  };
  _proto._isNextColumnWidthEnough = function _isNextColumnWidthEnough(nextColumnNewSize, $nextColumnElement, eventOffset) {
    if (!this._nextLineSize) {
      return true;
    } else if (nextColumnNewSize >= this._minColumnWidth) {
      const isWidthIncreased = this._nextColumnOffsetLimit ? eventOffset < this._nextColumnOffsetLimit : eventOffset < 0;
      const isWidthLimited = Math.abs(this._getWidthStyleValue($nextColumnElement) - (0, _size.getOuterWidth)($nextColumnElement)) > ROUGH_OFFSET;
      return isWidthIncreased || !isWidthLimited;
    }
    return false;
  };
  _proto._shouldSetNextColumnWidth = function _shouldSetNextColumnWidth(nextColumnNewSize) {
    return this._nextLineSize && nextColumnNewSize > 0;
  };
  _proto._horizontalDragHandler = function _horizontalDragHandler(_ref2) {
    let {
      currentLineNewSize,
      directionInfo,
      eventOffset,
      $determinantElements,
      index,
      frame
    } = _ref2;
    let nextColumnNewSize = this._nextLineSize && this._nextLineSize - eventOffset;
    const isCurrentColumnWidthEnough = currentLineNewSize >= this._minColumnWidth;
    const $lineElements = (0, _table_helper.getLineElements)(frame.$table, index);
    const $nextLineElements = (0, _table_helper.getLineElements)(frame.$table, index + 1);
    const realWidthDiff = (0, _size.getOuterWidth)($lineElements.eq(0)) - currentLineNewSize;
    if (isCurrentColumnWidthEnough) {
      if (this._isNextColumnWidthEnough(nextColumnNewSize, $determinantElements.eq(index + 1), eventOffset)) {
        (0, _table_helper.setLineElementsFormat)(this, {
          elements: $lineElements,
          property: directionInfo.positionStyleProperty,
          value: currentLineNewSize
        });
        if (this._shouldSetNextColumnWidth(nextColumnNewSize)) {
          (0, _table_helper.setLineElementsFormat)(this, {
            elements: $nextLineElements,
            property: directionInfo.positionStyleProperty,
            value: nextColumnNewSize
          });
        }
        const isTableWidthChanged = Math.abs(this._startTableWidth - (0, _size.getOuterWidth)(frame.$table)) < ROUGH_OFFSET;
        const shouldRevertNewValue = Math.abs(realWidthDiff) > ROUGH_OFFSET || !this._nextLineSize && isTableWidthChanged;
        if (shouldRevertNewValue) {
          (0, _table_helper.setLineElementsFormat)(this, {
            elements: $lineElements,
            property: directionInfo.positionStyleProperty,
            value: (0, _size.getOuterWidth)($lineElements.eq(0))
          });
          nextColumnNewSize += currentLineNewSize - (0, _size.getOuterWidth)($lineElements.eq(0));
          if (this._shouldSetNextColumnWidth(nextColumnNewSize)) {
            (0, _table_helper.setLineElementsFormat)(this, {
              elements: $nextLineElements,
              property: directionInfo.positionStyleProperty,
              value: nextColumnNewSize
            });
          }
        }
      } else {
        this._nextColumnOffsetLimit = this._nextColumnOffsetLimit || eventOffset;
      }
    }
    this._$highlightedElement.css(directionInfo.positionCoordinate, this._startLineSeparatorPosition + eventOffset + realWidthDiff + 'px');
  };
  _proto._verticalDragHandler = function _verticalDragHandler(_ref3) {
    let {
      currentLineNewSize,
      directionInfo,
      eventOffset,
      $determinantElements,
      index,
      frame
    } = _ref3;
    const newHeight = Math.max(currentLineNewSize, this._minRowHeight);
    const $lineElements = (0, _table_helper.getLineElements)(frame.$table, index, 'vertical');
    (0, _table_helper.setLineElementsFormat)(this, {
      elements: $lineElements,
      property: directionInfo.positionStyleProperty,
      value: newHeight
    });
    const rowHeightDiff = (0, _size.getOuterHeight)($determinantElements.eq(index)) - currentLineNewSize;
    this._$highlightedElement.css(directionInfo.positionCoordinate, this._startLineSeparatorPosition + eventOffset + rowHeightDiff + 'px');
  };
  _proto._dragMoveHandler = function _dragMoveHandler(event, _ref4) {
    let {
      $determinantElements,
      index,
      frame,
      direction
    } = _ref4;
    const directionInfo = this._getDirectionInfo(direction);
    let eventOffset = event.offset[directionInfo.positionCoordinateName];
    this.editorInstance._saveValueChangeEvent(event);
    if (this._shouldRevertOffset(direction)) {
      eventOffset = -eventOffset;
    }
    const currentLineNewSize = this._startLineSize + eventOffset;
    if (direction === 'horizontal') {
      this._horizontalDragHandler({
        currentLineNewSize,
        directionInfo,
        eventOffset,
        $determinantElements,
        index,
        frame
      });
    } else {
      this._verticalDragHandler({
        currentLineNewSize,
        directionInfo,
        eventOffset,
        $determinantElements,
        index,
        frame
      });
    }
    this._updateFramePosition(frame.$table, frame.$frame);
  };
  _proto._dragEndHandler = function _dragEndHandler(options) {
    var _this$_$highlightedEl;
    (_this$_$highlightedEl = this._$highlightedElement) === null || _this$_$highlightedEl === void 0 ? void 0 : _this$_$highlightedEl.remove();
    this._isDragging = undefined;
    this._nextColumnOffsetLimit = undefined;
    this._tableLastWidth(options.frame, (0, _size.getOuterWidth)(options.frame.$table));
    this._updateFramesPositions();
    this._updateFramesSeparators();
  };
  _proto._isLastColumnResizing = function _isLastColumnResizing(_ref5) {
    let {
      $determinantElements,
      index
    } = _ref5;
    return !(0, _type.isDefined)($determinantElements[index + 1]);
  };
  _proto._getBoundaryConfig = function _getBoundaryConfig(options) {
    const result = {};
    if (options.direction === 'vertical') {
      result.boundary = options.frame.$table;
      result.boundOffset = {
        bottom: (0, _window.hasWindow)() ? -(0, _size.getHeight)((0, _window.getWindow)()) : -(0, _size.getOuterHeight)(this._quillContainer),
        top: 0,
        left: 0,
        right: 0
      };
    } else {
      if (!this._isLastColumnResizing(options)) {
        result.boundary = options.frame.$table;
      } else {
        const $content = this.editorInstance._getContent();
        result.boundary = $content;
        result.boundOffset = {
          bottom: 0,
          top: 0,
          left: $content.css('paddingLeft'),
          right: $content.css('paddingRight')
        };
      }
    }
    return result;
  };
  _proto._createDraggableElement = function _createDraggableElement(options) {
    var _this$_$highlightedEl2;
    const boundaryConfig = this._getBoundaryConfig(options);
    const directionClass = options.direction === 'vertical' ? 'dx-htmleditor-highlighted-row' : 'dx-htmleditor-highlighted-column';
    (_this$_$highlightedEl2 = this._$highlightedElement) === null || _this$_$highlightedEl2 === void 0 ? void 0 : _this$_$highlightedEl2.remove();
    this._$highlightedElement = (0, _renderer.default)('<div>').addClass("".concat(directionClass)).insertAfter((0, _renderer.default)(options.lineSeparator));
    const config = {
      contentTemplate: null,
      allowMoveByClick: false,
      dragDirection: options.direction,
      onDragMove: _ref6 => {
        let {
          component,
          event
        } = _ref6;
        this._dragMoveHandler(event, options);
      },
      onDragStart: () => {
        this._dragStartHandler(options);
      },
      onDragEnd: () => {
        this._dragEndHandler(options);
      }
    };
    (0, _extend.extend)(config, boundaryConfig);
    this._currentDraggableElement = this.editorInstance._createComponent(options.lineSeparator, _draggable.default, config);
  };
  _proto._fixColumnsWidth = function _fixColumnsWidth($table) {
    const determinantElements = this._getTableDeterminantElements($table);
    (0, _iterator.each)(determinantElements, (index, element) => {
      const columnWidth = (0, _size.getOuterWidth)(element);
      const $lineElements = (0, _table_helper.getLineElements)($table, index);
      (0, _table_helper.setLineElementsFormat)(this, {
        elements: $lineElements,
        property: 'width',
        value: Math.max(columnWidth, this._minColumnWidth)
      });
    });
  };
  _proto._getColumnElementsSum = function _getColumnElementsSum(columnElements) {
    const columnsWidths = [];
    let columnsSum = 0;
    (0, _iterator.each)(columnElements, (index, element) => {
      const $element = (0, _renderer.default)(element);
      const columnWidth = this._getWidthStyleValue($element) || (0, _size.getOuterWidth)($element);
      columnsWidths[index] = Math.max(columnWidth, this._minColumnWidth);
      columnsSum += columnsWidths[index];
    });
    return {
      columnsWidths,
      columnsSum
    };
  };
  _proto._setColumnsRatioWidth = function _setColumnsRatioWidth(columnElements, ratio, columnsWidths, $table) {
    (0, _iterator.each)(columnElements, index => {
      const $lineElements = (0, _table_helper.getLineElements)($table, index);
      let resultWidth;
      if (ratio > 0) {
        resultWidth = this._minColumnWidth + Math.round((columnsWidths[index] - this._minColumnWidth) * ratio);
      } else {
        resultWidth = this._minColumnWidth;
      }
      (0, _table_helper.setLineElementsFormat)(this, {
        elements: $lineElements,
        property: 'width',
        value: resultWidth
      });
    });
  };
  _proto._updateColumnsWidth = function _updateColumnsWidth($table, frameIndex) {
    const determinantElements = this._getTableDeterminantElements($table);
    let frame = this._tableResizeFrames[frameIndex];
    if (!frame) {
      this._tableResizeFrames[frameIndex] = {};
    }
    frame = this._tableResizeFrames[frameIndex];
    const tableWidth = this._tableLastWidth(frame) || (0, _size.getOuterWidth)($table);
    let ratio;
    const {
      columnsWidths,
      columnsSum
    } = this._getColumnElementsSum(determinantElements);
    const minWidthForColumns = determinantElements.length * this._minColumnWidth;
    if (columnsSum > minWidthForColumns) {
      ratio = (tableWidth - minWidthForColumns) / (columnsSum - minWidthForColumns);
    } else {
      ratio = -1;
    }
    this._tableLastWidth(frame, ratio > 0 ? tableWidth : minWidthForColumns);
    this._setColumnsRatioWidth(determinantElements, ratio, columnsWidths, $table);
  };
  _proto._updateTablesColumnsWidth = function _updateTablesColumnsWidth($tables) {
    (0, _iterator.each)($tables, (index, table) => {
      this._updateColumnsWidth((0, _renderer.default)(table), index);
    });
  };
  _proto.option = function option(_option, value) {
    if (_option === 'tableResizing') {
      this.handleOptionChangeValue(value);
      return;
    }
    if (_option === 'enabled') {
      this.enabled = value;
      value ? this._applyResizing(true) : this.clean();
    } else if (['minColumnWidth', 'minRowHeight'].includes(_option)) {
      this["_".concat(_option)] = this._minSizeLimit(_option, value);
    }
  };
  _proto.clean = function clean() {
    this._removeResizeFrames(true);
    this._detachEvents();
    _resize_callbacks.default.remove(this._resizeHandlerWithContext);
    clearTimeout(this._windowResizeTimeout);
    this._resizeHandlerWithContext = undefined;
    this._isDragging = undefined;
    this._startTableWidth = undefined;
    clearTimeout(this._attachResizerTimeout);
  };
  return TableResizingModule;
}(_base.default);
module.exports = exports.default;
module.exports.default = exports.default;
