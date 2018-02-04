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

import {isNodeCollection} from '../../../src/core/util/is-node-collection';

describe('isNodeList', () => {
  let fixtures;

  beforeEach(() => {
    fixtures = document.createElement('div');

    fixtures.appendChild(document.createElement('p'));
    fixtures.appendChild(document.createElement('p'));

    document.body.appendChild(fixtures);
  });

  afterEach(() => {
    document.body.removeChild(fixtures);
  });

  it('should return true with NodeList instance', () => {
    const children = fixtures.childNodes;
    expect(isNodeCollection(children)).toBe(true);
  });

  it('should return true with HTMLCollection instance', () => {
    const p = fixtures.getElementsByTagName('p');
    expect(isNodeCollection(p)).toBe(true);
  });

  it('should return false without NodeList or HTMLCollection', () => {
    expect(isNodeCollection(0)).toBe(false);
    expect(isNodeCollection(true)).toBe(false);
    expect(isNodeCollection({})).toBe(false);
    expect(isNodeCollection(() => {})).toBe(false);
    expect(isNodeCollection([])).toBe(false);
    expect(isNodeCollection(null)).toBe(false);
    expect(isNodeCollection(undefined)).toBe(false);
  });
});
