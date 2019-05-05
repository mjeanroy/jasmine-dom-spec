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
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
  'use strict';

  // Check version
  var _version = jasmine.version_ || jasmine.version;

  if (_version.major) {
    _version = _version.major;
  } else {
    _version = parseInt(_version.split('.')[0], 10);
  }
  /**
   * Major version of Jasmine being imported.
   * @type {number}
   */


  var version = _version;

  /**
   * Check that a given value is `null`.
   *
   * @param {*} obj Value to check.
   * @return {boolean} `true` if `obj` is `null`, `false` otherwise.
   */
  function isNull(obj) {
    return obj === null;
  }

  /**
   * Check that a given value is `undefined`.
   *
   * @param {*} obj Value to check.
   * @return {boolean} `true` if `obj` is `undefined`, `false` otherwise.
   */
  function isUndefined(obj) {
    return obj === undefined;
  }

  /**
   * Check that a given value is an object.
   *
   * @param {*} obj Value to check.
   * @return {boolean} `true` if `obj` is an object, `false` otherwise.
   */

  function isObject(obj) {
    return !isNull(obj) && typeof obj === 'object';
  }

  /**
   * The type value for element nodes.
   * @see https://developer.mozilla.org/fr/docs/Web/API/Node
   */

  var ELEMENT_NODE = 1;
  /**
   * Check if an object is a DOM node.
   *
   * @param {*} actual The object to test.
   * @return {boolean} `true` if `actual` is a DOM node, `false` otherwise.
   */

  function isDomElement(actual) {
    if (isNull(actual) || isUndefined(actual)) {
      return false;
    }

    return isObject(actual) && actual.nodeType === ELEMENT_NODE;
  }

  /**
   * Pretty-Print object (use `jasmine.pp` by default).
   *
   * @param {*} value Object to pretty-print.
   * @return {string} The string representation of object.
   */

  function pp(value) {
    try {
      var str = isDomElement(value) && 'outerHTML' in value ? value.outerHTML : value;
      return jasmine.pp(str);
    } catch (e) {
      // Fallback using object `toString` implementation.
      // Don't worry about `null` or `undefined` since it should be handled
      // by `jasmine.pp`
      return value.toString();
    }
  }

  var PLACEHOLDER = '[NOT]';
  /**
   * Return message with the appropriate negation:
   * - If `isNot` is `true`, then the pattern `{{not}}` will be replaced by `not`.
   * - Otherwise, the pattern `{{not}}` is replaced by an empty string.
   *
   * @param {boolean} isNot Enable/disable negation.
   * @param {string} message The message.
   * @return {string} The negated message.
   */

  function negateMessage(isNot, message) {
    if (!message) {
      return '';
    }

    var notKey = isNot ? PLACEHOLDER : PLACEHOLDER + " ";
    var notValue = isNot ? 'not' : '';
    return message.replace(notKey, notValue);
  }

  /**
   * This factory will create a matcher supported by Jasmine 1.3.X.
   *
   * This factory takes a generic matcher function (matcher defined in this project)
   * and returns the matcher that can be used with Jasmine 1.3.
   *
   * @param {function} fn Generic matcher function.
   * @return {function} Jasmine 1.3 official matcher.
   * @see https://jasmine.github.io/1.3/introduction#section-Writing_a_custom_matcher
   */

  function jasmine1MatcherFactory(fn) {
    /**
     * Jasmine 1.3.X matcher.
     *
     * @return {boolean} The result of the expectation.
     */
    return function jasmine1Matcher() {
      // The `this` object is equals to the current test context.
      // eslint-disable-next-line no-invalid-this
      var env = this.env; // eslint-disable-next-line no-invalid-this

      var equals_ = this.env.equals_; // eslint-disable-next-line no-invalid-this

      var actual = this.actual; // eslint-disable-next-line no-invalid-this

      var isNot = this.isNot;
      var ctx = {
        actual: actual,
        isNot: isNot,
        // Adapter for `callCount`
        // https://jasmine.github.io/1.3/introduction#section-Spies
        callCount: function callCount(spy) {
          return spy.callCount;
        },
        // Adapter for `argsFor`
        // https://jasmine.github.io/1.3/introduction#section-Spies
        argsFor: function argsFor(spy, call) {
          return spy.argsForCall[call];
        },
        // Adapter for custom equality.
        equals: function equals() {
          for (var _len2 = arguments.length, equalsArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            equalsArgs[_key2] = arguments[_key2];
          }

          return equals_.apply(env, equalsArgs);
        }
      };

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = fn.apply(ctx, [ctx].concat(args));
      var pass = isNot ? !result.pass : result.pass;

      if (!pass) {
        // eslint-disable-next-line no-invalid-this
        this.message = function() {
          return negateMessage(isNot, result.message());
        };
      }

      return pass;
    };
  }

  /**
   * This factory will create a matcher supported by Jasmine 2.X.X.
   *
   * This factory takes a generic matcher function (matcher defined in this project)
   * and returns the matcher that can be used with Jasmine 2.
   *
   * @param {function} fn Generic matcher function.
   * @return {function} Jasmine2 official matcher.
   * @see https://jasmine.github.io/2.5/custom_matcher.html
   */

  function jasmine2MatcherFactory(fn) {
    /**
     * Jasmine 2.X.X matcher.
     *
     * @param {Object} util Jasmine util object.
     * @param {Object} customEqualityTesters List of equality functions registered in Jasmine.
     * @return {Object} An object containing `compare` and `negativeCompare` function
     *                  that will be executed by Jasmine..
     */
    return function jasmine2Matcher(util, customEqualityTesters) {
      var ctx = {
        // Adapter for `callCount`.
        // See: https://jasmine.github.io/2.5/introduction#section-Spies
        callCount: function callCount(spy) {
          return spy.calls.count();
        },
        // Adapter for `argsFor`.
        // See: https://jasmine.github.io/2.5/introduction#section-Spies
        argsFor: function argsFor(spy, call) {
          return spy.calls.argsFor(call);
        },
        // Adapter for custom equals functions.
        // See: https://jasmine.github.io/2.5/custom_equality.html
        equals: function equals(a, b) {
          return util.equals(a, b, customEqualityTesters);
        }
      };
      return {
        /**
         * Jasmine2 compare function that will be called when a custom matcher is used with:
         *  `expect(value).toCustomMatcher(...)`.
         *
         * @param {*} actual Object being tested (the object being given in `expect` call).
         * @param {Array<*>} args The matcher arguments (arguments being given to `toCustomMatcher` call).
         * @return {Object} The test result.
         */
        compare: function compare(actual) {
          ctx.actual = actual;
          ctx.isNot = false;

          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var result = fn.apply(void 0, [ctx].concat(args));
          return {
            pass: result.pass,
            message: function message() {
              return negateMessage(false, result.message());
            }
          };
        },

        /**
         * Jasmine2 compare function that will be called when a custom matcher is used with:
         *  `expect(value).not.toCustomMatcher(...)`.
         *
         * @param {*} actual Object being tested (the object being given in `expect` call).
         * @param {Array<*>} args The matcher arguments (arguments being given to `toCustomMatcher` call).
         * @return {void}
         */
        negativeCompare: function negativeCompare(actual) {
          ctx.actual = actual;
          ctx.isNot = true;

          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          var result = fn.apply(void 0, [ctx].concat(args));
          return {
            pass: !result.pass,
            message: function message() {
              return negateMessage(true, result.message());
            }
          };
        }
      };
    };
  }

  var factories = {
    1: jasmine1MatcherFactory,
    // Api for custom matchers with jasmine 2 and jasmine 3 is the same.
    2: jasmine2MatcherFactory,
    3: jasmine2MatcherFactory
  };
  /**
   * Create Jasmine matcher.
   * The created matcher will depends on the jasmine's version being used.
   *
   * @param {function} matcher Generic matcher function.
   * @return {function} A matcher that can be used with Jasmine 1.3.X / 2.X.X.
   */

  function createMatcher(matcher) {
    return (factories[version] || jasmine2MatcherFactory)(matcher);
  }

  /**
   * Apply a predicate function on all the values of an array (also supports array-like
   * objects).
   *
   * The iteratee function will be called with three arguments:
   *  - `value` The value for the given iteration.
   *  - `index` The index of the value being iterated.
   *  - `array` The array being traversed.
   *
   * @param {Array<*>} array The array to iterate.
   * @param {function} iteratee The iteratee function.
   * @return {void}
   */
  function forEach(array, iteratee) {
    for (var i = 0, size = array.length; i < size; ++i) {
      iteratee.call(null, array[i], i, array);
    }
  }

  /**
   * Check if a key is a property of a given object (i.e this is the result
   * of `Object.hasOwnProperty` method).
   *
   * @param {Object} object Object to check.
   * @param {string} prop Property (a.k.a key) to look for.
   * @return {boolean} `true` if `prop` is a key of `object`, `false` otherwise.
   */
  function has(object, prop) {
    return Object.prototype.hasOwnProperty.call(object, prop);
  }

  var objectKeys = Object.keys || function _keys(o) {
    var results = [];

    for (var key in o) {
      if (has(o, key)) {
        results.push(key);
      }
    }

    return results;
  };
  /**
   * Get all own and enumerable keys of an object.
   *
   * @param {Object} obj Object to extract keys.
   * @return {Array<string>} An array of all the keys in the object.
   */


  function keys(obj) {
    return objectKeys(obj);
  }

  /**
   * Check if a key is a property of a given object or an inherited property.
   *
   * @param {Object} object Object to check.
   * @param {string} prop Property (a.k.a key) to look for.
   * @return {boolean} `true` if `prop` is a key in `object`, `false` otherwise.
   */
  function hasIn(object, prop) {
    return prop in object;
  }

  /**
   * Check that given object has given property in its prototype chain.
   *
   * @param {Object} o The object.
   * @param {string} prop Property name.
   * @param {string} message The error message.
   * @return {Object} The original object.
   */

  function ensureHasIn(o, prop, message) {
    if (!hasIn(o, prop)) {
      throw new Error(message);
    }

    return o;
  }

  /**
   * Return the tag name of the object (a.k.a the result of `Object.prototype.toString`).
   *
   * @param {*} obj Object to get tag name.
   * @return {string} Tag name.
   */

  function tagName(obj) {
    // Handle null and undefined since it may fail on some browser.
    if (isNull(obj)) {
      return '[object Null]';
    }

    if (isUndefined(obj)) {
      return '[object Undefined]';
    }

    var tag = Object.prototype.toString.call(obj); // IE11 on Win10 returns `[object Object]` with `Map` and `Set`.
    // IE8 returns `[object Object]` with NodeList and HTMLCollection.
    // Try to patch this bug and return the appropriate tag value.

    if (tag === '[object Object]') {
      // -- IE8 Patch
      // Handle NodeList (IE8 only).
      if (obj instanceof NodeList) {
        return '[object NodeList]';
      } // Handle HTMLCollection (IE8 only).


      if (obj instanceof HTMLCollection) {
        return '[object HTMLCollection]';
      } // Handle HTMLCollection (IE8 only).


      if (has(obj, 'callee')) {
        return '[object Arguments]';
      }
    }

    return tag;
  }

  /**
   * Check that a given value is of a given type.
   * The type is the tag name displayed with `Object.prototype.toString`
   * function call.
   *
   * @param {*} obj Value to check.
   * @param {string} type The type id.
   * @return {boolean} `true` if `obj` is of given type, `false` otherwise.
   */

  function is(obj, type) {
    return tagName(obj) === "[object " + type + "]";
  }

  /**
   * Check that a given value is a string.
   *
   * @param {*} obj Value to check.
   * @return {boolean} `true` if `obj` is a string, `false` otherwise.
   */

  function isString(obj) {
    return is(obj, 'String');
  }

  /**
   * Check if the parameter is a node list (i.e collections of nodes such as
   * those returned by properties such as `Node.childNodes` and
   * the `document.querySelectorAll()` method) or an HTML Collection (i.e a
   * generic collection (array-like object similar to `arguments`) of
   * elements (in document order)).
   *
   * @param {*} obj Object to test.
   * @return {boolean} `true` if `obj` is a `NodeList` or an `HTMLCollection`, `false` otherwise.
   */

  function isNodeCollection(obj) {
    return is(obj, 'NodeList') || is(obj, 'HTMLCollection');
  }

  /**
   * Check that a predicate satisfies each elements in an array.
   *
   * The predicate function will be called with three arguments:
   *  - `value` The value for the given iteration.
   *  - `key` The key of the value being iterated.
   *  - `array` The array being traversed.
   *
   * @param {Array} array The array to iterate.
   * @param {function} predicate The predicate function.
   * @return {boolean} `true` if the predicate returns a truthy value for each element
   *                   in the array, `false` otherwise.
   */
  function every(array, predicate) {
    for (var i = 0, size = array.length; i < size; ++i) {
      if (!predicate.call(null, array[i], i, array)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check that a given value is a function.
   *
   * @param {*} value Value to check.
   * @return {boolean} `true` if `value` is a function, `false` otherwise.
   */

  function isFunction(value) {
    return is(value, 'Function');
  }

  /**
   * Check that a given value is a number.
   *
   * @param {*} obj Value to check.
   * @return {boolean} `true` if `obj` is a number, `false` otherwise.
   */

  function isNumber(obj) {
    return is(obj, 'Number');
  }

  // An object with these methods will be considered a jQuery object.

  var JQ_METHODS = ['addClass', 'prop', 'attr', 'html', 'text'];
  /**
   * Check if the parameter is an HTML collection (i.e  a generic collection (array-like
   * object similar to `arguments`) of elements (in document order)).
   *
   * @param {*} obj Object to test.
   * @return {boolean} `true` if `obj` is an `HTMLCollection`, `false` otherwise.
   */

  function isJqueryObject(obj) {
    // Fail fast with `primitive types`.
    if (!isObject(obj)) {
      return false;
    } // If `obj` is an instance of global jQuery, we are sure it is a jQuery object.


    if (isJqueryGloballyAvailable() && obj instanceof jQuery) {
      return true;
    } // Use duck-typing ; each jQuery instances should have:
    // - A `length` property that is a `number` greater than or equal to zero.
    // - Mandatory methods listed below.


    return isNumber(obj.length) && obj.length >= 0 && every(JQ_METHODS, function(x) {
        return isFunction(obj[x]);
      });
  }
  /**
   * Check if `jQuery` is globally available (i.e available on `window` object).
   *
   * @return {boolean} `true` if `jQuery` is globally available, `false` otherwise.
   */

  function isJqueryGloballyAvailable() {
    return typeof jQuery !== 'undefined';
  }

  var _isArray = Array.isArray || function _isArray(obj) {
    return is(obj, 'Array');
  };
  /**
   * Check that a given value is an array.
   *
   * @param {*} obj Value to check.
   * @return {boolean} `true` if `obj` is an array, `false` otherwise.
   */


  function isArray(obj) {
    return _isArray(obj);
  }

  /**
   * Translate a value to a valid DOM Node:
   * - Return exact DOM node if `value` is already a DOM element.
   * - Throw error otherwise.
   *
   * @param {*} value Value to translate to a DOM element.
   * @return {HTMLElement} The DOM element.
   */

  function toDomElement(value) {
    if (isDomElement(value)) {
      return value;
    }

    var nodes = isString(value) ? createNodes(value) : value;

    if (isNodeCollection(nodes) || isJqueryObject(nodes) || isArray(nodes)) {
      return extractSingleNode(nodes);
    }

    throw new Error("Expect DOM node but found: " + pp(value));
  }
  /**
   * Translate HTML content to a `NodeList` element.
   *
   * @param {string} html HTML Content.
   * @return {NodeList} The node list wrapper.
   */

  function createNodes(html) {
    var div = document.createElement('div');
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
    var size = value.length;

    if (size === 0) {
      throw new Error('Expect valid node but found empty node list');
    }

    if (size > 1) {
      throw new Error("Expect single node but found node list of " + size + " nodes: " + pp(value));
    }

    var node = value[0];

    if (!isDomElement(node)) {
      throw new Error("Expect single node but found value: " + pp(value));
    }

    return node;
  }

  /**
   * Check that the tested object is a DOM node with a property `checked` equal
   * to `true`.
   *
   * @message Expect [actual] [NOT] to be checked
   * @example
   *   const actual = document.createElement('input');
   *   actual.type = 'checkbox';
   *   actual.checked = true;
   *   expect(actual).toBeChecked();
   *
   * @param {Object} ctx Test context.
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toBeChecked(_ref) {
    var actual = _ref.actual;
    var node = toDomElement(actual);
    ensureHasIn(node, 'checked', 'Cannot run `toBeChecked` matcher on a DOM node without `checked` property');
    return {
      pass: node.checked === true,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to be checked";
      }
    };
  }

  /**
   * Check that the tested object is a DOM node not attached to the
   * current active document window.
   *
   * @message Expect [actual] [NOT] to be detached element
   * @example
   *   const actual = document.createElement('div');
   *   expect(actual).toBeDetachedElement();
   *   document.body.appendChild(actual);
   *   expect(actual).not.toBeDetachedElement();
   *
   * @param {Object} ctx Test context.
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toBeDetachedElement(_ref) {
    var actual = _ref.actual;
    var node = toDomElement(actual);
    var isDetached = true;
    var parentNode = node;

    while (parentNode) {
      if (parentNode === document || parentNode === document.body) {
        isDetached = false;
        break;
      }

      parentNode = parentNode.parentNode;
    }

    return {
      pass: isDetached,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to be detached element";
      }
    };
  }

  /**
   * Check that the tested object is a DOM node with a property `disabled` equal
   * to `true`.
   *
   * @message Expect [actual] [NOT] to be disabled
   * @example
   *   const actual = document.createElement('input');
   *   actual.disabled = true;
   *   expect(actual).toBeDisabled();
   *
   * @param {Object} ctx Test context.
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toBeDisabled(_ref) {
    var actual = _ref.actual;
    var node = toDomElement(actual);
    ensureHasIn(node, 'disabled', 'Cannot run `toBeDisabled` matcher on a DOM node without `disabled` property');
    return {
      pass: node.disabled === true,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to be disabled";
      }
    };
  }

  /**
   * Check that a given object has a specific key in its prototype chain.
   *
   * @param {*} obj Value to check.
   * @param {string} key Key name.
   * @return {boolean} `true` if `obj` has `key` property, `false` otherwise.
   */
  function isIn(obj, key) {
    return key in obj;
  }

  /**
   * Check that the tested object is displayed: it means that it does not
   * have a `display` style set to `none`..
   *
   * @message Expect [actual] [NOT] to be displayed
   * @example
   *   const actual = document.createElement('div');
   *   expect(actual).toBeDisplayed();
   *
   *   actual.style.display = 'none';
   *   expect(actual).not.toBeDisplayed();
   *
   * @param {Object} ctx Test context.
   * @return {Object} Test result.
   * @since 0.4.0
   */

  function toBeDisplayed(_ref) {
    var actual = _ref.actual,
      equals = _ref.equals;
    var node = toDomElement(actual);
    var display = getCurrentDisplayStyleValue(node);
    var ok = !equals(display, 'none');
    return {
      pass: ok,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to be displayed";
      }
    };
  }
  /**
   * Get the value of the `display` css property on given node.
   *
   * @param {Object} node The DOM node.
   * @return {string} The `display` property.
   */

  function getCurrentDisplayStyleValue(node) {
    // Modern browsers.
    if (isIn(node, 'getComputedStyle')) {
      return getComputedDisplayStyle(node);
    } // IE8 does not support `getComputedStyle` method.


    if (isIn(node, 'currentStyle')) {
      return getCurrentDisplayStyle(node);
    } // If we are here, then it's weird since `getComputedStyle` and `currentStyle` are not supported.
    // Use the `style` property as a fallback.


    return node.style.display;
  }
  /**
   * Extract the computed value of the `display` style property.
   * Note that with a detached node, calling `getComputedStyle#getPropertyValue` may fail
   * on some version of IE (at least, IE9, IE10). In this case, the value of the
   * inline-style will be returned.
   *
   * @param {Object} node The DOM node.
   * @return {string} The `display` computed value.
   */


  function getComputedDisplayStyle(node) {
    try {
      return node.getComputedStyle().getPropertyValue('display');
    } catch (e) {
      // May happen with a detached node on IE <= 10.
      // Fallback to inline style value.
      return node.style.display;
    }
  }
  /**
   * Extract the current style value of the `display` style property.
   * This function is a fallback for `getComputedStyle` on IE8.
   *
   * Note that with a detached node, calling `getComputedStyle#getPropertyValue` may fail.
   * In this case, the value of the inline-style will be returned.
   *
   * @param {Object} node The DOM node.
   * @return {string} The `display` computed value.
   */


  function getCurrentDisplayStyle(node) {
    try {
      return node.currentStyle.display;
    } catch (e) {
      // May happen with a detached node.
      // Fallback to inline style value.
      return node.style.display;
    }
  }

  /**
   * Check that the tested object has focus on the active document window (note that if
   * element is not attached to the DOM, it can't have focus).
   *
   * @message Expect [actual] [NOT] to be focused
   * @example
   *   const actual = document.getElementById('my-input');
   *   actual.focus();
   *   expect(actual).toBeFocused();
   *
   * @param {Object} ctx Test context.
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toBeFocused(_ref) {
    var actual = _ref.actual;
    var node = toDomElement(actual);
    var activeElement = document.activeElement;
    return {
      pass: activeElement === node,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to be focused";
      }
    };
  }

  /**
   * Check that the tested object is a DOM node property `indeterminate` equal
   * to `true`.
   *
   * @message Expect [actual] [NOT] to be indeterminate
   * @example
   *   const actual = document.createElement('input');
   *   actual.type = 'checkbox';
   *   actual.indeterminate = true;
   *   expect(actual).toBeIndeterminate();
   *
   * @param {Object} ctx Test context.
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toBeIndeterminate(_ref) {
    var actual = _ref.actual;
    var node = toDomElement(actual);
    ensureHasIn(node, 'indeterminate', 'Cannot run `toBeIndeterminate` matcher on a DOM node without `indeterminate` property');
    return {
      pass: node.indeterminate === true,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to be indeterminate";
      }
    };
  }

  /**
   * Check that the tested object is a DOM node with a property `required` equal
   * to `true`.
   *
   * @message Expect [actual] [NOT] to be required
   * @example
   *   const actual = document.createElement('input');
   *   actual.required = true;
   *   expect(actual).toBeRequired();
   *
   * @param {Object} ctx Test context.
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toBeRequired(_ref) {
    var actual = _ref.actual;
    var node = toDomElement(actual);
    ensureHasIn(node, 'required', 'Cannot run `toBeRequired` matcher on a DOM node without `required` property');
    return {
      pass: node.required === true,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to be required";
      }
    };
  }

  /**
   * Check that the tested object is a DOM node with a property `selected` equal
   * to `true`.
   *
   * @message Expect [actual] [NOT] to be selected
   * @example
   *   const actual = document.createElement('option');
   *   actual.selected = true;
   *   expect(actual).toBeSelected();
   *
   * @param {Object} ctx Test context.
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toBeSelected(_ref) {
    var actual = _ref.actual;
    var node = toDomElement(actual);
    ensureHasIn(node, 'selected', 'Cannot run `toBeSelected` matcher on a DOM node without `selected` property');
    return {
      pass: node.selected === true,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to be selected";
      }
    };
  }

  /**
   * Check that a given value is NIL (`null` or `undefined`).
   *
   * @param {*} obj Value to check.
   * @return {boolean} `true` if `obj` is `null` or `undefined`, `false` otherwise.
   */

  function isNil(obj) {
    return isNull(obj) || isUndefined(obj);
  }

  /**
   * Check if a value is a regexp instance.
   *
   * @param {*} value Value to check.
   * @return {boolean} `true` if `value` is a `RegExp`, `false` otherwise.
   */

  function isRegExp(value) {
    return is(value, 'RegExp');
  }

  /**
   * Check if a `string` match a regexp or is equal to an expected other `string`
   * using a custom equal function.
   *
   * @param {string} actual Actual string to compare.
   * @param {string|RegExp} expected The expected string, or the regexp to test.
   * @param {function} equalsFn The equals function, used if `expected` is not a regexp.
   * @return {boolean} `true` if `actual` match or is equal to `expected`, `false` otherwise.
   */

  function matchOrEquals(actual, expected, equalsFn) {
    if (isRegExp(expected)) {
      var actualStr = isNil(actual) ? actual : actual.toString();
      var results = isNil(actualStr) ? null : actualStr.match(expected);
      return isArray(results);
    }

    return equalsFn(actual, expected);
  }

  /**
   * Check that the tested object is a DOM node with expected `id`.
   *
   * @message Expect [actual] [NOT] to have id [id] but was [id]
   * @example
   *   const actual = document.createElement('div');
   *   actual.id = 'foo';
   *   expect(actual).toHaveId();
   *   expect(actual).toHaveId('foo');
   *   expect(actual).toHaveId(jasmine.any(String));
   *   expect(actual).not.toHaveId('bar');
   *
   * @param {Object} ctx Test context.
   * @param {String|RegExp|jasmine.Any|jasmine.Anything} id The expected id or a jasmine matcher (i.e `jasmine.any(<Type>)`).
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toHaveId(_ref, id) {
    var actual = _ref.actual,
      equals = _ref.equals;
    var node = toDomElement(actual);
    var actualId = node.id;
    var checkId = !isUndefined(id);
    var isIdFilled = !isNil(actualId) && actualId !== '';
    var isExpectedId = checkId ? matchOrEquals(actualId, id, equals) : true;
    var pass = isIdFilled && isExpectedId;
    return {
      pass: pass,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to have id" + (checkId ? " " + pp(id) + " but was " + pp(actualId) : '');
      }
    };
  }

  /**
   * Check that the tested object has expected attributes.
   *
   * @message Expect [actual] [NOT] to have attributes [expected]
   * @example
   *   const actual = document.createElement('input');
   *   actual.setAttribute('data-id', '1');
   *   expect(actual).toHaveAttrs('data-id');
   *   expect(actual).toHaveAttrs('data-id', '1');
   *   expect(actual).toHaveAttrs('data-id', /1/);
   *   expect(actual).toHaveAttrs({'data-id': '1'});
   *   expect(actual).toHaveAttrs({'data-id': /1/});
   *   expect(actual).toHaveAttrs({'data-id': jasmine.anything()});
   *
   * @param {Object} ctx Test context.
   * @param {String|Object} attrName Attribute name (or map of attributes).
   * @param {String|RegExp|jasmine.Any|jasmine.Anything} attrValue Attribute value or a jasmine matcher (i.e `jasmine.any(<Type>)`).
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toHaveAttrs(_ref, attrName, attrValue) {
    var _ref2;

    var actual = _ref.actual,
      equals = _ref.equals;
    var node = toDomElement(actual);
    var expected = isObject(attrName) ? attrName : (_ref2 = {}, _ref2[attrName] = attrValue, _ref2);
    var props = keys(expected);
    var ok = every(props, function(attr) {
      if (!node.hasAttribute(attr)) {
        return false;
      }

      var expectedValue = expected[attr];

      if (isUndefined(expectedValue)) {
        return true;
      }

      var actualValue = node.getAttribute(attr);
      return matchOrEquals(actualValue, expectedValue, equals);
    });
    return {
      pass: ok,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to have attributes " + pp(expected);
      }
    };
  }

  /**
   * Apply a predicate function on all the values of an array (also supports array-like
   * objects) and returns an array without elements that satisfied the predicate.
   *
   * The iteratee function will be called with three arguments:
   *  - `value` The value for the given iteration.
   *  - `index` The index of the value being iterated.
   *  - `array` The array being traversed.
   *
   * @param {Array<*>} array The array to iterate.
   * @param {function} predicate The filter function.
   * @return {Array<*>} Array without filtered elements.
   */
  function filter(array, predicate) {
    var results = [];

    for (var i = 0, size = array.length; i < size; ++i) {
      if (predicate.call(null, array[i], i, array)) {
        results.push(array[i]);
      }
    }

    return results;
  }

  /**
   * Index all elements in the array and return the result.
   *
   * @param {Array<*>} array Array to index.
   * @param {function} iteratee The predicate that return the index value.
   * @return {Object} The result as a map object.
   */
  function indexBy(array, iteratee) {
    var map = {};
    var size = array.length;

    for (var i = 0; i < size; ++i) {
      map[iteratee(array[i], i, array)] = array[i];
    }

    return map;
  }

  /**
   * Check that a given value is a truthy value.
   *
   * @param {*} a Value to check.
   * @return {boolean} `true` if parameter is a truthy value.
   */
  function isTruthy(a) {
    return !!a;
  }

  /**
   * Apply a predicate function on all the values of an array (also supports array-like
   * objects) and returns an array of all intermediate results.
   *
   * The iteratee function will be called with three arguments:
   *  - `value` The value for the given iteration.
   *  - `index` The index of the value being iterated.
   *  - `array` The array being traversed.
   *
   * @param {Array<*>} array The array to iterate.
   * @param {function} iteratee The iteratee function.
   * @return {Array<*>} Array containing all intermediate results.
   */
  function map(array, iteratee) {
    var results = [];

    for (var i = 0, size = array.length; i < size; ++i) {
      results.push(iteratee.call(null, array[i], i, array));
    }

    return results;
  }

  /**
   * Check that a predicate satisfies at least one element in an array.
   *
   * The predicate function will be called with three arguments:
   *  - `value` The value for the given iteration.
   *  - `key` The key of the value being iterated.
   *  - `array` The array being traversed.
   *
   * @param {Array} array The array to iterate.
   * @param {function} predicate The predicate function.
   * @return {boolean} `true` if the predicate returns a truthy value for one element
   *                   in the array, `false` otherwise.
   */
  function some(array, predicate) {
    for (var i = 0, size = array.length; i < size; ++i) {
      if (predicate.call(null, array[i], i, array)) {
        return true;
      }
    }

    return false;
  }

  var _trim = String.prototype.trim;
  /**
   * Trim a string (use native String#trim function if available).
   *
   * @param {string} str String to trim.
   * @return {string} Trimmed string.
   */

  function trim(str) {
    if (_trim) {
      return _trim.call(str);
    }

    return str.replace(/^\s+|\s+$/g, '');
  }

  /**
   * Check that the tested object has expected css classes.
   *
   * @message Expect [actual] [NOT] to have css class [cssClass]
   * @example
   *   const actual = document.createElement('div');
   *   actual.className = 'foo bar';
   *   expect(actual).toHaveCssClass('foo');
   *   expect(actual).toHaveCssClass('bar');
   *   expect(actual).toHaveCssClass(/foo/);
   *   expect(actual).toHaveCssClass('foo bar');
   *   expect(actual).toHaveCssClass('bar foo');
   *   expect(actual).toHaveCssClass(['bar', 'foo']);
   *   expect(actual).toHaveCssClass([/bar/, /foo/]);
   *   expect(actual).not.toHaveCssClass('foobar');
   *   expect(actual).not.toHaveCssClass('foo bar baz');
   *
   * @param {Object} ctx Test context.
   * @param {Array<string>|String} expected The expected class name.
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toHaveCssClass(_ref, expected) {
    var actual = _ref.actual;
    var node = toDomElement(actual);
    var actualClasses = extract(node.className);
    var expectedClasses = isArray(expected) ? expected : extract(expected);
    var mapOfClasses = indexBy(actualClasses, function(x) {
      return x;
    });
    var ok = every(expectedClasses, function(cssClass) {
      return isRegExp(cssClass) ? matchOne(actualClasses, cssClass) : has(mapOfClasses, cssClass);
    });
    return {
      pass: ok,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to have css class " + pp(expected);
      }
    };
  }
  /**
   * Extract array of all css classes, removing useless whitespaces.
   * @param {string} classes The class names.
   * @return {Array<string|RegExp>} Array of all class names.
   */

  function extract(classes) {
    if (isRegExp(classes)) {
      return [classes];
    }

    var arrayOfClasses = classes.split(' ');
    var trimmedClasses = map(arrayOfClasses, function(x) {
      return trim(x);
    });
    return filter(trimmedClasses, function(x) {
      return isTruthy(x);
    });
  }
  /**
   * Check if the given regexp match at least one element in the
   * array.
   *
   * @param {array<string>} array Input array.
   * @param {RegExp} regexp The regexp to check.
   * @return {boolean} `true` if the `regexp` match at least one element in `array`, `false` otherwise.
   */


  function matchOne(array, regexp) {
    return some(array, function(x) {
      return matchOrEquals(x, regexp, function(x, y) {
        return x === y;
      });
    });
  }

  /**
   * Check that a given value is a boolean.
   *
   * @param {*} obj Value to test.
   * @return {boolean} `true` if `obj` is a boolean, `false` otherwise.
   */

  function isBoolean(obj) {
    return obj === true || obj === false || is(obj, 'Boolean');
  }

  /**
   * Check that a given value is a primitive object, i.e one of:
   * - A `number`,
   * - A `string`,
   * - A `boolean`
   *
   * @param {*} obj Value to check.
   * @return {boolean} `true` if `obj` is a primitive, `false` otherwise.
   */

  function isPrimitive(obj) {
    return isString(obj) || isNumber(obj) || isBoolean(obj);
  }

  /**
   * Check that the tested object is a DOM node with expected html content.
   * If the expected html parameter is a `number` or a `boolean`, it will be
   * converted to a `string` using its `toString` method.
   *
   * @message Expect [actual] [NOT] to have HTML [expectedHtml] but was [actualHtml]
   * @example
   *   const actual = document.createElement('input');
   *   actual.innerHTML = '<span>foo</span>';
   *   expect(actual).toHaveHtml('<span>foo</span>');
   *   expect(actual).toHaveHtml('/foo/');
   *   expect(actual).toHaveHtml(jasmine.any(String));
   *   expect(actual).not.toHaveHtml('<div>foo</div>');
   *
   * @param {Object} ctx Test context.
   * @param {String|Number|Boolean|RegExp|jasmine.Any|jasmine.Anything} html The expected html or a jasmine matcher (i.e `jasmine.any(<Type>)`).
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toHaveHtml(_ref, html) {
    var actual = _ref.actual,
      equals = _ref.equals;
    var node = toDomElement(actual);
    var actualHtml = node.innerHTML; // Html may be a string **or** a jasmine asymetric matcher object.
    // In the last case, do not try to normalize HTML.

    var expectedHtml = isPrimitive(html) ? normalizeHtml(html.toString()) : html;
    var ok = matchOrEquals(actualHtml, expectedHtml, equals);
    return {
      pass: ok,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to have HTML " + pp(expectedHtml) + " but was " + pp(actualHtml);
      }
    };
  }
  /**
   * Normalize HTML to be able to compare HTML content
   * using browser specific implementation (for example, IE8 turn tag name to
   * upper case).
   *
   * @param {string} html Input.
   * @return {string} output.
   */

  function normalizeHtml(html) {
    var fragment = document.createElement('div');
    fragment.innerHTML = html;
    return fragment.innerHTML;
  }

  /**
   * Check that the tested object has expected properties.
   *
   * @message Expect [actual] [NOT] to have properties [expected]
   * @example
   *   const actual = document.createElement('input');
   *   actual.id = 'node-id';
   *   actual.required = true;
   *   actual.checked = false;
   *   expect(actual).toHaveProps('id', 'node-id');
   *   expect(actual).toHaveProps('id', /node-id/);
   *   expect(actual).toHaveProps('required', true);
   *   expect(actual).toHaveProps('checked', false);
   *   expect(actual).toHaveProps({required: true, checked: false});
   *   expect(actual).toHaveProps({required: jasmine.any(Boolean)});
   *
   * @param {Object} ctx Test context.
   * @param {String|Object} propName Property name (or object of properties).
   * @param {*} propValue Property value.
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toHaveProps(_ref, propName, propValue) {
    var _ref2;

    var actual = _ref.actual,
      equals = _ref.equals;
    var node = toDomElement(actual);
    var expected = isObject(propName) ? propName : (_ref2 = {}, _ref2[propName] = propValue, _ref2);
    var props = keys(expected);
    var ok = every(props, function(p) {
      return matchOrEquals(node[p], expected[p], equals);
    });
    return {
      pass: ok,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to have properties " + pp(expected);
      }
    };
  }

  /**
   * Turn a string, formatted as dash-case to a string formatted as
   * camelCase.
   *
   * @param {string} value The dash-case string.
   * @return {string} The camelCase string.
   */
  function dashToCamel(value) {
    if (!value) {
      return value;
    }

    var result = '';
    var turnToUpper = false;

    for (var i = 0, size = value.length; i < size; ++i) {
      var c = value.charAt(i);

      if (c === '-') {
        turnToUpper = true;
      } else {
        result += turnToUpper ? c.toUpperCase() : c;
        turnToUpper = false;
      }
    }

    return result;
  }

  /**
   * Check that the tested object has expected style value (the css style property
   * name can dash-cased, such as `font-size`, or camel cased, such as `fontSize`).
   *
   * @message Expect [actual] [NOT] to have styles [expected]
   * @example
   *   const actual = document.createElement('input');
   *   actual.required = true;
   *   actual.checked = false;
   *   expect(actual).toHaveStyle('display', 'none');
   *   expect(actual).toHaveStyle('font-size', '10px');
   *   expect(actual).toHaveStyle('font-size', /10/);
   *   expect(actual).toHaveStyle({fontSize: '10px', display: 'none'});
   *   expect(actual).toHaveStyle({fontSize: /10/, display: 'none'});
   *   expect(actual).toHaveStyle({fontSize: jasmine.anything()});
   *
   * @param {Object} ctx Test context.
   * @param {String|Object} styleName Style name or object of styles.
   * @param {String|RegExp|jasmine.Any|jasmine.Anything} styleValue Style value or a jasmine matcher (i.e `jasmine.any(<Type>)`).
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toHaveStyle(_ref, styleName, styleValue) {
    var _ref2;

    var actual = _ref.actual,
      equals = _ref.equals;
    var node = toDomElement(actual);
    var expected = isObject(styleName) ? styleName : (_ref2 = {}, _ref2[styleName] = styleValue, _ref2);
    var props = keys(expected);
    var ok = every(props, function(name) {
      var camelCaseName = dashToCamel(name);
      var actualValue = node.style[camelCaseName];
      var expectedValue = expected[name];
      return matchOrEquals(actualValue, expectedValue, equals);
    });
    return {
      pass: ok,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to have styles " + pp(expected);
      }
    };
  }

  /**
   * Turn a `string` to a lower case string.
   * If the argument is not a `string`, it is automatically returned.
   *
   * @param {*} value Value to turn to a lower case string.
   * @return {*} The lower case string, or the argument if it is not a string.
   */

  function toLower(value) {
    return isString(value) ? value.toLowerCase() : value;
  }

  /**
   * Check that the tested object is a DOM node with expected tag name.
   *
   * @message Expect [actual] [NOT] to have tag name [expectedTagName] but was [actualTagName]
   * @example
   *   const actual = document.createElement('input');
   *   expect(actual).toHaveTagName('input');
   *   expect(actual).toHaveTagName('INPUT');
   *   expect(actual).toHaveTagName(/input|select/i);
   *   expect(actual).not.toHaveTagName('div');
   *
   * @param {Object} ctx Test context.
   * @param {String|RegExp|jasmine.Any|jasmine.Anything} tagName The expected tag name or a jasmine matcher (i.e `jasmine.any(<Type>)`).
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toHaveTagName(_ref, tagName) {
    var actual = _ref.actual,
      equals = _ref.equals;
    // IE8 does not know textContent but knows innerText.
    var node = toDomElement(actual);
    var actualTagName = node.tagName;
    var lowerActualTagName = toLower(actualTagName);
    var lowerExpectedTagName = toLower(tagName);
    var ok = matchOrEquals(lowerActualTagName, lowerExpectedTagName, equals);
    return {
      pass: ok,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to have tag name " + pp(tagName) + " but was " + pp(actualTagName);
      }
    };
  }

  /**
   * Check that the tested object is a DOM node with expected text content.
   * If the expected text parameter is a `number` or a `boolean`, it will be
   * converted to a `string` using its `toString` method.
   *
   * @message Expect [actual] [NOT] to have text [expectedText] but was [actualText]
   * @example
   *   const actual = document.createElement('input');
   *   actual.textContent = '1';
   *   expect(actual).toHaveText('1');
   *   expect(actual).toHaveText(1);
   *   expect(actual).toHaveText(/1/);
   *   expect(actual).toHaveText(jasmine.any(String));
   *   expect(actual).not.toHaveText('foobar');
   *
   * @param {Object} ctx Test context.
   * @param {String|Number|Boolean|RegExp|jasmine.Any|jasmine.Anything} text The expected text or a jasmine matcher (i.e `jasmine.any(<Type>)`).
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toHaveText(_ref, text) {
    var actual = _ref.actual,
      equals = _ref.equals;
    // IE8 does not know textContent but knows innerText.
    var node = toDomElement(actual);
    var actualText = 'textContent' in node ? node.textContent : node.innerText;
    var expectedText = isPrimitive(text) ? text.toString() : text;
    var ok = matchOrEquals(actualText, expectedText, equals);
    return {
      pass: ok,
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to have text " + pp(expectedText) + " but was " + pp(actualText);
      }
    };
  }

  /**
   * Check that the tested object is a DOM node property `value` equal
   * to an expected value.
   *
   * @message Expect [actual] [NOT] to have value [expectedValue] but was [actualValue]
   * @example
   *   const actual = document.createElement('input');
   *   actual.value = 'foobar';
   *   expect(actual).toHaveValue('foobar');
   *   expect(actual).toHaveValue(/foobar/);
   *   expect(actual).toHaveValue(jasmine.any(String));
   *   expect(actual).not.toHaveValue('');
   *
   * @param {Object} ctx Test context.
   * @param {String|RegExp|jasmine.Any|jasmine.Anything} expectedValue The expected value or a jasmine matcher (i.e `jasmine.any(<Type>)`).
   * @return {Object} Test result.
   * @since 0.1.0
   */

  function toHaveValue(_ref, expectedValue) {
    var actual = _ref.actual,
      equals = _ref.equals;
    var node = toDomElement(actual);
    ensureHasIn(node, 'value', 'Cannot run `toHaveValue` matcher on a DOM node without `value` property');
    var actualValue = node.value;
    return {
      pass: matchOrEquals(actualValue, expectedValue, equals),
      message: function message() {
        return "Expect " + pp(actual) + " [NOT] to have value " + pp(expectedValue) + " but was " + pp(actualValue);
      }
    };
  }



  var matchers = /*#__PURE__*/ Object.freeze({
    toBeChecked: toBeChecked,
    toBeDetachedElement: toBeDetachedElement,
    toBeDisabled: toBeDisabled,
    toBeDisplayed: toBeDisplayed,
    toBeFocused: toBeFocused,
    toBeIndeterminate: toBeIndeterminate,
    toBeRequired: toBeRequired,
    toBeSelected: toBeSelected,
    toHaveId: toHaveId,
    toHaveAttrs: toHaveAttrs,
    toHaveCssClass: toHaveCssClass,
    toHaveHtml: toHaveHtml,
    toHaveProps: toHaveProps,
    toHaveStyle: toHaveStyle,
    toHaveTagName: toHaveTagName,
    toHaveText: toHaveText,
    toHaveValue: toHaveValue
  });

  var jasmineMatchers = {};
  forEach(keys(matchers), function(id) {
    jasmineMatchers[id] = createMatcher(matchers[id]);
  });
  beforeEach(function jasmineUtilBeforeEach() {
    if (version === 1) {
      // eslint-disable-next-line no-invalid-this
      this.addMatchers(jasmineMatchers);
    } else {
      jasmine.addMatchers(jasmineMatchers);
    }
  });

}());
