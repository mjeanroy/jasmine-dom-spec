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

import { toHaveTagName } from '../../../src/core/matchers/to-have-tag-name';
import { createFakeContext } from '../test/create-fake-context';

describe('toHaveTagName', () => {
  it('should pass with a dom node with expected tag name', () => {
    const actual = document.createElement('input');
    const ctx = createFakeContext(actual);

    const result = toHaveTagName(ctx, 'input');

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have tag name 'input' but was '${actual.tagName}'`,
    );
  });

  it('should pass with a dom node with a regexp', () => {
    const actual = document.createElement('input');
    const ctx = createFakeContext(actual);

    const result = toHaveTagName(ctx, /input|select/i);

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have tag name /input|select/i but was '${actual.tagName}'`,
    );
  });
});
