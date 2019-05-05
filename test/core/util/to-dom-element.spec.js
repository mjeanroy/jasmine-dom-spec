/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2019 Mickael Jeanroy
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

import $ from 'jquery';
import {toDomElement} from '../../../src/core/util/to-dom-element';

describe('toDomElement', () => {
  let fixtures;

  beforeEach(() => {
    fixtures = document.createElement('div');
    document.body.appendChild(fixtures);
  });

  afterEach(() => {
    document.body.removeChild(fixtures);
  });

  it('should return a DOM Node', () => {
    const node = document.createElement('div');
    const result = toDomElement(node);
    expect(result).toBe(node);
  });

  it('should return a DOM Node from an array containing one node', () => {
    const node = document.createElement('div');
    const nodes = [node];
    const result = toDomElement(nodes);
    expect(result).toBe(node);
  });

  it('should return a DOM Node from a NodeList containing one node', () => {
    const node = document.createElement('div');
    fixtures.appendChild(node);
    const result = toDomElement(fixtures.childNodes);
    expect(result).toBe(node);
  });

  it('should return a DOM Node from a jQuery object containing one node', () => {
    const node = $('<div></div>');
    const result = toDomElement(node);
    expect(result).toBe(node[0]);
  });

  it('should return a DOM Node from an array containing one node', () => {
    const node = document.createElement('div');
    const nodes = [node];
    const result = toDomElement(nodes);
    expect(result).toBe(node);
  });

  it('should return a DOM Node from string template', () => {
    const html = '<div id="foo-bar"></div>';
    const result = toDomElement(html);
    expect(result).toBeDefined();
    expect(result.nodeType).toBe(1);
    expect(result.id).toBe('foo-bar');
  });

  it('should fail to return DOM Node from an empty node list', () => {
    const nodeList = fixtures.childNodes;
    expect(() => toDomElement(nodeList)).toThrow(Error('Expect valid node but found empty node list'));
  });

  it('should fail to return DOM Node from an empty jQuery object', () => {
    const nodes = $(fixtures).children();
    expect(() => toDomElement(nodes)).toThrow(Error('Expect valid node but found empty node list'));
  });

  it('should fail to return DOM Node from an empty array', () => {
    expect(() => toDomElement([])).toThrow(Error('Expect valid node but found empty node list'));
  });

  it('should fail to return DOM Node if node list contains more than one element', () => {
    const n1 = document.createElement('span');
    const n2 = document.createElement('span');
    fixtures.appendChild(n1);
    fixtures.appendChild(n2);

    const nodeList = fixtures.childNodes;
    expect(() => toDomElement(nodeList)).toThrow(
        Error(`Expect single node but found node list of 2 nodes: ${jasmine.pp(nodeList)}`)
    );
  });

  it('should fail to return DOM Node if jQuery object contains more than one element', () => {
    const n1 = document.createElement('form');
    const n2 = document.createElement('form');
    fixtures.appendChild(n1);
    fixtures.appendChild(n2);

    const nodes = $(fixtures).children();
    expect(() => toDomElement(nodes)).toThrow(
        Error(`Expect single node but found node list of 2 nodes: ${jasmine.pp(nodes)}`)
    );
  });

  it('should fail to return DOM Node from an array containing a single value that is not a DOM node', () => {
    const array = ['foo'];
    expect(() => toDomElement(array)).toThrow(Error(`Expect single node but found value: [ 'foo' ]`));
  });

  it('should fail to return DOM Node with a number', () => {
    expect(() => toDomElement(0)).toThrow(Error(`Expect DOM node but found: 0`));
  });

  it('should fail to return DOM Node with a date', () => {
    const value = new Date();
    expect(() => toDomElement(value)).toThrow(
        Error(`Expect DOM node but found: ${jasmine.pp(value)}`)
    );
  });

  it('should fail to return DOM Node with null', () => {
    expect(() => toDomElement(null)).toThrow(Error(`Expect DOM node but found: null`));
  });

  it('should fail to return DOM Node with undefined', () => {
    expect(() => toDomElement(undefined)).toThrow(Error(`Expect DOM node but found: undefined`));
  });
});
