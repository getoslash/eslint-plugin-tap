# Ensure no tests are written in ignored files

This rule will verify that files with `tap` tests are in the searched files and not in ignored folders.

By default the rule considers valid file names that satisfy the following glob paths –
```json
[
	"test/**/*.{js,ts}",
	"tests/**/*.{js,ts}",
	"**/__tests__/**/*.{js,ts}"
]
```

You can specify a different set of paths for your project and/or specify a list of globs of excluded files (see [Options](#options)).

## Fail

```js
// File: lib/test1.test.js
// Invalid because not in the searched files
import tap from 'tap';

tap.test('some test', t => {
	t.pass();
	t.end();
});

// File: test/fixtures/bar.js
// with { "excludedFiles": ['**/fixtures/**'] }
// in the rule options
import tap from 'tap';

tap.test('some test', t => {
	t.pass();
	t.end();
});
```


## Pass

```js
// File: test/test1/module.js
import tap from 'tap';

tap.test('some test', t => {
	t.pass();
	t.end();
});

// File: src/__tests__/test2.js
import tap from 'tap';

tap.test('some other tesst', t => {
	t.pass();
	t.end();
});

// File: lib/boop.test.js
// with { "files": ["lib/**/*.test.js", "utils/**/*.test.js"] }
// in the rule options
import tap from 'tap';

tap.test('boop', t => {
	t.pass();
	t.end();
});
```

## Options

This rule supports the following options:

- `files`: An array of strings representing the files glob that tap will use to find test files.
- `excludedFiles`: An array of string globs of excluded files.

You can set the options like this:

```js
"tap/no-ignored-test-files": ["error", {"files": ["lib/**/*.test.js", "utils/**/*.test.js"], "excludedFiles": ["**/fixtures/**", "**/helpers/**"]}]
```
