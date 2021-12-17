# eslint-plugin-tap

[![npm version](https://img.shields.io/npm/v/eslint-plugin-tap)](https://npmjs.com/package/eslint-plugin-tap)
[![npm size](https://img.shields.io/bundlephobia/minzip/eslint-plugin-tap)](https://bundlephobia.com/package/eslint-plugin-tap)
[![install size](https://packagephobia.com/badge?p=eslint-plugin-tap)](https://packagephobia.com/result?p=eslint-plugin-tap)
[![code coverage](https://codecov.io/gh/getoslash/eslint-plugin-tap/branch/main/graph/badge.svg?token=VBS5M4qYfz)](https://codecov.io/gh/getoslash/eslint-plugin-tap)
[![Release](https://github.com/getoslash/eslint-plugin-tap/actions/workflows/release.yml/badge.svg?event=push)](https://github.com/getoslash/eslint-plugin-tap/actions/workflows/release.yml)
[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/getoslash/eslint-plugin-tap)

🕵🏼 ESLint rules for [`tap`](https://node-tap.org/) tests.

## Install

```bash
npm install --save-dev eslint eslint-plugin-tap
# OR
yarn add --dev eslint eslint-plugin-tap
```

## Usage

Configure it in your `package.json` or `eslintrc.*` file as described in the [ESLint user guide](http://eslint.org/docs/user-guide/configuring) –

```json
{
	"plugins": [
		"tap"
	],
	"rules": {
		"tap/assertion-message": ["error", "always"],
		"tap/max-asserts": ["error", 8],
		"tap/no-identical-title": "error",
		"tap/no-ignored-test-files": "error",
		"tap/no-only-test": "error",
		"tap/no-skip-test": "error",
		"tap/no-statement-after-end": "error",
		"tap/no-unknown-modifiers": "error",
		"tap/test-ended": "error",
		"tap/test-title": ["error", "if-multiple"],
		"tap/use-plan": ["error", "always"],
		"tap/use-plan-well": "error",
		"tap/use-t-well": "error",
		"tap/use-t": "error",
		"tap/use-tap": "error",
	}
}
```

## Rules

The rules will activate only in `tap` test files.

- [assertion-message](docs/rules/assertion-message.md) - Enforce or disallow assertion messages.
- [max-asserts](docs/rules/max-asserts.md) - Limit the number of assertions in a test.
- [no-identical-title](docs/rules/no-identical-title.md) - Ensure no tests have the same title.
- [no-ignored-test-files](docs/rules/no-ignored-test-files.md) - Ensure no tests are written in ignored files.
- [no-only-test](docs/rules/no-only-test.md) - Ensure no `test.only()` are present.
- [no-skip-test](docs/rules/no-skip-test.md) - Ensure no tests are skipped.
- [no-statement-after-end](docs/rules/no-statement-after-end.md) - Ensure `t.end()` is the last statement executed.
- [no-unknown-modifiers](docs/rules/no-unknown-modifiers.md) - Prevent the use of unknown test modifiers.
- [test-ended](docs/rules/test-ended.md) - Ensure callback tests are explicitly ended.
- [use-plan](docs/rules/use-plan.md) - Ensure every test uses a `t.plan()`.
- [use-plan-well](docs/rules/use-plan-well.md) - Prevent the incorrect use of `t.plan()`.
- [use-t-well](docs/rules/use-t-well.md) - Prevent the incorrect use of `t`.
- [use-t](docs/rules/use-t.md) - Ensure test functions use `t` as their parameter.
- [use-tap](docs/rules/use-tap.md) - Ensure that tap is imported with `tap` as the variable name.


## Recommended configuration

This plugin exports a [`recommended` configuration](src/index.ts) that enforces good practices.

Enable it in your `package.json` or `eslintrc.*` file with the `extends` option –

```json
{
	"plugins": [
		"tap"
	],
	"extends": "plugin:tap/recommended"
}
```

See the [ESLint documentation](http://eslint.org/docs/user-guide/configuring#extending-configuration-files) for more information about extending configuration files.

**Note**: This config will also enable the correct [parser options](http://eslint.org/docs/user-guide/configuring#specifying-parser-options) and [environment](http://eslint.org/docs/user-guide/configuring#specifying-environments).

## Credits

1. [Sindre Sorhus](https://sindresorhus.com) & [AVA team](https://github.com/sindresorhus/ava#team) for building [`eslint-plugin-ava`](https://github.com/sindresorhus/eslint-plugin-ava).
2. [Abel Toledano](https://github.com/atabel) for adapting [`eslint-plugin-ava`](https://github.com/sindresorhus/eslint-plugin-ava) to build [`eslint-plugin-tape`](https://github.com/atabel/eslint-plugin-tape), on which this project is heavily based on.


## License

The code in this project is released under the [MIT License](LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fgetoslash%2Feslint-plugin-tap.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fgetoslash%2Feslint-plugin-tap?ref=badge_large)
