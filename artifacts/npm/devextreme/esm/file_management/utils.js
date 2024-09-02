/**
* DevExtreme (esm/file_management/utils.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { each } from '../core/utils/iterator';
export const PATH_SEPARATOR = '/';
export const getFileExtension = path => {
  const index = path.lastIndexOf('.');
  return index !== -1 ? path.substr(index) : '';
};
export const getName = path => {
  const index = path.lastIndexOf(PATH_SEPARATOR);
  return index !== -1 ? path.substr(index + PATH_SEPARATOR.length) : path;
};
export const getParentPath = path => {
  const index = path.lastIndexOf(PATH_SEPARATOR);
  return index !== -1 ? path.substr(0, index) : '';
};
export const getPathParts = (path, includeFullPath) => {
  if (!path || path === '/') {
    return [];
  }
  const result = [];
  let pathPart = '';
  for (let i = 0; i < path.length; i++) {
    let char = path.charAt(i);
    if (char === PATH_SEPARATOR) {
      const nextChar = path.charAt(i + 1);
      if (nextChar !== PATH_SEPARATOR) {
        if (pathPart) {
          result.push(pathPart);
          pathPart = '';
        }
        char = nextChar;
      }
      i++;
    }
    pathPart += char;
  }
  if (pathPart) {
    result.push(pathPart);
  }
  if (includeFullPath) {
    for (let i = 0; i < result.length; i++) {
      result[i] = pathCombine(i === 0 ? '' : result[i - 1], getEscapedFileName(result[i]));
    }
  }
  return result;
};
export const getEscapedFileName = function (fileName) {
  return fileName.replace(/\/{1,1}/g, '//');
};
export const pathCombine = function () {
  let result = '';
  each(arguments, (_, arg) => {
    if (arg) {
      if (result) {
        result += PATH_SEPARATOR;
      }
      result += arg;
    }
  });
  return result;
};
