/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2022 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {isIn} from '../util/is-in';
import {toDomElement} from '../util/to-dom-element';

/**
 * Check that the tested object is displayed: it means that it does not
 * have a `display` style set to `none`..
 *
 * @message Expect [actual] [NOT] to be displayed
 * @example
 *   const actual = document.createElement('div');
 *   expect(actual).toBeDisplayed();
 *
 *   actual.style.display = 'none';
 *   expect(actual).not.toBeDisplayed();
 *
 * @param {Object} ctx Test context.
 * @return {Object} Test result.
 * @since 0.4.0
 */
export function toBeDisplayed({actual, equals, pp}) {
  const node = toDomElement(actual, pp);
  const display = getCurrentDisplayStyleValue(node);
  const ok = !equals(display, 'none');

  return {
    pass: ok,
    message() {
      return `Expect ${pp(actual)} [NOT] to be displayed`;
    },
  };
}

/**
 * Get the value of the `display` css property on given node.
 *
 * @param {Object} node The DOM node.
 * @return {string} The `display` property.
 */
function getCurrentDisplayStyleValue(node) {
  // Modern browsers.
  if (isIn(node, 'getComputedStyle')) {
    return getComputedDisplayStyle(node);
  }

  // IE8 does not support `getComputedStyle` method.
  if (isIn(node, 'currentStyle')) {
    return getCurrentDisplayStyle(node);
  }

  // If we are here, then it's weird since `getComputedStyle` and `currentStyle` are not supported.
  // Use the `style` property as a fallback.
  return node.style.display;
}

/**
 * Extract the computed value of the `display` style property.
 * Note that with a detached node, calling `getComputedStyle#getPropertyValue` may fail
 * on some version of IE (at least, IE9, IE10). In this case, the value of the
 * inline-style will be returned.
 *
 * @param {Object} node The DOM node.
 * @return {string} The `display` computed value.
 */
function getComputedDisplayStyle(node) {
  try {
    return node.getComputedStyle().getPropertyValue('display');
  } catch (e) {
    // May happen with a detached node on IE <= 10.
    // Fallback to inline style value.
    return node.style.display;
  }
}

/**
 * Extract the current style value of the `display` style property.
 * This function is a fallback for `getComputedStyle` on IE8.
 *
 * Note that with a detached node, calling `getComputedStyle#getPropertyValue` may fail.
 * In this case, the value of the inline-style will be returned.
 *
 * @param {Object} node The DOM node.
 * @return {string} The `display` computed value.
 */
function getCurrentDisplayStyle(node) {
  try {
    return node.currentStyle.display;
  } catch (e) {
    // May happen with a detached node.
    // Fallback to inline style value.
    return node.style.display;
  }
}
