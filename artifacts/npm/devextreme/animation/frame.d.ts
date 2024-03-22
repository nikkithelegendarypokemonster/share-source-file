/**
* DevExtreme (animation/frame.d.ts)
* Version: 24.1.0
* Build date: Fri Mar 22 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/**
 * Cancels an animation frame request scheduled with the requestAnimationFrame method.
 */
export function cancelAnimationFrame(requestID: number): void;

/**
 * Makes the browser call a function to update animation before the next repaint.
 */
export function requestAnimationFrame(callback: Function): number;
