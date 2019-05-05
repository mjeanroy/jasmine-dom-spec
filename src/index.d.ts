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

type MatcherResult = boolean;

type NodeId = string | RegExp | jasmine.Any;
type NodeTagName = string | RegExp | jasmine.Any;
type NodeContent = string | number | boolean | RegExp | jasmine.Any;
type NodeInputValue = string | RegExp | jasmine.Any;
type NodeClassName = string | RegExp | jasmine.Any;
type NodeStyle = string | RegExp | jasmine.Any;
type NodeAttribute = string | RegExp | jasmine.Any;
type NodeProps = any;

interface NodeAttributeDictionary {
  [key: string]: NodeAttribute;
}

interface NodeStyleDictionary {
  [key: string]: NodeStyle;
}

interface NodePropsDictionary {
  [key: string]: NodeProps;
}

declare namespace jasmine {
  interface Matchers<T> {
    toBeChecked(): MatcherResult;
    toBeDetachedElement(): MatcherResult;
    toBeDisabled(): MatcherResult;
    toBeDisplayed(expected: any): MatcherResult;
    toBeFocused(): MatcherResult;
    toBeIndeterminate(): MatcherResult;
    toBeRequired(): MatcherResult;
    toBeSelected(): MatcherResult;
    toHaveAttrs(name: string, value?: NodeAttribute): MatcherResult;
    toHaveAttrs(attrs: NodeAttributeDictionary): MatcherResult;
    toHaveCssClass(classNames: NodeClassName | NodeClassName[]): MatcherResult;
    toHaveHtml(text: NodeContent): MatcherResult;
    toHaveId(id: NodeId): MatcherResult;
    toHaveProps(name: string, value: NodeProps): MatcherResult;
    toHaveProps(props: NodePropsDictionary): MatcherResult;
    toHaveStyle(name: string, value: NodeStyle): MatcherResult;
    toHaveStyle(styles: NodeStyleDictionary): MatcherResult;
    toHaveTagName(tagName: NodeTagName): MatcherResult;
    toHaveText(text: NodeContent): MatcherResult;
    toHaveValue(value: NodeInputValue): MatcherResult;
  }
}
