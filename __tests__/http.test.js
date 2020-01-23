import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import app from '..';

describe('Requests', () => {
  let server;

  beforeAll(() => {
    expect.extend(matchers);
  });

  beforeEach(() => {
    server = app.listen();
  });

  it('200', async () => {
    const result = await request.agent(server).get('/');
    expect(result).toHaveHTTPStatus(200);
  });

  it('404', async () => {
    const result = await request.agent(server).get('/wrongpath');
    expect(result).toHaveHTTPStatus(404);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});
