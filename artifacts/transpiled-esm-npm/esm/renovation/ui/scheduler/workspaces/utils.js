export var getKeyByDateAndGroup = (date, groupIndex) => {
  var key = date.getTime();
  if (!groupIndex) {
    return key.toString();
  }
  return (key + groupIndex).toString();
};