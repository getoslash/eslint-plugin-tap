# Prevent the incorrect use of `t.plan()`

`t.plan()` is useful for ensuring every single assertion is executed, and to catch unexpected flow errors.

`t.plan()` has a few basic usage rules –

1. `t.plan()` should be used before any assertions.
2. `t.plan()` must be given an argument with the plan count.
3. `t.plan()` should be used only once inside a test.

## Fail

```js
import tap from 'tap';

// Invalid because `t.plan()` is used after an assertion.
tap.test('test name', t => {
	t.ok(true);
    t.plan(1)
	t.end();
});

// Invalid because `t.plan()` was not given the plan count as an argument.
tap.test('test name', t => {
    t.plan()
	t.ok(true);
	t.end();
});

// Invalid because `t.plan()` was used more than once.
tap.test('test name', t => {
    t.plan(1)
	t.ok(true);
    t.notOk(false);
    t.plan(2);
	t.end();
});
```


## Pass

```js
import tap from 'tap';

tap.test('test name', t => {
    t.plan(2);
	t.ok(true);
	t.notOk(false);
	t.end();
});

tap.test('test name', t => {
	t.ok(true);
	t.end();
});
```
