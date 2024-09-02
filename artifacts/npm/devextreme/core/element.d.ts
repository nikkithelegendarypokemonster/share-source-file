/**
* DevExtreme (core/element.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars */
import { dxElementWrapper } from './renderer';

export interface Condition {}

export interface ElementWrapper<T extends Element> { }
export interface ElementsArrayWrapper<T extends Element> { }
/**
 * @docid
 * @type HTMLElement|SVGElement|JQuery
 */
export type DxElement<T extends Element = HTMLElement> = {} extends Condition ? T : ElementWrapper<T>;

/**
 * @docid
 * @type HTMLElement|SVGElement|JQuery
 */
export type UserDefinedElement<T extends Element = Element> = {} extends Condition ? T : ElementWrapper<T> | T;

export type UserDefinedElementsArray = {} extends Condition ? Array<Element> : ElementsArrayWrapper<Element>;

export interface InternalElementWrapper<T extends Element> { }
export type InternalElement<T extends Element> = {} extends Condition ? dxElementWrapper : InternalElementWrapper<T>;

/**
 * @docid
 * @hidden
 * @type HTMLElement|JQuery
 * @deprecated
 */
export type dxElement = DxElement<HTMLElement>;

/**
 * @docid
 * @hidden
 * @type SVGElement|JQuery
 * @deprecated
 */
export type dxSVGElement = DxElement<SVGElement>;

export function getPublicElement<TElement extends Element = Element>(element: InternalElement<Element>): DxElement<TElement>;
export function setPublicElementWrapper(newStrategy: (element: InternalElement<Element>) => DxElement<Element>): void;
