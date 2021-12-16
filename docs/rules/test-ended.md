# Ensure callback tests are explicitly ended

If you forget a `t.end();` in a test it may hang indefinitely.


## Fail

```js
import tap from 'tap';

tap.test('some test', t => {
	t.pass();
});
```


## Pass

```js
import tap from 'tap';

tap.test('some test', t => {
	t.pass();
	t.end();
});

tap.test('some test', t => {
	acceptsCallback(t.end);
});
```
