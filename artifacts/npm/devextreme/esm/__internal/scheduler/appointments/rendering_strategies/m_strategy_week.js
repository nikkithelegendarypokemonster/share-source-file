/**
* DevExtreme (esm/__internal/scheduler/appointments/rendering_strategies/m_strategy_week.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import VerticalRenderingStrategy from './m_strategy_vertical';
class WeekAppointmentRenderingStrategy extends VerticalRenderingStrategy {
  isApplyCompactAppointmentOffset() {
    if (this.isAdaptive && this._getMaxAppointmentCountPerCellByType() === 0) {
      return false;
    }
    return this.supportCompactDropDownAppointments();
  }
}
export default WeekAppointmentRenderingStrategy;
