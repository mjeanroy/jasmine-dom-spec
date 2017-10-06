jasmine-dom-spec
=================

[![Build Status](https://travis-ci.org/mjeanroy/jasmine-dom-spec.svg?branch=master)](https://travis-ci.org/mjeanroy/jasmine-dom-spec)

Jasmine-Dom-Spec is a set of custom matchers to be able to test DOM nodes easily.

Jasmine-Dom-Spec is compatible with __Jasmine 1.3__ and __Jasmine 2.0.X__.

## Matchers

### toBeChecked

Check that the tested object is a DOM node property `checked` equal
to `true`.

#### Since

0.1.0

#### Parameters

*No parameters*

#### Message

`Expect [actual] [NOT] to be checked`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('input');
  actual.type = 'checkbox';
  actual.checked = true;
  expect(actual).toBeChecked();
});
```

### toBeDetachedElement

Check that the tested object is a DOM node not attached to the
current active document window.

#### Since

0.1.0

#### Parameters

*No parameters*

#### Message

`Expect [actual] [NOT] to be detached element`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('div');
  expect(actual).toBeDetachedElement();
  document.body.appendChild(actual);
  expect(actual).not.toBeDetachedElement();
});
```

### toBeDisabled

Check that the tested object is a DOM node property `disabled` equal
to `true`.

#### Since

0.1.0

#### Parameters

*No parameters*

#### Message

`Expect [actual] [NOT] to be disabled`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('input');
  actual.disabled = true;
  expect(actual).toBeDisabled();
});
```

### toBeFocused

Check that the tested object has focus on the active document window (note that if
element is not attached to the DOM, it can't have focus).

#### Since

0.1.0

#### Parameters

*No parameters*

#### Message

`Expect [actual] [NOT] to be focused`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.getElementById('my-input');
  actual.focus();
  expect(actual).toBeFocused();
});
```

### toBeIndeterminate

Check that the tested object is a DOM node property `indeterminate` equal
to `true`.

#### Since

0.1.0

#### Parameters

*No parameters*

#### Message

`Expect [actual] [NOT] to be checked`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('input');
  actual.type = 'checkbox';
  actual.indeterminate = true;
  expect(actual).toBeIndeterminate();
});
```

### toBeRequired

Check that the tested object is a DOM node property required equal
to an expected value.

#### Since

0.1.0

#### Parameters

*No parameters*

#### Message

`Expect [actual] [NOT] to be required`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('input');
  actual.required = true;
  expect(actual).toBeRequired();
});
```

### toBeSelected

Check that the tested object is a DOM node property `selected` equal
to `true`.

#### Since

0.1.0

#### Parameters

*No parameters*

#### Message

`Expect [actual] [NOT] to be required`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('option');
  actual.selected = true;
  expect(actual).toBeSelected();
});
```

### toHaveAttrs

Check that the tested object has expected attributes.

#### Since

0.1.0

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `attrName` | `Object,string` | Attribute name (or map of attributes). |
| `attrValue` | `string` | Attribute value. |

#### Message

`Expect [actual] [NOT] to have attributes [expected]`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('input');
  actual.setAttribute('data-id', '1');
  actual.checked = false;
  expect(actual).toHaveAttrs('data-id', '1');
  expect(actual).toHaveAttrs({'data-id': '1'});
  expect(actual).toHaveAttrs({'data-id': jasmine.anything()});
});
```

### toHaveCssClass

Check that the tested object has expected css classes.

#### Since

0.1.0

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `expected` | `Array.<string>,string` | The expected class name. |

#### Message

`Expect [actual] [NOT] to have css class [cssClass]`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('div');
  actual.className = 'foo bar';
  expect(actual).toHaveCssClass('foo');
  expect(actual).toHaveCssClass('bar');
  expect(actual).toHaveCssClass('foo bar');
  expect(actual).toHaveCssClass('bar foo');
  expect(actual).toHaveCssClass(['bar', 'foo']);
  expect(actual).not.toHaveCssClass('foobar');
  expect(actual).not.toHaveCssClass('foo bar baz');
});
```

### toHaveHtml

Check that the tested object is a DOM node with expected html content.

#### Since

0.1.0

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `html` | `string` | The expected html. |

#### Message

`Expect [actual] [NOT] to have HTML [expectedHtml] but was [actualHtml]`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('input');
  actual.textContent = '<span>foo</span>';
  expect(actual).toHaveHtml('<span>foo</span>');
  expect(actual).toHaveHtml(jasmine.any(String));
  expect(actual).not.toHaveHtml('<div>foo</div>');
});
```

### toHaveId

Check that the tested object is a DOM node with expected `id`.

#### Since

0.1.0

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `id` | `string` | The expected id. |

#### Message

`Expect [actual] [NOT] to have id [id] but was [id]`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('div');
  actual.id = 'foo';
  expect(actual).toHaveId('foo');
  expect(actual).not.toHaveId('bar');
});
```

### toHaveProps

Check that the tested object has expected properties.

#### Since

0.1.0

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `propName` | `Object,string` | Property name (or map of properties). |
| `propValue` | `*` | Property value. |

#### Message

`Expect [actual] [NOT] to have properties [expected]`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('input');
  actual.required = true;
  actual.checked = false;
  expect(actual).toHaveProps('required', true);
  expect(actual).toHaveProps('checked', false);
  expect(actual).toHaveProps({required: true, checked: false});
  expect(actual).toHaveProps(required: jasmine.any(Boolean));
});
```

### toHaveStyle

Check that the tested object has expected style value (the css style property
name can dash-cased, such as `font-size`, or camel cased, such as `fontSize`).

#### Since

0.1.0

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `styleName` | `Object,string` | Style name. |
| `styleValue` | `string` | Style value. |

#### Message

`Expect [actual] [NOT] to have styles [expected]`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('input');
  actual.required = true;
  actual.checked = false;
  expect(actual).toHaveStyle('display', 'none');
  expect(actual).toHaveStyle('font-size', '10px');
  expect(actual).toHaveStyle({fontSize: '10px', display: 'none'});
  expect(actual).toHaveStyle({fontSize: jasmine.anything()});
});
```

### toHaveText

Check that the tested object is a DOM node with expected text content.

#### Since

0.1.0

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `expectedText` | `string` | The expected text. |

#### Message

`Expect [actual] [NOT] to have text [expectedText] but was [actualText]`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('input');
  actual.textContent = 'foo';
  expect(actual).toHaveText('foo');
  expect(actual).toHaveText(jasmine.any(String));
  expect(actual).not.toHaveText('foobar');
});
```

### toHaveValue

Check that the tested object is a DOM node property `value` equal
to an expected value.

#### Since

0.1.0

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| `expectedValue` | `*` | The expected value. |

#### Message

`Expect [actual] [NOT] to have value [expectedValue] but was [actualValue]`

#### Example:

```javascript
it('should pass', () => {
  const actual = document.createElement('input');
  actual.value = 'foobar';
  expect(actual).toHaveValue('foobar');
  expect(actual).toHaveValue(jasmine.any(String));
  expect(actual).not.toHaveValue('');
});
```


## Licence

MIT License (MIT)

## Contributing

If you think some matchers are missing or error messages are not useful enough, feel free to contribute and submit an issue or a pull request.
