/**
* DevExtreme (esm/integration/knockout/utils.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
// eslint-disable-next-line no-restricted-imports
import ko from 'knockout';
import $ from '../../core/renderer';
export var getClosestNodeWithContext = node => {
  var context = ko.contextFor(node);
  if (!context && node.parentNode) {
    return getClosestNodeWithContext(node.parentNode);
  }
  return node;
};
export var getClosestNodeWithKoCreation = node => {
  var $el = $(node);
  var data = $el.data();
  var hasFlag = data && data['dxKoCreation'];
  if (hasFlag) {
    return node;
  }
  if (node.parentNode) {
    return getClosestNodeWithKoCreation(node.parentNode);
  }
  return null;
};
