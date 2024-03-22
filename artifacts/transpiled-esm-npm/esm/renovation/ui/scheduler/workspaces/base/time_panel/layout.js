import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["groupOrientation", "tableRef", "timeCellTemplate", "timePanelData"];
import { createFragment, createComponentVNode, normalizeProps } from "inferno";
import { Fragment } from 'inferno';
import { InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { Row } from '../row';
import { TimePanelCell } from './cell';
import { CellBase } from '../cell';
import { Table } from '../table';
import { AllDayPanelTitle } from '../date_table/all_day_panel/title';
export var viewFunction = _ref => {
  var {
    bottomVirtualRowHeight,
    props: {
      tableRef,
      timeCellTemplate,
      timePanelData
    },
    restAttributes,
    topVirtualRowHeight
  } = _ref;
  return normalizeProps(createComponentVNode(2, Table, _extends({}, restAttributes, {
    "topVirtualRowHeight": topVirtualRowHeight,
    "bottomVirtualRowHeight": bottomVirtualRowHeight,
    "virtualCellsCount": 1,
    "className": "dx-scheduler-time-panel",
    "tableRef": tableRef,
    children: timePanelData.groupedData.map(_ref2 => {
      var {
        dateTable,
        groupIndex,
        isGroupedAllDayPanel,
        key: fragmentKey
      } = _ref2;
      return createFragment([isGroupedAllDayPanel && createComponentVNode(2, Row, {
        children: createComponentVNode(2, CellBase, {
          "className": "dx-scheduler-time-panel-title-cell",
          children: createComponentVNode(2, AllDayPanelTitle)
        })
      }), dateTable.map(cell => {
        var {
          groups,
          highlighted,
          index: cellIndex,
          isFirstGroupCell,
          isLastGroupCell,
          key,
          startDate,
          text
        } = cell;
        return createComponentVNode(2, Row, {
          "className": "dx-scheduler-time-panel-row",
          children: createComponentVNode(2, TimePanelCell, {
            "startDate": startDate,
            "text": text,
            "groups": groups,
            "groupIndex": groupIndex,
            "isFirstGroupCell": isFirstGroupCell,
            "isLastGroupCell": isLastGroupCell,
            "index": cellIndex,
            "timeCellTemplate": timeCellTemplate,
            "highlighted": highlighted
          })
        }, key);
      })], 0, fragmentKey);
    })
  })));
};
export var TimePanelLayoutProps = {
  timePanelData: Object.freeze({
    groupedData: [],
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0
  })
};
import { createReRenderEffect } from '@devextreme/runtime/inferno';
var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class TimePanelTableLayout extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  createEffects() {
    return [createReRenderEffect()];
  }
  get topVirtualRowHeight() {
    var _this$props$timePanel;
    return (_this$props$timePanel = this.props.timePanelData.topVirtualRowHeight) !== null && _this$props$timePanel !== void 0 ? _this$props$timePanel : 0;
  }
  get bottomVirtualRowHeight() {
    var _this$props$timePanel2;
    return (_this$props$timePanel2 = this.props.timePanelData.bottomVirtualRowHeight) !== null && _this$props$timePanel2 !== void 0 ? _this$props$timePanel2 : 0;
  }
  get restAttributes() {
    var _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        timeCellTemplate: getTemplate(props.timeCellTemplate)
      }),
      topVirtualRowHeight: this.topVirtualRowHeight,
      bottomVirtualRowHeight: this.bottomVirtualRowHeight,
      restAttributes: this.restAttributes
    });
  }
}
TimePanelTableLayout.defaultProps = TimePanelLayoutProps;