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

import {isNull} from './is-null';
import {isUndefined} from './is-undefined';
import {isObject} from './is-object';

/**
 * The type value for element nodes.
 * @see https://developer.mozilla.org/fr/docs/Web/API/Node
 */
const ELEMENT_NODE = 1;

/**
 * Check if an object is a DOM node.
 *
 * @param {*} actual The object to test.
 * @return {boolean} `true` if `actual` is a DOM node, `false` otherwise.
 */
export function isDomElement(actual) {
  if (isNull(actual) || isUndefined(actual)) {
    return false;
  }

  return isObject(actual) && actual.nodeType === ELEMENT_NODE;
}
