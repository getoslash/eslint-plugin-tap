# Enforce the use of `t.plan()` in every test

`t.plan()` is useful for ensuring every single assertion is executed, and to catch unexpected flow errors. This rule enforces every test to have a `t.plan()` statement.

## Fail

```js
import tap from 'tap';

// Invalid because the rule is turned on, but there's no `t.plan()` statement.
/* eslint tap/use-plan: ["error", "always"] */
tap.test('test name', t => {
	t.ok(true);
	t.end();
});
```


## Pass

```js
import tap from 'tap';

/* eslint tap/use-plan: ["error", "always"] */
tap.test('test name', t => {
    t.plan(2);
	t.ok(true);
	t.notOk(false);
	t.end();
});

/* eslint tap/use-plan: ["error", "never"] */
tap.test('test name', t => {
	t.ok(true);
	t.end();
});
```

## Options

The rule takes one option, a string, which could be either `"always"` or `"never"`. The default is `"always"`.

You can set the option in configuration like this:

```js
"tap/use-plan": ["error", "always"]
```
