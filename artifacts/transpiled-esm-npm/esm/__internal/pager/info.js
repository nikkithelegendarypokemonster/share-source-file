import { createVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { createRef as infernoCreateRef } from 'inferno';
import { format } from '../../core/utils/string';
import messageLocalization from '../../localization/message';
import { PagerDefaultProps } from './common/pager_props';
export const PAGER_INFO_CLASS = 'dx-info';
const InfoTextDefaultProps = {
  pageCount: PagerDefaultProps.pageCount,
  pageIndex: PagerDefaultProps.pageIndex,
  totalCount: PagerDefaultProps.totalCount
};
export class InfoText extends BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this.state = {};
    this.refs = null;
    // eslint-disable-next-line max-len
    this.rootElementRef = infernoCreateRef();
  }
  getInfoText() {
    return this.props.infoText ?? messageLocalization.getFormatter('dxPager-infoText')();
  }
  getText() {
    const {
      pageCount,
      pageIndex,
      totalCount
    } = this.props;
    return format(this.getInfoText(), (pageIndex + 1).toString(), pageCount === null || pageCount === void 0 ? void 0 : pageCount.toString(), totalCount === null || totalCount === void 0 ? void 0 : totalCount.toString());
  }
  render() {
    return createVNode(1, "div", PAGER_INFO_CLASS, this.getText(), 0, null, null, this.props.rootElementRef);
  }
}
InfoText.defaultProps = InfoTextDefaultProps;