# Limit the number of assertions in a test

Limit the amount of assertions in a test to enforce splitting up large tests into smaller ones.

Skipped assertions are also counted.


## Fail

```js
/*eslint tap/max-asserts: ["error", 5]*/
import tap from 'tap';

tap.test('getSomeObject should define the players\' names', t => {
	const object = lib.getSomeObject();

	t.type(object, 'object');
	t.type(object.player, 'object');
	t.equal(object.player.firstName, 'Luke');
	t.equal(object.player.lastName, 'Skywalker');
	t.type(object.opponent, 'object');
	t.equal(object.opponent.firstName, 'Darth');
	t.equal(object.opponent.lastName, 'Vader');
	t.end();
});
```


## Pass

```js
import tap from 'tap';

test('getSomeObject should define the player\'s name', t => {
	const object = lib.getSomeObject();

	t.type(object, 'object');
	t.type(object.player, 'object');
	t.equal(object.player.firstName, 'Luke');
	t.equal(object.player.lastName, 'Skywalker');
	t.end();
});

test('getSomeObject should define the opponent\'s name', t => {
	const object = lib.getSomeObject();

	t.type(object, 'object');
	t.type(object.opponent, 'object');
	t.equal(object.opponent.firstName, 'Darth');
	t.equal(object.opponent.lastName, 'Vader');
	t.end();
});
```

## Options

The rule takes one option, a number, which is the maximum number of assertions for each test. The default is 8.

You can set the option in configuration like this:

```js
"tap/max-asserts": ["error", 8]
```
