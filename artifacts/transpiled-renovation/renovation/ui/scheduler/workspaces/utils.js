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