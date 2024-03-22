"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGroupCellClasses = exports.combineClasses = exports.addWidthToStyle = exports.addToStyles = exports.addHeightToStyle = void 0;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const addToStyles = (options, style) => {
  const nextStyle = style !== null && style !== void 0 ? style : {};
  const result = _extends({}, nextStyle);
  options.forEach(_ref => {
    let {
      attr,
      value
    } = _ref;
    result[attr] = value || nextStyle[attr];
  });
  return result;
};
exports.addToStyles = addToStyles;
const addWidthToStyle = (value, style) => {
  const width = value ? "".concat(value, "px") : '';
  return addToStyles([{
    attr: 'width',
    value: width
  }], style);
};
exports.addWidthToStyle = addWidthToStyle;
const addHeightToStyle = (value, style) => {
  const height = value ? "".concat(value, "px") : '';
  return addToStyles([{
    attr: 'height',
    value: height
  }], style);
};
exports.addHeightToStyle = addHeightToStyle;
const combineClasses = classesMap => Object.keys(classesMap).filter(p => classesMap[p]).join(' ');
exports.combineClasses = combineClasses;
const getGroupCellClasses = function () {
  let isFirstGroupCell = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  let isLastGroupCell = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  let className = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return combineClasses({
    'dx-scheduler-first-group-cell': isFirstGroupCell,
    'dx-scheduler-last-group-cell': isLastGroupCell,
    [className]: true
  });
};
exports.getGroupCellClasses = getGroupCellClasses;