# Enforce or disallow assertion messages

Assertion messages are optional arguments that can be given to any assertion call to improve the error message, should the assertion fail. This rule either enforces or disallows the use of those messages.


## Fail

```js
import tap from 'tap';

/* eslint tap/assertion-message: ["error", "always"] */
tap.test('test name', t => {
	t.ok(array.includes(value));
	t.end();
});

/* eslint tap/assertion-message: ["error", "never"] */
tap.test('test name', t => {
	t.ok(array.includes(value), 'value is not in array');
	t.end();
});
```


## Pass

```js
import tap from 'tap';

/* eslint tap/assertion-message: ["error", "always"] */
tap.test('test name', t => {
	t.ok(array.includes(value), 'value is not in array');
	t.end();
});

/* eslint tap/assertion-message: ["error", "never"] */
tap.test('test name', t => {
	t.ok(array.includes(value));
	t.end();
});
```

## Options

The rule takes one option, a string, which could be either `"always"` or `"never"`. The default is `"always"`.

You can set the option in configuration like this:

```js
"tap/assertion-message": ["error", "always"]
```
