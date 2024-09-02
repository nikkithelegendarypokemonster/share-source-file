/**
* DevExtreme (cjs/renovation/utils/combine_classes.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.combineClasses = combineClasses;
function combineClasses(classesMap) {
  return Object.keys(classesMap).filter(p => classesMap[p]).join(' ');
}
