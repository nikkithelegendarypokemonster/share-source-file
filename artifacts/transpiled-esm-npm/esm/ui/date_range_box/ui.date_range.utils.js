import dateUtils from '../../core/utils/date';
import dateSerialization from '../../core/utils/date_serialization';
export var getDeserializedDate = value => {
  return dateSerialization.deserializeDate(value);
};
export var isSameDates = (date1, date2) => {
  if (!date1 && !date2) {
    return true;
  }
  return dateUtils.sameDate(getDeserializedDate(date1), getDeserializedDate(date2));
};
export var isSameDateArrays = (value, previousValue) => {
  var [startDate, endDate] = value;
  var [previousStartDate, previousEndDate] = previousValue;
  return isSameDates(startDate, previousStartDate) && isSameDates(endDate, previousEndDate);
};
export var sortDatesArray = value => {
  var [startDate, endDate] = value;
  if (startDate && endDate && getDeserializedDate(startDate) > getDeserializedDate(endDate)) {
    return [endDate, startDate];
  } else {
    return value;
  }
};
export var monthDifference = (date1, date2) => {
  return (date2.getFullYear() - date1.getFullYear()) * 12 - date1.getMonth() + date2.getMonth();
};