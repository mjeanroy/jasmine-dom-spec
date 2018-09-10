/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2018 Mickael Jeanroy
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

import {toHaveHtml} from '../../../src/core/matchers/to-have-html';

describe('toHaveHtml', () => {
  it('should pass with a dom node with expected html content', () => {
    const actual = document.createElement('div');
    const equals = jasmine.createSpy('equals').and.callFake((x, y) => x === y);
    const html = '<div>foo</div>';
    actual.innerHTML = html;

    const result = toHaveHtml({actual, equals}, html);

    const expected = document.createElement('div');
    expected.innerHTML = html;

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
        `Expect '${actual.outerHTML}' [NOT] to have HTML '${expected.innerHTML}' but was '${actual.innerHTML}'`
    );
  });

  it('should pass with a dom node with expected number content', () => {
    const html = 1;
    const actual = document.createElement('div');
    const equals = jasmine.createSpy('equals').and.callFake((x, y) => x === y);
    actual.innerHTML = html;

    const result = toHaveHtml({actual, equals}, html);

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
        `Expect '${actual.outerHTML}' [NOT] to have HTML '1' but was '1'`
    );
  });

  it('should pass with a dom node with expected boolean content', () => {
    const html = true;
    const actual = document.createElement('div');
    const equals = jasmine.createSpy('equals').and.callFake((x, y) => x === y);
    actual.innerHTML = html;

    const result = toHaveHtml({actual, equals}, html);

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
        `Expect '${actual.outerHTML}' [NOT] to have HTML 'true' but was 'true'`
    );
  });

  it('should pass with a dom node with expected regexp', () => {
    const html = /true/;
    const actual = document.createElement('div');
    const equals = jasmine.createSpy('equals').and.callFake((x, y) => x === y);
    actual.innerHTML = 'true';

    const result = toHaveHtml({actual, equals}, html);

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
        `Expect '${actual.outerHTML}' [NOT] to have HTML /true/ but was 'true'`
    );
  });
});
