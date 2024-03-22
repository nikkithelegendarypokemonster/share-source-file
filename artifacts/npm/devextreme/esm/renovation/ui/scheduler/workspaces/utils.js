/**
* DevExtreme (esm/renovation/ui/scheduler/workspaces/utils.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export var getKeyByDateAndGroup = (date, groupIndex) => {
  var key = date.getTime();
  if (!groupIndex) {
    return key.toString();
  }
  return (key + groupIndex).toString();
};
