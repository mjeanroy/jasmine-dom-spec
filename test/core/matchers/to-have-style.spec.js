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

import { toHaveStyle } from '../../../src/core/matchers/to-have-style';
import { createFakeContext } from '../test/create-fake-context';

describe('toHaveStyle', () => {
  let fixtures;

  beforeEach(() => {
    fixtures = document.createElement('div');
    document.body.appendChild(fixtures);
  });

  afterEach(() => {
    document.body.removeChild(fixtures);
  });

  it('should pass with a dom node with expected style', () => {
    const equals = jasmine.createSpy('equals').and.callFake((a, b) => a === b);
    const actual = document.createElement('input');
    const name = 'fontSize';
    const value = '10px';
    const ctx = createFakeContext(actual, {
      equals,
    });

    fixtures.appendChild(actual);
    actual.style[name] = value;

    const result = toHaveStyle(ctx, name, value);

    expect(equals).toHaveBeenCalled();
    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have styles Object({ fontSize: '10px' })`,
    );
  });

  it('should pass with a dom node with expected style as object', () => {
    const equals = jasmine.createSpy('equals').and.callFake((a, b) => a === b);
    const actual = document.createElement('input');
    const name = 'fontSize';
    const value = '10px';
    const ctx = createFakeContext(actual, {
      equals,
    });

    fixtures.appendChild(actual);
    actual.style[name] = value;

    const result = toHaveStyle(ctx, {
      [name]: value,
    });

    expect(equals).toHaveBeenCalled();
    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have styles Object({ fontSize: '10px' })`,
    );
  });

  it('should pass with a dom node with expected style using dash-case', () => {
    const equals = jasmine.createSpy('equals').and.callFake((a, b) => a === b);
    const actual = document.createElement('input');
    const name = 'fontSize';
    const value = '10px';
    const ctx = createFakeContext(actual, {
      equals,
    });

    fixtures.appendChild(actual);
    actual.style[name] = value;

    const result = toHaveStyle(ctx, 'font-size', value);

    expect(equals).toHaveBeenCalled();
    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have styles Object({ font-size: '10px' })`,
    );
  });

  it('should pass with a dom node with expected regexp style', () => {
    const actual = document.createElement('input');
    const name = 'fontSize';
    const value = /10/;
    const ctx = createFakeContext(actual);

    fixtures.appendChild(actual);
    actual.style[name] = '10px';

    const result = toHaveStyle(ctx, 'font-size', value);

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have styles Object({ font-size: /10/ })`,
    );
  });

  it('should pass with a dom node with expected style as object containing regexp', () => {
    const actual = document.createElement('input');
    const name = 'fontSize';
    const value = /10/;
    const ctx = createFakeContext(actual);

    fixtures.appendChild(actual);
    actual.style[name] = '10px';

    const result = toHaveStyle(ctx, {
      [name]: value,
    });

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have styles Object({ fontSize: /10/ })`,
    );
  });
});
