# A bug with Lodash + Jest



## Set up
```
yarn
tsc
yarn test
```

## Repro
```
aturek@aturek-mbpro ~/oss/jest-lodash-handles-bug> yarn test
yarn run v1.7.0
$ node ./node_modules/.bin/jest --detectOpenHandles --config test/jest.json
 PASS  dist/test/do-lodash-things.js
  lodash
    ✓ causes these tests to show open handles (9ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.951s, estimated 2s
Ran all test suites.

Jest has detected the following 2 open handles potentially keeping Jest from exiting:

  ●  PROMISE

          at Function.resolve (<anonymous>)
      at Object.<anonymous> (node_modules/lodash/_getTag.js:37:32)


  ●  PROMISE

      1 | "use strict";
      2 | Object.defineProperty(exports, "__esModule", { value: true });
    > 3 | require("lodash");
        | ^
      4 | describe(`lodash`, () => {
      5 |     it(`causes these tests to show open handles`, () => {
      6 |         expect(1).toEqual(1);

          at Function.resolve (<anonymous>)
      at runInContext (node_modules/lodash/lodash.js:6069:36)
      at Object.<anonymous> (dist/test/do-lodash-things.js:3:1)

✨  Done in 2.03s.
```

## The lodash line in question
([link](https://github.com/lodash/lodash/blob/d10b44bdef2b735865c493fbaec8687ec8998aef/.internal/getTag.js#L30))
```diff
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = baseGetTag;

  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
      (Map && getTag(new Map) != mapTag) ||
+     (Promise && getTag(Promise.resolve()) != promiseTag) ||
      (Set && getTag(new Set) != setTag) ||
      (WeakMap && getTag(new WeakMap) != weakMapTag)) {
    getTag = function(value) {
      var result = baseGetTag(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? toSource(Ctor) : '';
```
