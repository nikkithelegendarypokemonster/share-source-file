/**
* DevExtreme (renovation/ui/scheduler/workspaces/utils.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.getKeyByDateAndGroup = void 0;
const getKeyByDateAndGroup = (date, groupIndex) => {
  const key = date.getTime();
  if (!groupIndex) {
    return key.toString();
  }
  return (key + groupIndex).toString();
};
exports.getKeyByDateAndGroup = getKeyByDateAndGroup;
