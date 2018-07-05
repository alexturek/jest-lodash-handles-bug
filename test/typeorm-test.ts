import * as typeorm from 'typeorm';

describe(`a typeorm connection`, () => {
  let connection: typeorm.Connection;

  describe(`when connected`, () => {
    beforeAll(async () => {
      connection = await typeorm.createConnection({
        host: 'localhost',
        database: 'handle_bug',
        port: 5432,
        type: 'postgres',
        username: process.env.USER,
      });
    });

    it(`may cause jest to report open handles`, async () => {
      await connection.createQueryBuilder().select('1');
    });

    afterAll(async () => {
      await connection.close();
    });
  });
});
