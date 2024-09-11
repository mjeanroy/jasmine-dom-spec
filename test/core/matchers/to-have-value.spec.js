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

import { toHaveValue } from '../../../src/core/matchers/to-have-value';
import { createFakeContext } from '../test/create-fake-context';

describe('toHaveValue', () => {
  it('should pass with a dom node with expected value', () => {
    const value = 'foo';
    const actual = document.createElement('input');
    const equals = jasmine.createSpy('equals').and.callFake((x, y) => x === y);
    const ctx = createFakeContext(actual, {
      equals,
    });

    actual.value = value;

    const result = toHaveValue(ctx, value);

    expect(equals).toHaveBeenCalled();
    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have value 'foo' but was 'foo'`,
    );
  });

  it('should pass with a dom node with expected regexp value', () => {
    const actual = document.createElement('input');
    const ctx = createFakeContext(actual);

    actual.value = 'foo';

    const result = toHaveValue(ctx, /foo/);

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have value /foo/ but was 'foo'`,
    );
  });

  it('should fail with a DOM node without `value` property', () => {
    const actual = document.createElement('div');
    const ctx = createFakeContext(actual);
    expect(() => toHaveValue(ctx)).toThrow(new Error(
      'Cannot run `toHaveValue` matcher on a DOM node without `value` property',
    ));
  });
});
