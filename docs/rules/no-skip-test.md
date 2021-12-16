# Ensure no tests are skipped

It's easy to make a test skipped with `tap.skip()` and then forget about it. It's visible in the results, but still easily missed.


## Fail

```js
import tap from 'tap';

tap.test('some test', t => {
	t.pass();
	t.end();
});

tap.skip('some other test', t => {
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
