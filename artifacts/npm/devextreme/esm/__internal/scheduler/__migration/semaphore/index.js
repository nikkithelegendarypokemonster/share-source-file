/**
* DevExtreme (esm/__internal/scheduler/__migration/semaphore/index.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export class Semaphore {
  constructor() {
    this.counter = 0;
  }
  isFree() {
    return this.counter === 0;
  }
  take() {
    this.counter += 1;
  }
  release() {
    this.counter -= 1;
    if (this.counter < 0) {
      this.counter = 0;
    }
  }
}
