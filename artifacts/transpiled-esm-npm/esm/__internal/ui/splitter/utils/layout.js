import $ from '../../../../core/renderer';
import { getOuterHeight, getOuterWidth } from '../../../../core/utils/size';
import { normalizeStyleProp, styleProp } from '../../../../core/utils/style';
import { isDefined, isNumeric, isString } from '../../../../core/utils/type';
import { compareNumbersWithPrecision, PRECISION } from './number_comparison';
var FLEX_PROPERTY_NAME = 'flexGrow';
var ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};
export function getCurrentLayout($items) {
  var itemsDistribution = [];
  $items.each((index, item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemsDistribution.push(parseFloat($(item).css(FLEX_PROPERTY_NAME)));
    return true;
  });
  return itemsDistribution;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findLastIndexOfVisibleItem(items) {
  for (var i = items.length - 1; i >= 0; i -= 1) {
    if (items[i].visible !== false) {
      return i;
    }
  }
  return -1;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findIndexOfNextVisibleItem(items, index) {
  for (var i = index + 1; i < items.length; i += 1) {
    if (items[i].visible !== false) {
      return i;
    }
  }
  return -1;
}
export function normalizePanelSize(paneRestrictions, size) {
  var {
    minSize = 0,
    maxSize = 100,
    resizable
  } = paneRestrictions;
  if (paneRestrictions.collapsed === true) {
    return 0;
  }
  if (resizable === false) {
    return paneRestrictions.size;
  }
  var adjustedSize = compareNumbersWithPrecision(size, minSize) < 0 ? minSize : size;
  adjustedSize = Math.min(maxSize, adjustedSize);
  adjustedSize = parseFloat(adjustedSize.toFixed(PRECISION));
  return adjustedSize;
}
// eslint-disable-next-line max-len
function findMaxAvailableDelta(increment, currentLayout, paneRestrictions, paneIndex) {
  var maxDelta = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  if (paneIndex < 0 || paneIndex >= paneRestrictions.length) {
    return maxDelta;
  }
  var prevSize = currentLayout[paneIndex];
  var maxPaneSize = normalizePanelSize(paneRestrictions[paneIndex], 100);
  var delta = maxPaneSize - prevSize;
  var nextMaxDelta = maxDelta + delta;
  return findMaxAvailableDelta(increment, currentLayout, paneRestrictions, paneIndex + increment, nextMaxDelta);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getNewLayout(currentLayout, delta, prevPaneIndex, paneRestrictions) {
  var nextLayout = [...currentLayout];
  var nextPaneIndex = prevPaneIndex + 1;
  var currentDelta = delta;
  var increment = currentDelta < 0 ? 1 : -1;
  var currentItemIndex = currentDelta < 0 ? nextPaneIndex : prevPaneIndex;
  // eslint-disable-next-line max-len
  var maxDelta = findMaxAvailableDelta(increment, currentLayout, paneRestrictions, currentItemIndex);
  var minAbsDelta = Math.min(Math.abs(currentDelta), Math.abs(maxDelta));
  var deltaApplied = 0;
  currentDelta = currentDelta < 0 ? -minAbsDelta : minAbsDelta;
  currentItemIndex = currentDelta < 0 ? prevPaneIndex : nextPaneIndex;
  while (currentItemIndex >= 0 && currentItemIndex < paneRestrictions.length) {
    var deltaRemaining = Math.abs(currentDelta) - Math.abs(deltaApplied);
    var _prevSize = currentLayout[currentItemIndex];
    var _unsafeSize = _prevSize - deltaRemaining;
    var _safeSize = normalizePanelSize(paneRestrictions[currentItemIndex], _unsafeSize);
    if (!(compareNumbersWithPrecision(_prevSize, _safeSize) === 0)) {
      deltaApplied += _prevSize - _safeSize;
      nextLayout[currentItemIndex] = _safeSize;
      if (parseFloat(deltaApplied.toFixed(PRECISION)) >= parseFloat(Math.abs(currentDelta).toFixed(PRECISION))) {
        break;
      }
    }
    if (currentDelta < 0) {
      currentItemIndex -= 1;
    } else {
      currentItemIndex += 1;
    }
  }
  if (compareNumbersWithPrecision(deltaApplied, 0) === 0) {
    return currentLayout;
  }
  var pivotIndex = currentDelta < 0 ? nextPaneIndex : prevPaneIndex;
  var prevSize = currentLayout[pivotIndex];
  var unsafeSize = prevSize + deltaApplied;
  var safeSize = normalizePanelSize(paneRestrictions[pivotIndex], unsafeSize);
  nextLayout[pivotIndex] = safeSize;
  if (!(compareNumbersWithPrecision(safeSize, unsafeSize) === 0)) {
    var _deltaRemaining = unsafeSize - safeSize;
    pivotIndex = currentDelta < 0 ? nextPaneIndex : prevPaneIndex;
    var index = pivotIndex;
    while (index >= 0 && index < paneRestrictions.length) {
      prevSize = nextLayout[index];
      unsafeSize = prevSize + _deltaRemaining;
      safeSize = normalizePanelSize(paneRestrictions[index], unsafeSize);
      if (!(compareNumbersWithPrecision(prevSize, safeSize) === 0)) {
        _deltaRemaining -= safeSize - prevSize;
        nextLayout[index] = safeSize;
      }
      if (compareNumbersWithPrecision(_deltaRemaining, 0) === 0) {
        break;
      }
      if (currentDelta > 0) {
        index -= 1;
      } else {
        index += 1;
      }
    }
  }
  var totalSize = nextLayout.reduce((total, size) => size + total, 0);
  if (!(compareNumbersWithPrecision(totalSize, 100, 3) === 0)) {
    return currentLayout;
  }
  return nextLayout;
}
function normalizeOffset(offset, orientation, rtlEnabled) {
  var _a, _b;
  if (orientation === ORIENTATION.vertical) {
    return (_a = offset.y) !== null && _a !== void 0 ? _a : 0;
  }
  return (rtlEnabled ? -1 : 1) * ((_b = offset.x) !== null && _b !== void 0 ? _b : 0);
}
export function getDimensionByOrientation(orientation) {
  return orientation === ORIENTATION.horizontal ? 'width' : 'height';
}
export function calculateDelta(offset, orientation, rtlEnabled, totalWidth) {
  var delta = normalizeOffset(offset, orientation, rtlEnabled) / totalWidth * 100;
  return delta;
}
export function setFlexProp(element, prop, value) {
  var normalizedProp = normalizeStyleProp(prop, value);
  element.style[styleProp(prop)] = normalizedProp;
}
export function updateItemsSize(items, sizeDistribution) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items.each((index, item) => {
    setFlexProp(item, FLEX_PROPERTY_NAME, sizeDistribution[index]);
  });
}
// eslint-disable-next-line class-methods-use-this
function isPercentWidth(size) {
  return isString(size) && size.endsWith('%');
}
// eslint-disable-next-line class-methods-use-this
function isPixelWidth(size) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return isNumeric(size) || isString(size) && size.endsWith('px');
}
function calculatePercentage(totalSize, size) {
  if (totalSize === 0) {
    return 0;
  }
  var percentage = size / totalSize * 100;
  return percentage;
}
// We can do it better
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function convertSizeToRatio(size, totalPanesSize) {
  if (!isDefined(size)) {
    return size;
  }
  var isPixel = isPixelWidth(size);
  var sizeNumber = parseFloat(size);
  if (isPixel) {
    return parseFloat(calculatePercentage(totalPanesSize, sizeNumber).toFixed(4));
  }
  var isPercentage = isPercentWidth(size);
  if (isPercentage) {
    return sizeNumber;
  }
  // todo: handle incorrect size input
  return 0;
}
export function getDefaultLayout(layoutRestrictions) {
  var layout = new Array(layoutRestrictions.length).fill(0);
  var numPanelsWithSizes = 0;
  var remainingSize = 100;
  layoutRestrictions.forEach((panelConstraints, index) => {
    var {
      size,
      visible,
      collapsed
    } = panelConstraints;
    if (visible === false) {
      numPanelsWithSizes += 1;
      layout[index] = 0;
      remainingSize -= 0;
      return;
    }
    if (collapsed === true) {
      numPanelsWithSizes += 1;
      layout[index] = 0;
      remainingSize -= 0;
      return;
    }
    if (isDefined(size)) {
      numPanelsWithSizes += 1;
      layout[index] = size;
      remainingSize -= size;
    }
  });
  layoutRestrictions.forEach((panelConstraints, index) => {
    var {
      size,
      visible,
      collapsed
    } = panelConstraints;
    if (size == null && visible !== false && collapsed !== true) {
      var numRemainingPanels = layoutRestrictions.length - numPanelsWithSizes;
      var newSize = remainingSize / numRemainingPanels;
      numPanelsWithSizes += 1;
      layout[index] = newSize;
      remainingSize -= newSize;
    }
  });
  return layout;
}
function adjustAndDistributeLayoutSize(layout, layoutRestrictions) {
  var remainingSize = 0;
  var nextLayout = layout.map((panelSize, index) => {
    var restriction = layoutRestrictions[index];
    var adjustedSize = normalizePanelSize(restriction, panelSize);
    remainingSize += panelSize - adjustedSize;
    return adjustedSize;
  });
  if (compareNumbersWithPrecision(remainingSize, 0) !== 0) {
    for (var index = 0; index < nextLayout.length && compareNumbersWithPrecision(remainingSize, 0) !== 0; index += 1) {
      var currentSize = nextLayout[index];
      var adjustedSize = normalizePanelSize(layoutRestrictions[index], currentSize + remainingSize);
      remainingSize -= adjustedSize - currentSize;
      nextLayout[index] = adjustedSize;
    }
  }
  return nextLayout;
}
export function validateLayout(prevLayout, layoutRestrictions) {
  var nextLayout = [...prevLayout];
  var nextLayoutTotalSize = nextLayout.reduce((accumulated, current) => accumulated + current, 0);
  if (!(compareNumbersWithPrecision(nextLayoutTotalSize, 100) === 0)) {
    for (var index = 0; index < layoutRestrictions.length; index += 1) {
      var unsafeSize = nextLayout[index];
      var safeSize = 100 / nextLayoutTotalSize * unsafeSize;
      nextLayout[index] = safeSize;
    }
  }
  return adjustAndDistributeLayoutSize(nextLayout, layoutRestrictions);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// export function getInitialLayout(panes, totalPanesSize: number): number[] {
//   const layout: number[] = [];
//   let totalSize = 0;
//   let sizeOverflow = false;
//   // eslint-disable-next-line no-restricted-syntax
//   for (const pane of panes) {
//     if (pane.visible === false || sizeOverflow || pane.size === 0) {
//       layout.push(0);
//       // todo: refactor
//     } else if (pane.size && (isPercentWidth(pane.size) || isPixelWidth(pane.size))) {
//       let ratio = convertSizeToRatio(pane.size, totalPanesSize) ?? 0;
//       ratio = Math.min(100 - totalSize, ratio);
//       totalSize += ratio;
//       layout.push(ratio);
//       if (totalSize >= 100) {
//         sizeOverflow = true;
//       }
//     } else {
//       layout.push(-1);
//     }
//   }
//   const noSizePanes = panes.filter((p) => p.visible !== false && !p.size && p.size !== 0);
//   if (noSizePanes.length) {
//     const remainingSpace = Math.max(100 - totalSize, 0);
//     layout.forEach((pane, index) => {
//       if (layout[index] === -1) {
//         layout[index] = remainingSpace / noSizePanes.length;
//       }
//     });
//   } else if (totalSize < 100) {
//     layout[findLastIndexOfVisibleItem(panes)] += 100 - totalSize;
//   }
//   return layout;
// }
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getElementItemsSizeSum($element, orientation, handlesSizeSum) {
  var size = orientation === ORIENTATION.horizontal ? getOuterWidth($element) : getOuterHeight($element);
  return size - handlesSizeSum;
}
export function getVisibleItems(items) {
  return items.filter(p => p.visible !== false);
}
export function getVisibleItemsCount(items) {
  return getVisibleItems(items).length;
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getElementSize($element, orientation, width, height, handlesSizeSum) {
  var sizeOption = orientation === ORIENTATION.horizontal ? width : height;
  if (isPixelWidth(sizeOption)) {
    return sizeOption - handlesSizeSum;
  }
  return getElementItemsSizeSum($element, orientation, handlesSizeSum);
}
export function isElementVisible(element) {
  var _a;
  if (element) {
    return !!(element.offsetWidth || element.offsetHeight || ((_a = element.getClientRects) === null || _a === void 0 ? void 0 : _a.call(element).length));
  }
  return false;
}