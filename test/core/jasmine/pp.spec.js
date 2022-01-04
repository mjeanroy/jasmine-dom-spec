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

import {pp} from '../../../src/core/jasmine/pp.js';

describe('pp', () => {
  let prettyPrinter;

  beforeEach(() => {
    prettyPrinter = jasmine.makePrettyPrinter ? jasmine.makePrettyPrinter() : jasmine.pp;
    spyOn(console, 'error');
  });

  it('should pretty-print null', () => {
    expect(pp(null, prettyPrinter)).toBe('null');
  });

  it('should pretty-print undefined', () => {
    expect(pp(undefined, prettyPrinter)).toBe('undefined');
  });

  it('should pretty-print empty array', () => {
    expect(pp([], prettyPrinter)).toBe('[  ]');
  });

  it('should pretty-print DOM Node', () => {
    const value = document.createElement('div');
    const str = pp(value, prettyPrinter);
    expect(str).toBe(`'${value.outerHTML}'`);
  });
});
