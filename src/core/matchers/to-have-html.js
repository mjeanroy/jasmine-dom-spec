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

import {pp} from '../jasmine/index';
import {toDomElement} from '../util/index';

/**
 * Check that the tested object is a DOM node with expected html content.
 *
 * @message Expect [actual] [NOT] to have HTML [expectedHtml] but was [actualHtml]
 * @example
 *   const actual = document.createElement('input');
 *   actual.textContent = '<span>foo</span>';
 *   expect(actual).toHaveHtml('<span>foo</span>');
 *   expect(actual).toHaveHtml(jasmine.any(String));
 *   expect(actual).not.toHaveHtml('<div>foo</div>');
 *
 * @param {Object} ctx Test context.
 * @param {string} expectedHtml The expected html.
 * @return {Object} Test result.
 * @since 0.1.0
 */
export function toHaveHtml({actual, equals}, expectedHtml) {
  const node = toDomElement(actual);
  const fragment = document.createDocumentFragment();
  fragment.innerHTML = expectedHtml;

  const actualHtml = node.innerHTML;
  const testedHtml = fragment.innerHTML;

  return {
    pass: equals(actualHtml, testedHtml),
    message: `Expect ${pp(actual)} [NOT] to have HTML ${pp(expectedHtml)} but was ${pp(actualHtml)}`,
  };
}
