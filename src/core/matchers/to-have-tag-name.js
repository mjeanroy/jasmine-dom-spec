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

import { matchOrEquals } from '../util/match-or-equals';
import { toDomElement } from '../util/to-dom-element';
import { toLower } from '../util/to-lower';

/**
 * Check that the tested object is a DOM node with expected tag name.
 *
 * @message Expect [actual] [NOT] to have tag name [expectedTagName] but was [actualTagName]
 * @example
 *   const actual = document.createElement('input');
 *   expect(actual).toHaveTagName('input');
 *   expect(actual).toHaveTagName('INPUT');
 *   expect(actual).toHaveTagName(/input|select/i);
 *   expect(actual).not.toHaveTagName('div');
 *
 * @param {Object} ctx Test context.
 * @param {String|RegExp|jasmine.Any|jasmine.Anything} tagName The expected tag name or a jasmine matcher (i.e `jasmine.any(<Type>)`).
 * @return {Object} Test result.
 * @since 0.1.0
 */
export function toHaveTagName({ actual, equals, pp }, tagName) {
  // IE8 does not know textContent but knows innerText.
  const node = toDomElement(actual, pp);
  const actualTagName = node.tagName;
  const lowerActualTagName = toLower(actualTagName);
  const lowerExpectedTagName = toLower(tagName);
  const ok = matchOrEquals(lowerActualTagName, lowerExpectedTagName, equals);

  return {
    pass: ok,
    message() {
      return `Expect ${pp(actual)} [NOT] to have tag name ${pp(tagName)} but was ${pp(actualTagName)}`;
    },
  };
}
