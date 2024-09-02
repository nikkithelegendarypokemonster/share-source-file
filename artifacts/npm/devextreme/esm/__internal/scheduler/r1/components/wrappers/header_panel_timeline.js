/**
* DevExtreme (esm/__internal/scheduler/r1/components/wrappers/header_panel_timeline.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import registerComponent from '../../../../../core/component_registrator';
import { HeaderPanelTimeline } from '../timeline/header_panel_timeline';
import { HeaderPanelComponent } from './header_panel';
export class HeaderPanelTimelineComponent extends HeaderPanelComponent {
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ['dateCellTemplate', 'timeCellTemplate', 'dateHeaderTemplate', 'resourceCellTemplate'],
      props: ['viewContext', 'dateHeaderData', 'isRenderDateHeader', 'dateCellTemplate', 'timeCellTemplate', 'dateHeaderTemplate', 'groups', 'groupOrientation', 'groupPanelData', 'groupByDate', 'height', 'className', 'resourceCellTemplate']
    };
  }
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-enable @typescript-eslint/explicit-function-return-type */
  get _viewComponent() {
    return HeaderPanelTimeline;
  }
}
registerComponent('dxTimelineHeaderPanelLayout', HeaderPanelTimelineComponent);
