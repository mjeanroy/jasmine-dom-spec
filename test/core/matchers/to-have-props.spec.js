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

import { toHaveProps } from '../../../src/core/matchers/to-have-props';
import { createFakeContext } from '../test/create-fake-context';

describe('toHaveProps', () => {
  it('should pass with a dom node with expected id', () => {
    const actual = document.createElement('input');
    const equals = jasmine.createSpy('equals').and.callFake((a, b) => a === b);
    const ctx = createFakeContext(actual, {
      equals,
    });

    actual.required = true;

    const result = toHaveProps(ctx, 'required', true);

    expect(equals).toHaveBeenCalled();
    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have properties Object({ required: true })`,
    );
  });

  it('should not pass with a dom node without expected id', () => {
    const actual = document.createElement('input');
    const equals = jasmine.createSpy('equals').and.callFake((a, b) => a === b);
    const ctx = createFakeContext(actual, {
      equals,
    });

    actual.required = true;

    const result = toHaveProps(ctx, 'required', false);

    expect(equals).toHaveBeenCalled();
    expect(result).toEqual({
      pass: false,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have properties Object({ required: false })`,
    );
  });

  it('should pass with a dom node with expected id regexp', () => {
    const actual = document.createElement('input');
    const ctx = createFakeContext(actual);

    actual.id = 'awesome-id-123456';

    const result = toHaveProps(ctx, 'id', /awesome-id/);

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have properties Object({ id: /awesome-id/ })`,
    );
  });

  it('should pass with a dom node with expected props object containing regexp', () => {
    const actual = document.createElement('input');
    const ctx = createFakeContext(actual);

    actual.id = 'awesome-id-123456';
    actual.required = true;

    const result = toHaveProps(ctx, {
      id: /awesome-id/,
      required: /true/,
    });

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have properties Object({ id: /awesome-id/, required: /true/ })`,
    );
  });
});
