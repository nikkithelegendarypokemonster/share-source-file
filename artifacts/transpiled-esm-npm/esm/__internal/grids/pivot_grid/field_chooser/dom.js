import $ from '../../../../core/renderer';
import { getOuterWidth } from '../../../../core/utils/size';
import { ATTRIBUTES, CLASSES, SORTABLE_CONST } from './const';
// === Drag-N-Drop item render ===
function getTreeViewItem($sourceItem) {
  return $sourceItem.clone().addClass(CLASSES.area.box).css('width', parseFloat(getOuterWidth($sourceItem)));
}
function getAreaBoxItemArray($sourceItem, target) {
  var $itemArray = $sourceItem.clone();
  if (target === SORTABLE_CONST.targets.drag) {
    $sourceItem.each((idx, sourceItem) => {
      var width = parseFloat(getOuterWidth(sourceItem));
      $itemArray.eq(idx).css('width', width);
      return true;
    });
  }
  return $itemArray;
}
function getDefaultItem($sourceItem) {
  return $('<div>').addClass(CLASSES.area.field).addClass(CLASSES.area.box).text($sourceItem.text());
}
function getItemArray($sourceItem, target) {
  var isAreaBox = $sourceItem.hasClass(CLASSES.area.box);
  var isTreeList = $sourceItem.attr(ATTRIBUTES.treeViewItem);
  if (isAreaBox) {
    return getAreaBoxItemArray($sourceItem, target);
  }
  if (isTreeList) {
    return getTreeViewItem($sourceItem);
  }
  return getDefaultItem($sourceItem);
}
function wrapItemsInFieldsContainer($itemArray) {
  var $wrappedTmpContainer = $('<div>');
  $itemArray.each((_, item) => {
    var $wrappedItem = $('<div>').addClass(CLASSES.pivotGrid.fieldsContainer).addClass(CLASSES.widget).append($(item));
    $wrappedTmpContainer.append($wrappedItem);
    return true;
  });
  return $wrappedTmpContainer.children();
}
export function dragAndDropItemRender($sourceItem, target) {
  var $itemArray = getItemArray($sourceItem, target);
  if (target === SORTABLE_CONST.targets.drag) {
    return wrapItemsInFieldsContainer($itemArray);
  }
  return $itemArray;
}