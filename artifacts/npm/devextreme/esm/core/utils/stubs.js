/**
* DevExtreme (esm/core/utils/stubs.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export function stubComponent(componentName) {
  return class NoComponent {
    constructor() {
      // TODO: make correct exceptions here and in decorators
      throw new Error(`Module '${componentName}' not found`);
    }
    static getInstance() {}
  };
}
