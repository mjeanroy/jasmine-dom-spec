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

import {toBeDisplayed} from '../../../src/core/matchers/to-be-displayed';

describe('toBeDisplayed', () => {
  let fixtures;

  beforeEach(() => {
    fixtures = document.createElement('div');
    document.body.appendChild(fixtures);
  });

  afterEach(() => {
    document.body.removeChild(fixtures);
  });

  it('should pass with a simple div', () => {
    const actual = document.createElement('div');
    fixtures.appendChild(actual);

    const equals = jasmine.createSpy('equals').and.callFake((x, y) => x === y);
    const result = toBeDisplayed({actual, equals});

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to be displayed`
    );
  });

  it('should not pass with a display:none div', () => {
    const actual = document.createElement('div');
    actual.style.display = 'none';
    fixtures.appendChild(actual);

    const equals = jasmine.createSpy('equals').and.callFake((x, y) => x === y);
    const result = toBeDisplayed({actual, equals});

    expect(result).toEqual({
      pass: false,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to be displayed`
    );
  });

  it('should be ok with a detached node', () => {
    const actual = document.createElement('div');
    const equals = jasmine.createSpy('equals').and.callFake((x, y) => x === y);
    const result = toBeDisplayed({actual, equals});

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to be displayed`
    );
  });
});
