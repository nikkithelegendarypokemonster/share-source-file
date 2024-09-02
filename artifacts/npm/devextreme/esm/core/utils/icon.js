/**
* DevExtreme (esm/core/utils/icon.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import $ from '../../core/renderer';
const ICON_CLASS = 'dx-icon';
const SVG_ICON_CLASS = 'dx-svg-icon';
export const getImageSourceType = source => {
  if (!source || typeof source !== 'string') {
    return false;
  }
  if (/^\s*<svg[^>]*>(.|\r?\n)*?<\/svg>\s*$/i.test(source)) {
    return 'svg';
  }
  if (/data:.*base64|\.|[^<\s]\/{1,1}/.test(source)) {
    return 'image';
  }
  if (/^[\w-_]+$/.test(source)) {
    return 'dxIcon';
  }
  if (/^\s?([\w-_:]\s?)+$/.test(source)) {
    return 'fontIcon';
  }
  return false;
};
export const getImageContainer = source => {
  switch (getImageSourceType(source)) {
    case 'image':
      return $('<img>').attr('src', source).addClass(ICON_CLASS);
    case 'fontIcon':
      return $('<i>').addClass(`${ICON_CLASS} ${source}`);
    case 'dxIcon':
      return $('<i>').addClass(`${ICON_CLASS} ${ICON_CLASS}-${source}`);
    case 'svg':
      return $('<i>').addClass(`${ICON_CLASS} ${SVG_ICON_CLASS}`).append(source);
    default:
      return null;
  }
};
