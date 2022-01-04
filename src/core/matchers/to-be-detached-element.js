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

import {toDomElement} from '../util/to-dom-element';

/**
 * Check that the tested object is a DOM node not attached to the
 * current active document window.
 *
 * @message Expect [actual] [NOT] to be detached element
 * @example
 *   const actual = document.createElement('div');
 *   expect(actual).toBeDetachedElement();
 *   document.body.appendChild(actual);
 *   expect(actual).not.toBeDetachedElement();
 *
 * @param {Object} ctx Test context.
 * @return {Object} Test result.
 * @since 0.1.0
 */
export function toBeDetachedElement({actual, pp}) {
  const node = toDomElement(actual, pp);

  let isDetached = true;
  let parentNode = node;
  while (parentNode) {
    if (parentNode === document || parentNode === document.body) {
      isDetached = false;
      break;
    }

    parentNode = parentNode.parentNode;
  }

  return {
    pass: isDetached,
    message() {
      return `Expect ${pp(actual)} [NOT] to be detached element`;
    },
  };
}
