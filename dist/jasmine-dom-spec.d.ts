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

/* eslint-disable no-use-before-define */

type Primitive = string | number | boolean;
type NodeId = string | RegExp | jasmine.Any;
type NodeSelectedIndex = number | jasmine.Any;
type NodeTagName = string | RegExp | jasmine.Any;
type NodeContent = Primitive | Array<Primitive> | RegExp | jasmine.Any;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<T> {
    toBeChecked(): boolean;
    toBeDetachedElement(): boolean;
    toBeDisabled(): boolean;
    toBeDisplayed(expected: any): boolean;
    toBeFocused(): boolean;
    toBeIndeterminate(): boolean;
    toBeReadOnly(): boolean;
    toBeRequired(): boolean;
    toBeSelected(): boolean;
    toHaveAttrs(name: string, value?: NodeAttribute): boolean;
    toHaveAttrs(attrs: NodeAttributeDictionary): boolean;
    toHaveComputedStyle(name: string, value: NodeStyle): boolean;
    toHaveComputedStyle(styles: NodeStyleDictionary): boolean;
    toHaveCssClass(classNames: NodeClassName | NodeClassName[]): boolean;
    toHaveHtml(text: NodeContent): boolean;
    toHaveId(id: NodeId): boolean;
    toHaveProps(name: string, value: NodeProps): boolean;
    toHaveProps(props: NodePropsDictionary): boolean;
    toHaveSelectedIndex(props: NodeSelectedIndex): boolean;
    toHaveStyle(name: string, value: NodeStyle): boolean;
    toHaveStyle(styles: NodeStyleDictionary): boolean;
    toHaveTagName(tagName: NodeTagName): boolean;
    toHaveText(text: NodeContent): boolean;
    toHaveValue(value: NodeInputValue): boolean;
  }
}
