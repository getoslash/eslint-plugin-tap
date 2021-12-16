# Ensure `t.end()` is the last statement executed.

`t.end()` should mark the end of your test, and additional statements should not be executed.

## Fail

```js
import tap from 'tap';

tap.test('some test', t => {
	t.end();
	t.equal(1, 1);
});

tap.test('some other test', t => {
	t.end();
	console.log('at the end');
});
```


## Pass

```js
import tap from 'tap';

tap.test('some test', t => {
	t.equal(1, 1);
	t.end();
});

tap.test('some other test', t => {
	if (a) {
		// Allowed because no further statements are reachable.
		return t.end();
	}
	if (b) {
		t.end();
		return;
	}
	t.equal(1, 1);
	t.end();
});

```
