/**
* DevExtreme (bundles/__internal/viz/core/themes/generic/light/bar_gauge.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _contants = require("./contants");
var _default = exports.default = {
  barGauge: {
    backgroundColor: '#e0e0e0',
    relativeInnerRadius: 0.3,
    barSpacing: 4,
    resolveLabelOverlapping: 'hide',
    label: {
      indent: 20,
      connectorWidth: 2,
      font: {
        size: 16
      }
    },
    legend: {
      visible: false
    },
    indicator: {
      hasPositiveMeaning: true,
      layout: {
        horizontalAlignment: _contants.CENTER,
        verticalAlignment: _contants.BOTTOM
      },
      text: {
        font: {
          size: 18
        }
      }
    }
  }
};