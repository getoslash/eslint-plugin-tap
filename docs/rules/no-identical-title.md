# Ensure no tests have the same title

Disallow tests with identical titles as it makes it hard to differentiate them.


## Fail

```js
import tap from 'tap';

tap.test('some test', t => {
	t.pass();
	t.end();
});

tap.test('some test', t => {
	t.pass();
	t.end();
});
```


## Pass

```js
import tap from 'tap';

tap.test('some test', t => {
	t.pass();
	t.end();
});

tap.test('some other test', t => {
	t.pass();
	t.end();
});
```
