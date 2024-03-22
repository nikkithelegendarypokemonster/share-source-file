/**
* DevExtreme (cjs/renovation/test_utils/transformers/tsx.js)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

const fs = require('fs');
const tsJest = require('ts-jest');
const getCacheKey = require('./get_cache_key');
const THIS_FILE = fs.readFileSync(__filename);
const jestTransformer = tsJest.createTransformer();
const addCreateElementImport = src => "import React from 'react'; ".concat(src);
module.exports = {
  process(src, filename, config) {
    return jestTransformer.process(filename.indexOf('__tests__') > -1 ? src : addCreateElementImport(src), filename, config);
  },
  getCacheKey(fileData, filePath, configStr) {
    return getCacheKey(fileData, filePath, configStr, THIS_FILE);
  }
};
