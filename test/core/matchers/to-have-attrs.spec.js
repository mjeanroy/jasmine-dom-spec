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

import { toHaveAttrs } from '../../../src/core/matchers/to-have-attrs';
import { createFakeContext } from '../test/create-fake-context';

describe('toHaveAttrs', () => {
  it('should pass with a dom node with expected attributes', () => {
    const actual = document.createElement('div');
    const equals = jasmine.createSpy('equals').and.callFake((a, b) => a === b);
    const ctx = createFakeContext(actual, {
      equals,
    });

    actual.setAttribute('data-foo', 1);

    const result = toHaveAttrs(ctx, 'data-foo', '1');

    expect(equals).toHaveBeenCalled();
    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have attributes Object({ data-foo: '1' })`,
    );
  });

  it('should pass without attribute value', () => {
    const actual = document.createElement('div');
    const equals = jasmine.createSpy('equals').and.callFake((a, b) => a === b);
    const ctx = createFakeContext(actual, {
      equals,
    });

    actual.setAttribute('data-foo', 1);

    const result = toHaveAttrs(ctx, 'data-foo');

    expect(equals).not.toHaveBeenCalled();
    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have attributes Object({ data-foo: undefined })`,
    );
  });

  it('should not pass with a dom node without expected attributes', () => {
    const actual = document.createElement('input');
    const equals = jasmine.createSpy('equals').and.callFake((a, b) => a === b);
    const ctx = createFakeContext(actual, {
      equals,
    });

    actual.setAttribute('data-foo', '0');

    const result = toHaveAttrs(ctx, 'data-foo', '1');

    expect(equals).toHaveBeenCalled();
    expect(result).toEqual({
      pass: false,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have attributes Object({ data-foo: '1' })`,
    );
  });

  it('should pass with a dom node with matching attribute regexp', () => {
    const actual = document.createElement('div');
    const ctx = createFakeContext(actual);

    actual.setAttribute('data-foo', 1);

    const result = toHaveAttrs(ctx, 'data-foo', /1/);

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have attributes Object({ data-foo: /1/ })`,
    );
  });

  it('should pass with a dom node with matching attribute object containing a regexp', () => {
    const actual = document.createElement('div');
    const ctx = createFakeContext(actual);

    actual.setAttribute('data-foo', 1);

    const result = toHaveAttrs(ctx, {
      'data-foo': /1/,
    });

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have attributes Object({ data-foo: /1/ })`,
    );
  });
});
