import registerComponent from '../../../core/component_registrator';
import { getWeekendsCount } from '../__migration/utils/index';
import { VIEWS } from '../m_constants';
import SchedulerTimelineWeek from './m_timeline_week';
var TIMELINE_CLASS = 'dx-scheduler-timeline-work-week';
var LAST_DAY_WEEK_INDEX = 5;
class SchedulerTimelineWorkWeek extends SchedulerTimelineWeek {
  get type() {
    return VIEWS.TIMELINE_WORK_WEEK;
  }
  constructor() {
    // @ts-expect-error
    super(...arguments);
    this._getWeekendsCount = getWeekendsCount;
  }
  _getElementClass() {
    return TIMELINE_CLASS;
  }
  _incrementDate(date) {
    var day = date.getDay();
    if (day === LAST_DAY_WEEK_INDEX) {
      date.setDate(date.getDate() + 2);
    }
    super._incrementDate(date);
  }
}
registerComponent('dxSchedulerTimelineWorkWeek', SchedulerTimelineWorkWeek);
export default SchedulerTimelineWorkWeek;