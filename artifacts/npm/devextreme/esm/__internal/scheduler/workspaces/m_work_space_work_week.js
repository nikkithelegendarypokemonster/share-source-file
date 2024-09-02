/**
* DevExtreme (esm/__internal/scheduler/workspaces/m_work_space_work_week.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import registerComponent from '../../../core/component_registrator';
import { getWeekendsCount } from '../../scheduler/r1/utils/index';
import { VIEWS } from '../m_constants';
import SchedulerWorkSpaceWeek from './m_work_space_week';
const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';
class SchedulerWorkSpaceWorkWeek extends SchedulerWorkSpaceWeek {
  get type() {
    return VIEWS.WORK_WEEK;
  }
  constructor() {
    // @ts-expect-error
    super(...arguments);
    this._getWeekendsCount = getWeekendsCount;
  }
  _getElementClass() {
    return WORK_WEEK_CLASS;
  }
}
registerComponent('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek);
export default SchedulerWorkSpaceWorkWeek;
