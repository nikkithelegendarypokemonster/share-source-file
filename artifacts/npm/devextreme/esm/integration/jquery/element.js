/**
* DevExtreme (esm/integration/jquery/element.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { setPublicElementWrapper } from '../../core/element';
import useJQueryFn from './use_jquery';
var useJQuery = useJQueryFn();
var getPublicElement = function getPublicElement($element) {
  return $element;
};
if (useJQuery) {
  setPublicElementWrapper(getPublicElement);
}
