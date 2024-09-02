import { createVNode, createComponentVNode } from "inferno";
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '../../../../core/r1/utils/index';
import { combineClasses } from '../../../../core/r1/utils/render_utils';
import { renderUtils } from '../../utils/index';
import { CellBase, CellBaseDefaultProps } from './cell';
export class TimePanelCell extends BaseInfernoComponent {
  constructor() {
    super(...arguments);
    this.timeCellTemplateProps = null;
  }
  getTimeCellTemplateProps() {
    if (this.timeCellTemplateProps !== null) {
      return this.timeCellTemplateProps;
    }
    const {
      groupIndex,
      groups,
      index,
      startDate,
      text
    } = this.props;
    this.timeCellTemplateProps = {
      data: {
        date: startDate,
        groups,
        groupIndex,
        text
      },
      index
    };
    return this.timeCellTemplateProps;
  }
  componentWillUpdate(nextProps) {
    if (this.props.groupIndex !== nextProps.groupIndex || this.props.groups !== nextProps.groups || this.props.index !== nextProps.index || this.props.startDate !== nextProps.startDate || this.props.text !== nextProps.text) {
      this.timeCellTemplateProps = null;
    }
  }
  render() {
    const {
      className,
      viewContext,
      highlighted,
      isFirstGroupCell,
      isLastGroupCell,
      text,
      timeCellTemplate
    } = this.props;
    const cellSizeVerticalClass = renderUtils.getCellSizeVerticalClass(false);
    const classes = combineClasses({
      'dx-scheduler-time-panel-cell': true,
      [cellSizeVerticalClass]: true,
      'dx-scheduler-time-panel-current-time-cell': !!highlighted,
      [className ?? '']: true
    });
    const timeCellTemplateProps = this.getTimeCellTemplateProps();
    const TimeCellTemplateComponent = getTemplate(timeCellTemplate);
    return (// @ts-ignore
      createComponentVNode(2, CellBase, {
        "className": classes,
        "viewContext": viewContext,
        "isFirstGroupCell": isFirstGroupCell,
        "isLastGroupCell": isLastGroupCell,
        "startDate": CellBaseDefaultProps.startDate,
        "endDate": CellBaseDefaultProps.endDate,
        "index": CellBaseDefaultProps.index,
        children: TimeCellTemplateComponent ? TimeCellTemplateComponent({
          index: timeCellTemplateProps.index,
          data: timeCellTemplateProps.data
        }) : createVNode(1, "div", null, text, 0)
      })
    );
  }
}
TimePanelCell.defaultProps = CellBaseDefaultProps;