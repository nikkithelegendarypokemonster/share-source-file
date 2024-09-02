/**
* DevExtreme (esm/__internal/scheduler/m_utils.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { getPublicElement } from '../../core/element';
import $ from '../../core/renderer';
import { compileGetter, compileSetter } from '../../core/utils/data';
import dateSerialization from '../../core/utils/date_serialization';
import { each } from '../../core/utils/iterator';
import { getOuterHeight, setHeight, setWidth } from '../../core/utils/size';
import { APPOINTMENT_SETTINGS_KEY } from './m_constants';
export const utils = {
  dataAccessors: {
    getAppointmentSettings: element => $(element).data(APPOINTMENT_SETTINGS_KEY),
    getAppointmentInfo: element => {
      const settings = utils.dataAccessors.getAppointmentSettings(element);
      return settings === null || settings === void 0 ? void 0 : settings.info;
    },
    create: (fields, currentDataAccessors, forceIsoDateParsing, dateSerializationFormat) => {
      const isDateField = field => field === 'startDate' || field === 'endDate';
      const defaultDataAccessors = {
        getter: {},
        setter: {},
        expr: {}
      };
      const dataAccessors = currentDataAccessors ? _extends({}, currentDataAccessors) : defaultDataAccessors;
      each(fields, (name, expr) => {
        if (expr) {
          const getter = compileGetter(expr);
          const setter = compileSetter(expr);
          let dateGetter;
          let dateSetter;
          let serializationFormat;
          if (isDateField(name)) {
            dateGetter = object => {
              let value = getter(object);
              if (forceIsoDateParsing) {
                value = dateSerialization.deserializeDate(value);
              }
              return value;
            };
            dateSetter = (object, value) => {
              if (dateSerializationFormat) {
                serializationFormat = dateSerializationFormat;
              } else if (forceIsoDateParsing && !serializationFormat) {
                const oldValue = getter(object);
                serializationFormat = dateSerialization.getDateSerializationFormat(oldValue);
              }
              const newValue = dateSerialization.serializeDate(value, serializationFormat);
              setter(object, newValue);
            };
          }
          dataAccessors.getter[name] = dateGetter || getter;
          dataAccessors.setter[name] = dateSetter || setter;
          dataAccessors.expr[`${name}Expr`] = expr;
        } else {
          /* eslint-disable @typescript-eslint/no-dynamic-delete */
          delete dataAccessors.getter[name];
          delete dataAccessors.setter[name];
          delete dataAccessors.expr[`${name}Expr`];
          /* eslint-enable @typescript-eslint/no-dynamic-delete */
        }
      });
      return dataAccessors;
    }
  },
  DOM: {
    getHeaderHeight: header => header ? header._$element && parseInt(getOuterHeight(header._$element), 10) : 0
  },
  renovation: {
    renderComponent: (widget, parentElement, componentClass, componentName, viewModel) => {
      let component = widget[componentName];
      if (!component) {
        const container = getPublicElement(parentElement);
        component = widget._createComponent(container, componentClass, viewModel);
        widget[componentName] = component;
      } else {
        // TODO: this is a workaround for setTablesSizes. Remove after CSS refactoring
        const $element = component.$element();
        const elementStyle = $element.get(0).style;
        const {
          height
        } = elementStyle;
        const {
          width
        } = elementStyle;
        component.option(viewModel);
        if (height) {
          setHeight($element, height);
        }
        if (width) {
          setWidth($element, width);
        }
      }
    }
  }
};
