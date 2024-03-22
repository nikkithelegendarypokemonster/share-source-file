"use strict";

var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _type = require("../../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _remove = require("../../../../events/remove");
var _m_rows_view = require("../../../grids/grid_core/views/m_rows_view");
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const TREELIST_TEXT_CONTENT = 'dx-treelist-text-content';
const TREELIST_EXPAND_ICON_CONTAINER_CLASS = 'dx-treelist-icon-container';
const TREELIST_CELL_EXPANDABLE_CLASS = 'dx-treelist-cell-expandable';
const TREELIST_EMPTY_SPACE = 'dx-treelist-empty-space';
const TREELIST_EXPANDED_CLASS = 'dx-treelist-expanded';
const TREELIST_COLLAPSED_CLASS = 'dx-treelist-collapsed';
const createCellContent = function ($container) {
  return (0, _renderer.default)('<div>').addClass(TREELIST_TEXT_CONTENT).appendTo($container);
};
const createIcon = function (hasIcon, isExpanded) {
  const $iconElement = (0, _renderer.default)('<div>').addClass(TREELIST_EMPTY_SPACE);
  if (hasIcon) {
    $iconElement.toggleClass(TREELIST_EXPANDED_CLASS, isExpanded).toggleClass(TREELIST_COLLAPSED_CLASS, !isExpanded).append((0, _renderer.default)('<span>'));
  }
  return $iconElement;
};
let TreeListRowsView = /*#__PURE__*/function (_RowsView) {
  _inheritsLoose(TreeListRowsView, _RowsView);
  function TreeListRowsView() {
    return _RowsView.apply(this, arguments) || this;
  }
  var _proto = TreeListRowsView.prototype;
  _proto._renderIconContainer = function _renderIconContainer($container, options) {
    const $iconContainer = (0, _renderer.default)('<div>').addClass(TREELIST_EXPAND_ICON_CONTAINER_CLASS).appendTo($container);
    if (options.watch) {
      const dispose = options.watch(() => [options.row.level, options.row.isExpanded, options.row.node.hasChildren], () => {
        $iconContainer.empty();
        this._renderIcons($iconContainer, options);
      });
      _events_engine.default.on($iconContainer, _remove.removeEvent, dispose);
    }
    $container.addClass(TREELIST_CELL_EXPANDABLE_CLASS);
    return this._renderIcons($iconContainer, options);
  };
  _proto._renderIcons = function _renderIcons($iconContainer, options) {
    const {
      row
    } = options;
    const {
      level
    } = row;
    for (let i = 0; i <= level; i++) {
      $iconContainer.append(createIcon(i === level && row.node.hasChildren, row.isExpanded));
    }
    return $iconContainer;
  };
  _proto._renderCellCommandContent = function _renderCellCommandContent(container, model) {
    this._renderIconContainer(container, model);
    return true;
  };
  _proto._processTemplate = function _processTemplate(template, options) {
    var _a;
    const that = this;
    let resultTemplate;
    const renderingTemplate = _RowsView.prototype._processTemplate.call(this, template);
    // @ts-expect-error
    const firstDataColumnIndex = that._columnsController.getFirstDataColumnIndex();
    if (renderingTemplate && ((_a = options.column) === null || _a === void 0 ? void 0 : _a.index) === firstDataColumnIndex) {
      resultTemplate = {
        render(options) {
          const $container = options.container;
          if (that._renderCellCommandContent($container, options.model)) {
            options.container = createCellContent($container);
          }
          renderingTemplate.render(options);
        }
      };
    } else {
      resultTemplate = renderingTemplate;
    }
    return resultTemplate;
  };
  _proto._updateCell = function _updateCell($cell, options) {
    $cell = $cell.hasClass(TREELIST_TEXT_CONTENT) ? $cell.parent() : $cell;
    _RowsView.prototype._updateCell.call(this, $cell, options);
  };
  _proto._rowClick = function _rowClick(e) {
    const dataController = this._dataController;
    const $targetElement = (0, _renderer.default)(e.event.target);
    const isExpandIcon = this.isExpandIcon($targetElement);
    const item = dataController === null || dataController === void 0 ? void 0 : dataController.items()[e.rowIndex];
    if (isExpandIcon && item) {
      // @ts-expect-error
      dataController.changeRowExpand(item.key);
    }
    _RowsView.prototype._rowClick.call(this, e);
  };
  _proto._createRow = function _createRow(row) {
    const node = row && row.node;
    const $rowElement = _RowsView.prototype._createRow.apply(this, arguments);
    if (node) {
      this.setAria('level', row.level + 1, $rowElement);
      if (node.hasChildren) {
        this.setAria('expanded', row.isExpanded, $rowElement);
      }
    }
    return $rowElement;
  };
  _proto._getGridRoleName = function _getGridRoleName() {
    return 'treegrid';
  };
  _proto.isExpandIcon = function isExpandIcon($targetElement) {
    return !!$targetElement.closest(".".concat(TREELIST_EXPANDED_CLASS, ", .").concat(TREELIST_COLLAPSED_CLASS)).length;
  };
  _proto.setAriaExpandedAttribute = function setAriaExpandedAttribute($row, row) {
    const isRowExpanded = row.isExpanded;
    this.setAria('expanded', (0, _type.isDefined)(isRowExpanded) && isRowExpanded.toString(), $row);
  };
  return TreeListRowsView;
}(_m_rows_view.RowsView);
_m_core.default.registerModule('rows', {
  defaultOptions: _m_rows_view.rowsModule.defaultOptions,
  views: {
    rowsView: TreeListRowsView
  }
});