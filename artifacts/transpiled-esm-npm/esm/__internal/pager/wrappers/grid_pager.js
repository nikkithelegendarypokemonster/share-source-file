/* eslint-disable @typescript-eslint/ban-types */
import { ComponentWrapper } from '../../core/r1/component_wrapper';
export class GridPagerWrapper extends ComponentWrapper {
  _optionChanged(args) {
    switch (args.name) {
      case 'pageIndex':
        {
          const pageIndexChanged = this.option('pageIndexChanged');
          if (pageIndexChanged) {
            pageIndexChanged(args.value);
          }
          break;
        }
      case 'pageSize':
        {
          const pageSizeChanged = this.option('pageSizeChanged');
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