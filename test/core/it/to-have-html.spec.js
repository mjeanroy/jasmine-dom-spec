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

import '../../../src/index';

describe('toHaveHtml', () => {
  it('should pass with a DOM node', () => {
    const html = '<div>foo</div>';
    const node = document.createElement('div');
    node.innerHTML = html;

    expect(node).toHaveHtml(html);
    expect(node).toHaveHtml(new RegExp(html, 'i'));
    expect(node).toHaveHtml(jasmine.any(String));
    expect(node).not.toHaveHtml('<span>foo</span>');
  });

  it('should pass with a DOM node and number content', () => {
    const html = 1;
    const node = document.createElement('div');
    node.innerHTML = html;
    expect(node).toHaveHtml(html);
  });

  it('should pass with a DOM node and boolean content', () => {
    const html = true;
    const node = document.createElement('div');
    node.innerHTML = html;
    expect(node).toHaveHtml(html);
  });
});
