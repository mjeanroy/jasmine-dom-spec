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

import {toHaveText} from '../../../src/core/matchers/to-have-text';

describe('toHaveText', () => {
  it('should pass with a dom node with expected text content', () => {
    const txt = 'foo';
    const actual = document.createElement('div');
    const equals = jasmine.createSpy('equals').and.callFake((x, y) => x === y);
    actual.innerHTML = txt;

    const result = toHaveText({actual, equals}, txt);

    expect(result).toEqual({
      pass: true,
      message: `Expect '${actual.outerHTML}' [NOT] to have text 'foo' but was 'foo'`,
    });
  });

  it('should pass with a dom node with expected number content', () => {
    const txt = 1;
    const actual = document.createElement('div');
    const equals = jasmine.createSpy('equals').and.callFake((x, y) => x === y);
    actual.innerHTML = txt;

    const result = toHaveText({actual, equals}, txt);

    expect(result).toEqual({
      pass: true,
      message: `Expect '${actual.outerHTML}' [NOT] to have text '1' but was '1'`,
    });
  });

  it('should pass with a dom node with expected boolean content', () => {
    const txt = true;
    const actual = document.createElement('div');
    const equals = jasmine.createSpy('equals').and.callFake((x, y) => x === y);
    actual.innerHTML = txt;

    const result = toHaveText({actual, equals}, txt);

    expect(result).toEqual({
      pass: true,
      message: `Expect '${actual.outerHTML}' [NOT] to have text 'true' but was 'true'`,
    });
  });
});
