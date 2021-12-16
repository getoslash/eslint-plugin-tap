# Prevent the incorrect use of `t`

Prevent the use of unknown assertion methods and the access to members other than the assertion methods and `context`, as well as some known misuses of `t`.


## Fail

```js
import tap from 'tap';

tap.test('some test', t => {
	t(value); // `t` is not a function
	t.depEqual(value, [2]); // Unknown assertion method
	t.boop = 100; // Unknown tap method `boop`
	t.true(value); // Deprecated method, use `t.ok()` instead
	t.end();
});
```


## Pass

```js
import tap from 'tap';

tap.test('some test', t => {
	t.same(value, [2]);
	t.ok(true);
	t.end();
});
```

## ℹ️ Auto-Fix

This rule supports [fixing this problem](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) when deprecated methods are reported. To automatically replace deprecated methods with their supported equivalents, use –

```
eslint --fix
```
