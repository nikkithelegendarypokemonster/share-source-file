/**
* DevExtreme (esm/__internal/grids/grid_core/row_dragging/dom.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '../../../../core/renderer';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports,
import gridCoreUtils from '../m_utils';
import { CLASSES } from './const';
var createHandleTemplateFunc = addWidgetPrefix => (container, options) => {
  var $container = $(container);
  if (options.rowType === 'data') {
    $container.addClass(CLASSES.cellFocusDisabled);
    return $('<span>').addClass(addWidgetPrefix(CLASSES.handleIcon));
  }
  gridCoreUtils.setEmptyText($container);
  return undefined;
};
export var GridCoreRowDraggingDom = {
  createHandleTemplateFunc
};
