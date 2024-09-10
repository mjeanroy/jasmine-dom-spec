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

import { isArrayLike } from './is-array-like';
import { isDomElement } from './is-dom-element';
import { isString } from './is-string';
import { isNil } from './is-nil';
import { isNodeCollection } from './is-node-collection';

/**
 * Translate a value to a valid DOM Node:
 * - Return exact DOM node if `value` is already a DOM element.
 * - Throw error otherwise.
 *
 * @param {*} value Value to translate to a DOM element.
 * @param {function} pp A pretty printer function used to format error message in case of an error.
 * @return {HTMLElement} The DOM element.
 */
export function toDomElement(value, pp) {
  if (isDomElement(value)) {
    return value;
  }

  const nodes = isString(value) ? createNodes(value) : value;
  const maybeDomNode = isNodeCollection(nodes) || isArrayLike(nodes) ? extractSingleNode(nodes, pp) : nodes;

  if (isDomElement(maybeDomNode)) {
    return maybeDomNode;
  }

  const unwrappedDomNode = unwrapDomNode(maybeDomNode);
  if (!unwrappedDomNode) {
    throw new Error(`Expect DOM node but found: ${pp(value)}`);
  }

  return unwrappedDomNode;
}

/**
 * Unwrap angular `DebugElement` to return associated native DOM node.
 *
 * @param {*} value Angular `DebugElement`
 * @returns {*} DOM Node if `value` is a `DebugElement`, or something else.
 */
function unwrapNgDebugElement(value) {
  return value.nativeElement;
}

/**
 * Unwrap angular `VueWrapper` to return associated native DOM node.
 *
 * @param {*} value Vue `VueWrapper`
 * @returns {*} DOM Node if `value` is a `VueWrapper`, or something else.
 */
function unwrapVueWrapper(value) {
  return value.element;
}

/**
 * Unwrap render result of react-testing-library to return associated native DOM node.
 *
 * @param {*} value Result of react-testing-library `render`.
 * @returns {*} DOM Node if `value` is the result of react-testing-library `render`, or something else.
 */
function unwrapReactTestingLibraryResult(value) {
  return value.baseElement;
}

const unwrapFunctions = [
  unwrapNgDebugElement,
  unwrapVueWrapper,
  unwrapReactTestingLibraryResult,
];

/**
 * Try to unwrap DOM Node from given structure.
 *
 * @param {*} wrapper DOM Node wrapper.
 * @returns {HTMLElement | null} The unwrapped DOM node, `null` otherwise.
 */
function unwrapDomNode(wrapper) {
  if (isNil(wrapper)) {
    return null;
  }

  for (let i = 0; i < unwrapFunctions.length; ++i) {
    const unwrappedNode = unwrapFunctions[i](wrapper);
    if (isDomElement(unwrappedNode)) {
      return unwrappedNode;
    }
  }

  return null;
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
 * @param {function} pp A pretty printer function used to format error message in case of an error.
 * @return {HTMLElement} DOM Node.
 */
function extractSingleNode(value, pp) {
  const size = value.length;
  if (size === 0) {
    throw new Error('Expect valid node but found empty node list');
  }

  if (size > 1) {
    throw new Error(`Expect single node but found node list of ${size} nodes: ${pp(value)}`);
  }

  return value[0];
}
