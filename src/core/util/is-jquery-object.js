/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2017 Mickael Jeanroy
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

import {every} from './every';
import {isFunction} from './is-function';
import {isNumber} from './is-number';
import {isObject} from './is-object';

// Main jQuery methods.
// An object with these methods will be considered a jQuery object.
const JQ_METHODS = [
  'addClass',
  'prop',
  'attr',
  'html',
  'text',
];

/**
 * Check if the parameter is an HTML collection (i.e  a generic collection (array-like
 * object similar to `arguments`) of elements (in document order)).
 *
 * @param {*} obj Object to test.
 * @return {boolean} `true` if `obj` is an `HTMLCollection`, `false` otherwise.
 */
export function isJqueryObject(obj) {
  // Fail fast with `primitive types`.
  if (!isObject(obj)) {
    return false;
  }

  // If `obj` is an instance of global jQuery, we are sure it is a jQuery object.
  if (isJqueryGloballyAvailable() && (obj instanceof jQuery)) {
    return true;
  }

  // Use duck-typing ; each jQuery instances should have:
  // - A `length` property that is a `number` greater than or equal to zero.
  // - Mandatory methods listed below.
  return isNumber(obj.length) && obj.length >= 0 && every(JQ_METHODS, (x) => isFunction(obj[x]));
}

/**
 * Check if `jQuery` is globally available (i.e available on `window` object).
 *
 * @return {boolean} `true` if `jQuery` is globally available, `false` otherwise.
 */
function isJqueryGloballyAvailable() {
  return typeof jQuery !== 'undefined';
}
