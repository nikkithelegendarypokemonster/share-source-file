"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.virtualColumnsModule = void 0;
var _browser = _interopRequireDefault(require("../../../../core/utils/browser"));
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _window = require("../../../../core/utils/window");
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_virtual_columns_core = require("./m_virtual_columns_core");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */
const DEFAULT_COLUMN_WIDTH = 50;
const rowsView = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(VirtualColumnsRowsViewExtender, _Base);
  function VirtualColumnsRowsViewExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = VirtualColumnsRowsViewExtender.prototype;
  _proto._resizeCore = function _resizeCore() {
    // @ts-expect-error
    _Base.prototype._resizeCore.apply(this, arguments);
    // @ts-expect-error
    this._columnsController.resize();
  };
  _proto._handleScroll = function _handleScroll(e) {
    const that = this;
    const scrollable = this.getScrollable();
    let {
      left
    } = e.scrollOffset;
    // @ts-expect-error
    _Base.prototype._handleScroll.apply(that, arguments);
    if (that.option('rtlEnabled') && scrollable) {
      left = (0, _size.getWidth)(scrollable.$content()) - (0, _size.getWidth)(scrollable.$element()) - left;
    }
    // @ts-expect-error
    that._columnsController.setScrollPosition(left);
  };
  _proto._renderCore = function _renderCore(e) {
    var _a, _b;
    if (e === null || e === void 0 ? void 0 : e.virtualColumnsScrolling) {
      const $contentElement = this._findContentElement();
      const fixedColumns = (_a = this._columnsController) === null || _a === void 0 ? void 0 : _a.getFixedColumns();
      const useNativeScrolling = (_b = this._scrollable) === null || _b === void 0 ? void 0 : _b.option('useNative');
      if (fixedColumns === null || fixedColumns === void 0 ? void 0 : fixedColumns.length) {
        $contentElement.css({
          minHeight: useNativeScrolling ? (0, _size.getHeight)($contentElement) : _m_utils.default.getContentHeightLimit(_browser.default)
        });
        const resizeCompletedHandler = () => {
          this.resizeCompleted.remove(resizeCompletedHandler);
          $contentElement.css({
            minHeight: ''
          });
        };
        this.resizeCompleted.add(resizeCompletedHandler);
      }
    }
    // @ts-expect-error
    return _Base.prototype._renderCore.apply(this, arguments);
  };
  return VirtualColumnsRowsViewExtender;
}(Base);
const columnHeadersView = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(VirtualColumnsColumnHeaderViewExtender, _Base2);
  function VirtualColumnsColumnHeaderViewExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto2 = VirtualColumnsColumnHeaderViewExtender.prototype;
  _proto2._renderCore = function _renderCore() {
    // @ts-expect-error
    const deferred = _Base2.prototype._renderCore.apply(this, arguments);
    // @ts-expect-error
    if (this._columnsController.isVirtualMode()) {
      this._updateScrollLeftPosition();
    }
    return deferred;
  };
  return VirtualColumnsColumnHeaderViewExtender;
}(Base);
const getWidths = function (columns) {
  return columns.map(column => column.visibleWidth || parseFloat(column.width) || DEFAULT_COLUMN_WIDTH);
};
const columns = Base => /*#__PURE__*/function (_Base3) {
  _inheritsLoose(VirtualColumnsControllerExtender, _Base3);
  function VirtualColumnsControllerExtender() {
    return _Base3.apply(this, arguments) || this;
  }
  var _proto3 = VirtualColumnsControllerExtender.prototype;
  _proto3.init = function init() {
    const that = this;
    // @ts-expect-error
    _Base3.prototype.init.apply(this, arguments);
    this._resizingController = this.getController('resizing');
    that._beginPageIndex = null;
    that._endPageIndex = null;
    that._position = 0;
    that._virtualVisibleColumns = {};
  };
  _proto3.dispose = function dispose() {
    clearTimeout(this._changedTimeout);
    // @ts-expect-error
    _Base3.prototype.dispose.apply(this, arguments);
  };
  _proto3.resetColumnsCache = function resetColumnsCache() {
    _Base3.prototype.resetColumnsCache.call(this);
    this._virtualVisibleColumns = {};
  };
  _proto3.getBeginPageIndex = function getBeginPageIndex(position) {
    const visibleColumns = this.getVisibleColumns(undefined, true);
    const widths = getWidths(visibleColumns);
    let currentPosition = 0;
    for (let index = 0; index < widths.length; index++) {
      if (currentPosition >= position) {
        return Math.floor(index / this.getColumnPageSize());
      }
      currentPosition += widths[index];
    }
    return 0;
  };
  _proto3.getTotalWidth = function getTotalWidth() {
    const width = this.option('width');
    if (typeof width === 'number') {
      return width;
    }
    return this._resizingController._lastWidth || (0, _size.getOuterWidth)(this.component.$element());
  };
  _proto3.getEndPageIndex = function getEndPageIndex(position) {
    const visibleColumns = this.getVisibleColumns(undefined, true);
    const widths = getWidths(visibleColumns);
    let currentPosition = 0;
    position += this.getTotalWidth();
    for (let index = 0; index < widths.length; index++) {
      if (currentPosition >= position) {
        return Math.ceil(index / this.getColumnPageSize());
      }
      currentPosition += widths[index];
    }
    return Math.ceil(widths.length / this.getColumnPageSize());
  };
  _proto3.getColumnPageSize = function getColumnPageSize() {
    return this.option('scrolling.columnPageSize');
  };
  _proto3._fireColumnsChanged = function _fireColumnsChanged() {
    const date = new Date();
    this.columnsChanged.fire({
      optionNames: {
        all: true,
        length: 1
      },
      changeTypes: {
        columns: true,
        virtualColumnsScrolling: true,
        length: 2
      }
    });
    this._renderTime = new Date() - date;
  };
  _proto3.getScrollingTimeout = function getScrollingTimeout() {
    const renderingThreshold = this.option('scrolling.columnRenderingThreshold');
    const renderAsync = this.option('scrolling.renderAsync');
    let scrollingTimeout = 0;
    if (!(0, _type.isDefined)(renderAsync) && this._renderTime > renderingThreshold || renderAsync) {
      scrollingTimeout = this.option('scrolling.timeout');
    }
    return scrollingTimeout;
  };
  _proto3.setScrollPosition = function setScrollPosition(position) {
    const scrollingTimeout = this.getScrollingTimeout();
    if (scrollingTimeout > 0) {
      clearTimeout(this._changedTimeout);
      this._changedTimeout = setTimeout(() => {
        this._setScrollPositionCore(position);
      }, scrollingTimeout);
    } else {
      this._setScrollPositionCore(position);
    }
  };
  _proto3.isVirtualMode = function isVirtualMode() {
    return (0, _window.hasWindow)() && this.option('scrolling.columnRenderingMode') === 'virtual';
  };
  _proto3.resize = function resize() {
    this._setScrollPositionCore(this._position);
  };
  _proto3._setScrollPositionCore = function _setScrollPositionCore(position) {
    const that = this;
    if (that.isVirtualMode()) {
      const beginPageIndex = that.getBeginPageIndex(position);
      const endPageIndex = that.getEndPageIndex(position);
      const needColumnsChanged = position < that._position ? that._beginPageIndex > beginPageIndex : that._endPageIndex < endPageIndex;
      that._position = position;
      if (needColumnsChanged) {
        that._beginPageIndex = beginPageIndex;
        that._endPageIndex = endPageIndex;
        that._fireColumnsChanged();
      }
    }
  };
  _proto3.getFixedColumns = function getFixedColumns(rowIndex, isBase) {
    const fixedColumns = _Base3.prototype.getFixedColumns.call(this, rowIndex);
    if (this.isVirtualMode() && !isBase && fixedColumns.length) {
      const transparentColumnIndex = fixedColumns.map(c => c.command).indexOf('transparent');
      fixedColumns[transparentColumnIndex].colspan = this.getVisibleColumns().length - _Base3.prototype.getFixedColumns.call(this).length + 1;
      return fixedColumns;
    }
    return fixedColumns;
  };
  _proto3._compileVisibleColumns = function _compileVisibleColumns(rowIndex, isBase) {
    var _a;
    if (isBase || !this.isVirtualMode() || !this._shouldReturnVisibleColumns()) {
      return _Base3.prototype._compileVisibleColumns.call(this, rowIndex);
    }
    if (((_a = this._columns) === null || _a === void 0 ? void 0 : _a.length) && !(0, _type.isDefined)(this._beginPageIndex) && !(0, _type.isDefined)(this._endPageIndex)) {
      this._beginPageIndex = this.getBeginPageIndex(this._position);
      this._endPageIndex = this.getEndPageIndex(this._position);
    }
    const beginPageIndex = this._beginPageIndex;
    const endPageIndex = this._endPageIndex;
    const visibleColumnsHash = "".concat(rowIndex, "-").concat(beginPageIndex, "-").concat(endPageIndex);
    if (this._virtualVisibleColumns[visibleColumnsHash]) {
      return this._virtualVisibleColumns[visibleColumnsHash];
    }
    let visibleColumns = _Base3.prototype._compileVisibleColumns.call(this);
    const rowCount = this.getRowCount();
    const pageSize = this.getColumnPageSize();
    let startIndex = beginPageIndex * pageSize;
    let endIndex = endPageIndex * pageSize;
    const fixedColumns = this.getFixedColumns(undefined, true);
    const transparentColumnIndex = fixedColumns.map(c => c.command).indexOf('transparent');
    const beginFixedColumnCount = fixedColumns.length ? transparentColumnIndex : 0;
    let beginFixedColumns = visibleColumns.slice(0, beginFixedColumnCount);
    const beginColumns = visibleColumns.slice(beginFixedColumnCount, startIndex);
    const beginWidth = getWidths(beginColumns).reduce((a, b) => a + b, 0);
    if (!beginWidth) {
      startIndex = 0;
    }
    const endFixedColumnCount = fixedColumns.length ? fixedColumns.length - transparentColumnIndex - 1 : 0;
    let endFixedColumns = visibleColumns.slice(visibleColumns.length - endFixedColumnCount);
    const endColumns = visibleColumns.slice(endIndex, visibleColumns.length - endFixedColumnCount);
    const endWidth = getWidths(endColumns).reduce((a, b) => a + b, 0);
    if (!endWidth) {
      endIndex = visibleColumns.length;
    }
    if (rowCount > 1 && typeof rowIndex === 'number') {
      const columnsInfo = [];
      for (let i = 0; i <= rowCount; i++) {
        columnsInfo.push(_Base3.prototype._compileVisibleColumns.call(this, i));
      }
      beginFixedColumns = (0, _m_virtual_columns_core.createColumnsInfo)(columnsInfo, 0, beginFixedColumns.length)[rowIndex] || [];
      endFixedColumns = (0, _m_virtual_columns_core.createColumnsInfo)(columnsInfo, visibleColumns.length - endFixedColumns.length, visibleColumns.length)[rowIndex] || [];
      visibleColumns = (0, _m_virtual_columns_core.createColumnsInfo)(columnsInfo, startIndex, endIndex)[rowIndex] || [];
    } else {
      visibleColumns = visibleColumns.slice(startIndex, endIndex);
    }
    if (beginWidth) {
      visibleColumns.unshift({
        command: 'virtual',
        width: beginWidth
      });
      visibleColumns = beginFixedColumns.concat(visibleColumns);
    }
    if (endWidth) {
      visibleColumns.push({
        command: 'virtual',
        width: endWidth
      });
      visibleColumns = visibleColumns.concat(endFixedColumns);
    }
    this._virtualVisibleColumns[visibleColumnsHash] = visibleColumns;
    return visibleColumns;
  };
  _proto3.getColumnIndexOffset = function getColumnIndexOffset() {
    let offset = 0;
    if (this._beginPageIndex > 0) {
      const fixedColumns = this.getFixedColumns();
      const transparentColumnIndex = fixedColumns.map(c => c.command).indexOf('transparent');
      const leftFixedColumnCount = transparentColumnIndex >= 0 ? transparentColumnIndex : 0;
      offset = this._beginPageIndex * this.getColumnPageSize() - leftFixedColumnCount - 1;
    }
    return offset > 0 ? offset : 0;
  };
  return VirtualColumnsControllerExtender;
}(Base);
const virtualColumnsModule = exports.virtualColumnsModule = {
  defaultOptions() {
    return {
      scrolling: {
        columnRenderingMode: 'standard',
        columnPageSize: 5,
        columnRenderingThreshold: 300
      }
    };
  },
  extenders: {
    controllers: {
      columns
    },
    views: {
      columnHeadersView,
      rowsView
    }
  }
};