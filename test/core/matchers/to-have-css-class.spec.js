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

import {toHaveCssClass} from '../../../src/core/matchers/to-have-css-class';

describe('toHaveCssClass', () => {
  it('should pass with a dom node with expected class', () => {
    const actual = document.createElement('div');
    actual.className = 'foo bar';

    const result = toHaveCssClass({actual}, 'foo');

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have css class 'foo'`
    );
  });

  it('should pass with a list of classes', () => {
    const actual = document.createElement('div');
    actual.className = 'foo bar';

    const result = toHaveCssClass({actual}, 'bar foo');

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have css class 'bar foo'`
    );
  });

  it('should pass with an array of classes', () => {
    const actual = document.createElement('div');
    actual.className = 'foo bar';

    const result = toHaveCssClass({actual}, ['foo', 'bar']);

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have css class [ 'foo', 'bar' ]`
    );
  });

  it('should not pass if a css class is missing with a list of classes', () => {
    const actual = document.createElement('div');
    actual.className = 'foo';

    const result = toHaveCssClass({actual}, 'foo bar');

    expect(result).toEqual({
      pass: false,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have css class 'foo bar'`
    );
  });

  it('should not pass if a css class is missing with an array of classes', () => {
    const actual = document.createElement('div');
    actual.className = 'foo';

    const result = toHaveCssClass({actual}, ['foo', 'bar']);

    expect(result).toEqual({
      pass: false,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have css class [ 'foo', 'bar' ]`
    );
  });

  it('should pass with a dom node with expected regexp class', () => {
    const actual = document.createElement('div');
    actual.className = 'foo bar';

    const result = toHaveCssClass({actual}, /foo/);

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have css class /foo/`
    );
  });

  it('should pass with a dom node with expected array of regexp class', () => {
    const actual = document.createElement('div');
    actual.className = 'foo bar';

    const result = toHaveCssClass({actual}, [/foo/, /bar/]);

    expect(result).toEqual({
      pass: true,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have css class [ /foo/, /bar/ ]`
    );
  });

  it('should not pass with a dom node with missing regexp in array', () => {
    const actual = document.createElement('div');
    actual.className = 'foo';

    const result = toHaveCssClass({actual}, [/foo/, /bar/]);

    expect(result).toEqual({
      pass: false,
      message: jasmine.any(Function),
    });

    expect(result.message()).toBe(
      `Expect '${actual.outerHTML}' [NOT] to have css class [ /foo/, /bar/ ]`
    );
  });
});
