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

import {pp} from '../jasmine/index';
import {isString} from './is-string';
import {isNodeCollection} from './is-node-collection';
import {isJqueryObject} from './is-jquery-object';
import {isArray} from './is-array';
import {isDomElement} from './is-dom-element';

/**
 * Translate a value to a valid DOM Node:
 * - Return exact DOM node if `value` is already a DOM element.
 * - Throw error otherwise.
 *
 * @param {*} value Value to translate to a DOM element.
 * @return {HTMLElement} The DOM element.
 */
export function toDomElement(value) {
  if (isDomElement(value)) {
    return value;
  }

  const nodes = isString(value) ? createNodes(value) : value;
  if (isNodeCollection(nodes) || isJqueryObject(nodes) || isArray(nodes)) {
    return extractSingleNode(nodes);
  }

  throw new Error(`Expect DOM node but found: ${pp(value)}`);
}

/**
 * Translate HTML content to a `NodeList` element.
 *
 * @param {string} html HTML Content.
 * @return {NodeList} The node list wrapper.
 */
function createNodes(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.childNodes;
}

/**
 * Extract DOM from singleton array-like object and:
 * - Throw error if collection is empty.
 * - Throw error if collection contains more than one element.
 *
 * @param {Object} value Array like object (such as `NodeList`, `HTMLCollection` or `jQuery` instance).
 * @return {HTMLElement} DOM Node.
 */
function extractSingleNode(value) {
  const size = value.length;
  if (size === 0) {
    throw new Error('Expect valid node but found empty node list');
  }

  if (size > 1) {
    throw new Error(`Expect single node but found node list of ${size} nodes: ${pp(value)}`);
  }

  const node = value[0];

  if (!isDomElement(node)) {
    throw new Error(`Expect single node but found value: ${pp(value)}`);
  }

  return node;
}
