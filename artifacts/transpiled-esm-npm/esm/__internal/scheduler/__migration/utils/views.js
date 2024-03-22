import { isObject } from '../../../../core/utils/type';
import { VIEW_TYPES } from '../const';
export var getCurrentView = (currentView,
// https://github.com/DevExpress/devextreme-renovation/issues/754
views) => {
  var currentViewProps = views.find(view => {
    var names = isObject(view)
    // @ts-expect-error this type was related to R1 TSX
    ? [view.name, view.type] : [view];
    if (names.includes(currentView)) {
      return true;
    }
    return false;
  });
  if (currentViewProps === undefined) {
    if (VIEW_TYPES.includes(currentView)) {
      currentViewProps = currentView;
    } else {
      [currentViewProps] = views;
    }
  }
  return currentViewProps;
};