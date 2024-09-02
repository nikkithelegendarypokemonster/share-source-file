/**
* DevExtreme (esm/integration/jquery/element.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { setPublicElementWrapper } from '../../core/element';
import useJQueryFn from './use_jquery';
const useJQuery = useJQueryFn();
export function getPublicElementJQuery($element) {
  return $element;
}
if (useJQuery) {
  setPublicElementWrapper(getPublicElementJQuery);
}
