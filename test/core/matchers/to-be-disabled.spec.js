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

import {toBeDisabled} from '../../../src/core/matchers/to-be-disabled';
import {assumeNotIE} from '../test/assume-not-ie';

describe('toBeDisabled', () => {
  it('should pass with a disabled input', () => {
    const actual = document.createElement('input');
    actual.disabled = true;

    const result = toBeDisabled({actual});

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
        `Expect '${actual.outerHTML}' [NOT] to be disabled`
    );
  });

  it('should not pass with a non-disabled input', () => {
    const actual = document.createElement('input');
    const result = toBeDisabled({actual});

    expect(result).toEqual({
      pass: false,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
        `Expect '${actual.outerHTML}' [NOT] to be disabled`
    );
  });

  it('should fail with a DOM node missing a `disabled` property', () => {
    // Skip test on Internet Explorer because the `disabled` property is part of `Element.prototype`, so
    // every DOM node has a `disabled` in these browsers.
    assumeNotIE();

    const actual = document.createElement('div');
    expect(() => toBeDisabled({actual})).toThrow(new Error(
        'Cannot run `toBeDisabled` matcher on a DOM node without `disabled` property'
    ));
  });
});
