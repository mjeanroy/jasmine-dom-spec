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

import { jasmine2MatcherFactory } from '../../../src/core/jasmine/j2-matcher-factory';

describe('jasmine2MatcherFactory', () => {
  it('should create matcher', () => {
    const matcher = jasmine.createSpy('matcher');
    const j2Matcher = jasmine2MatcherFactory(matcher);
    expect(j2Matcher).toBeDefined();
  });

  describe('matcher', () => {
    let matcher;
    let j2Matcher;

    let util;
    let customEqualityTesters;

    beforeEach(() => {
      matcher = jasmine.createSpy('matcher');
      j2Matcher = jasmine2MatcherFactory(matcher);

      customEqualityTesters = {};
      util = {
        equals: jasmine.createSpy('equals').and.returnValue(true),
      };
    });

    it('should execute matcher with the compare function', () => {
      const pass = true;
      const message = jasmine.createSpy('message').and.returnValue('A [NOT] message');

      matcher.and.returnValue({
        pass,
        message,
      });

      const actual = {};
      const arg0 = 0;
      const arg1 = 1;
      const result = j2Matcher(util, customEqualityTesters).compare(actual, arg0, arg1);

      expect(result).toBeDefined();
      expect(result.pass).toEqual(pass);
      expect(result.message).not.toBe(message);
      expect(message).not.toHaveBeenCalled();
      expect(result.message()).toBe('A message');
      expect(message).toHaveBeenCalled();

      const { args } = matcher.calls.mostRecent();

      // Check for expected context.
      expect(args[0]).toEqual({
        actual,
        isNot: false,
        equals: jasmine.any(Function),
        pp: jasmine.any(Function),
      });

      expect(args[1]).toBe(arg0);
      expect(args[2]).toBe(arg1);
    });

    it('should execute matcher with the negativeCompare function', () => {
      const pass = true;
      const message = jasmine.createSpy('message').and.returnValue('A [NOT] message');

      matcher.and.returnValue({
        pass,
        message,
      });

      const actual = {};
      const arg0 = 0;
      const arg1 = 1;
      const result = j2Matcher(util, customEqualityTesters).negativeCompare(actual, arg0, arg1);

      expect(result).toBeDefined();
      expect(result.pass).toBe(!pass);
      expect(result.message).not.toBe(message);
      expect(message).not.toHaveBeenCalled();
      expect(result.message()).toBe('A not message');
      expect(message).toHaveBeenCalled();

      const { args } = matcher.calls.mostRecent();

      expect(args.length).toBe(3);
      expect(args[1]).toBe(arg0);
      expect(args[2]).toBe(arg1);

      // Check for expected context.
      expect(args[0]).toEqual({
        actual,
        isNot: true,
        equals: jasmine.any(Function),
        pp: jasmine.any(Function),
      });
    });

    describe('context', () => {
      let ctx;

      beforeEach(() => {
        matcher.and.returnValue({
          pass: true,
          message: 'a message',
        });

        j2Matcher(util, customEqualityTesters).negativeCompare({});
        [ctx] = matcher.calls.mostRecent().args;
      });

      it('should check for equality', () => {
        const a = {};
        const b = {};

        const areEquals = ctx.equals(a, b);

        expect(areEquals).toBe(true);
        expect(util.equals).toHaveBeenCalledWith(a, b, customEqualityTesters);
      });
    });
  });
});
