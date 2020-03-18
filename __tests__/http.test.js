import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import app from '..';

describe('Requests', () => {
  let server;

  beforeAll(() => {
    expect.extend(matchers);
  });

  beforeEach(() => {
    server = app().listen();
  });

  test.each(['/', '/login', '/users/new'])('200', async (path) => {
    const result = await request.agent(server).get(path);
    expect(result).toHaveHTTPStatus(200);
  });

  it('404', async () => {
    const result = await request.agent(server).get('/wrongpath');
    expect(result).toHaveHTTPStatus(404);
  });

  it('302', async () => {
    const result = await request.agent(server).delete('/session');
    expect(result).toHaveHTTPStatus(302);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});
