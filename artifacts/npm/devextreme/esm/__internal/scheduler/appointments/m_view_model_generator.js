/**
* DevExtreme (esm/__internal/scheduler/appointments/m_view_model_generator.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { dateUtilsTs } from '../../core/utils/date';
import { getAppointmentKey } from '../__migration/utils/index';
import AgendaAppointmentsStrategy from './rendering_strategies/m_strategy_agenda';
import HorizontalAppointmentsStrategy from './rendering_strategies/m_strategy_horizontal';
import HorizontalMonthAppointmentsStrategy from './rendering_strategies/m_strategy_horizontal_month';
import HorizontalMonthLineAppointmentsStrategy from './rendering_strategies/m_strategy_horizontal_month_line';
import VerticalAppointmentsStrategy from './rendering_strategies/m_strategy_vertical';
import WeekAppointmentRenderingStrategy from './rendering_strategies/m_strategy_week';
var RENDERING_STRATEGIES = {
  horizontal: HorizontalAppointmentsStrategy,
  horizontalMonth: HorizontalMonthAppointmentsStrategy,
  horizontalMonthLine: HorizontalMonthLineAppointmentsStrategy,
  vertical: VerticalAppointmentsStrategy,
  week: WeekAppointmentRenderingStrategy,
  agenda: AgendaAppointmentsStrategy
};
export class AppointmentViewModelGenerator {
  initRenderingStrategy(options) {
    var RenderingStrategy = RENDERING_STRATEGIES[options.appointmentRenderingStrategyName];
    this.renderingStrategy = new RenderingStrategy(options);
  }
  generate(filteredItems, options) {
    var {
      viewOffset
    } = options;
    var appointments = filteredItems ? filteredItems.slice() : [];
    this.initRenderingStrategy(options);
    var renderingStrategy = this.getRenderingStrategy();
    var positionMap = renderingStrategy.createTaskPositionMap(appointments); // TODO - appointments are mutated inside!
    var shiftedViewModel = this.postProcess(appointments, positionMap);
    var viewModel = this.unshiftViewModelAppointmentsByViewOffset(shiftedViewModel, viewOffset);
    return {
      positionMap,
      viewModel
    };
  }
  postProcess(filteredItems, positionMap) {
    var renderingStrategy = this.getRenderingStrategy();
    return filteredItems.map((data, index) => {
      // TODO research do we need this code
      if (!renderingStrategy.keepAppointmentSettings()) {
        delete data.settings;
      }
      // TODO Seems we can analize direction in the rendering strategies
      var appointmentSettings = positionMap[index];
      appointmentSettings.forEach(item => {
        item.direction = renderingStrategy.getDirection() === 'vertical' && !item.allDay ? 'vertical' : 'horizontal';
      });
      var item = {
        itemData: data,
        settings: appointmentSettings
      };
      item.needRepaint = true;
      item.needRemove = false;
      return item;
    });
  }
  makeRenovatedViewModels(viewModel, supportAllDayRow, isVerticalGrouping) {
    var strategy = this.getRenderingStrategy();
    var regularViewModels = [];
    var allDayViewModels = [];
    var compactOptions = [];
    var isAllDayPanel = supportAllDayRow && !isVerticalGrouping;
    viewModel.forEach(_ref => {
      var {
        itemData,
        settings
      } = _ref;
      settings.forEach(options => {
        var item = this.prepareViewModel(options, strategy, itemData);
        if (options.isCompact) {
          compactOptions.push({
            compactViewModel: options.virtual,
            appointmentViewModel: item
          });
        } else if (options.allDay && isAllDayPanel) {
          allDayViewModels.push(item);
        } else {
          regularViewModels.push(item);
        }
      });
    });
    var compactViewModels = this.prepareCompactViewModels(compactOptions, supportAllDayRow);
    var result = _extends({
      allDay: allDayViewModels,
      regular: regularViewModels
    }, compactViewModels);
    return result;
  }
  prepareViewModel(options, strategy, itemData) {
    var geometry = strategy.getAppointmentGeometry(options);
    var viewModel = {
      key: getAppointmentKey(geometry),
      appointment: itemData,
      geometry: _extends(_extends({}, geometry), {
        // TODO move to the rendering strategies
        leftVirtualWidth: options.leftVirtualWidth,
        topVirtualHeight: options.topVirtualHeight
      }),
      info: _extends(_extends({}, options.info), {
        allDay: options.allDay,
        direction: options.direction,
        appointmentReduced: options.appointmentReduced,
        groupIndex: options.groupIndex
      })
    };
    return viewModel;
  }
  getCompactViewModelFrame(compactViewModel) {
    return {
      isAllDay: !!compactViewModel.isAllDay,
      isCompact: compactViewModel.isCompact,
      groupIndex: compactViewModel.groupIndex,
      geometry: {
        left: compactViewModel.left,
        top: compactViewModel.top,
        width: compactViewModel.width,
        height: compactViewModel.height
      },
      items: {
        colors: [],
        data: [],
        settings: []
      }
    };
  }
  prepareCompactViewModels(compactOptions, supportAllDayRow) {
    var regularCompact = {};
    var allDayCompact = {};
    compactOptions.forEach(_ref2 => {
      var {
        compactViewModel,
        appointmentViewModel
      } = _ref2;
      var {
        index,
        isAllDay
      } = compactViewModel;
      var viewModel = isAllDay && supportAllDayRow ? allDayCompact : regularCompact;
      if (!viewModel[index]) {
        viewModel[index] = this.getCompactViewModelFrame(compactViewModel);
      }
      var {
        settings,
        data,
        colors
      } = viewModel[index].items;
      settings.push(appointmentViewModel);
      data.push(appointmentViewModel.appointment);
      colors.push(appointmentViewModel.info.resourceColor);
    });
    var toArray = items => Object.keys(items).map(key => _extends({
      key
    }, items[key]));
    var allDayViewModels = toArray(allDayCompact);
    var regularViewModels = toArray(regularCompact);
    return {
      allDayCompact: allDayViewModels,
      regularCompact: regularViewModels
    };
  }
  getRenderingStrategy() {
    return this.renderingStrategy;
  }
  // NOTE: Unfortunately, we cannot implement immutable behavior here
  // because in this case it will break the refs (keys) of dataSource's appointments,
  // and it will break appointment updates :(
  unshiftViewModelAppointmentsByViewOffset(viewModel, viewOffset) {
    var _a, _b;
    var processedAppointments = new Set();
    // eslint-disable-next-line no-restricted-syntax
    for (var model of viewModel) {
      // eslint-disable-next-line no-restricted-syntax
      for (var setting of (_a = model.settings) !== null && _a !== void 0 ? _a : []) {
        // eslint-disable-next-line prefer-destructuring
        var appointment = (_b = setting === null || setting === void 0 ? void 0 : setting.info) === null || _b === void 0 ? void 0 : _b.appointment;
        if (appointment && !processedAppointments.has(appointment)) {
          appointment.startDate = dateUtilsTs.addOffsets(appointment.startDate, [viewOffset]);
          appointment.endDate = dateUtilsTs.addOffsets(appointment.endDate, [viewOffset]);
          appointment.normalizedEndDate = dateUtilsTs.addOffsets(appointment.normalizedEndDate, [viewOffset]);
          processedAppointments.add(appointment);
        }
      }
    }
    return viewModel;
  }
}
