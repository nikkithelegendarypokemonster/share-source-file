"use strict";

exports.GanttMappingHelper = void 0;
var _type = require("../../core/utils/type");
var _data = require("../../core/utils/data");
const GANTT_TASKS = 'tasks';
const GANTT_MAPPED_FIELD_REGEX = /(\w*)Expr/;
let GanttMappingHelper = exports.GanttMappingHelper = /*#__PURE__*/function () {
  function GanttMappingHelper(gantt) {
    this._gantt = gantt;
  }
  var _proto = GanttMappingHelper.prototype;
  _proto._getMappedFieldName = function _getMappedFieldName(optionName, coreField) {
    let coreFieldName = coreField;
    if (coreField === 'id') {
      coreFieldName = 'key';
    }
    return this._gantt.option("".concat(optionName, ".").concat(coreFieldName, "Expr"));
  };
  _proto.getTaskMappedFieldNames = function getTaskMappedFieldNames() {
    const mappedFields = [];
    const mappedFieldsData = this._gantt.option(GANTT_TASKS);
    for (const field in mappedFieldsData) {
      const exprMatches = field.match(GANTT_MAPPED_FIELD_REGEX);
      const mappedFieldName = exprMatches && mappedFieldsData[exprMatches[0]];
      if (mappedFieldName) {
        mappedFields.push(mappedFieldName);
      }
    }
    return mappedFields;
  };
  _proto.convertCoreToMappedData = function convertCoreToMappedData(optionName, coreData) {
    return Object.keys(coreData).reduce((previous, f) => {
      const mappedField = this._getMappedFieldName(optionName, f);
      if (mappedField && !(0, _type.isFunction)(mappedField)) {
        const setter = (0, _data.compileSetter)(mappedField);
        setter(previous, coreData[f]);
      }
      return previous;
    }, {});
  };
  _proto.convertMappedToCoreData = function convertMappedToCoreData(optionName, mappedData) {
    const coreData = {};
    if (mappedData) {
      const mappedFields = this._gantt.option(optionName);
      for (const field in mappedFields) {
        const exprMatches = field.match(GANTT_MAPPED_FIELD_REGEX);
        const mappedFieldName = exprMatches && mappedFields[exprMatches[0]];
        if (mappedFieldName && mappedData[mappedFieldName] !== undefined) {
          const getter = (0, _data.compileGetter)(mappedFieldName);
          const coreFieldName = exprMatches[1];
          coreData[coreFieldName] = getter(mappedData);
        }
      }
    }
    return coreData;
  };
  _proto.convertCoreToMappedFields = function convertCoreToMappedFields(optionName, fields) {
    return fields.reduce((previous, f) => {
      const mappedField = this._getMappedFieldName(optionName, f);
      if (mappedField) {
        previous.push(mappedField);
      }
      return previous;
    }, []);
  };
  _proto.convertMappedToCoreFields = function convertMappedToCoreFields(optionName, fields) {
    const coreFields = [];
    const mappedFields = this._gantt.option(optionName);
    for (const field in mappedFields) {
      const exprMatches = field.match(GANTT_MAPPED_FIELD_REGEX);
      const mappedFieldName = exprMatches && mappedFields[exprMatches[0]];
      if (mappedFieldName && fields.indexOf(mappedFieldName) > -1) {
        const coreFieldName = exprMatches[1];
        coreFields.push(coreFieldName);
      }
    }
    return coreFields;
  };
  return GanttMappingHelper;
}();