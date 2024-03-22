import _extends from "@babel/runtime/helpers/esm/extends";
export var addToStyles = (options, style) => {
  var nextStyle = style !== null && style !== void 0 ? style : {};
  var result = _extends({}, nextStyle);
  options.forEach(_ref => {
    var {
      attr,
      value
    } = _ref;
    result[attr] = value || nextStyle[attr];
  });
  return result;
};
export var addWidthToStyle = (value, style) => {
  var width = value ? "".concat(value, "px") : '';
  return addToStyles([{
    attr: 'width',
    value: width
  }], style);
};
export var addHeightToStyle = (value, style) => {
  var height = value ? "".concat(value, "px") : '';
  return addToStyles([{
    attr: 'height',
    value: height
  }], style);
};
export var combineClasses = classesMap => Object.keys(classesMap).filter(p => classesMap[p]).join(' ');
export var getGroupCellClasses = function getGroupCellClasses() {
  var isFirstGroupCell = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var isLastGroupCell = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var className = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return combineClasses({
    'dx-scheduler-first-group-cell': isFirstGroupCell,
    'dx-scheduler-last-group-cell': isLastGroupCell,
    [className]: true
  });
};