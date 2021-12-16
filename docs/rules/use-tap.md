# Ensure that tap is imported with `tap` as the variable name

The convention is to import tap and assign it to a variable named `tap`. Most rules in `eslint-plugin-tap` are based on that assumption.

### Fail

```js
const t = require('tap');
let test = require('tap');
const t = require('tap');
import test from 'tap';
```

### Pass

```js
var tap = require('tap');
let tap = require('tap');
const tap = require('tap');
import tap from 'tap';

var tap = require('boop');
import tap from 'snoot';
```
