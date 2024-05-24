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

import { isArray } from './is-array';
import { isNil } from './is-nil';
import { isRegExp } from './is-regexp';

/**
 * Check if a `string` match a regexp or is equal to an expected other `string`
 * using a custom equal function.
 *
 * @param {string} actual Actual string to compare.
 * @param {string|RegExp} expected The expected string, or the regexp to test.
 * @param {function} equalsFn The equals function, used if `expected` is not a regexp.
 * @return {boolean} `true` if `actual` match or is equal to `expected`, `false` otherwise.
 */
export function matchOrEquals(actual, expected, equalsFn) {
  if (isRegExp(expected)) {
    const actualStr = isNil(actual) ? actual : actual.toString();
    const results = isNil(actualStr) ? null : actualStr.match(expected);
    return isArray(results);
  }

  return equalsFn(actual, expected);
}
