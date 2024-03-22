"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateDelta = calculateDelta;
exports.convertSizeToRatio = convertSizeToRatio;
exports.findIndexOfNextVisibleItem = findIndexOfNextVisibleItem;
exports.findLastIndexOfVisibleItem = findLastIndexOfVisibleItem;
exports.getCurrentLayout = getCurrentLayout;
exports.getDefaultLayout = getDefaultLayout;
exports.getDimensionByOrientation = getDimensionByOrientation;
exports.getElementSize = getElementSize;
exports.getNewLayout = getNewLayout;
exports.getVisibleItems = getVisibleItems;
exports.getVisibleItemsCount = getVisibleItemsCount;
exports.isElementVisible = isElementVisible;
exports.normalizePanelSize = normalizePanelSize;
exports.setFlexProp = setFlexProp;
exports.updateItemsSize = updateItemsSize;
exports.validateLayout = validateLayout;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _size = require("../../../../core/utils/size");
var _style = require("../../../../core/utils/style");
var _type = require("../../../../core/utils/type");
var _number_comparison = require("./number_comparison");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FLEX_PROPERTY_NAME = 'flexGrow';
const ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};
function getCurrentLayout($items) {
  const itemsDistribution = [];
  $items.each((index, item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemsDistribution.push(parseFloat((0, _renderer.default)(item).css(FLEX_PROPERTY_NAME)));
    return true;
  });
  return itemsDistribution;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findLastIndexOfVisibleItem(items) {
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (items[i].visible !== false) {
      return i;
    }
  }
  return -1;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findIndexOfNextVisibleItem(items, index) {
  for (let i = index + 1; i < items.length; i += 1) {
    if (items[i].visible !== false) {
      return i;
    }
  }
  return -1;
}
function normalizePanelSize(paneRestrictions, size) {
  const {
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
  let adjustedSize = (0, _number_comparison.compareNumbersWithPrecision)(size, minSize) < 0 ? minSize : size;
  adjustedSize = Math.min(maxSize, adjustedSize);
  adjustedSize = parseFloat(adjustedSize.toFixed(_number_comparison.PRECISION));
  return adjustedSize;
}
// eslint-disable-next-line max-len
function findMaxAvailableDelta(increment, currentLayout, paneRestrictions, paneIndex) {
  let maxDelta = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  if (paneIndex < 0 || paneIndex >= paneRestrictions.length) {
    return maxDelta;
  }
  const prevSize = currentLayout[paneIndex];
  const maxPaneSize = normalizePanelSize(paneRestrictions[paneIndex], 100);
  const delta = maxPaneSize - prevSize;
  const nextMaxDelta = maxDelta + delta;
  return findMaxAvailableDelta(increment, currentLayout, paneRestrictions, paneIndex + increment, nextMaxDelta);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getNewLayout(currentLayout, delta, prevPaneIndex, paneRestrictions) {
  const nextLayout = [...currentLayout];
  const nextPaneIndex = prevPaneIndex + 1;
  let currentDelta = delta;
  const increment = currentDelta < 0 ? 1 : -1;
  let currentItemIndex = currentDelta < 0 ? nextPaneIndex : prevPaneIndex;
  // eslint-disable-next-line max-len
  const maxDelta = findMaxAvailableDelta(increment, currentLayout, paneRestrictions, currentItemIndex);
  const minAbsDelta = Math.min(Math.abs(currentDelta), Math.abs(maxDelta));
  let deltaApplied = 0;
  currentDelta = currentDelta < 0 ? -minAbsDelta : minAbsDelta;
  currentItemIndex = currentDelta < 0 ? prevPaneIndex : nextPaneIndex;
  while (currentItemIndex >= 0 && currentItemIndex < paneRestrictions.length) {
    const deltaRemaining = Math.abs(currentDelta) - Math.abs(deltaApplied);
    const prevSize = currentLayout[currentItemIndex];
    const unsafeSize = prevSize - deltaRemaining;
    const safeSize = normalizePanelSize(paneRestrictions[currentItemIndex], unsafeSize);
    if (!((0, _number_comparison.compareNumbersWithPrecision)(prevSize, safeSize) === 0)) {
      deltaApplied += prevSize - safeSize;
      nextLayout[currentItemIndex] = safeSize;
      if (parseFloat(deltaApplied.toFixed(_number_comparison.PRECISION)) >= parseFloat(Math.abs(currentDelta).toFixed(_number_comparison.PRECISION))) {
        break;
      }
    }
    if (currentDelta < 0) {
      currentItemIndex -= 1;
    } else {
      currentItemIndex += 1;
    }
  }
  if ((0, _number_comparison.compareNumbersWithPrecision)(deltaApplied, 0) === 0) {
    return currentLayout;
  }
  let pivotIndex = currentDelta < 0 ? nextPaneIndex : prevPaneIndex;
  let prevSize = currentLayout[pivotIndex];
  let unsafeSize = prevSize + deltaApplied;
  let safeSize = normalizePanelSize(paneRestrictions[pivotIndex], unsafeSize);
  nextLayout[pivotIndex] = safeSize;
  if (!((0, _number_comparison.compareNumbersWithPrecision)(safeSize, unsafeSize) === 0)) {
    let deltaRemaining = unsafeSize - safeSize;
    pivotIndex = currentDelta < 0 ? nextPaneIndex : prevPaneIndex;
    let index = pivotIndex;
    while (index >= 0 && index < paneRestrictions.length) {
      prevSize = nextLayout[index];
      unsafeSize = prevSize + deltaRemaining;
      safeSize = normalizePanelSize(paneRestrictions[index], unsafeSize);
      if (!((0, _number_comparison.compareNumbersWithPrecision)(prevSize, safeSize) === 0)) {
        deltaRemaining -= safeSize - prevSize;
        nextLayout[index] = safeSize;
      }
      if ((0, _number_comparison.compareNumbersWithPrecision)(deltaRemaining, 0) === 0) {
        break;
      }
      if (currentDelta > 0) {
        index -= 1;
      } else {
        index += 1;
      }
    }
  }
  const totalSize = nextLayout.reduce((total, size) => size + total, 0);
  if (!((0, _number_comparison.compareNumbersWithPrecision)(totalSize, 100, 3) === 0)) {
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
function getDimensionByOrientation(orientation) {
  return orientation === ORIENTATION.horizontal ? 'width' : 'height';
}
function calculateDelta(offset, orientation, rtlEnabled, totalWidth) {
  const delta = normalizeOffset(offset, orientation, rtlEnabled) / totalWidth * 100;
  return delta;
}
function setFlexProp(element, prop, value) {
  const normalizedProp = (0, _style.normalizeStyleProp)(prop, value);
  element.style[(0, _style.styleProp)(prop)] = normalizedProp;
}
function updateItemsSize(items, sizeDistribution) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items.each((index, item) => {
    setFlexProp(item, FLEX_PROPERTY_NAME, sizeDistribution[index]);
  });
}
// eslint-disable-next-line class-methods-use-this
function isPercentWidth(size) {
  return (0, _type.isString)(size) && size.endsWith('%');
}
// eslint-disable-next-line class-methods-use-this
function isPixelWidth(size) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (0, _type.isNumeric)(size) || (0, _type.isString)(size) && size.endsWith('px');
}
function calculatePercentage(totalSize, size) {
  if (totalSize === 0) {
    return 0;
  }
  const percentage = size / totalSize * 100;
  return percentage;
}
// We can do it better
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function convertSizeToRatio(size, totalPanesSize) {
  if (!(0, _type.isDefined)(size)) {
    return size;
  }
  const isPixel = isPixelWidth(size);
  const sizeNumber = parseFloat(size);
  if (isPixel) {
    return parseFloat(calculatePercentage(totalPanesSize, sizeNumber).toFixed(4));
  }
  const isPercentage = isPercentWidth(size);
  if (isPercentage) {
    return sizeNumber;
  }
  // todo: handle incorrect size input
  return 0;
}
function getDefaultLayout(layoutRestrictions) {
  const layout = new Array(layoutRestrictions.length).fill(0);
  let numPanelsWithSizes = 0;
  let remainingSize = 100;
  layoutRestrictions.forEach((panelConstraints, index) => {
    const {
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
    if ((0, _type.isDefined)(size)) {
      numPanelsWithSizes += 1;
      layout[index] = size;
      remainingSize -= size;
    }
  });
  layoutRestrictions.forEach((panelConstraints, index) => {
    const {
      size,
      visible,
      collapsed
    } = panelConstraints;
    if (size == null && visible !== false && collapsed !== true) {
      const numRemainingPanels = layoutRestrictions.length - numPanelsWithSizes;
      const newSize = remainingSize / numRemainingPanels;
      numPanelsWithSizes += 1;
      layout[index] = newSize;
      remainingSize -= newSize;
    }
  });
  return layout;
}
function adjustAndDistributeLayoutSize(layout, layoutRestrictions) {
  let remainingSize = 0;
  const nextLayout = layout.map((panelSize, index) => {
    const restriction = layoutRestrictions[index];
    const adjustedSize = normalizePanelSize(restriction, panelSize);
    remainingSize += panelSize - adjustedSize;
    return adjustedSize;
  });
  if ((0, _number_comparison.compareNumbersWithPrecision)(remainingSize, 0) !== 0) {
    for (let index = 0; index < nextLayout.length && (0, _number_comparison.compareNumbersWithPrecision)(remainingSize, 0) !== 0; index += 1) {
      const currentSize = nextLayout[index];
      const adjustedSize = normalizePanelSize(layoutRestrictions[index], currentSize + remainingSize);
      remainingSize -= adjustedSize - currentSize;
      nextLayout[index] = adjustedSize;
    }
  }
  return nextLayout;
}
function validateLayout(prevLayout, layoutRestrictions) {
  const nextLayout = [...prevLayout];
  const nextLayoutTotalSize = nextLayout.reduce((accumulated, current) => accumulated + current, 0);
  if (!((0, _number_comparison.compareNumbersWithPrecision)(nextLayoutTotalSize, 100) === 0)) {
    for (let index = 0; index < layoutRestrictions.length; index += 1) {
      const unsafeSize = nextLayout[index];
      const safeSize = 100 / nextLayoutTotalSize * unsafeSize;
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
  const size = orientation === ORIENTATION.horizontal ? (0, _size.getOuterWidth)($element) : (0, _size.getOuterHeight)($element);
  return size - handlesSizeSum;
}
function getVisibleItems(items) {
  return items.filter(p => p.visible !== false);
}
function getVisibleItemsCount(items) {
  return getVisibleItems(items).length;
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getElementSize($element, orientation, width, height, handlesSizeSum) {
  const sizeOption = orientation === ORIENTATION.horizontal ? width : height;
  if (isPixelWidth(sizeOption)) {
    return sizeOption - handlesSizeSum;
  }
  return getElementItemsSizeSum($element, orientation, handlesSizeSum);
}
function isElementVisible(element) {
  var _a;
  if (element) {
    return !!(element.offsetWidth || element.offsetHeight || ((_a = element.getClientRects) === null || _a === void 0 ? void 0 : _a.call(element).length));
  }
  return false;
}