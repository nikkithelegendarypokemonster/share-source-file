"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ColumnStateMixin = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _extend = require("../../../../core/utils/extend");
var _position = require("../../../../core/utils/position");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const COLUMN_INDICATORS_CLASS = 'dx-column-indicators';
const GROUP_PANEL_ITEM_CLASS = 'dx-group-panel-item';
const ColumnStateMixin = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(_class, _Base);
  function _class() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto = _class.prototype;
  /**
   * @extended header_filter_core
   */
  _proto._applyColumnState = function _applyColumnState(options) {
    var _a;
    const that = this;
    const rtlEnabled = this.option('rtlEnabled');
    const columnAlignment = that._getColumnAlignment(options.column.alignment, rtlEnabled);
    const parameters = (0, _extend.extend)(true, {
      columnAlignment
    }, options);
    const isGroupPanelItem = parameters.rootElement.hasClass(GROUP_PANEL_ITEM_CLASS);
    const $indicatorsContainer = that._createIndicatorContainer(parameters, isGroupPanelItem);
    const $span = (0, _renderer.default)('<span>').addClass(that._getIndicatorClassName(options.name));
    // TODO getController
    const columnsController = (_a = that.component) === null || _a === void 0 ? void 0 : _a.getController('columns');
    const indicatorAlignment = (columnsController === null || columnsController === void 0 ? void 0 : columnsController.getHeaderContentAlignment(columnAlignment)) || columnAlignment;
    parameters.container = $indicatorsContainer;
    parameters.indicator = $span;
    that._renderIndicator(parameters);
    $indicatorsContainer[(isGroupPanelItem || !options.showColumnLines) && indicatorAlignment === 'left' ? 'appendTo' : 'prependTo'](options.rootElement);
    return $span;
  }
  /**
   * @extended header_filter_core
   */
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._getIndicatorClassName = function _getIndicatorClassName(name) {};
  _proto._getColumnAlignment = function _getColumnAlignment(alignment, rtlEnabled) {
    rtlEnabled = rtlEnabled || this.option('rtlEnabled');
    return alignment && alignment !== 'center' ? alignment : (0, _position.getDefaultAlignment)(rtlEnabled);
  };
  _proto._createIndicatorContainer = function _createIndicatorContainer(options, ignoreIndicatorAlignment) {
    let $indicatorsContainer = this._getIndicatorContainer(options.rootElement);
    const indicatorAlignment = options.columnAlignment === 'left' ? 'right' : 'left';
    if (!$indicatorsContainer.length) {
      $indicatorsContainer = (0, _renderer.default)('<div>').addClass(COLUMN_INDICATORS_CLASS);
    }
    this.setAria('role', 'presentation', $indicatorsContainer);
    return $indicatorsContainer.css('float', options.showColumnLines && !ignoreIndicatorAlignment ? indicatorAlignment : null);
  };
  _proto._getIndicatorContainer = function _getIndicatorContainer($cell) {
    return $cell && $cell.find(".".concat(COLUMN_INDICATORS_CLASS));
  };
  _proto._getIndicatorElements = function _getIndicatorElements($cell) {
    const $indicatorContainer = this._getIndicatorContainer($cell);
    return $indicatorContainer && $indicatorContainer.children();
  }
  /**
   * @extended header_filter_core
   */;
  _proto._renderIndicator = function _renderIndicator(options) {
    const $container = options.container;
    const $indicator = options.indicator;
    $container && $indicator && $container.append($indicator);
  };
  _proto._updateIndicators = function _updateIndicators(indicatorName) {
    const that = this;
    // @ts-expect-error
    const columns = that.getColumns();
    // @ts-expect-error
    const $cells = that.getColumnElements();
    let $cell;
    if (!$cells || columns.length !== $cells.length) return;
    for (let i = 0; i < columns.length; i++) {
      $cell = $cells.eq(i);
      that._updateIndicator($cell, columns[i], indicatorName);
      const rowOptions = $cell.parent().data('options');
      if (rowOptions && rowOptions.cells) {
        rowOptions.cells[$cell.index()].column = columns[i];
      }
    }
  };
  _proto._updateIndicator = function _updateIndicator($cell, column, indicatorName) {
    if (!column.command) {
      return this._applyColumnState({
        name: indicatorName,
        rootElement: $cell,
        column,
        showColumnLines: this.option('showColumnLines')
      });
    }
    return undefined;
  };
  return _class;
}(Base);
exports.ColumnStateMixin = ColumnStateMixin;
var _default = exports.default = ColumnStateMixin;