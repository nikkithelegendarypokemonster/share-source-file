import dateLocalization from '../../../../localization/date';
export var formatWeekday = date => dateLocalization.getDayNames('abbreviated')[date.getDay()];
export var formatWeekdayAndDay = date => "".concat(formatWeekday(date), " ").concat(dateLocalization.format(date, 'day'));