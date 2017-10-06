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
import {every, isObject, keys, toDomElement} from '../util/index';

/**
 * Check that the tested object has expected attributes.
 *
 * @message Expect [actual] [NOT] to have attributes [expected]
 * @example
 *   const actual = document.createElement('input');
 *   actual.setAttribute('data-id', '1');
 *   actual.checked = false;
 *   expect(actual).toHaveAttrs('data-id', '1');
 *   expect(actual).toHaveAttrs({'data-id': '1'});
 *   expect(actual).toHaveAttrs({'data-id': jasmine.anything()});
 *
 * @param {Object} ctx Test context.
 * @param {Object|string} attrName Attribute name (or map of attributes).
 * @param {string} attrValue Attribute value.
 * @return {Object} Test result.
 * @since 0.1.0
 */
export function toHaveAttrs({actual, equals}, attrName, attrValue) {
  const node = toDomElement(actual);
  const expected = isObject(attrName) ? attrName : {[attrName]: attrValue};
  const props = keys(expected);
  const ok = every(props, (attr) => (
    node.hasAttribute(attr) && equals(node.getAttribute(attr), expected[attr])
  ));

  return {
    pass: ok,
    message: `Expect ${pp(actual)} [NOT] to have attributes ${pp(expected)}`,
  };
}
