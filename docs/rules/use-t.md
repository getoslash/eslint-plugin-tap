# Ensure test functions use `t` as their parameter

The convention is to have the parameter in tap's test function be named `t`. Most rules in `eslint-plugin-tap` are based on that assumption.

### Fail

```js
import tap from 'tap';

tap.test('test name', boop => { // Incorrect name
	t.pass();
	t.end();
});

tap.test('test name', (t, bar) => { // too many arguments
	t.pass();
	t.end();
});

tap.test('test name', (bar, t) => { // too many arguments
	t.pass();
	t.end();
});
```

### Pass

```js
import tap from 'tap';

tap.test('test name', () => {
	// ...
});

tap.test('test name', t => {
	t.pass();
	t.end();
});
```
