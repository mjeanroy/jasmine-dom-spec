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

import { isNil } from '../util/is-nil';
import { isUndefined } from '../util/is-undefined';
import { matchOrEquals } from '../util/match-or-equals';
import { toDomElement } from '../util/to-dom-element';

/**
 * Check that the tested object is a DOM node with expected `id`.
 *
 * @message Expect [actual] [NOT] to have id [id] but was [id]
 * @example
 *   const actual = document.createElement('div');
 *   actual.id = 'foo';
 *   expect(actual).toHaveId();
 *   expect(actual).toHaveId('foo');
 *   expect(actual).toHaveId(jasmine.any(String));
 *   expect(actual).not.toHaveId('bar');
 *
 * @param {Object} ctx Test context.
 * @param {String|RegExp|jasmine.Any|jasmine.Anything} id The expected id or a jasmine matcher (i.e `jasmine.any(<Type>)`).
 * @return {Object} Test result.
 * @since 0.1.0
 */
export function toHaveId({ actual, equals, pp }, id) {
  const node = toDomElement(actual, pp);
  const actualId = node.id;
  const checkId = !isUndefined(id);

  const isIdFilled = !isNil(actualId) && actualId !== '';
  const isExpectedId = checkId ? matchOrEquals(actualId, id, equals) : true;
  const pass = isIdFilled && isExpectedId;

  return {
    pass,
    message() {
      return `Expect ${pp(actual)} [NOT] to have id${checkId ? ` ${pp(id)} but was ${pp(actualId)}` : ''}`;
    },
  };
}
