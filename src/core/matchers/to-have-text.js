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

import { isArray } from '../util/is-array';
import { isPrimitive } from '../util/is-primitive';
import { isString } from '../util/is-string';
import { matchOrEquals } from '../util/match-or-equals';
import { toDomElement } from '../util/to-dom-element';
import { trim } from '../util/trim';

/**
 * Check that the tested object is a DOM node with expected text content.
 * If the expected text parameter is a `number` or a `boolean`, it will be
 * converted to a `string` using its `toString` method.
 *
 * @message Expect [actual] [NOT] to have text [expectedText] but was [actualText]
 * @example
 *   const actual = document.createElement('input');
 *   actual.textContent = '1';
 *   expect(actual).toHaveText('1');
 *   expect(actual).toHaveText(1);
 *   expect(actual).toHaveText(/1/);
 *   expect(actual).toHaveText(jasmine.any(String));
 *   expect(actual).not.toHaveText('foobar');
 *
 * @param {Object} ctx Test context.
 * @param {String|Number|Boolean|RegExp|Array<String|Number|Boolean>|jasmine.Any|jasmine.Anything} text The expected text or a jasmine matcher (i.e `jasmine.any(<Type>)`).
 * @return {Object} Test result.
 * @since 0.1.0
 */
export function toHaveText({ actual, equals, pp }, text) {
  // IE8 does not know textContent but knows innerText.
  const node = toDomElement(actual, pp);
  const actualText = 'textContent' in node ? node.textContent : node.innerText;
  const expectedText = toString(text);

  const ok = matchOrEquals(
    normalizeTextContent(actualText),
    normalizeTextContent(expectedText),
    equals,
  );

  return {
    pass: ok,
    message() {
      return `Expect ${pp(actual)} [NOT] to have text ${pp(expectedText)} but was ${pp(actualText)}`;
    },
  };
}

/**
 * Transform `text` to string if possible:
 * - Serialize primitive types (number, boolean, string) to string.
 * - Join array elements with the line separator character.
 * - Otherwise, returns `text`.
 *
 * @param {String|Number|Boolean|RegExp|Array<String|Number|Boolean>|jasmine.Any|jasmine.Anything} text The expected text or a jasmine matcher (i.e `jasmine.any(<Type>)`).
 * @return {*|string} String value, or `text`.
 */
function toString(text) {
  if (isPrimitive(text)) {
    return text.toString();
  }

  if (isArray(text)) {
    return text.join('\n');
  }

  return text;
}

/**
 * Normalize text content by trimming it if it is a string.
 *
 * @param  {String|Number|Boolean|RegExp|jasmine.Any|jasmine.Anything} text The text to normalize.
 * @returns {string|*} The normalized output.
 */
function normalizeTextContent(text) {
  return isString(text) ? trim(text) : text;
}
