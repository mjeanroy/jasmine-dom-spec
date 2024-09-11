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

import { isArrayLike } from '../../../src/core/util/is-array-like';

describe('isArrayLike', () => {
  it('should return true with array or something that looks like an array', () => {
    expect(isArrayLike([0, 1, 2])).toBe(true);
    expect(isArrayLike(Array(10))).toBe(true);
    expect(isArrayLike({ length: 2 })).toBe(true);

    // eslint-disable-next-line no-array-constructor
    expect(isArrayLike(new Array(1, 2, 3))).toBe(true);
  });

  it('should return false without array or something not compatible with an array', () => {
    expect(isArrayLike(0)).toBe(false);
    expect(isArrayLike(true)).toBe(false);
    expect(isArrayLike({})).toBe(false);
    expect(isArrayLike({ length: 1.5 })).toBe(false);
    expect(isArrayLike(() => {})).toBe(false);
  });
});
