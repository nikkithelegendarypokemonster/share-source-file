/**
* DevExtreme (esm/__internal/scheduler/base/m_widget_observer.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Widget from '../../../ui/widget/ui.widget';
class WidgetObserver extends Widget {
  notifyObserver(subject, args) {
    var observer = this.option('observer');
    if (observer) {
      observer.fire(subject, args);
    }
  }
  invoke() {
    var observer = this.option('observer');
    if (observer) {
      return observer.fire.apply(observer, arguments);
    }
  }
}
export default WidgetObserver;
