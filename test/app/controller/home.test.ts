import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/home.test.ts', () => {
  it('should GET /', async () => {
    await app.httpRequest().get('/').expect(200);
  });
});
