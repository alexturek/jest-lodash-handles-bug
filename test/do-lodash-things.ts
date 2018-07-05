import { doLodash } from '../src/do-lodash-things';

describe(`the exported function`, () => {
  it(`returns false with no args`, async () => {
    await expect(doLodash()).resolves.toBe(false);
  });

  it(`returns true when passed an array`, async () => {
    await expect(doLodash([1, 2, 'a'])).resolves.toBe(true);
  });
});
