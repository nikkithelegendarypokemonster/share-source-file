import _extends from "@babel/runtime/helpers/esm/extends";
import { isDefined } from '../../../core/utils/type';
import { getPageWidth, getPageHeight } from './pdf_utils';
import { roundToThreeDecimals } from './draw_utils';
import { getMultiPageRowPages, checkPageContainsOnlyHeader } from './rows_spliting_utils/get_multipage_row_pages';
import { createOnSplitMultiPageRow } from './rows_spliting_utils/create_on_split_multipage_row';
var COORDINATE_EPSILON = 0.001;
function convertToCellsArray(rows) {
  return [].concat.apply([], rows.map(rowInfo => {
    return rowInfo.cells.filter(cell => !isDefined(cell.pdfCell.isMerged)).map(cellInfo => {
      return _extends({}, cellInfo.pdfCell._rect, {
        sourceCellInfo: _extends({}, cellInfo.pdfCell, {
          gridCell: cellInfo.gridCell
        })
      });
    });
  }));
}
function splitByPages(doc, rowsInfo, options, onSeparateRectHorizontally, onSeparateRectVertically) {
  if (rowsInfo.length === 0) {
    // Empty Table
    return [[]];
  }
  var maxBottomRight = {
    x: getPageWidth(doc) - options.margin.right,
    y: getPageHeight(doc) - options.margin.bottom
  };
  var headerRows = rowsInfo.filter(r => r.rowType === 'header');
  var headerHeight = headerRows.reduce((accumulator, row) => {
    return accumulator + row.height;
  }, 0);
  var verticallyPages = splitRectsByPages(convertToCellsArray(rowsInfo), options.margin.top, 'y', 'h', (isFirstPage, currentCoordinate) => {
    var additionalHeight = !isFirstPage && options.repeatHeaders ? headerHeight : 0;
    return roundToThreeDecimals(currentCoordinate + additionalHeight) <= roundToThreeDecimals(maxBottomRight.y);
  }, (rect, currentPageMaxRectCoordinate, currentPageRects, rectsToSplit) => {
    var args = {
      sourceRect: rect,
      topRect: {
        x: rect.x,
        y: rect.y,
        w: rect.w,
        h: currentPageMaxRectCoordinate - rect.y
      },
      bottomRect: {
        x: rect.x,
        y: currentPageMaxRectCoordinate,
        w: rect.w,
        h: rect.h - (currentPageMaxRectCoordinate - rect.y)
      }
    };
    onSeparateRectVertically(args);
    currentPageRects.push(args.topRect);
    rectsToSplit.push(args.bottomRect);
  }, createOnSplitMultiPageRow(doc, options, headerHeight, maxBottomRight));
  if (options.repeatHeaders) {
    for (var i = 1; i < verticallyPages.length; i++) {
      verticallyPages[i].forEach(rect => rect.y += headerHeight);
      // create deep copy of headers for each page
      var headerCells = convertToCellsArray(headerRows);
      headerCells.forEach(cell => {
        cell.y -= options.topLeft.y;
        // cell.x -= options.topLeft.x; don't forget to uncomment this line after fixing topleft.x issue
      });
      verticallyPages[i] = [...headerCells, ...verticallyPages[i]];
    }
  }
  var pageIndex = 0;
  while (pageIndex < verticallyPages.length) {
    var horizontallyPages = splitRectsByPages(verticallyPages[pageIndex], options.margin.left, 'x', 'w', (pagesLength, currentCoordinate) => roundToThreeDecimals(currentCoordinate) <= roundToThreeDecimals(maxBottomRight.x), (rect, currentPageMaxRectCoordinate, currentPageRects, rectsToSplit) => {
      var args = {
        sourceRect: rect,
        leftRect: {
          x: rect.x,
          y: rect.y,
          w: currentPageMaxRectCoordinate - rect.x,
          h: rect.h
        },
        rightRect: {
          x: currentPageMaxRectCoordinate,
          y: rect.y,
          w: rect.w - (currentPageMaxRectCoordinate - rect.x),
          h: rect.h
        }
      };
      onSeparateRectHorizontally(args);
      currentPageRects.push(args.leftRect);
      rectsToSplit.push(args.rightRect);
    });
    if (horizontallyPages.length > 1) {
      verticallyPages.splice(pageIndex, 1, ...horizontallyPages);
      pageIndex += horizontallyPages.length;
    } else {
      pageIndex += 1;
    }
  }
  return verticallyPages.map(rects => {
    return rects.map(rect => _extends({}, rect.sourceCellInfo, {
      _rect: rect
    }));
  });
}
function splitRectsByPages(rects, marginValue, coordinate, dimension, isFitToPage, onSeparateCallback, onSplitMultiPageRow) {
  var pages = [];
  var rectsToSplit = [...rects];
  var isFitToPageForMultiPageRow = (isFirstPage, rectHeight) => isFitToPage(isFirstPage, rectHeight + marginValue);
  var _loop = function _loop() {
    var currentPageMaxRectCoordinate = 0;
    var currentPageRects = rectsToSplit.filter(rect => {
      var currentRectCoordinate = rect[coordinate] + rect[dimension];
      if (isFitToPage(pages.length === 0, currentRectCoordinate)) {
        if (currentPageMaxRectCoordinate <= currentRectCoordinate) {
          currentPageMaxRectCoordinate = currentRectCoordinate;
        }
        return true;
      } else {
        return false;
      }
    });
    var isCurrentPageContainsOnlyHeader = checkPageContainsOnlyHeader(currentPageRects, pages.length === 0);
    var multiPageRowPages = getMultiPageRowPages(currentPageRects, rectsToSplit, isCurrentPageContainsOnlyHeader, onSplitMultiPageRow, isFitToPageForMultiPageRow);
    var rectsToSeparate = rectsToSplit.filter(rect => {
      // Check cells that have 'coordinate' less than 'currentPageMaxRectCoordinate'
      var currentRectLeft = rect[coordinate];
      var currentRectRight = rect[coordinate] + rect[dimension];
      return currentPageMaxRectCoordinate - currentRectLeft > COORDINATE_EPSILON && currentRectRight - currentPageMaxRectCoordinate > COORDINATE_EPSILON;
    });
    rectsToSeparate.forEach(rect => {
      onSeparateCallback(rect, currentPageMaxRectCoordinate, currentPageRects, rectsToSplit);
      var index = rectsToSplit.indexOf(rect);
      if (index !== -1) {
        rectsToSplit.splice(index, 1);
      }
    });
    currentPageRects.forEach(rect => {
      var index = rectsToSplit.indexOf(rect);
      if (index !== -1) {
        rectsToSplit.splice(index, 1);
      }
    });
    rectsToSplit.forEach(rect => {
      rect[coordinate] = isDefined(currentPageMaxRectCoordinate) ? rect[coordinate] - currentPageMaxRectCoordinate + marginValue : rect[coordinate];
    });
    var firstPageContainsHeaderAndMultiPageRow = isCurrentPageContainsOnlyHeader && multiPageRowPages.length > 0;
    if (firstPageContainsHeaderAndMultiPageRow) {
      var [firstPage, ...restOfPages] = multiPageRowPages;
      pages.push([...currentPageRects, ...firstPage]);
      pages.push(...restOfPages);
    } else if (currentPageRects.length > 0) {
      pages.push(currentPageRects);
      pages.push(...multiPageRowPages);
    } else if (multiPageRowPages.length > 0) {
      pages.push(...multiPageRowPages);
      pages.push(rectsToSplit);
    } else {
      pages.push(rectsToSplit);
      return 1; // break
    }
  };
  while (rectsToSplit.length > 0) {
    if (_loop()) break;
  }
  return pages;
}
export { splitByPages };