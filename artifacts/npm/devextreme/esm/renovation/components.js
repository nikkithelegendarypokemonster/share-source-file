/**
* DevExtreme (esm/renovation/components.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable import/no-commonjs */
// pathToWrapper should contains named export - WrapperWidget. WrapperWidget is predefined.
// Default export doesnt work
module.exports = [{
  name: 'Button',
  pathInRenovationFolder: 'ui/button.j',
  pathInJSFolder: 'ui/button.js'
}, {
  name: 'CheckBox',
  pathInRenovationFolder: 'ui/editors/check_box/check_box.j',
  pathInJSFolder: 'ui/check_box.js'
}
// { name: 'Widget', pathInRenovationFolder: 'ui/widget.j' },
// { name: 'ScrollView', pathInRenovationFolder: 'ui/scroll_view/scroll_view.j', pathInJSFolder: 'ui/scroll_view.js', pathToWrapper: '/testing/helpers/renovationScrollViewHelper.js', inProgress: true },
// { name: 'Scrollable', pathInRenovationFolder: 'ui/scroll_view/scrollable.j', pathInJSFolder: 'ui/scroll_view/ui.scrollable.js', pathToWrapper: '/testing/helpers/renovationScrollableHelper.js', inProgress: true },
// { name: 'DataGrid', pathInRenovationFolder: 'ui/grids/data_grid/data_grid.j', pathInJSFolder: 'ui/data_grid.js' },
// { name: 'Scheduler', pathInRenovationFolder: 'ui/scheduler/scheduler.j', pathInJSFolder: 'ui/scheduler.js', inProgress: true },
// { name: 'Pager', pathInRenovationFolder: 'ui/pager/pager.j', pathInJSFolder: 'ui/pager.js', pathToWrapper: '/packages/devextreme/testing/helpers/renovationPagerHelper.js' },
// { name: 'Bullet', pathInRenovationFolder: 'viz/sparklines/bullet.j', pathInJSFolder: 'viz/sparklines/bullet.js' },
];
