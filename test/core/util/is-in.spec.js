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

import { isIn } from '../../../src/core/util/is-in';

describe('isIn', () => {
  it('should return true if object has key in its prototype chain', () => {
    const obj = {
      k1: true,
      k2: false,
    };

    expect(isIn(obj, 'k1')).toBe(true);
    expect(isIn(obj, 'k2')).toBe(true);
    expect(isIn(obj, 'toString')).toBe(true);
  });

  it('should return false if object does not have key in its prototype chain', () => {
    const obj = {
      k1: true,
      k2: false,
    };

    expect(isIn(obj, 'k3')).toBe(false);
    expect(isIn(obj, 'foobar')).toBe(false);
  });
});
