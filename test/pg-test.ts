import * as pg from 'pg';

describe(`a pg client`, () => {
  let client: pg.Client;

  beforeAll(() => {
    client = new pg.Client({
      user: process.env.USER,
      database: 'handle_bug',
      host: 'localhost',
      port: 5432,
    });
  });

  describe(`when connected`, () => {
    beforeAll(async () => {
      await client.connect()
    });

    it(`may cause jest to report open handles`, async () => {
      await client.query('select 1;');
    });

    afterAll(async () => {
      await new Promise((resolve, reject) => {
        client.end(err => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  });
});
