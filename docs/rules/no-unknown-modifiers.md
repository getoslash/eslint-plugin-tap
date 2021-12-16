# Prevent the use of unknown test modifiers

Prevent the use of unknown test modifiers.


## Fail

```js
import tap from 'tap';

tap.onlu('some test', t => {});
test.only.onlu('some test', t => {});
test.beforeeach('some test', t => {});
test.skop('some test', t => {});
```


## Pass

```js
import tap from 'tap';

tap.only('some test', t => {});
tap.skip('some test', t => {});
tap.beforeEach('some test', t => {});
```
