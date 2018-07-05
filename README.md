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
  the exported function
    ✓ returns false with no args (22ms)
    ✓ returns true when passed an array (8ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.369s, estimated 2s
Ran all test suites.

Jest has detected the following 2 open handles potentially keeping Jest from exiting:

  ●  PROMISE

          at Function.resolve (<anonymous>)
      at Object.<anonymous> (node_modules/lodash/_getTag.js:37:32)


  ●  PROMISE

       9 | };
      10 | Object.defineProperty(exports, "__esModule", { value: true });
    > 11 | const _ = require("lodash");
         |           ^
      12 | function doLodash(args) {
      13 |     return __awaiter(this, void 0, void 0, function* () {
      14 |         return _.isArray(args);

          at Function.resolve (<anonymous>)
      at runInContext (node_modules/lodash/lodash.js:6069:36)
      at Object.<anonymous> (dist/src/do-lodash-things.js:11:11)

✨  Done in 4.53s.
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
