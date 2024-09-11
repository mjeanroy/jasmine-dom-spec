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

import { dashToCamel } from '../util/dash-to-camel';
import { every } from '../util/every';
import { isObject } from '../util/is-object';
import { keys } from '../util/keys';
import { matchOrEquals } from '../util/match-or-equals';
import { toDomElement } from '../util/to-dom-element';

const _getComputedStyle = getComputedStyle
  ? (el) => getComputedStyle(el, null)
  : (el) => el.currentStyle;

/**
 * Check that the tested object has expected computed style value (the css style property
 * name can dash-cased, such as `font-size`, or camel cased, such as `fontSize`).
 *
 * @message Expect [actual] [NOT] to have computed styles [expected]
 * @example
 *   const actual = document.createElement('input');
 *   actual.required = true;
 *   actual.checked = false;
 *   expect(actual).toHaveComputedStyle('display', 'none');
 *   expect(actual).toHaveComputedStyle('font-size', '10px');
 *   expect(actual).toHaveComputedStyle('font-size', /10/);
 *   expect(actual).toHaveComputedStyle({fontSize: '10px', display: 'none'});
 *   expect(actual).toHaveComputedStyle({fontSize: /10/, display: 'none'});
 *   expect(actual).toHaveComputedStyle({fontSize: jasmine.anything()});
 *
 * @param {Object} ctx Test context.
 * @param {String|Object} styleName Style name or object of styles.
 * @param {String|RegExp|jasmine.Any|jasmine.Anything} styleValue Style value or a jasmine matcher (i.e `jasmine.any(<Type>)`).
 * @return {Object} Test result.
 * @since 0.9.0
 */
export function toHaveComputedStyle({ actual, equals, pp }, styleName, styleValue) {
  const node = toDomElement(actual, pp);
  const expected = isObject(styleName) ? styleName : { [styleName]: styleValue };
  const props = keys(expected);
  const computedStyle = _getComputedStyle(node);

  const ok = every(props, (name) => {
    const camelCaseName = dashToCamel(name);
    const actualValue = computedStyle[camelCaseName];
    const expectedValue = expected[name];
    return matchOrEquals(actualValue, expectedValue, equals);
  });

  return {
    pass: ok,
    message() {
      return `Expect ${pp(actual)} [NOT] to have computed styles ${pp(expected)}`;
    },
  };
}
