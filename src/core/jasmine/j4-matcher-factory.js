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

import { negateMessage } from './negate-message';
import { pp } from './pp';

/**
 * This factory will create a matcher supported by Jasmine 4.X.X.
 *
 * This factory takes a generic matcher function (matcher defined in this project)
 * and returns the matcher that can be used with Jasmine 4.
 *
 * @param {function} fn Generic matcher function.
 * @return {function} Jasmine 4 official matcher.
 */
export function jasmine4MatcherFactory(fn) {
  /**
   * Jasmine 4.X.X matcher.
   *
   * @param {Object} matchersUtil Jasmine util object.
   * @return {Object} An object containing `compare` and `negativeCompare` function that will be executed by Jasmine.
   */
  return function jasmine4Matcher(matchersUtil) {
    const ctx = {
      // Adapter for custom equals functions.
      equals(a, b) {
        return matchersUtil.equals(a, b);
      },

      // Adapter for pretty printer function.
      pp(value) {
        return pp(value, matchersUtil.pp);
      },
    };

    return {
      /**
       * Jasmine compare function that will be called when a custom matcher is used with:
       *  `expect(value).toCustomMatcher(...)`.
       *
       * @param {*} actual Object being tested (the object being given in `expect` call).
       * @param {Array<*>} args The matcher arguments (arguments being given to `toCustomMatcher` call).
       * @return {Object} The test result.
       */
      compare(actual, ...args) {
        ctx.actual = actual;
        ctx.isNot = false;

        const result = fn(...[ctx].concat(args));
        return {
          pass: result.pass,
          message() {
            return negateMessage(false, result.message());
          },
        };
      },

      /**
       * Jasmine2 compare function that will be called when a custom matcher is used with:
       *  `expect(value).not.toCustomMatcher(...)`.
       *
       * @param {*} actual Object being tested (the object being given in `expect` call).
       * @param {Array<*>} args The matcher arguments (arguments being given to `toCustomMatcher` call).
       * @return {void}
       */
      negativeCompare(actual, ...args) {
        ctx.actual = actual;
        ctx.isNot = true;

        const result = fn(...[ctx].concat(args));
        return {
          pass: !result.pass,
          message() {
            return negateMessage(true, result.message());
          },
        };
      },
    };
  };
}
