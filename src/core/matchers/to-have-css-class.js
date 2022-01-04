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

import {isArray} from '../util/is-array';
import {every} from '../util/every';
import {has} from '../util/has';
import {filter} from '../util/filter';
import {indexBy} from '../util/index-by';
import {isRegExp} from '../util/is-regexp';
import {isTruthy} from '../util/is-truthy';
import {map} from '../util/map';
import {matchOrEquals} from '../util/match-or-equals';
import {some} from '../util/some';
import {toDomElement} from '../util/to-dom-element';
import {trim} from '../util/trim';

/**
 * Check that the tested object has expected css classes.
 *
 * @message Expect [actual] [NOT] to have css class [cssClass]
 * @example
 *   const actual = document.createElement('div');
 *   actual.className = 'foo bar';
 *   expect(actual).toHaveCssClass('foo');
 *   expect(actual).toHaveCssClass('bar');
 *   expect(actual).toHaveCssClass(/foo/);
 *   expect(actual).toHaveCssClass('foo bar');
 *   expect(actual).toHaveCssClass('bar foo');
 *   expect(actual).toHaveCssClass(['bar', 'foo']);
 *   expect(actual).toHaveCssClass([/bar/, /foo/]);
 *   expect(actual).not.toHaveCssClass('foobar');
 *   expect(actual).not.toHaveCssClass('foo bar baz');
 *
 * @param {Object} ctx Test context.
 * @param {Array<string>|String} expected The expected class name.
 * @return {Object} Test result.
 * @since 0.1.0
 */
export function toHaveCssClass({actual, pp}, expected) {
  const node = toDomElement(actual, pp);
  const actualClasses = extract(node.className);
  const expectedClasses = isArray(expected) ? expected : extract(expected);
  const mapOfClasses = indexBy(actualClasses, (x) => x);
  const ok = every(expectedClasses, (cssClass) => (
    isRegExp(cssClass) ? matchOne(actualClasses, cssClass) : has(mapOfClasses, cssClass))
  );

  return {
    pass: ok,
    message() {
      return `Expect ${pp(actual)} [NOT] to have css class ${pp(expected)}`;
    },
  };
}

/**
 * Extract array of all css classes, removing useless whitespaces.
 * @param {string} classes The class names.
 * @return {Array<string|RegExp>} Array of all class names.
 */
function extract(classes) {
  if (isRegExp(classes)) {
    return [classes];
  }

  const arrayOfClasses = classes.split(' ');
  const trimmedClasses = map(arrayOfClasses, (x) => trim(x));
  return filter(trimmedClasses, (x) => isTruthy(x));
}

/**
 * Check if the given regexp match at least one element in the
 * array.
 *
 * @param {array<string>} array Input array.
 * @param {RegExp} regexp The regexp to check.
 * @return {boolean} `true` if the `regexp` match at least one element in `array`, `false` otherwise.
 */
function matchOne(array, regexp) {
  return some(array, (x) => (
    matchOrEquals(x, regexp, (x, y) => x === y)
  ));
}
