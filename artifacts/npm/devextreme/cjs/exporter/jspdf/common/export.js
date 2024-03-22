/**
* DevExtreme (cjs/exporter/jspdf/common/export.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.Export = void 0;
var _type = require("../../../core/utils/type");
var _extend = require("../../../core/utils/extend");
var _normalizeOptions = require("./normalizeOptions");
var _row_utils = require("./row_utils");
var _height_updater = require("./height_updater");
var _rows_generator = require("./rows_generator");
var _rows_splitting = require("./rows_splitting");
var _draw_utils = require("./draw_utils");
var _pdf_utils = require("./pdf_utils");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _export_load_panel = require("../../common/export_load_panel");
var _window = require("../../../core/utils/window");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _getFullOptions(options) {
  const {
    jsPDFDocument
  } = options;
  const fullOptions = (0, _extend.extend)({}, options);
  if (!(0, _type.isDefined)(fullOptions.topLeft)) {
    fullOptions.topLeft = {
      x: 0,
      y: 0
    };
  }
  if (!(0, _type.isDefined)(fullOptions.indent)) {
    fullOptions.indent = 0;
  }
  if (!(0, _type.isDefined)(fullOptions.repeatHeaders)) {
    fullOptions.repeatHeaders = true;
  }
  if (!(0, _type.isDefined)(fullOptions.margin)) {
    fullOptions.margin = (0, _pdf_utils.toPdfUnit)(jsPDFDocument, 40);
  }
  fullOptions.margin = (0, _normalizeOptions.normalizeBoundaryValue)(fullOptions.margin);
  if (!Array.isArray(fullOptions.columnWidths)) {
    fullOptions.columnWidths = [];
  }
  if (!(0, _type.isDefined)(fullOptions.loadPanel)) {
    fullOptions.loadPanel = {};
  }
  if (!(0, _type.isDefined)(fullOptions.loadPanel.enabled)) {
    fullOptions.loadPanel.enabled = true;
  }
  if (!(0, _type.isDefined)(fullOptions.loadPanel.text)) {
    fullOptions.loadPanel.text = _message.default.format('dxDataGrid-exporting');
  }
  return fullOptions;
}
function exportDataGrid(options) {
  var _component$_getIntern;
  const {
    jsPDFDocument,
    component,
    selectedRowsOnly,
    loadPanel
  } = options;
  const internalComponent = ((_component$_getIntern = component._getInternalInstance) === null || _component$_getIntern === void 0 ? void 0 : _component$_getIntern.call(component)) || component;
  const initialLoadPanelEnabledOption = internalComponent.option('loadPanel') && internalComponent.option('loadPanel').enabled;
  if (initialLoadPanelEnabledOption) {
    component.option('loadPanel.enabled', false);
  }
  let exportLoadPanel;
  if (loadPanel.enabled && (0, _window.hasWindow)()) {
    const rowsView = component.getView('rowsView');
    exportLoadPanel = new _export_load_panel.ExportLoadPanel(component, rowsView.element(), rowsView.element().parent(), loadPanel);
    exportLoadPanel.show();
  }
  const dataProvider = component.getDataProvider(selectedRowsOnly);
  return new Promise(resolve => {
    dataProvider.ready().done(() => {
      var _options$rowOptions, _options$rowOptions$h;
      // TODO: pass rowOptions: { headerStyles: { backgroundColor }, groupStyles: {...}, totalStyles: {...} }
      const rowsInfo = (0, _rows_generator.generateRowsInfo)(jsPDFDocument, dataProvider, component, (_options$rowOptions = options.rowOptions) === null || _options$rowOptions === void 0 ? void 0 : (_options$rowOptions$h = _options$rowOptions.headerStyles) === null || _options$rowOptions$h === void 0 ? void 0 : _options$rowOptions$h.backgroundColor);
      if (options.customizeCell) {
        rowsInfo.forEach(rowInfo => rowInfo.cells.forEach(cellInfo => options.customizeCell(cellInfo)));
      }
      (0, _normalizeOptions.normalizeRowsInfo)(rowsInfo);

      // computes withs of the cells depending of the fullOptions
      (0, _row_utils.initializeCellsWidth)(jsPDFDocument, dataProvider, rowsInfo, options);

      // apply intends for correctly set width and colSpan for grouped rows
      (0, _row_utils.resizeFirstColumnByIndentLevel)(rowsInfo, options);

      // apply colSpans + recalculate cellsWidth
      (0, _row_utils.applyColSpans)(rowsInfo);

      // set/update/initCellHeight - autocalculate by text+width+wordWrapEnabled+padding or use value from customizeCell
      (0, _row_utils.calculateHeights)(jsPDFDocument, rowsInfo, options);

      // apply rowSpans + recalculate cells height
      (0, _row_utils.applyRowSpans)(rowsInfo);

      // when we know all rowSpans we can recalculate rowsHeight
      (0, _height_updater.updateRowsAndCellsHeights)(jsPDFDocument, rowsInfo);

      // when we known all sizes we can calculate all coordinates
      (0, _row_utils.calculateCoordinates)(jsPDFDocument, rowsInfo, options); // set/init/update 'pdfCell.top/left'

      // recalculate for grouped rows
      // TODO: applyGroupIndents()

      (0, _row_utils.applyBordersConfig)(rowsInfo);
      (0, _pdf_utils.applyWordWrap)(jsPDFDocument, rowsInfo);

      // splitting to pages
      // ?? TODO: Does split a cell which have an attribute 'colSpan/rowSpan > 0' into two cells and place the first cell on the first page and second cell on the second page. And show initial 'text' in the both new cells ??
      // TODO: applySplitting()

      const docStyles = (0, _draw_utils.getDocumentStyles)(jsPDFDocument);
      const rtlEnabled = !!component.option('rtlEnabled');
      const onSeparateRectHorizontally = _ref => {
        var _sourceRect$sourceCel;
        let {
          sourceRect,
          leftRect,
          rightRect
        } = _ref;
        let leftRectTextOptions = {};
        let rightRectTextOptions = {};
        const isTextNotEmpty = ((_sourceRect$sourceCel = sourceRect.sourceCellInfo.text) === null || _sourceRect$sourceCel === void 0 ? void 0 : _sourceRect$sourceCel.length) > 0;
        if (isTextNotEmpty) {
          if (rtlEnabled) {
            const isTextWidthGreaterThanRect = jsPDFDocument.getTextWidth(sourceRect.sourceCellInfo.text) > leftRect.w;
            const isTextRightAlignment = !(0, _type.isDefined)(sourceRect.sourceCellInfo.horizontalAlign) || sourceRect.sourceCellInfo.horizontalAlign === 'right';
            if (isTextWidthGreaterThanRect || !isTextRightAlignment) {
              var _sourceRect$sourceCel2, _sourceRect$sourceCel4, _sourceRect$sourceCel5;
              let rightRectTextOffset;
              let leftRectTextOffset;
              if (((_sourceRect$sourceCel2 = sourceRect.sourceCellInfo) === null || _sourceRect$sourceCel2 === void 0 ? void 0 : _sourceRect$sourceCel2.horizontalAlign) === 'right') {
                var _sourceRect$sourceCel3;
                rightRectTextOffset = (_sourceRect$sourceCel3 = sourceRect.sourceCellInfo._textLeftOffset) !== null && _sourceRect$sourceCel3 !== void 0 ? _sourceRect$sourceCel3 : 0;
                leftRectTextOffset = rightRectTextOffset + leftRect.w;
              } else if (((_sourceRect$sourceCel4 = sourceRect.sourceCellInfo) === null || _sourceRect$sourceCel4 === void 0 ? void 0 : _sourceRect$sourceCel4.horizontalAlign) === 'center') {
                leftRectTextOffset = sourceRect.x + sourceRect.w - (rightRect.x + rightRect.w) + sourceRect.sourceCellInfo._rect.w / 2 - leftRect.w / 2;
                rightRectTextOffset = leftRectTextOffset - rightRect.w;
              } else if (((_sourceRect$sourceCel5 = sourceRect.sourceCellInfo) === null || _sourceRect$sourceCel5 === void 0 ? void 0 : _sourceRect$sourceCel5.horizontalAlign) === 'left') {
                leftRectTextOffset = sourceRect.x + sourceRect.w - (rightRect.x + rightRect.w);
                rightRectTextOffset = leftRectTextOffset - rightRect.w;
              }
              leftRectTextOptions = _extends({}, {
                _textLeftOffset: rightRectTextOffset
              });
              rightRectTextOptions = _extends({}, {
                _textLeftOffset: leftRectTextOffset
              });
            } else {
              rightRectTextOptions = _extends({}, {
                text: ''
              });
            }
          } else {
            const isTextWidthGreaterThanRect = jsPDFDocument.getTextWidth(sourceRect.sourceCellInfo.text) > leftRect.w;
            const isTextLeftAlignment = !(0, _type.isDefined)(sourceRect.sourceCellInfo.horizontalAlign) || sourceRect.sourceCellInfo.horizontalAlign === 'left';
            if (isTextWidthGreaterThanRect || !isTextLeftAlignment) {
              var _sourceRect$sourceCel6, _sourceRect$sourceCel8, _sourceRect$sourceCel10;
              let leftTextLeftOffset;
              let rightTextLeftOffset;
              if (((_sourceRect$sourceCel6 = sourceRect.sourceCellInfo) === null || _sourceRect$sourceCel6 === void 0 ? void 0 : _sourceRect$sourceCel6.horizontalAlign) === 'left') {
                var _sourceRect$sourceCel7;
                leftTextLeftOffset = (_sourceRect$sourceCel7 = sourceRect.sourceCellInfo._textLeftOffset) !== null && _sourceRect$sourceCel7 !== void 0 ? _sourceRect$sourceCel7 : 0;
                rightTextLeftOffset = leftTextLeftOffset - leftRect.w;
              } else if (((_sourceRect$sourceCel8 = sourceRect.sourceCellInfo) === null || _sourceRect$sourceCel8 === void 0 ? void 0 : _sourceRect$sourceCel8.horizontalAlign) === 'center') {
                var _sourceRect$sourceCel9;
                const offset = (_sourceRect$sourceCel9 = sourceRect.sourceCellInfo._textLeftOffset) !== null && _sourceRect$sourceCel9 !== void 0 ? _sourceRect$sourceCel9 : 0;
                leftTextLeftOffset = offset + (sourceRect.x + sourceRect.w / 2) - (leftRect.x + leftRect.w / 2);
                rightTextLeftOffset = offset + (sourceRect.x + sourceRect.w / 2) - (rightRect.x + rightRect.w / 2);
              } else if (((_sourceRect$sourceCel10 = sourceRect.sourceCellInfo) === null || _sourceRect$sourceCel10 === void 0 ? void 0 : _sourceRect$sourceCel10.horizontalAlign) === 'right') {
                leftTextLeftOffset = sourceRect.x + sourceRect.w - (leftRect.x + leftRect.w);
                rightTextLeftOffset = sourceRect.x + sourceRect.w - (rightRect.x + rightRect.w);
              }
              leftRectTextOptions = _extends({}, {
                _textLeftOffset: leftTextLeftOffset
              });
              rightRectTextOptions = _extends({}, {
                _textLeftOffset: rightTextLeftOffset
              });
            } else {
              rightRectTextOptions = _extends({}, {
                text: ''
              });
            }
          }
        }
        leftRect.sourceCellInfo = _extends({}, sourceRect.sourceCellInfo, {
          debugSourceCellInfo: sourceRect.sourceCellInfo
        }, leftRectTextOptions);
        rightRect.sourceCellInfo = _extends({}, sourceRect.sourceCellInfo, {
          debugSourceCellInfo: sourceRect.sourceCellInfo
        }, rightRectTextOptions);
      };
      const onSeparateRectVertically = _ref2 => {
        var _sourceRect$sourceCel11;
        let {
          sourceRect,
          topRect,
          bottomRect
        } = _ref2;
        let topRectTextOptions = {};
        let bottomRectTextOptions = {};
        const isTextNotEmpty = ((_sourceRect$sourceCel11 = sourceRect.sourceCellInfo.text) === null || _sourceRect$sourceCel11 === void 0 ? void 0 : _sourceRect$sourceCel11.length) > 0;
        if (isTextNotEmpty) {
          var _sourceRect$sourceCel12;
          const isTextHeightGreaterThanRect = jsPDFDocument.getTextDimensions(sourceRect.sourceCellInfo.text).h > topRect.h;
          const isTextTopAlignment = ((_sourceRect$sourceCel12 = sourceRect.sourceCellInfo) === null || _sourceRect$sourceCel12 === void 0 ? void 0 : _sourceRect$sourceCel12.verticalAlign) === 'top';
          if (isTextHeightGreaterThanRect || !isTextTopAlignment) {
            var _sourceRect$sourceCel13, _sourceRect$sourceCel15, _sourceRect$sourceCel17;
            let topTextTopOffset;
            let bottomTextTopOffset;
            if (((_sourceRect$sourceCel13 = sourceRect.sourceCellInfo) === null || _sourceRect$sourceCel13 === void 0 ? void 0 : _sourceRect$sourceCel13.verticalAlign) === 'top') {
              var _sourceRect$sourceCel14;
              topTextTopOffset = (_sourceRect$sourceCel14 = sourceRect.sourceCellInfo._textTopOffset) !== null && _sourceRect$sourceCel14 !== void 0 ? _sourceRect$sourceCel14 : 0;
              bottomTextTopOffset = topTextTopOffset - topRect.h;
            } else if (((_sourceRect$sourceCel15 = sourceRect.sourceCellInfo) === null || _sourceRect$sourceCel15 === void 0 ? void 0 : _sourceRect$sourceCel15.verticalAlign) === 'middle') {
              var _sourceRect$sourceCel16;
              const offset = (_sourceRect$sourceCel16 = sourceRect.sourceCellInfo._textTopOffset) !== null && _sourceRect$sourceCel16 !== void 0 ? _sourceRect$sourceCel16 : 0;
              topTextTopOffset = offset + (sourceRect.y + sourceRect.h / 2) - (topRect.y + topRect.h / 2);
              bottomTextTopOffset = offset + (sourceRect.y + sourceRect.h / 2) - (bottomRect.y + bottomRect.h / 2);
            } else if (((_sourceRect$sourceCel17 = sourceRect.sourceCellInfo) === null || _sourceRect$sourceCel17 === void 0 ? void 0 : _sourceRect$sourceCel17.verticalAlign) === 'bottom') {
              topTextTopOffset = sourceRect.y + sourceRect.h - (topRect.y + topRect.h);
              bottomTextTopOffset = sourceRect.y + sourceRect.h - (bottomRect.y + bottomRect.h);
            }
            topRectTextOptions = _extends({}, {
              _textTopOffset: topTextTopOffset
            });
            bottomRectTextOptions = _extends({}, {
              _textTopOffset: bottomTextTopOffset
            });
          } else {
            bottomRectTextOptions = _extends({}, {
              text: ''
            });
          }
        }
        topRect.sourceCellInfo = _extends({}, sourceRect.sourceCellInfo, {
          debugSourceCellInfo: sourceRect.sourceCellInfo
        }, topRectTextOptions);
        bottomRect.sourceCellInfo = _extends({}, sourceRect.sourceCellInfo, {
          debugSourceCellInfo: sourceRect.sourceCellInfo
        }, bottomRectTextOptions);
      };
      const rectsByPages = (0, _rows_splitting.splitByPages)(jsPDFDocument, rowsInfo, options, onSeparateRectHorizontally, onSeparateRectVertically);
      if (rtlEnabled) {
        (0, _pdf_utils.applyRtl)(jsPDFDocument, rectsByPages, options);
      }
      rectsByPages.forEach((pdfCellsInfo, index) => {
        if (index > 0) {
          (0, _draw_utils.addNewPage)(jsPDFDocument);
        }
        (0, _draw_utils.drawCellsContent)(jsPDFDocument, options.customDrawCell, pdfCellsInfo, docStyles);
        (0, _draw_utils.drawCellsLines)(jsPDFDocument, pdfCellsInfo, docStyles);
        const isEmptyPdfCellsInfoSpecified = (0, _type.isDefined)(pdfCellsInfo) && pdfCellsInfo.length === 0;
        if (isEmptyPdfCellsInfoSpecified) {
          const tableRect = (0, _row_utils.calculateTableSize)(jsPDFDocument, pdfCellsInfo, options); // TODO: after splitting to pages we need get 'rowsInfo' for selected table in the page
          const baseStyle = (0, _rows_generator.getBaseTableStyle)();
          (0, _draw_utils.drawGridLines)(jsPDFDocument, tableRect, baseStyle, docStyles);
        }
      });
      (0, _draw_utils.setDocumentStyles)(jsPDFDocument, docStyles);
      resolve();
    }).always(() => {
      if (initialLoadPanelEnabledOption) {
        component.option('loadPanel.enabled', initialLoadPanelEnabledOption);
      }
      if (loadPanel.enabled && (0, _window.hasWindow)()) {
        exportLoadPanel.dispose();
      }
    });
  });
}
const Export = exports.Export = {
  getFullOptions: _getFullOptions,
  export: exportDataGrid
};
