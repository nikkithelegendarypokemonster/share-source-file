/**
* DevExtreme (bundles/__internal/scheduler/__migration/components/base/group_panel_props.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelRowDefaultProps = exports.GroupPanelCellDefaultProps = exports.GroupPanelBaseDefaultProps = void 0;
const GroupPanelBaseDefaultProps = exports.GroupPanelBaseDefaultProps = {
  groupPanelData: {
    groupPanelItems: [],
    baseColSpan: 1
  },
  groupByDate: false,
  styles: {}
};
const GroupPanelCellDefaultProps = exports.GroupPanelCellDefaultProps = {
  id: 0,
  text: '',
  data: Object.freeze({
    id: 0
  }),
  className: ''
};
const GroupPanelRowDefaultProps = exports.GroupPanelRowDefaultProps = {
  groupItems: Object.freeze([]),
  className: ''
};
