/**
* DevExtreme (esm/renovation/utils/combine_classes.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export function combineClasses(classesMap) {
  return Object.keys(classesMap).filter(p => classesMap[p]).join(' ');
}