/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2019 Mickael Jeanroy
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
import {every} from '../util/every';
import {isObject} from '../util/is-object';
import {keys} from '../util/keys';
import {matchOrEquals} from '../util/match-or-equals';
import {toDomElement} from '../util/to-dom-element';

/**
 * Check that the tested object has expected properties.
 *
 * @message Expect [actual] [NOT] to have properties [expected]
 * @example
 *   const actual = document.createElement('input');
 *   actual.id = 'node-id';
 *   actual.required = true;
 *   actual.checked = false;
 *   expect(actual).toHaveProps('id', 'node-id');
 *   expect(actual).toHaveProps('id', /node-id/);
 *   expect(actual).toHaveProps('required', true);
 *   expect(actual).toHaveProps('checked', false);
 *   expect(actual).toHaveProps({required: true, checked: false});
 *   expect(actual).toHaveProps({required: jasmine.any(Boolean)});
 *
 * @param {Object} ctx Test context.
 * @param {String|Object} propName Property name (or object of properties).
 * @param {*} propValue Property value.
 * @return {Object} Test result.
 * @since 0.1.0
 */
export function toHaveProps({actual, equals}, propName, propValue) {
  const node = toDomElement(actual);
  const expected = isObject(propName) ? propName : {[propName]: propValue};
  const props = keys(expected);
  const ok = every(props, (p) => (
    matchOrEquals(node[p], expected[p], equals)
  ));

  return {
    pass: ok,
    message() {
      return `Expect ${pp(actual)} [NOT] to have properties ${pp(expected)}`;
    },
  };
}
