/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2024 Mickael Jeanroy
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

import { ensureHasIn } from '../preconditions/ensure-has-in';
import { toDomElement } from '../util/to-dom-element';

/**
 * Check that the tested object is a DOM node property `indeterminate` equal
 * to `true`.
 *
 * @message Expect [actual] [NOT] to be indeterminate
 * @example
 *   const actual = document.createElement('input');
 *   actual.type = 'checkbox';
 *   actual.indeterminate = true;
 *   expect(actual).toBeIndeterminate();
 *
 * @param {Object} ctx Test context.
 * @return {Object} Test result.
 * @since 0.1.0
 */
export function toBeIndeterminate({ actual, pp }) {
  const node = toDomElement(actual, pp);

  ensureHasIn(node, 'indeterminate', 'Cannot run `toBeIndeterminate` matcher on a DOM node without `indeterminate` property');

  return {
    pass: node.indeterminate === true,
    message() {
      return `Expect ${pp(actual)} [NOT] to be indeterminate`;
    },
  };
}
