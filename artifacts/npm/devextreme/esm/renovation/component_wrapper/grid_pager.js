/**
* DevExtreme (esm/renovation/component_wrapper/grid_pager.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Component from './common/component';
export class GridPagerWrapper extends Component {
  _optionChanged(args) {
    switch (args.name) {
      case 'pageIndex':
        {
          var pageIndexChanged = this.option('pageIndexChanged');
          if (pageIndexChanged) {
            pageIndexChanged(args.value);
          }
          break;
        }
      case 'pageSize':
        {
          var pageSizeChanged = this.option('pageSizeChanged');
          if (pageSizeChanged) {
            pageSizeChanged(args.value);
          }
          break;
        }
      default:
        break;
    }
    super._optionChanged(args);
  }
}
