/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2022 Mickael Jeanroy
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

import {toBeChecked} from '../../../src/core/matchers/to-be-checked';
import {createFakeContext} from '../test/create-fake-context';

describe('toBeChecked', () => {
  it('should pass with a checked checkbox', () => {
    const actual = document.createElement('input');
    actual.type = 'checkbox';
    actual.checked = true;

    const ctx = createFakeContext(actual);

    const result = toBeChecked(ctx);

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
        `Expect '${actual.outerHTML}' [NOT] to be checked`
    );
  });

  it('should not pass with a non-checked checkbox', () => {
    const actual = document.createElement('input');
    actual.type = 'checkbox';

    const ctx = createFakeContext(actual);

    const result = toBeChecked(ctx);

    expect(result).toEqual({
      pass: false,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
        `Expect '${actual.outerHTML}' [NOT] to be checked`
    );
  });

  it('should fail without a checked checkbox', () => {
    const actual = document.createElement('div');
    const ctx = createFakeContext(actual);

    expect(() => toBeChecked(ctx)).toThrow(new Error(
        'Cannot run `toBeChecked` matcher on a DOM node without `checked` property'
    ));
  });
});
